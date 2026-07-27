import { NextResponse } from "next/server";
import { capiContextFromRequest, sendMetaCapiEvents } from "@/lib/metaCapi";

const MIN_FORM_DURATION_MS = 3000;

interface ContactPayload {
  firstName?: string;
  company?: string;
  email?: string;
  phone?: string;
  adSpend?: string;
  crm?: string;
  teamSize?: string;
  role?: string;
  notes?: string;
  smsOptIn?: boolean;
  // anti-spam
  website?: string;
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

export async function POST(request: Request) {
  let body: ContactPayload;
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

  const firstName = clamp(body.firstName ?? "", 50);
  const company = clamp(body.company ?? "", 100);
  const email = clamp(body.email ?? "", 200);
  const phone = clamp(body.phone ?? "", 40);
  const adSpend = clamp(body.adSpend ?? "", 60);
  const crm = clamp(body.crm ?? "", 60);
  const teamSize = clamp(body.teamSize ?? "", 30);
  const role = clamp(body.role ?? "", 60);
  const notes = clamp(body.notes ?? "", 2000);
  const smsOptIn = Boolean(body.smsOptIn);

  if (!firstName || !company || !email || !phone) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 422 },
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 422 });
  }
  if (digitCount(phone) < 7) {
    return NextResponse.json({ error: "Invalid phone." }, { status: 422 });
  }
  if (!adSpend || !crm || !teamSize || !role) {
    return NextResponse.json(
      { error: "Missing qualification fields." },
      { status: 422 },
    );
  }

  const payload = {
    tags: ["inbound"],
    firstName,
    company,
    email,
    phone,
    adSpend,
    crm,
    teamSize,
    role,
    notes,
    smsOptIn,
    submittedAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") ?? undefined,
    ip:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      undefined,
  };

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("Contact webhook returned non-2xx:", res.status);
      }
    } catch (err) {
      console.error("Contact webhook failed:", err);
    }
  } else {
    console.log("[contact] new submission:", payload);
  }

  // The main qualifier form fires no browser pixel event, so this is the only
  // signal Meta gets for it — send it server-side with hashed contact details.
  // No dedup id is needed since there is no browser twin to pair with.
  await sendMetaCapiEvents(
    [
      {
        name: "Lead",
        eventId: crypto.randomUUID(),
        customData: { content_name: "contact-form" },
        userData: { email, phone, firstName },
      },
    ],
    capiContextFromRequest(request),
  );

  return NextResponse.json({ ok: true });
}
