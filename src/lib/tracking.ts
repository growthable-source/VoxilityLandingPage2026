// Client-side conversion tracking helpers. Every call is guarded so pages
// work identically with or without the Meta Pixel / GTM present.
//
// Meta events carry an `eventID` and are mirrored server-side through the
// Conversions API (see src/lib/metaCapi.ts). Meta deduplicates on
// (event_name, event_id), so the browser event and its server twin count once.
// Events with no PII mirror themselves via /api/meta-event; form-backed events
// pass their id into the form's own API route, which sends the CAPI event with
// hashed email/phone for a much better match rate.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  fbclid?: string;
  /** Google Ads click id — capture it into leads for offline conversion import. */
  gclid?: string;
}

/** Read ad-attribution params from the current URL (client only). */
export function readUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  const q = new URLSearchParams(window.location.search);
  const pick = (k: string) => q.get(k)?.slice(0, 200) || undefined;
  return {
    utmSource: pick("utm_source"),
    utmMedium: pick("utm_medium"),
    utmCampaign: pick("utm_campaign"),
    utmContent: pick("utm_content"),
    utmTerm: pick("utm_term"),
    fbclid: pick("fbclid"),
    gclid: pick("gclid"),
  };
}

// ─── Meta event ids + Conversions API mirroring ──────────────────────────────

/**
 * A unique id shared by a browser pixel event and its Conversions API twin.
 * Form components generate one per submission and hand it to both the API route
 * and the track* call below, so the pair deduplicates.
 */
export function newMetaEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

type MetaCustomData = Record<string, string | number | undefined>;

interface MirrorEvent {
  name: string;
  eventId: string;
  customData?: MetaCustomData;
}

/**
 * Send PII-free events to our own CAPI relay. Fire-and-forget: `keepalive` lets
 * it survive the page unloading (the signup click navigates away immediately),
 * and any failure is swallowed — tracking must never break a user action.
 */
function mirrorToCapi(events: MirrorEvent[]) {
  if (typeof window === "undefined" || events.length === 0) return;
  try {
    void fetch("/api/meta-event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        events,
        sourceUrl: window.location.href,
        fbclid: readUtmParams().fbclid,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Ignore — no tracking is better than a thrown error in a click handler.
  }
}

/** Fire a Meta pixel event with a dedup id attached. */
function fbqEvent(
  kind: "track" | "trackCustom",
  name: string,
  customData: MetaCustomData,
  eventId: string,
) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(kind, name, customData, { eventID: eventId });
  }
}

function pushDataLayer(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
}

/** Fire a GA4 / Google Ads event via gtag (no-op when the tag is absent). */
function gtagEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}

/** Fired once when the visitor first interacts with the calculator. */
export function trackCalculatorStart() {
  const eventId = newMetaEventId();
  fbqEvent("trackCustom", "CalculatorStart", { calculator: "gym" }, eventId);
  mirrorToCapi([
    { name: "CalculatorStart", eventId, customData: { calculator: "gym" } },
  ]);
  pushDataLayer("gym_calculator_start");
}

/**
 * The conversion we optimize ads on: a completed calculator (lead captured,
 * results revealed). Fires the standard Lead event plus a custom event that
 * can be used as a custom conversion in Meta Events Manager.
 *
 * `metaEventId` should be the id the caller also sent to /api/calculator, which
 * mirrors both events server-side with the lead's hashed email and phone.
 */
export function trackCalculatorComplete(
  missedMonthlyRevenue: number,
  metaEventId?: string,
) {
  const eventId = metaEventId ?? newMetaEventId();
  fbqEvent(
    "track",
    "Lead",
    {
      value: missedMonthlyRevenue,
      currency: "USD",
      content_name: "gym-calculator",
    },
    eventId,
  );
  fbqEvent(
    "trackCustom",
    "CalculatorComplete",
    { calculator: "gym", value: missedMonthlyRevenue, currency: "USD" },
    eventId,
  );
  pushDataLayer("gym_calculator_complete", {
    calculator: "gym",
    value: missedMonthlyRevenue,
  });
}

/**
 * Google Ads conversion "Booked a Demo with Xovera Sales Team" (account
 * 570-724-0444). Value ($100 USD) and one-per-click counting are configured on
 * the Google Ads side — do not pass a value here.
 */
const ADS_DEMO_BOOKED_SEND_TO = "AW-11078657396/vX1zCP_evdQcEPTK26Ip";

/**
 * Fired when a demo request is submitted (e.g. /ai-for-gyms). `metaEventId`
 * should be the id the caller also sent to the demo API route, which mirrors
 * both Meta events server-side with hashed contact details.
 */
