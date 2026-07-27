// Meta Conversions API — the server-side half of our pixel.
//
// The browser pixel in src/components/MetaPixel.tsx loses a meaningful slice of
// events to ATT, Safari ITP and ad blockers. Every event we fire in the browser
// is therefore mirrored here with the SAME event id: Meta deduplicates on
// (event_name, event_id), so a visitor whose browser event made it through is
// counted once, and one whose didn't is still counted.
//
// Form submissions go one better — those routes have the lead's real email and
// phone, so they send hashed identifiers and get a far higher match quality
// than the browser can manage on its own.
//
// Everything here is a no-op when META_CAPI_ACCESS_TOKEN is unset, mirroring how
// the pixel no-ops without NEXT_PUBLIC_META_PIXEL_ID.

import { createHash } from "node:crypto";

const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION || "v23.0";
const PIXEL_ID =
  process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID;
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE;

/** Meta drops the request if we hang; don't let it hold up a form response. */
const REQUEST_TIMEOUT_MS = 4000;

export interface CapiUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

export interface CapiContext {
  ip?: string;
  userAgent?: string;
  /** _fbp cookie — Meta's first-party browser id. */
  fbp?: string;
  /** _fbc cookie, or one synthesized from an fbclid query param. */
  fbc?: string;
  sourceUrl?: string;
}

export interface CapiEvent {
  /** Standard ("Lead") or custom ("CompletedWebDemo") event name. */
  name: string;
  /** Must match the browser's `eventID` for the same action, or dedup fails. */
  eventId?: string;
  customData?: Record<string, string | number | undefined>;
  userData?: CapiUserData;
}

export function isMetaCapiConfigured(): boolean {
  return Boolean(ACCESS_TOKEN && PIXEL_ID);
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Meta wants lowercase, trimmed, then SHA-256 hex. Empty input → undefined. */
function hashNormalized(value: string | undefined): string | undefined {
  const normalized = value?.trim().toLowerCase();
  return normalized ? sha256(normalized) : undefined;
}

/** Names: lowercase, letters only (Meta strips punctuation before matching). */
function hashName(value: string | undefined): string | undefined {
  const normalized = value?.trim().toLowerCase().replace(/[^a-z]/g, "");
  return normalized ? sha256(normalized) : undefined;
}

/**
 * Phones must be digits only, including country code. Our ICP is US-primary and
 * those numbers arrive as bare 10-digit strings, so assume +1 for that length
 * and otherwise trust the digits we were given.
 */
function hashPhone(value: string | undefined): string | undefined {
  let digits = (value ?? "").replace(/\D/g, "");
  if (!digits) return undefined;
  if (digits.length === 10) digits = `1${digits}`;
  return sha256(digits);
}

function readCookie(cookieHeader: string | null, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("=")) || undefined;
  }
  return undefined;
}

/**
 * Pull the request-scoped signals Meta uses for matching: IP, user agent and the
 * _fbp/_fbc cookies. When _fbc is missing but the landing URL carried an fbclid
 * (first click, before the pixel wrote the cookie) we synthesize it in Meta's
 * documented `fb.1.<timestamp>.<fbclid>` format.
 */
export function capiContextFromRequest(
  request: Request,
  opts: { fbclid?: string; sourceUrl?: string } = {},
): CapiContext {
  const cookies = request.headers.get("cookie");
  const fbc =
    readCookie(cookies, "_fbc") ??
    (opts.fbclid ? `fb.1.${Date.now()}.${opts.fbclid}` : undefined);

  return {
    ip:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
    fbp: readCookie(cookies, "_fbp"),
    fbc,
    sourceUrl: opts.sourceUrl ?? request.headers.get("referer") ?? undefined,
  };
}

function buildUserData(user: CapiUserData | undefined, ctx: CapiContext) {
  const userData: Record<string, string | string[]> = {};
  const em = hashNormalized(user?.email);
  const ph = hashPhone(user?.phone);
  const fn = hashName(user?.firstName);
  const ln = hashName(user?.lastName);

  // Meta expects these identifier fields as arrays.
  if (em) userData.em = [em];
  if (ph) userData.ph = [ph];
  if (fn) userData.fn = [fn];
  if (ln) userData.ln = [ln];
  if (ctx.ip) userData.client_ip_address = ctx.ip;
  if (ctx.userAgent) userData.client_user_agent = ctx.userAgent;
  if (ctx.fbp) userData.fbp = ctx.fbp;
  if (ctx.fbc) userData.fbc = ctx.fbc;

  return userData;
}

function buildCustomData(custom: CapiEvent["customData"]) {
  const out: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(custom ?? {})) {
    if (value !== undefined && value !== "") out[key] = value;
  }
  return out;
}

/**
 * Send one or more events to the Conversions API. Never throws and never
 * rejects — ad tracking must not be able to fail a form submission.
 */
export async function sendMetaCapiEvents(
  events: CapiEvent[],
  ctx: CapiContext,
): Promise<void> {
  if (!isMetaCapiConfigured() || events.length === 0) return;

  const eventTime = Math.floor(Date.now() / 1000);
  const body: Record<string, unknown> = {
    data: events.map((event) => ({
      event_name: event.name,
      event_time: eventTime,
      event_id: event.eventId,
      event_source_url: ctx.sourceUrl,
      action_source: "website",
      user_data: buildUserData(event.userData, ctx),
      custom_data: buildCustomData(event.customData),
    })),
  };
  if (TEST_EVENT_CODE) body.test_event_code = TEST_EVENT_CODE;

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(
    ACCESS_TOKEN as string,
  )}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) {
      // Body carries Meta's actual complaint (bad token, stale API version,
      // malformed user_data) — worth logging in full, it's the only way to
      // debug a silent tracking gap.
      console.error(
        "Meta CAPI returned non-2xx:",
        res.status,
        await res.text().catch(() => ""),
      );
    }
  } catch (err) {
    console.error("Meta CAPI request failed:", err);
  }
}
