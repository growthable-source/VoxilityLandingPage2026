import { NextResponse } from "next/server";
import { capiContextFromRequest, sendMetaCapiEvents } from "@/lib/metaCapi";
import { upsertGhlContact } from "@/lib/ghl";
import { isPlausibleName, isValidAuPhone } from "@/lib/leadValidation";

const MIN_FORM_DURATION_MS = 3000;

interface CallbackPayload {
  name?: string;
  business?: string;
  email?: string;
  phone?: string;
  callHandling?: string;
  /** Shared with the browser pixel event so Meta deduplicates the pair. */
  metaEventId?: string;
  utm?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    fbclid?: string;
    gclid?: string;
  };
  // anti-spam
  website?: string;
  formStartTime?: number;
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function clamp(s: string, max: number): string {
  return s.slice(0, max).trim();
}

export async function POST(request: Request) {
  let body: CallbackPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot — bots fill this; real users don't see it.
  if (body.website && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // Time-trap — anything under 3 seconds is almost certainly a bot.
  if (
    typeof body.formStartTime === "number" &&
    Date.now() - body.formStartTime < MIN_FORM_DURATION_MS
  ) {
    return NextResponse.json({ ok: true });
  }

  const name = clamp(body.name ?? "", 50);
  const business = clamp(body.business ?? "", 100);
  const email = clamp(body.email ?? "", 200);
  const phone = clamp(body.phone ?? "", 40);
  const callHandling = clamp(body.callHandling ?? "", 120);

  if (!name || !business || !email || !phone) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 422 },
    );
  }
  if (!isPlausibleName(name) || !isPlausibleName(business)) {
    return NextResponse.json(
      { error: "That doesn't look like a real name." },
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

  const utm = body.utm ?? {};
  const payload = {
    tags: ["inbound"],
    source: "ai-receptionist-au",
    firstName: name,
    company: business,
    email,
    phone,
    callHandling,
    utmSource: clamp(utm.utmSource ?? "", 200) || undefined,
    utmMedium: clamp(utm.utmMedium ?? "", 200) || undefined,
    utmCampaign: clamp(utm.utmCampaign ?? "", 200) || undefined,
    utmContent: clamp(utm.utmContent ?? "", 200) || undefined,
    utmTerm: clamp(utm.utmTerm ?? "", 200) || undefined,
    fbclid: clamp(utm.fbclid ?? "", 200) || undefined,
    gclid: clamp(utm.gclid ?? "", 200) || undefined,
    submittedAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") ?? undefined,
    ip:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      undefined,
  };

  // Direct contact upsert into the GHL subaccount via Private Integration
  // Token — this is what fires the speed-to-lead automations. The webhook
  // below still runs as an independent channel.
  await upsertGhlContact({
    name,
    email,
    phone,
    business,
    source: "AI Receptionist AU LP",
    tags: ["inbound", "ai-receptionist-au"],
    gclid: payload.gclid,
    attribution: {
      callHandling,
      utmSource: payload.utmSource,
      utmMedium: payload.utmMedium,
      utmCampaign: payload.utmCampaign,
      utmContent: payload.utmContent,
      utmTerm: payload.utmTerm,
    },
  });

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("Receptionist AU webhook returned non-2xx:", res.status);
      }
    } catch (err) {
      console.error("Receptionist AU webhook failed:", err);
    }
  } else {
    console.log("[receptionist-au] new callback request:", payload);
  }

  // Server-side twin of the browser's Lead + ReceptionistCallbackRequest pixel
  // events, with hashed contact details for a better match rate.
  await sendMetaCapiEvents(
    [
      {
        name: "Lead",
        eventId: body.metaEventId,
        customData: { content_name: "ai-receptionist-au" },
        userData: { email, phone, firstName: name },
      },
      {
        name: "ReceptionistCallbackRequest",
        eventId: body.metaEventId,
        customData: { callHandling },
        userData: { email, phone, firstName: name },
      },
    ],
    capiContextFromRequest(request, { fbclid: payload.fbclid }),
  );

  return NextResponse.json({ ok: true });
}
