import { NextResponse } from "next/server";
import { upsertGhlContact } from "@/lib/ghl";
import { capiContextFromRequest, sendMetaCapiEvents } from "@/lib/metaCapi";
import { updateAudit } from "@/lib/audit/store";
import type { AuditRecord } from "@/lib/audit/types";

// The reveal gate: attaches the contact details to a running (or finished)
// instant audit, pushes the lead into the CRM, and unlocks /audit/<token>.

interface ContactPayload {
  token?: string;
  business?: string;
  email?: string;
  phone?: string;
  /** Shared with the browser pixel event so Meta deduplicates the pair. */
  metaEventId?: string;
  // anti-spam
  homepage?: string;
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function digitCount(s: string): number {
  return (s.match(/\d/g) || []).length;
}
function clamp(s: string, max: number): string {
  return s.slice(0, max).trim();
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.homepage && body.homepage.length > 0) {
    return NextResponse.json({ ok: true });
  }
  if (!body.token) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }

  const business = clamp(body.business ?? "", 120);
  const email = clamp(body.email ?? "", 200);
  const phone = clamp(body.phone ?? "", 40);

  if (!business || !email || !phone) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 422 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 422 });
  }
  if (digitCount(phone) < 8) {
    return NextResponse.json({ error: "Invalid phone." }, { status: 422 });
  }

  const updated = await updateAudit(body.token, (record) => ({
    ...record,
    lead: {
      ...record.lead,
      // The gate asks for company name rather than a personal name, so the
      // business stands in for both until the call.
      name: record.lead.name || business,
      business,
      email,
      phone,
    },
  }));
  if (!updated) {
    return NextResponse.json({ error: "No such audit." }, { status: 404 });
  }

  await forwardToCrm(updated);

  await sendMetaCapiEvents(
    [
      {
        name: "Lead",
        eventId: body.metaEventId,
        customData: { content_name: "free-website-build" },
        userData: { email, phone, firstName: business },
      },
    ],
    capiContextFromRequest(request, {
      fbclid: updated.lead.attribution.fbclid,
      sourceUrl: updated.lead.attribution.landingPage,
    }),
  );

  return NextResponse.json({ ok: true });
}

async function forwardToCrm(record: AuditRecord): Promise<void> {
  const { attribution } = record.lead;

  // Direct upsert into the GHL subaccount via Private Integration Token —
  // this is what fires the speed-to-lead automations.
  await upsertGhlContact({
    name: record.lead.business,
    email: record.lead.email,
    phone: record.lead.phone,
    business: record.lead.business,
    website: record.lead.website,
    source: "Free AI Website + Teardown LP",
    tags: ["inbound", "free-website-build"],
    gclid: attribution.gclid,
    attribution: {
      auditToken: record.token,
      utmSource: attribution.utmSource,
      utmMedium: attribution.utmMedium,
      utmCampaign: attribution.utmCampaign,
      utmContent: attribution.utmContent,
      utmTerm: attribution.utmTerm,
      landingPage: attribution.landingPage,
    },
  });

  const payload = {
    tags: ["inbound", "free-website-build"],
    ...record.lead,
    auditToken: record.token,
    source: "Free AI Website + Teardown LP",
  };

  const webhookUrl =
    process.env.FREE_BUILD_WEBHOOK_URL ?? process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log("[instant-audit] contact captured:", payload);
    return;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("[instant-audit] webhook returned non-2xx:", res.status);
    }
  } catch (err) {
    console.error("[instant-audit] webhook failed:", err);
  }
}
