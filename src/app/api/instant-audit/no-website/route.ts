import { NextResponse } from "next/server";
import { buildBookingUrl } from "@/lib/booking";
import { upsertGhlContact } from "@/lib/ghl";
import { isFullName, isPlausibleName, isValidAuPhone } from "@/lib/leadValidation";
import { capiContextFromRequest, sendMetaCapiEvents } from "@/lib/metaCapi";

// The highest-intent path on the page: no website exists, so there is
// nothing to analyse and nothing to gate — contact details go straight to
// the CRM and the visitor goes straight to the booking calendar. Tagged
// `no-website` so the call is prepped as a blank-slate build, not a teardown.

const MIN_FORM_DURATION_MS = 2500;

interface NoWebsitePayload {
  name?: string;
  business?: string;
  email?: string;
  phone?: string;
  /** Shared with the browser pixel event so Meta deduplicates the pair. */
  metaEventId?: string;
  attribution?: Record<string, unknown>;
  // anti-spam — same decoy name as the rest of the funnel.
  homepage?: string;
  formStartTime?: number;
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function clamp(s: unknown, max: number): string {
  return typeof s === "string" ? s.slice(0, max).trim() : "";
}

export async function POST(request: Request) {
  let body: NoWebsitePayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    (body.homepage && body.homepage.length > 0) ||
    (typeof body.formStartTime === "number" &&
      Date.now() - body.formStartTime < MIN_FORM_DURATION_MS)
  ) {
    return NextResponse.json({ ok: true, bookingUrl: null });
  }

  const name = clamp(body.name, 80);
  const business = clamp(body.business, 120);
  const email = clamp(body.email, 200);
  const phone = clamp(body.phone, 40);

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

  const attribution = body.attribution ?? {};
  const gclid = clamp(attribution.gclid, 300) || undefined;

  await upsertGhlContact({
    name,
    email,
    phone,
    business,
    source: "Free AI Website + Teardown LP",
    tags: ["inbound", "free-website-build", "no-website"],
    gclid,
    attribution: {
      utmSource: clamp(attribution.utmSource, 200) || undefined,
      utmMedium: clamp(attribution.utmMedium, 200) || undefined,
      utmCampaign: clamp(attribution.utmCampaign, 200) || undefined,
      utmContent: clamp(attribution.utmContent, 200) || undefined,
      utmTerm: clamp(attribution.utmTerm, 200) || undefined,
      landingPage: clamp(attribution.landingPage, 500) || undefined,
    },
  });

  const payload = {
    tags: ["inbound", "free-website-build", "no-website"],
    name,
    business,
    website: "none",
    email,
    phone,
    source: "Free AI Website + Teardown LP",
    gclid,
    utmTerm: clamp(attribution.utmTerm, 200) || undefined,
    utmCampaign: clamp(attribution.utmCampaign, 200) || undefined,
    submittedAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") ?? undefined,
    ip:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      undefined,
  };

  const webhookUrl =
    process.env.FREE_BUILD_WEBHOOK_URL ?? process.env.CONTACT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("[no-website] webhook returned non-2xx:", res.status);
      }
    } catch (err) {
      console.error("[no-website] webhook failed:", err);
    }
  } else {
    console.log("[no-website] new lead:", payload);
  }

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
      fbclid: clamp(attribution.fbclid, 300) || undefined,
    }),
  );

  return NextResponse.json({
    ok: true,
    bookingUrl: buildBookingUrl({ name, email, phone }),
  });
}
