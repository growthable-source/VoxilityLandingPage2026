import { NextResponse } from "next/server";
import { capiContextFromRequest, sendMetaCapiEvents } from "@/lib/metaCapi";
import { loadAudit, saveAudit } from "@/lib/audit/store";
import type { AuditRecord } from "@/lib/audit/types";

interface ClaimPayload {
  token?: string;
  metaEventId?: string;
}

export async function POST(request: Request) {
  let body: ClaimPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.token) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }

  const record = await loadAudit(body.token);
  if (!record) {
    return NextResponse.json({ error: "No such audit." }, { status: 404 });
  }

  // Claiming twice is a double-click or a revisit, not an error — return the
  // booking URL again rather than blocking someone from reaching the calendar.
  const alreadyClaimed = record.status === "claimed";

  if (!alreadyClaimed) {
    await saveAudit({
      ...record,
      status: "claimed",
      claimedAt: new Date().toISOString(),
    });

    await forwardClaimToCrm(record);

    await sendMetaCapiEvents(
      [
        {
          name: "Schedule",
          eventId: body.metaEventId,
          customData: { content_name: "free-website-build" },
          userData: {
            email: record.lead.email,
            phone: record.lead.phone,
            firstName: record.lead.name.split(/\s+/)[0],
          },
        },
      ],
      capiContextFromRequest(request, {
        fbclid: record.lead.attribution.fbclid,
      }),
    );
  }

  return NextResponse.json({
    ok: true,
    bookingUrl: buildBookingUrl(record),
  });
}

/**
 * The GHL booking widget prefills its form from query params (first_name,
 * last_name, email, phone), so the lead who just claimed doesn't retype
 * details they gave us two minutes ago. The instant flow stores the company
 * name as the lead name, so the split puts its first word in first_name and
 * the rest in last_name — editable on the widget either way.
 */
function buildBookingUrl(record: AuditRecord): string | null {
  const base = process.env.NEXT_PUBLIC_BOOKING_URL;
  if (!base) return null;
  try {
    const url = new URL(base);
    // A misconfigured value (e.g. the whole "NAME=value" line pasted into the
    // env var) must degrade to no redirect, never to sending a fresh lead to
    // a 404 — the claim is still recorded and we follow up by phone.
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      console.error(
        "[audit] NEXT_PUBLIC_BOOKING_URL is not an http(s) URL — skipping the booking redirect.",
      );
      return null;
    }
    const nameParts = record.lead.name.trim().split(/\s+/);
    const first = nameParts[0] ?? "";
    const last = nameParts.slice(1).join(" ");
    if (first) url.searchParams.set("first_name", first);
    if (last) url.searchParams.set("last_name", last);
    if (record.lead.email) url.searchParams.set("email", record.lead.email);
    if (record.lead.phone) url.searchParams.set("phone", record.lead.phone);
    return url.toString();
  } catch {
    console.error(
      "[audit] NEXT_PUBLIC_BOOKING_URL did not parse as a URL — skipping the booking redirect.",
    );
    return null;
  }
}

/**
 * The claim is the moment this lead becomes worth a call, so the CRM gets the
 * gclid again alongside the tag — that pairing is what makes the Google Ads
 * offline-conversion import possible later.
 */
async function forwardClaimToCrm(record: AuditRecord): Promise<void> {
  const payload = {
    tags: ["inbound", "free-website-build", "claimed-free-build"],
    ...record.lead,
    auditToken: record.token,
    claimedAt: new Date().toISOString(),
    source: "Free AI Website + Teardown LP",
  };

  const webhookUrl =
    process.env.FREE_BUILD_WEBHOOK_URL ?? process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log("[audit] claim:", payload);
    return;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("[audit] claim webhook returned non-2xx:", res.status);
    }
  } catch (err) {
    console.error("[audit] claim webhook failed:", err);
  }
}
