// PageSpeed Insights, mobile strategy.
//
// Mobile is the only strategy we run: the searches this funnel buys happen on a
// phone, so a desktop score would flatter the site in a way the audit call
// would then have to walk back.
//
// Field data (real Chrome users, 28-day rolling) is used when Google has it and
// the lab run is the fallback. Which one produced the numbers is recorded, so
// the page can say so rather than implying more precision than we have.

import type { PageSpeedSignals } from "./types";

const ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const TIMEOUT_MS = 35_000;

interface PsiMetric {
  percentile?: number;
}

interface PsiResponse {
  loadingExperience?: {
    metrics?: {
      LARGEST_CONTENTFUL_PAINT_MS?: PsiMetric;
      CUMULATIVE_LAYOUT_SHIFT_SCORE?: PsiMetric;
    };
  };
  lighthouseResult?: {
    categories?: { performance?: { score?: number | null } };
    audits?: Record<
      string,
      { numericValue?: number; details?: { data?: string } }
    >;
  };
}

export class PageSpeedError extends Error {}

export async function fetchPageSpeed(url: string): Promise<PageSpeedSignals> {
  const key = process.env.PAGESPEED_API_KEY;
  if (!key) {
    throw new PageSpeedError("PAGESPEED_API_KEY is not set.");
  }

  const endpoint = new URL(ENDPOINT);
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("strategy", "mobile");
  endpoint.searchParams.set("category", "performance");
  endpoint.searchParams.set("key", key);

  let res: Response;
  try {
    res = await fetch(endpoint, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (err) {
    throw new PageSpeedError(
      err instanceof Error && err.name === "TimeoutError"
        ? "PageSpeed Insights timed out."
        : "PageSpeed Insights could not be reached.",
    );
  }

  if (!res.ok) {
    throw new PageSpeedError(`PageSpeed Insights returned ${res.status}.`);
  }

  const data = (await res.json()) as PsiResponse;

  const lab = data.lighthouseResult?.audits ?? {};
  const field = data.loadingExperience?.metrics;
  const fieldLcpMs = field?.LARGEST_CONTENTFUL_PAINT_MS?.percentile;
  const fieldCls = field?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile;
  const hasFieldData = typeof fieldLcpMs === "number";

  const score = data.lighthouseResult?.categories?.performance?.score;

  return {
    // Lighthouse reports 0–1; everyone who has ever seen this number reads it
    // as 0–100.
    performanceScore: typeof score === "number" ? Math.round(score * 100) : null,
    lcpSeconds: hasFieldData
      ? round(fieldLcpMs / 1000, 1)
      : msToSeconds(lab["largest-contentful-paint"]?.numericValue),
    // The field CLS percentile arrives multiplied by 100.
    cls:
      typeof fieldCls === "number"
        ? round(fieldCls / 100, 2)
        : roundOrNull(lab["cumulative-layout-shift"]?.numericValue, 2),
    tbtMs: roundOrNull(lab["total-blocking-time"]?.numericValue, 0),
    hasFieldData,
    screenshot: extractScreenshot(lab),
  };
}

/**
 * Lighthouse's final-screenshot — the rendered page on the emulated phone,
 * already a `data:image/jpeg;base64,…` URI. This is the input to the design
 * review, and the closest thing the audit has to eyes.
 */
function extractScreenshot(
  audits: NonNullable<NonNullable<PsiResponse["lighthouseResult"]>["audits"]>,
): string | null {
  const data = audits["final-screenshot"]?.details?.data;
  return typeof data === "string" && data.startsWith("data:image/")
    ? data
    : null;
}

function msToSeconds(ms: number | undefined): number | null {
  return typeof ms === "number" ? round(ms / 1000, 1) : null;
}

function roundOrNull(value: number | undefined, dp: number): number | null {
  return typeof value === "number" ? round(value, dp) : null;
}

function round(value: number, dp: number): number {
  const factor = 10 ** dp;
  return Math.round(value * factor) / factor;
}
