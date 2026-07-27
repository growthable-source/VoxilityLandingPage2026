import { NextResponse } from "next/server";
import {
  AFTER_HOURS_LABELS,
  RESPONSE_SPEED_LABELS,
  calculateMissedRevenue,
  roundResults,
  sanitizeInputs,
} from "@/lib/gymMath";
import { capiContextFromRequest, sendMetaCapiEvents } from "@/lib/metaCapi";

const MIN_FORM_DURATION_MS = 3000;

interface CalculatorPayload {
  /** Shared with the browser pixel event so Meta deduplicates the pair. */
  metaEventId?: string;
  firstName?: string;
  gymName?: string;
  email?: string;
  phone?: string;
  smsOptIn?: boolean;
  inputs?: {
    monthlyInquiries?: number;
    membershipPrice?: number;
    memberStayMonths?: number;
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

  const firstName = clamp(body.firstName ?? "", 50);
  const gymName = clamp(body.gymName ?? "", 100);
  const email = clamp(body.email ?? "", 200);
  const phone = clamp(body.phone ?? "", 40);
  const smsOptIn = Boolean(body.smsOptIn);

  if (!firstName || !gymName || !email || !phone) {
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
  const inputs = sanitizeInputs(body.inputs ?? {});
  const results = roundResults(calculateMissedRevenue(inputs));

  const utm = body.utm ?? {};
  const payload = {
    tags: ["inbound"],
    source: "gym-calculator",
    firstName,
    gymName,
    email,
    phone,
    smsOptIn,
    monthlyInquiries: inputs.monthlyInquiries,
    membershipPrice: inputs.membershipPrice,
    memberStayMonths: inputs.memberStayMonths,
    responseSpeed: RESPONSE_SPEED_LABELS[inputs.responseSpeed],
    afterHours: AFTER_HOURS_LABELS[inputs.afterHours],
    lostMembersPerMonth: results.lostMembersPerMonth,
    missedMonthlyRevenue: results.missedMonthlyRevenue,
    twelveMonthRevenue: results.twelveMonthRevenue,
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
        console.error("Calculator webhook returned non-2xx:", res.status);
      }
    } catch (err) {
      console.error("Calculator webhook failed:", err);
    }
  } else {
    console.log("[calculator] new completion:", payload);
  }

  // Server-side twin of the browser's Lead + CalculatorComplete pixel events,
  // with hashed contact details for a far better match rate.
  await sendMetaCapiEvents(
    [
      {
        name: "Lead",
        eventId: body.metaEventId,
        customData: {
          content_name: "gym-calculator",
          value: results.missedMonthlyRevenue,
          currency: "USD",
        },
        userData: { email, phone, firstName },
      },
      {
        name: "CalculatorComplete",
        eventId: body.metaEventId,
        customData: {
          calculator: "gym",
          value: results.missedMonthlyRevenue,
          currency: "USD",
        },
        userData: { email, phone, firstName },
      },
    ],
    capiContextFromRequest(request, { fbclid: payload.fbclid }),
  );

  return NextResponse.json({ ok: true, results });
}