export function trackDemoRequest(source: string, metaEventId?: string) {
  const eventId = metaEventId ?? newMetaEventId();
  fbqEvent("track", "Lead", { content_name: source }, eventId);
  fbqEvent("trackCustom", "DemoRequest", { source }, eventId);
  gtagEvent("demo_request", { source });
  // The paid-ads conversion: only called after the demo API confirms the
  // booking request succeeded, never on clicks or other CTAs.
  gtagEvent("conversion", { send_to: ADS_DEMO_BOOKED_SEND_TO });
  pushDataLayer("demo_request", { source });
}

// ─── Vertical funnel events (the growth report's funnel) ─────────────────────

/** Fired when a visitor launches the ungated in-browser voice demo. */
export function trackVoiceDemoStart(vertical: string) {
  const eventId = newMetaEventId();
  fbqEvent("trackCustom", "VoiceDemoStart", { vertical }, eventId);
  mirrorToCapi([{ name: "VoiceDemoStart", eventId, customData: { vertical } }]);
  gtagEvent("voice_demo_start", { vertical });
  pushDataLayer("voice_demo_start", { vertical });
}

/**
 * Google Ads conversion "Completed Web Demo" (account 570-724-0444) — the
 * mid-funnel optimization signal for the vertical Search campaigns. Create the
 * conversion action in Google Ads (Tools → Conversions → New → Website), then
 * set its send-to label ("AW-11078657396/<label>") as
 * NEXT_PUBLIC_ADS_WEB_DEMO_SEND_TO in Vercel. Until that env var is set this is
 * a no-op — the custom event below still flows to GA4/GTM/Meta. Configure the
 * value + counting on the Google Ads side; don't pass a value here.
 */
const ADS_WEB_DEMO_SEND_TO = process.env.NEXT_PUBLIC_ADS_WEB_DEMO_SEND_TO;

/**
 * The mid-funnel conversion we optimize on: a meaningful completed voice demo
 * (≥30s of talk or ≥2 turns). This is the Meta optimization event too — build a
 * custom conversion on "CompletedWebDemo" in Events Manager rather than on the
 * bare Lead event, which three different actions fire.
 */
export function trackCompletedWebDemo(vertical: string) {
  const eventId = newMetaEventId();
  fbqEvent("track", "Lead", { content_name: `voice-demo-${vertical}` }, eventId);
  fbqEvent("trackCustom", "CompletedWebDemo", { vertical }, eventId);
  mirrorToCapi([
    { name: "Lead", eventId, customData: { content_name: `voice-demo-${vertical}` } },
    { name: "CompletedWebDemo", eventId, customData: { vertical } },
  ]);
  gtagEvent("completed_web_demo", { vertical });
  // The paid-ads optimization conversion — fires only once the send-to label
  // is configured (see ADS_WEB_DEMO_SEND_TO above).
  if (ADS_WEB_DEMO_SEND_TO) {
    gtagEvent("conversion", { send_to: ADS_WEB_DEMO_SEND_TO });
  }
  pushDataLayer("completed_web_demo", { vertical });
}

/** Fired when a visitor clicks through to the paid self-serve signup. */
export function trackStartedPaidSignup(vertical: string) {
  const eventId = newMetaEventId();
  const contentName = `signup-${vertical}`;
  fbqEvent("track", "InitiateCheckout", { content_name: contentName }, eventId);
  fbqEvent("trackCustom", "StartedPaidSignup", { vertical }, eventId);
  mirrorToCapi([
    { name: "InitiateCheckout", eventId, customData: { content_name: contentName } },
    { name: "StartedPaidSignup", eventId, customData: { vertical } },
  ]);
  gtagEvent("started_paid_signup", { vertical });
  pushDataLayer("started_paid_signup", { vertical });
}

/** Fired once when a visitor first interacts with a vertical calculator. */
export function trackCalcStart(vertical: string) {
  const eventId = newMetaEventId();
  fbqEvent("trackCustom", "CalculatorStart", { calculator: vertical }, eventId);
  mirrorToCapi([
    { name: "CalculatorStart", eventId, customData: { calculator: vertical } },
  ]);
  gtagEvent("calculator_start", { calculator: vertical });
  pushDataLayer("calculator_start", { calculator: vertical });
}

/**
 * Fired when a vertical calculator is completed (lead captured, results shown).
 * `metaEventId` should be the id the caller also sent to
 * /api/vertical-calculator, which mirrors both events server-side with hashed
 * contact details.
 */
