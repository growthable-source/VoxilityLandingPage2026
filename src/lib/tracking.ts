// Client-side conversion tracking helpers. Every call is guarded so pages
// work identically with or without the Meta Pixel / GTM present.

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
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("trackCustom", "CalculatorStart", { calculator: "gym" });
  }
  pushDataLayer("gym_calculator_start");
}

/**
 * The conversion we optimize ads on: a completed calculator (lead captured,
 * results revealed). Fires the standard Lead event plus a custom event that
 * can be used as a custom conversion in Meta Events Manager.
 */
export function trackCalculatorComplete(missedMonthlyRevenue: number) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Lead", {
      value: missedMonthlyRevenue,
      currency: "USD",
      content_name: "gym-calculator",
    });
    window.fbq("trackCustom", "CalculatorComplete", {
      calculator: "gym",
      value: missedMonthlyRevenue,
      currency: "USD",
    });
  }
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

/** Fired when a demo request is submitted (e.g. /ai-for-gyms). */
export function trackDemoRequest(source: string) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Lead", { content_name: source });
    window.fbq("trackCustom", "DemoRequest", { source });
  }
  gtagEvent("demo_request", { source });
  // The paid-ads conversion: only called after the demo API confirms the
  // booking request succeeded, never on clicks or other CTAs.
  gtagEvent("conversion", { send_to: ADS_DEMO_BOOKED_SEND_TO });
  pushDataLayer("demo_request", { source });
}

// ─── Vertical funnel events (the growth report's funnel) ─────────────────────

/** Fired when a visitor launches the ungated in-browser voice demo. */
export function trackVoiceDemoStart(vertical: string) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("trackCustom", "VoiceDemoStart", { vertical });
  }
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
 * The mid-funnel conversion we optimize Google Ads on: a meaningful completed
 * voice demo (≥30s of talk or ≥2 turns). Fires the standard Lead event plus a
 * custom event to import as the Google Ads / Meta optimization conversion.
 */
export function trackCompletedWebDemo(vertical: string) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Lead", { content_name: `voice-demo-${vertical}` });
    window.fbq("trackCustom", "CompletedWebDemo", { vertical });
  }
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
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "InitiateCheckout", { content_name: `signup-${vertical}` });
    window.fbq("trackCustom", "StartedPaidSignup", { vertical });
  }
  gtagEvent("started_paid_signup", { vertical });
  pushDataLayer("started_paid_signup", { vertical });
}

/** Fired once when a visitor first interacts with a vertical calculator. */
export function trackCalcStart(vertical: string) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("trackCustom", "CalculatorStart", { calculator: vertical });
  }
  gtagEvent("calculator_start", { calculator: vertical });
  pushDataLayer("calculator_start", { calculator: vertical });
}

/** Fired when a vertical calculator is completed (lead captured, results shown). */
export function trackCalcComplete(vertical: string, missedMonthlyRevenue: number) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Lead", {
      value: missedMonthlyRevenue,
      currency: "USD",
      content_name: `${vertical}-calculator`,
    });
    window.fbq("trackCustom", "CalculatorComplete", {
      calculator: vertical,
      value: missedMonthlyRevenue,
      currency: "USD",
    });
  }
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
