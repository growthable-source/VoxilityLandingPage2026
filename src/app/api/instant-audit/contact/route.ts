import { NextResponse } from "next/server";
import { upsertGhlContact } from "@/lib/ghl";
import { isFullName, isPlausibleName, isValidAuPhone } from "@/lib/leadValidation";
import { capiContextFromRequest, sendMetaCapiEvents } from "@/lib/metaCapi";
import { renderReportText } from "@/lib/audit/reportText";
import { loadAudit, saveAuditLead } from "@/lib/audit/store";
import type { AuditRecord } from "@/lib/audit/types";

// The reveal gate: attaches the contact details to a running (or finished)
// instant audit, pushes the lead into the CRM, and unlocks /audit/<token>.

interface ContactPayload {
  token?: string;
  /** The person's first and last name. */
  name?: string;
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

  const name = clamp(body.name ?? "", 80);
  const business = clamp(body.business ?? "", 120);
  const email = clamp(body.email ?? "", 200);
  const phone = clamp(body.phone ?? "", 40);

  if (!name || !business || !email || !phone) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 422 },
    );
  }
  if (!isFullName(name)) {
    return NextResponse.json(
      { error: "First and last name, please." },
      { status: 422 },
    );
  }
  if (!isPlausibleName(business)) {
    return NextResponse.json(
      { error: "That doesn't look like a business name." },
      { status: 422 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 422 });
  }
  if (!isValidAuPhone(phone)) {
    return NextResponse.json(
      { error: "Check the number — Australian mobiles look like 0412 345 678." },
      { status: 422 },
    );
  }

  const record = await loadAudit(body.token);
  if (!record) {
    return NextResponse.json({ error: "No such audit." }, { status: 404 });
  }

  // The lead lives in its own overlay file that only this route writes —
  // never merged into the main record on disk, so the analysis finishing a
  // moment later can't overwrite it (Blob reads can be stale for up to a
  // minute, which made read-modify-write here a lost-update machine).
  await saveAuditLead(body.token, { name, business, email, phone });

  const updated: AuditRecord = {
    ...record,
    lead: { ...record.lead, name, business, email, phone },
  };

  await forwardToCrm(updated);

  await sendMetaCapiEvents(
    [
      {
        name: "Lead",
        eventId: body.metaEventId,
        customData: { content_name: "free-website-build" },
        userData: { email, phone, firstName: name.split(/\s+/)[0] },
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
  // Ready by gate time on most runs; when the analysis is still going, the
  // claim forward carries the report instead.
  const reportText = renderReportText(record) ?? undefined;

  // Direct upsert into the GHL subaccount via Private Integration Token —
  // this is what fires the speed-to-lead automations. Person name and
  // company map to their own GHL fields.
  await upsertGhlContact({
    name: record.lead.name,
    email: record.lead.email,
    phone: record.lead.phone,
    business: record.lead.business,
    website: record.lead.website,
    source: "Free AI Website + Teardown LP",
    tags: ["inbound", "free-website-build"],
    gclid: attribution.gclid,
    auditReport: reportText,
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
    // Mapped on the GHL side to {{contact.website_audit_report}}.
    website_audit_report: reportText,
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