export function trackCalcComplete(
  vertical: string,
  missedMonthlyRevenue: number,
  metaEventId?: string,
) {
  const eventId = metaEventId ?? newMetaEventId();
  fbqEvent(
    "track",
    "Lead",
    {
      value: missedMonthlyRevenue,
      currency: "USD",
      content_name: `${vertical}-calculator`,
    },
    eventId,
  );
  fbqEvent(
    "trackCustom",
    "CalculatorComplete",
    { calculator: vertical, value: missedMonthlyRevenue, currency: "USD" },
    eventId,
  );
  gtagEvent("calculator_complete", {
    calculator: vertical,
    value: missedMonthlyRevenue,
    currency: "USD",
  });
  pushDataLayer("calculator_complete", {
    calculator: vertical,
    value: missedMonthlyRevenue,
  });
}

// ─── Free build + teardown funnel (/free-website) ────────────────────────────

/** The visitor put a URL in and the instant analysis kicked off. */
export function trackInstantAuditStart() {
  const eventId = newMetaEventId();
  fbqEvent("trackCustom", "InstantAuditStart", {}, eventId);
  mirrorToCapi([{ name: "InstantAuditStart", eventId }]);
  gtagEvent("instant_audit_start");
  pushDataLayer("instant_audit_start");
}

/**
 * Send-to label for a "free build lead" Google Ads conversion action (the
 * gate submit — the form-fill moment). Create the action in Google Ads
 * (Goals → Conversions → New → Website, category "Submit lead form"), paste
 * its label here as NEXT_PUBLIC_ADS_LEAD_SEND_TO in Vercel, and this fires —
 * a no-op until then. During a low-volume test this is the conversion with
 * enough volume for Google to learn on; the claim conversion below is the
 * deeper signal.
 */
const ADS_LEAD_SEND_TO = process.env.NEXT_PUBLIC_ADS_LEAD_SEND_TO;

/**
 * A submitted free-build request. `metaEventId` should be the id the caller
 * also sent to /api/free-build, which mirrors this event server-side with
 * hashed contact details.
 *
 * This is the campaign's *proxy* conversion — the claim is what separates a
 * curious form fill from a booked call, and fires its own Ads conversion.
 */
export function trackFreeBuildLead(pain: string, metaEventId?: string) {
  const eventId = metaEventId ?? newMetaEventId();
  fbqEvent("track", "Lead", { content_name: "free-website-build" }, eventId);
  fbqEvent("trackCustom", "FreeBuildRequest", { pain }, eventId);
  gtagEvent("free_build_request", { pain });
  if (ADS_LEAD_SEND_TO) {
    gtagEvent("conversion", { send_to: ADS_LEAD_SEND_TO });
  }
  pushDataLayer("free_build_request", { pain });
}

/**
 * The lead opened their audit page. Only reachable from the emailed link, so it
 * doubles as email validation — the address is real and they are reading it.
 */
export function trackAuditViewed(token: string) {
  const eventId = newMetaEventId();
  fbqEvent("trackCustom", "AuditViewed", {}, eventId);
  mirrorToCapi([{ name: "AuditViewed", eventId }]);
  gtagEvent("audit_viewed");
  pushDataLayer("audit_viewed", { auditToken: token });
}

// ─── AU AI-receptionist campaign (/ai-receptionist-australia) ────────────────

/**
 * A submitted callback request from the Australian receptionist campaign page.
 * `metaEventId` should be the id the caller also sent to /api/receptionist-au,
 * which mirrors the events server-side with hashed contact details.
 *
 * Fires the Google Ads demo-booked conversion for the same reason
 * trackDemoRequest does: the form's whole job is booking the walkthrough call,
 * and it's only called after the API confirms the request landed.
 */
export function trackReceptionistAuLead(callHandling: string, metaEventId?: string) {
  const eventId = metaEventId ?? newMetaEventId();
  fbqEvent("track", "Lead", { content_name: "ai-receptionist-au" }, eventId);
  fbqEvent("trackCustom", "ReceptionistCallbackRequest", { callHandling }, eventId);
  gtagEvent("receptionist_callback_request", { callHandling });
  gtagEvent("conversion", { send_to: ADS_DEMO_BOOKED_SEND_TO });
  pushDataLayer("receptionist_callback_request", { callHandling });
}

/**
 * The conversion that matters: they read the audit and asked for the rebuild.
 * Fires just before the redirect to the booking calendar, so `keepalive` inside
 * mirrorToCapi is doing real work here.
 */
export function trackFreeBuildClaimed() {
  const eventId = newMetaEventId();
  fbqEvent("track", "Schedule", { content_name: "free-website-build" }, eventId);
  fbqEvent("trackCustom", "FreeBuildClaimed", {}, eventId);
  mirrorToCapi([
    { name: "Schedule", eventId, customData: { content_name: "free-website-build" } },
    { name: "FreeBuildClaimed", eventId },
  ]);
  gtagEvent("free_build_claimed");
  gtagEvent("conversion", { send_to: ADS_DEMO_BOOKED_SEND_TO });
  pushDataLayer("free_build_claimed");
}
