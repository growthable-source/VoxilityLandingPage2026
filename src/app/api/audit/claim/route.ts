import { NextResponse } from "next/server";
import { buildBookingUrl } from "@/lib/booking";
import { capiContextFromRequest, sendMetaCapiEvents } from "@/lib/metaCapi";
import { renderReportText } from "@/lib/audit/reportText";
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
    bookingUrl: buildBookingUrl(record.lead),
  });
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
    // Mapped on the GHL side to {{contact.website_audit_report}} so the
    // findings sit on the contact for the delivery call.
    website_audit_report: renderReportText(record) ?? undefined,
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
