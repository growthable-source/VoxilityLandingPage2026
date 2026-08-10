// Orchestrates one audit, from stored lead to reviewable record.
//
// Every collector is allowed to fail independently. A site that times out, a
// PageSpeed key that isn't set, a business with no Google listing — each of
// those removes one finding and adds a line to `gaps`, and the audit still
// sends. The only hard failure is not being able to persist the result.

import { reviewDesign } from "./design";
import { fetchSite, normalizeSiteUrl, SiteFetchError } from "./fetchSite";
import { buildNarrative } from "./findings";
import { narrate } from "./narrate";
import { extractOnPageSignals } from "./onPage";
import { fetchPageSpeed } from "./pagespeed";
import { fetchPlaces } from "./places";
import { loadAudit, saveAudit } from "./store";
import type { AuditRecord, AuditSignals } from "./types";

export async function runAudit(token: string): Promise<void> {
  const record = await loadAudit(token);
  if (!record) {
    console.error("[audit] no record to run for token", token);
    return;
  }

  try {
    const signals = await collectSignals(record);
    // The prose pass and the design review are independent Gemini calls, so
    // they run together. Both fail soft — a null design just means the report
    // ships without that section.
    const screenshot = signals.pageSpeed?.screenshot ?? null;
    const [narrative, design] = await Promise.all([
      narrate(buildNarrative(signals)),
      screenshot ? reviewDesign(screenshot) : Promise.resolve(null),
    ]);

    await saveAudit({
      ...record,
      status: "ready",
      signals,
      narrative,
      design,
      readyAt: new Date().toISOString(),
    });

    await notifyReviewer({ ...record, signals, narrative });
  } catch (err) {
    console.error("[audit] generation failed for", token, err);
    await saveAudit({
      ...record,
      status: "failed",
      failureReason: err instanceof Error ? err.message : "Unknown error",
    }).catch(() => {});
  }
}

async function collectSignals(record: AuditRecord): Promise<AuditSignals> {
  const gaps: string[] = [];
  const siteUrl = normalizeSiteUrl(record.lead.website);

  if (!siteUrl) {
    gaps.push(
      "No website was given, so the on-page and speed checks were skipped. " +
        "That is not a problem — it makes the free build more useful, not less.",
    );
  }

  // The three collectors are independent, so they run together rather than
  // stacking their timeouts. PageSpeed is the slow one at up to 35s.
  const [onPageResult, pageSpeedResult, placesResult] = await Promise.allSettled([
    siteUrl ? collectOnPage(siteUrl) : Promise.reject(new SkippedError()),
    siteUrl ? fetchPageSpeed(siteUrl) : Promise.reject(new SkippedError()),
    fetchPlaces(record.lead.business, siteUrl),
  ]);

  if (onPageResult.status === "rejected" && siteUrl) {
    gaps.push(
      `We couldn't read ${siteUrl} automatically. ${reasonOf(onPageResult.reason)}`,
    );
  }
  if (pageSpeedResult.status === "rejected" && siteUrl) {
    gaps.push(`The speed test didn't complete. ${reasonOf(pageSpeedResult.reason)}`);
  }
  if (placesResult.status === "rejected") {
    gaps.push(
      `We couldn't confidently match "${record.lead.business}" to a Google Business Profile, ` +
        "so the review comparison is one for the call rather than a guess.",
    );
  }

  return {
    onPage: onPageResult.status === "fulfilled" ? onPageResult.value : null,
    pageSpeed: pageSpeedResult.status === "fulfilled" ? pageSpeedResult.value : null,
    places: placesResult.status === "fulfilled" ? placesResult.value : null,
    gaps,
  };
}

async function collectOnPage(siteUrl: string) {
  const site = await fetchSite(siteUrl);
  if (site.statusCode >= 400) {
    throw new SiteFetchError(`It returned an HTTP ${site.statusCode}.`);
  }
  return extractOnPageSignals(site);
}

class SkippedError extends Error {}

function reasonOf(reason: unknown): string {
  if (reason instanceof SkippedError) return "";
  return reason instanceof Error ? reason.message : "The check didn't complete.";
}

/**
 * Ping whoever is reviewing. Without this the audit sits in storage unread and
 * the whole speed-to-lead argument in the campaign plan falls over.
 */
async function notifyReviewer(record: AuditRecord): Promise<void> {
  const reviewUrl = buildReviewUrl(record.token);
  const summary =
    `New audit ready for review — ${record.lead.business} (${record.lead.name}, ${record.lead.phone})\n` +
    `${record.narrative?.headline ?? "No headline finding."}\n${reviewUrl}`;

  const webhook = process.env.AUDIT_REVIEW_WEBHOOK_URL;
  if (!webhook) {
    console.log("[audit] ready for review:\n" + summary);
    return;
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        text: summary,
        token: record.token,
        business: record.lead.business,
        name: record.lead.name,
        email: record.lead.email,
        phone: record.lead.phone,
        reviewUrl,
        headline: record.narrative?.headline ?? null,
      }),
    });
    if (!res.ok) {
      console.error("[audit] review webhook returned non-2xx:", res.status);
    }
  } catch (err) {
    console.error("[audit] review webhook failed:", err);
  }
}

export function buildReviewUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.xovera.io";
  const key = process.env.AUDIT_REVIEW_SECRET;
  const suffix = key ? `?key=${encodeURIComponent(key)}` : "";
  return `${base}/audit/${token}${suffix}`;
}

export function buildAuditUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.xovera.io";
  return `${base}/audit/${token}`;
}
