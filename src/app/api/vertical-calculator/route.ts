import { NextResponse } from "next/server";
import {
  AFTER_HOURS_LABELS,
  RESPONSE_SPEED_LABELS,
  calculateMissedRevenue,
  roundResults,
  sanitizeInputs,
} from "@/lib/revenueMath";
import { getVertical } from "@/lib/verticals";

const MIN_FORM_DURATION_MS = 3000;

interface CalculatorPayload {
  vertical?: string;
  firstName?: string;
  orgName?: string;
  email?: string;
  phone?: string;
  smsOptIn?: boolean;
  inputs?: {
    monthlyInquiries?: number;
    avgValue?: number;
    repeatFactor?: number;
    responseSpeed?: string;
    afterHours?: string;
  };
  utm?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    fbclid?: string;
  };
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
  let body: CalculatorPayload;
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

  const vertical = getVertical(clamp(body.vertical ?? "", 60));
  if (!vertical) {
    return NextResponse.json({ error: "Unknown vertical." }, { status: 422 });
  }

  const firstName = clamp(body.firstName ?? "", 50);
  const orgName = clamp(body.orgName ?? "", 100);
  const email = clamp(body.email ?? "", 200);
  const phone = clamp(body.phone ?? "", 40);
  const smsOptIn = Boolean(body.smsOptIn);

  if (!firstName || !orgName || !email || !phone) {
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

  // Recompute results server-side — client numbers are display-only.
  const inputs = sanitizeInputs(body.inputs ?? {}, vertical.calc);
  const results = roundResults(calculateMissedRevenue(inputs, vertical.calc));

  const utm = body.utm ?? {};
  const payload = {
    source: `${vertical.slug}-calculator`,
    vertical: vertical.slug,
    firstName,
    orgName,
    email,
    phone,
    smsOptIn,
    monthlyInquiries: inputs.monthlyInquiries,
    avgValue: inputs.avgValue,
    repeatFactor: inputs.repeatFactor,
    responseSpeed: RESPONSE_SPEED_LABELS[inputs.responseSpeed],
    afterHours: AFTER_HOURS_LABELS[inputs.afterHours],
    lostCustomersPerMonth: results.lostCustomersPerMonth,
    missedMonthlyRevenue: results.missedMonthlyRevenue,
    annualRevenue: results.annualRevenue,
    customerValue: results.customerValue,
    utmSource: clamp(utm.utmSource ?? "", 200) || undefined,
    utmMedium: clamp(utm.utmMedium ?? "", 200) || undefined,
    utmCampaign: clamp(utm.utmCampaign ?? "", 200) || undefined,
    utmContent: clamp(utm.utmContent ?? "", 200) || undefined,
    utmTerm: clamp(utm.utmTerm ?? "", 200) || undefined,
    fbclid: clamp(utm.fbclid ?? "", 200) || undefined,
    submittedAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") ?? undefined,
    ip:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      undefined,
  };

  const webhookUrl =
    process.env.CALCULATOR_WEBHOOK_URL || process.env.CONTACT_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error("Vertical calculator webhook returned non-2xx:", res.status);
      }
    } catch (err) {
      console.error("Vertical calculator webhook failed:", err);
    }
  } else {
    console.log("[vertical-calculator] new completion:", payload);
  }

  return NextResponse.json({ ok: true, results });
}
