// The contract every vertical config implements. One `Vertical` object drives
// a full landing page (`/ai-for-<slug>`), a standalone calculator funnel
// (`/ai-for-<slug>/calculator`), the demo/lead form, and all SEO/JSON-LD.
//
// Everything here is plain serializable data (no JSX) so the same object can be
// read on the server (metadata, sitemap, API recompute) and the client.

import type { ResponseSpeed, AfterHours } from "@/lib/revenueMath";

/** A two-part heading: plain text with one gradient-highlighted fragment. */
export interface Highlighted {
  /** Leading text before the highlight. */
  before: string;
  /** The gradient-highlighted fragment. */
  highlight: string;
  /** Trailing text after the highlight (optional). */
  after?: string;
}

export interface Stat {
  /** Big value, e.g. "35%", "$7,800", "78%". */
  v: string;
  /** Supporting label. */
  l: string;
}

export interface Method {
  /** lucide-react icon name, resolved in the template. */
  icon: "Zap" | "Target" | "PhoneCall" | "Clock" | "CalendarCheck" | "ShieldCheck";
  title: string;
  body: string;
}

export interface Step {
  n: string;
  t: string;
  d: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface ChatLine {
  from: "lead" | "xovera";
  text: string;
}

export interface ChatDemo {
  /** Meta line in the demo window header, e.g. "New patient · Google · 8:12pm". */
  context: string;
  lines: ChatLine[];
  /** Outcome line under the conversation, e.g. "Appointment booked · 8:13pm". */
  outcome: string;
}

/** Economic model + copy for this vertical's missed-revenue calculator. */
export interface CalcConfig {
  /** Singular noun for a won customer, e.g. "appointment", "patient", "job". */
  unitSingular: string;
  /** Plural, e.g. "appointments", "patients", "jobs". */
  unitPlural: string;
  /** Inquiry → won close rate (0–1). */
  closeRate: number;
  /** Share of inquiries that arrive as phone calls (0–1). */
  callShare: number;
  /** Missed callers who never reconnect (0–1). */
  lostForGood: number;
  /** Missed-call rate by after-hours handling. */
  missedCallRate: Record<AfterHours, number>;
  /** Lead loss by first-reply speed. */
  speedLoss: Record<ResponseSpeed, number>;
  inputs: {
    /** Calls + forms + DMs per month. */
    monthlyInquiries: { min: number; max: number; step: number; default: number; label: string; hint: string };
    /** $ value of one booked period (first visit / month / job). */
    avgValue: { min: number; max: number; step: number; default: number; label: string; hint?: string };
    /** Repeat periods a won customer brings (visits/months/jobs), capped within 12 months. */
    repeatFactor: { min: number; max: number; step: number; default: number; label: string; hint?: string; unit: string };
  };
  /** Persona chip in the calculator hero, e.g. "For med spa owners". */
  audience: string;
}

export interface Vertical {
  /** URL slug, e.g. "med-spas". */
  slug: string;
  /** Display name, e.g. "Med Spas". */
  name: string;
  /** Lowercase persona for inline copy, e.g. "med spa". */
  noun: string;
  /** Org-name field label, e.g. "Med spa name", "Practice name". */
  orgLabel: string;
  /** Where the paid "Start free / Get my number" CTA points. */
  signupUrl: string;
  /** Source tag sent to the demo/calculator APIs + tracking. */
  demoSource: string;

  // ---- SEO ----
  seo: {
    title: string;
    description: string;
    ogAlt: string;
    keywords: string[];
  };

  // ---- Hero ----
  hero: {
    badge: string;
    h1: Highlighted;
    subhead: string;
    metrics: Stat[];
    /** Suggested things to ask the live voice demo. */
    demoPrompts: string[];
  };

  // ---- Integrations ----
  integrations: {
    heading: Highlighted;
    lede: string;
    /** Software names for the marquee. */
    tools: string[];
  };

  // ---- Problem / value (real numbers) ----
  problem: {
    eyebrow: string;
    heading: Highlighted;
    lede: string;
    stats: Stat[];
  };

  // ---- Three growth methods ----
  methods: {
    eyebrow: string;
    heading: Highlighted;
    items: Method[];
  };

  // ---- Scripted chat demo ----
  chatDemo: ChatDemo;
  /** Copy beside the chat demo. */
  demo: {
    eyebrow: string;
    heading: Highlighted;
    lede: string;
    metrics: Stat[];
  };

  // ---- Voice section ----
  voice: {
    eyebrow: string;
    heading: Highlighted;
    lede: string;
    bullets: string[];
  };

  // ---- Setup ----
  setup: {
    eyebrow: string;
    heading: Highlighted;
    lede: string;
    steps: Step[];
  };

  // ---- Demo booking ----
  contact: {
    eyebrow: string;
    heading: Highlighted;
    lede: string;
    bullets: string[];
  };

  // ---- FAQ ----
  faqs: Faq[];

  // ---- Calculator ----
  calc: CalcConfig;
  calcCopy: {
    /** H1 on the standalone calculator page. */
    h1: Highlighted;
    subhead: string;
    /** Cross-link teaser on the main landing page. */
    crossLink: string;
  };
}
