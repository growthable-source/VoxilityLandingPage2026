import { NextResponse } from "next/server";
import { capiContextFromRequest, sendMetaCapiEvents } from "@/lib/metaCapi";

/**
 * Server-side mirror for browser pixel events that carry no PII (voice-demo
 * starts and completions, signup clicks, calculator starts). The client fires
 * fbq with an `eventID` and posts the same id here; Meta deduplicates on
 * (event_name, event_id), so we recover the events ATT and ad blockers eat
 * without double-counting the ones that got through.
 *
 * Form submissions do NOT come through here — those routes send their own CAPI
 * events with hashed email/phone, which matches far better.
 */

/**
 * Only events we actually fire. This endpoint is public, so an allowlist keeps
 * it from being used to stuff arbitrary conversions into the pixel.
 */
const ALLOWED_EVENTS = new Set([
  "Lead",
  "InitiateCheckout",
  "VoiceDemoStart",
  "CompletedWebDemo",
  "StartedPaidSignup",
  "CalculatorStart",
]);

/** Custom-data keys we pass through; everything else is dropped. */
const ALLOWED_CUSTOM_KEYS = new Set([
  "vertical",
  "calculator",
  "source",
  "content_name",
  "value",
  "currency",
]);

const MAX_EVENTS_PER_REQUEST = 5;

interface MirrorPayload {
  events?: {
    name?: string;
    eventId?: string;
    customData?: Record<string, unknown>;
  }[];
  sourceUrl?: string;
  fbclid?: string;
}

function clamp(s: string, max: number): string {
  return s.slice(0, max).trim();
}

function sanitizeCustomData(raw: Record<string, unknown> | undefined) {
  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(raw ?? {})) {
    if (!ALLOWED_CUSTOM_KEYS.has(key)) continue;
    if (typeof value === "number" && Number.isFinite(value)) {
      out[key] = value;
    } else if (typeof value === "string" && value) {
      out[key] = clamp(value, 100);
    }
  }
  return out;
}

export async function POST(request: Request) {
  let body: MirrorPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const events = (body.events ?? [])
    .slice(0, MAX_EVENTS_PER_REQUEST)
    .filter((event) => event.name && ALLOWED_EVENTS.has(event.name))
    .map((event) => ({
      name: event.name as string,
      eventId: event.eventId ? clamp(event.eventId, 100) : undefined,
      customData: sanitizeCustomData(event.customData),
    }));

  if (events.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  await sendMetaCapiEvents(
    events,
    capiContextFromRequest(request, {
      fbclid: body.fbclid ? clamp(body.fbclid, 200) : undefined,
      sourceUrl: body.sourceUrl ? clamp(body.sourceUrl, 500) : undefined,
    }),
  );

  return NextResponse.json({ ok: true, sent: events.length });
}
