// Shape of a website audit, from lead capture through to a claimed rebuild.
//
// The cardinal rule the whole module is built around: every number shown to a
// business owner is measured, never inferred. Signals that could not be
// collected stay `null` and render as "we couldn't pull this automatically" —
// they are never filled in with a plausible-sounding guess.

export type AuditStatus =
  | "pending" // lead captured, audit generating
  | "ready" // audit generated, waiting on human review
  | "sent" // review approved, email sent
  | "claimed" // lead clicked "claim my free rebuild"
  | "failed"; // generation failed hard (nothing usable to send)

/** Ad-attribution params carried from the landing page into the CRM. */
export interface AuditAttribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  gclid?: string;
  fbclid?: string;
  landingPage?: string;
  referrer?: string;
}

export interface AuditLead {
  name: string;
  business: string;
  /** Exactly what they typed — may be "none", may be missing a scheme. */
  website: string;
  phone: string;
  email: string;
  /** Which of the six pain options they picked. */
  pain: string;
  attribution: AuditAttribution;
  submittedAt: string;
  userAgent?: string;
  ip?: string;
}

// ─── Measured signals ────────────────────────────────────────────────────────

export interface OnPageSignals {
  /** URL after redirects — what we actually measured. */
  finalUrl: string;
  statusCode: number;
  usesHttps: boolean;
  title: string | null;
  metaDescription: string | null;
  h1: string | null;
  h1Count: number;
  hasViewportMeta: boolean;
  /** A `tel:` link anywhere on the page — tap-to-call on mobile. */
  hasTelLink: boolean;
  formCount: number;
  hasLocalBusinessSchema: boolean;
  imageCount: number;
  imagesMissingAlt: number;
  /** Bytes of HTML alone, before images and scripts. */
  htmlBytes: number;
  /**
   * Characters of visible body text in the served HTML. A page that ships a
   * near-empty shell and paints itself with JavaScript scores very low here,
   * and we can't honestly judge its content from outside — see findings.ts.
   */
  bodyTextLength: number;
  /**
   * Whether a booking/contact word appears in the first ~3000 characters of
   * body text. A heuristic for "is there a CTA above the fold", and labelled as
   * one wherever it is shown.
   */
  ctaNearTop: boolean;
}

export interface PageSpeedSignals {
  /** Lighthouse performance score, 0–100, mobile strategy. */
  performanceScore: number | null;
  lcpSeconds: number | null;
  cls: number | null;
  tbtMs: number | null;
  /** True when the numbers come from real Chrome user data, not the lab run. */
  hasFieldData: boolean;
  /**
   * Lighthouse's final-screenshot: the page as it rendered on the emulated
   * phone, as a data URI. This is what the design review looks at, and the
   * report shows it beside the commentary so the reader can check every
   * observation against the image itself.
   */
  screenshot: string | null;
}

export interface PlacesCompetitor {
  name: string;
  rating: number | null;
  reviewCount: number | null;
}

export interface PlacesSignals {
  name: string;
  rating: number | null;
  reviewCount: number | null;
  mapsUrl: string | null;
  /** Up to three same-category businesses nearby, best-reviewed first. */
  competitors: PlacesCompetitor[];
}

export interface AuditSignals {
  onPage: OnPageSignals | null;
  pageSpeed: PageSpeedSignals | null;
  places: PlacesSignals | null;
  /**
   * The page rendered on an emulated laptop-size viewport (a second, desktop
   * PageSpeed run kept only for its screenshot). Purely presentational — the
   * report shows it in a laptop mockup beside the phone one.
   */
  desktopScreenshot?: string | null;
  /** Human-readable notes on what could not be measured, and why. */
  gaps: string[];
}

// ─── Findings ────────────────────────────────────────────────────────────────

export type FindingSeverity = "critical" | "warning" | "ok" | "unmeasured";

export type FindingId =
  | "first-five-seconds"
  | "speed"
  | "mobile-and-calls"
  | "reviews"
  | "findability";

export interface AuditFinding {
  id: FindingId;
  /** Short label, e.g. "The first five seconds". */
  title: string;
  severity: FindingSeverity;
  /**
   * The measured facts behind this finding, as label/value pairs. Rendered
   * verbatim — these are the numbers, and nothing generates them but code.
   */
  metrics: { label: string; value: string }[];
  /** One line stating the finding. Written by code, optionally rewritten by Gemini. */
  headline: string;
  /** Two to four sentences of explanation. Same provenance as `headline`. */
  body: string;
}

export interface AuditNarrative {
  /** The single strongest finding — drives the email subject and preview. */
  headline: string;
  summary: string;
  findings: AuditFinding[];
  /**
   * The three things a URL cannot reveal (missed calls, reply speed, ad spend).
   * These are the stated reason to get on the call.
   */
  callTopics: { title: string; body: string }[];
  /** True when Gemini rewrote the prose; false when the templates were used. */
  narrated: boolean;
}

// ─── Design review ───────────────────────────────────────────────────────────

/**
 * A qualitative read of the rendered page — design, colour, hierarchy, trust.
 * Unlike findings, this is professional opinion rather than measurement, and
 * the report labels it that way. Two rules keep it honest: it is only produced
 * when there is a real screenshot for it to describe (shown alongside), and
 * the prose is not allowed to contain numbers at all.
 */
export interface DesignReview {
  /** One-sentence overall impression. */
  headline: string;
  /** Three to four specific observations. */
  points: { title: string; body: string }[];
  /** Dominant colours seen in the screenshot, as hex strings. */
  palette: string[];
}

// ─── The stored record ───────────────────────────────────────────────────────

export interface AuditRecord {
  token: string;
  status: AuditStatus;
  /**
   * "instant" records come from the URL-first flow: the analysis starts from
   * the web address alone, the contact details arrive while it runs, and the
   * report is revealed on-page the moment the visitor asks for it — no human
   * review gate. Absent on records from the original emailed flow.
   */
  flow?: "instant";
  lead: AuditLead;
  signals: AuditSignals | null;
  narrative: AuditNarrative | null;
  design?: DesignReview | null;
  createdAt: string;
  readyAt?: string;
  sentAt?: string;
  claimedAt?: string;
  failureReason?: string;
}
