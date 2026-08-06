import { NextResponse } from "next/server";
import { after } from "next/server";
import { capiContextFromRequest, sendMetaCapiEvents } from "@/lib/metaCapi";
import { runAudit } from "@/lib/audit/run";
import { newAuditToken, saveAudit } from "@/lib/audit/store";
import type { AuditRecord } from "@/lib/audit/types";

// The audit runs after the response is sent, but still inside this invocation —
// PageSpeed alone can take 35 seconds.
export const maxDuration = 60;

const MIN_FORM_DURATION_MS = 3000;

interface FreeBuildPayload {
  name?: string;
  business?: string;
  /** Their real website — a genuine field here, unlike on the contact form. */
  website?: string;
  phone?: string;
  email?: string;
  pain?: string;
  attribution?: Record<string, unknown>;
  metaEventId?: string;
  // anti-spam. NB: the contact form uses `website` as its honeypot; this form
  // asks for a website for real, so the decoy is named `homepage` instead.
  homepage?: string;
  formStartTime?: number;
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

function clampField(value: unknown, max: number): string | undefined {
  return typeof value === "string" && value.trim() ? clamp(value, max) : undefined;
}

export async function POST(request: Request) {
  let body: FreeBuildPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — bots fill this; real users never see it.
  if (body.homepage && body.homepage.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // Time-trap — anything under 3 seconds is almost certainly a bot.
  if (
    typeof body.formStartTime === "number" &&
    Date.now() - body.formStartTime < MIN_FORM_DURATION_MS
  ) {
    return NextResponse.json({ ok: true });
  }

  const name = clamp(body.name ?? "", 80);
  const business = clamp(body.business ?? "", 120);
  const website = clamp(body.website ?? "", 300);
  const phone = clamp(body.phone ?? "", 40);
  const email = clamp(body.email ?? "", 200);
  const pain = clamp(body.pain ?? "", 120);

  if (!name || !business || !website || !phone || !email || !pain) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 422 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 422 });
  }
  if (digitCount(phone) < 7) {
    return NextResponse.json({ error: "Invalid phone." }, { status: 422 });
  }

  const attribution = body.attribution ?? {};
  const record: AuditRecord = {
    token: newAuditToken(),
    status: "pending",
    lead: {
      name,
      business,
      website,
      phone,
      email,
      pain,
      attribution: {
        utmSource: clampField(attribution.utmSource, 200),
        utmMedium: clampField(attribution.utmMedium, 200),
        utmCampaign: clampField(attribution.utmCampaign, 200),
        utmContent: clampField(attribution.utmContent, 200),
        utmTerm: clampField(attribution.utmTerm, 200),
        gclid: clampField(attribution.gclid, 300),
        fbclid: clampField(attribution.fbclid, 300),
        landingPage: clampField(attribution.landingPage, 500),
        referrer: clampField(attribution.referrer, 500),
      },
      submittedAt: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") ?? undefined,
      ip:
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        undefined,
    },
    signals: null,
    narrative: null,
    createdAt: new Date().toISOString(),
  };

  // Persist before anything else. If storage is broken we want to know here,
  // while the lead is still on the page, not silently forty seconds later.
  try {
    await saveAudit(record);
  } catch (err) {
    console.error("[free-build] could not persist the lead:", err);
    return NextResponse.json(
      { error: "We couldn't save that. Please try again." },
      { status: 500 },
    );
  }

  await forwardToCrm(record);

  // The gclid rides along so booked calls can be imported back into Google Ads
  // as offline conversions — form fills are a proxy, bookings are the truth.
  await sendMetaCapiEvents(
    [
      {
        name: "Lead",
        eventId: body.metaEventId,
        customData: {
          content_name: "free-website-build",
          pain,
        },
        userData: { email, phone, firstName: name.split(/\s+/)[0] },
      },
    ],
    capiContextFromRequest(request, {
      fbclid: record.lead.attribution.fbclid,
      sourceUrl: record.lead.attribution.landingPage,
    }),
  );

  // Runs after the response flushes, so the form returns in milliseconds while
  // the audit takes its time.
  after(async () => {
    await runAudit(record.token);
  });

  return NextResponse.json({ ok: true });
}

async function forwardToCrm(record: AuditRecord): Promise<void> {
  const payload = {
    tags: ["inbound", "free-website-build"],
    ...record.lead,
    auditToken: record.token,
    source: "Free AI Website + Teardown LP",
  };

  const webhookUrl =
    process.env.FREE_BUILD_WEBHOOK_URL ?? process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log("[free-build] new submission:", payload);
    return;
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("[free-build] webhook returned non-2xx:", res.status);
    }
  } catch (err) {
    console.error("[free-build] webhook failed:", err);
  }
}
