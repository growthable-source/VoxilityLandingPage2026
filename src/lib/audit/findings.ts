// Turning measured signals into findings.
//
// This file is where the audit's credibility lives, so it has one rule: every
// number a business owner reads is computed here, from a signal we actually
// collected, against a threshold written down in this file. Gemini may later
// rewrite the *prose* (see narrate.ts) but never the metrics, never the
// severity, and never which findings appear.
//
// A signal we could not collect produces a finding with severity "unmeasured"
// that says so plainly. It does not produce a guess.

import type {
  AuditFinding,
  AuditNarrative,
  AuditSignals,
  FindingSeverity,
  OnPageSignals,
  PageSpeedSignals,
  PlacesSignals,
} from "./types";

// Core Web Vitals thresholds, as Google defines them.
const LCP_GOOD_S = 2.5;
const LCP_POOR_S = 4.0;
/** Google truncates titles around here in mobile results. */
const TITLE_MAX_CHARS = 60;

/**
 * Below this much visible text in the served HTML, the page is painting itself
 * with JavaScript and we are looking at an empty shell. Judging its headings or
 * contact options from outside would be judging something the visitor never
 * sees, so those findings are reported as unmeasured instead.
 */
const JS_SHELL_TEXT_CHARS = 500;

/**
 * We read the HTML the server sends; we do not run the page's JavaScript. Any
 * widget mounted after load — which on a React, Wix or Squarespace site can
 * include the contact form and the phone number — is invisible to this check.
 * Every finding that turns on the *absence* of an element carries this caveat,
 * because "we couldn't find it" and "it isn't there" are different claims and
 * only one of them survives being challenged on a call.
 */
const HTML_ONLY_CAVEAT = {
  label: "How this was checked",
  value: "In the HTML your server sends, without running the page's JavaScript",
};

export function buildNarrative(signals: AuditSignals): AuditNarrative {
  const findings = [
    firstFiveSeconds(signals.onPage),
    speed(signals.pageSpeed),
    mobileAndCalls(signals.onPage),
    reviews(signals.places),
    findability(signals.onPage),
  ];

  const worst = rankBySeverity(findings)[0];

  return {
    headline: worst ? worst.headline : "We took a look at your setup.",
    summary: summarize(findings),
    findings,
    callTopics: CALL_TOPICS,
    narrated: false,
  };
}

// ─── The five measurable findings ────────────────────────────────────────────

function firstFiveSeconds(onPage: OnPageSignals | null): AuditFinding {
  if (!onPage) return unmeasured("first-five-seconds", "The first five seconds");
  if (onPage.bodyTextLength < JS_SHELL_TEXT_CHARS) {
    return unmeasured("first-five-seconds", "The first five seconds", JS_SHELL_REASON);
  }

  const metrics = [
    { label: "Page title", value: onPage.title ?? "Missing" },
    { label: "Main heading (H1)", value: onPage.h1 ?? "Not found" },
    {
      label: "Booking or contact wording near the top",
      value: onPage.ctaNearTop ? "Found" : "Not found",
    },
    HTML_ONLY_CAVEAT,
  ];

  const missingHeading = !onPage.h1;
  const noCta = !onPage.ctaNearTop;
  const severity: FindingSeverity =
    missingHeading || noCta ? "critical" : onPage.h1Count > 1 ? "warning" : "ok";

  let headline: string;
  let body: string;

  if (missingHeading && noCta) {
    headline = "We couldn't find a main heading or any booking wording near the top.";
    body =
      "Neither appears in the first screenful of the page's HTML. Someone landing from a Google " +
      "search has to work out both what you do and what to press for themselves, and most won't stay " +
      "long enough to do it. Worth checking together on the call in case either is being added by " +
      "JavaScript after the page loads — if it isn't, this is usually a same-day fix.";
  } else if (missingHeading) {
    headline = "We couldn't find a main heading for a visitor to land on.";
    body =
      "There's no H1 in the page's HTML, so neither a visitor skimming nor Google gets a one-line " +
      "answer to what you do and where you do it. The booking wording is there, which is the harder " +
      "half — this is mostly a matter of putting the right sentence at the top.";
  } else if (noCta) {
    headline = "We couldn't find anything near the top telling someone how to get in touch.";
    body =
      `The heading reads "${truncate(onPage.h1!, 70)}", so the "what you do" part is covered. ` +
      "What's missing is the next step — no booking, call or enquiry wording appears in the first " +
      "screenful, and on a phone the rest is several scrolls away.";
  } else if (onPage.h1Count > 1) {
    headline = `The page uses ${onPage.h1Count} main headings, which splits the message.`;
    body =
      "Both the heading and the booking wording are in place, which puts you ahead of most local " +
      "business sites. Multiple H1s dilute what Google reads as the page's subject — worth tidying, " +
      "but it isn't what's costing you enquiries.";
  } else {
    headline = "The top of the page does its job.";
    body =
      `The heading reads "${truncate(onPage.h1!, 70)}" and there's booking or contact wording within ` +
      "the first screenful. This one's working — we'll spend the call on the parts that aren't.";
  }

  return { id: "first-five-seconds", title: "The first five seconds", severity, metrics, headline, body };
}

function speed(pageSpeed: PageSpeedSignals | null): AuditFinding {
  if (!pageSpeed || pageSpeed.lcpSeconds === null) {
    return unmeasured("speed", "Speed on a phone");
  }

  const lcp = pageSpeed.lcpSeconds;
  const source = pageSpeed.hasFieldData
    ? "real visitors over the last 28 days"
    : "a lab test on a simulated 4G phone";

  const metrics = [
    { label: "Largest contentful paint", value: `${lcp.toFixed(1)}s` },
    {
      label: "Performance score (mobile)",
      value:
        pageSpeed.performanceScore === null
          ? "Not returned"
          : `${pageSpeed.performanceScore}/100`,
    },
    { label: "Measured from", value: source },
  ];
  if (pageSpeed.cls !== null) {
    metrics.push({ label: "Layout shift (CLS)", value: pageSpeed.cls.toFixed(2) });
  }

  const severity: FindingSeverity =
    lcp > LCP_POOR_S ? "critical" : lcp > LCP_GOOD_S ? "warning" : "ok";

  let headline: string;
  let body: string;

  if (severity === "critical") {
    headline = `Your main content takes ${lcp.toFixed(1)} seconds to appear on a phone.`;
    body =
      `Google treats anything over ${LCP_POOR_S} seconds as poor, and this is measured from ${source}. ` +
      "A good chunk of people who tap your listing never see the page at all — they're back in the " +
      "search results before it loads. Speed is also a ranking factor, so it costs you twice.";
  } else if (severity === "warning") {
    headline = `Your main content takes ${lcp.toFixed(1)} seconds to appear on a phone.`;
    body =
      `Google's threshold for "good" is ${LCP_GOOD_S} seconds, so there's room here, measured from ${source}. ` +
      "It isn't the most expensive thing on this list, but it's usually one of the cheapest to fix — " +
      "image sizes and a couple of scripts account for most of it.";
  } else {
    headline = `Your page loads in ${lcp.toFixed(1)} seconds on a phone, which is genuinely good.`;
    body =
      `That's inside Google's ${LCP_GOOD_S}-second threshold, measured from ${source}. ` +
      "Nothing to do here. Worth knowing, because it rules speed out as the reason enquiries are thin.";
  }

  return { id: "speed", title: "Speed on a phone", severity, metrics, headline, body };
}

function mobileAndCalls(onPage: OnPageSignals | null): AuditFinding {
  if (!onPage) return unmeasured("mobile-and-calls", "Getting in touch from a phone");
  if (onPage.bodyTextLength < JS_SHELL_TEXT_CHARS) {
    return unmeasured("mobile-and-calls", "Getting in touch from a phone", JS_SHELL_REASON);
  }

  const metrics = [
    { label: "Mobile viewport set", value: onPage.hasViewportMeta ? "Yes" : "No" },
    { label: "Tap-to-call link", value: onPage.hasTelLink ? "Found" : "Not found" },
    {
      label: "Enquiry forms on the page",
      value: onPage.formCount === 0 ? "Not found" : String(onPage.formCount),
    },
    HTML_ONLY_CAVEAT,
  ];

  const noViewport = !onPage.hasViewportMeta;
  const noWayToContact = !onPage.hasTelLink && onPage.formCount === 0;
  // A missing viewport tag is a fact about the markup and can be stated flatly.
  // A missing form or phone link is only ever "we didn't find one", so it is
  // capped at a warning — asserting absence is what gets contradicted on calls.
  const severity: FindingSeverity = noViewport
    ? "critical"
    : noWayToContact || !onPage.hasTelLink
      ? "warning"
      : "ok";

  let headline: string;
  let body: string;

  if (noViewport) {
    headline = "The page isn't set up to render properly on a phone.";
    body =
      "There's no mobile viewport tag, which means phones fall back to rendering a desktop layout " +
      "shrunk down. Most of your search traffic is on a phone, so this affects nearly everyone who " +
      "finds you. It's a small technical change with an outsized effect.";
  } else if (noWayToContact) {
    headline = "We couldn't find a tap-to-call link or an enquiry form on your homepage.";
    body =
      "Neither appears in the HTML your server sends, though a form added by JavaScript after load " +
      "wouldn't show up here — worth confirming together. If they genuinely aren't there, someone " +
      "ready to book has to copy your number out by hand, and every extra step between wanting to " +
      "call you and calling you loses a share of people.";
  } else if (!onPage.hasTelLink) {
    headline = "We couldn't find a tap-to-call link on your homepage.";
    body =
      `There ${onPage.formCount === 1 ? "is an enquiry form" : `are ${onPage.formCount} enquiry forms`}, ` +
      "which covers people who'd rather type. A phone number that isn't a tap-to-call link means " +
      "anyone who'd rather just ring you has to memorise it or copy it across, and plenty don't " +
      "bother. Quick to add if it's missing.";
  } else {
    headline = "Someone on a phone can reach you without friction.";
    body =
      "The page renders properly on mobile, your number is tappable, and there's a form for people " +
      `who'd rather type. That's the contact side handled — what we can't see from out here is what ` +
      "happens after they call. That's a call topic.";
  }

  return {
    id: "mobile-and-calls",
    title: "Getting in touch from a phone",
    severity,
    metrics,
    headline,
    body,
  };
}

function reviews(places: PlacesSignals | null): AuditFinding {
  if (!places || places.rating === null) {
    return unmeasured("reviews", "Your review position");
  }

  const rating = places.rating;
  const count = places.reviewCount ?? 0;
  const rivals = places.competitors.filter((c) => c.rating !== null);
  const bestRivalCount = Math.max(0, ...rivals.map((c) => c.reviewCount ?? 0));

  const metrics = [
    { label: "Your rating", value: `${rating.toFixed(1)} from ${count} review${count === 1 ? "" : "s"}` },
    ...rivals.map((c) => ({
      label: `Nearby: ${c.name}`,
      value: `${c.rating!.toFixed(1)} from ${c.reviewCount ?? 0} reviews`,
    })),
  ];

  const wellBehind = rivals.length > 0 && count < bestRivalCount * 0.5;
  const lowRating = rating < 4.0;
  const severity: FindingSeverity =
    lowRating || wellBehind ? "critical" : rating < 4.5 ? "warning" : "ok";

  let headline: string;
  let body: string;

  if (wellBehind) {
    headline = `You have ${count} Google review${count === 1 ? "" : "s"}; the best-reviewed business near you has ${bestRivalCount}.`;
    body =
      `Your ${rating.toFixed(1)} rating is fine — it's the volume that's doing the damage. Review count feeds ` +
      "how high you sit in the map pack, and it's the first thing someone compares when two businesses " +
      "look similar. This gap tends to close faster than people expect once asking is automatic rather " +
      "than something you remember to do.";
  } else if (lowRating) {
    headline = `Your Google rating sits at ${rating.toFixed(1)} across ${count} review${count === 1 ? "" : "s"}.`;
    body =
      "Under 4.0 is the point where people start filtering you out of the shortlist before they ever " +
      "reach your website. The usual cause isn't unhappy customers so much as happy ones never being " +
      "asked, which lets a handful of bad days set the average.";
  } else if (severity === "warning") {
    headline = `Your Google rating is ${rating.toFixed(1)} from ${count} review${count === 1 ? "" : "s"}.`;
    body =
      "That's a respectable position. The gap between 4.4 and 4.8 is worth more than it looks in the " +
      "map pack, and it's usually a matter of asking every happy customer rather than chasing the " +
      "unhappy ones.";
  } else {
    headline = `Your Google rating is ${rating.toFixed(1)} from ${count} review${count === 1 ? "" : "s"}, which is a strong position.`;
    body =
      "Reviews aren't your bottleneck. Worth saying plainly, because it means the enquiries you're " +
      "missing are being lost somewhere else — and that narrows down where to look.";
  }

  return { id: "reviews", title: "Your review position", severity, metrics, headline, body };
}

function findability(onPage: OnPageSignals | null): AuditFinding {
  if (!onPage) return unmeasured("findability", "How Google reads your site");

  const titleTooLong = Boolean(onPage.title && onPage.title.length > TITLE_MAX_CHARS);
  const metrics = [
    {
      label: "Page title length",
      value: onPage.title
        ? `${onPage.title.length} characters${titleTooLong ? ` (truncated after ~${TITLE_MAX_CHARS})` : ""}`
        : "Missing",
    },
    { label: "Meta description", value: onPage.metaDescription ? "Present" : "Missing" },
    {
      label: "Local business structured data",
      value: onPage.hasLocalBusinessSchema ? "Present" : "Missing",
    },
    { label: "Secure (HTTPS)", value: onPage.usesHttps ? "Yes" : "No" },
  ];

  // Noun phrases, not negations — these get read as "Google is missing <list>".
  const problems = [
    !onPage.title && "a page title",
    !onPage.metaDescription && "a meta description",
    !onPage.hasLocalBusinessSchema && "local business structured data",
    !onPage.usesHttps && "a secure connection",
  ].filter((value): value is string => Boolean(value));

  const severity: FindingSeverity =
    !onPage.usesHttps || !onPage.title
      ? "critical"
      : problems.length > 0 || titleTooLong
        ? "warning"
        : "ok";

  let headline: string;
  let body: string;

  if (!onPage.usesHttps) {
    headline = "Your site isn't served over HTTPS.";
    body =
      "Browsers mark it as not secure in the address bar, and Google has treated it as a ranking " +
      "signal for years. Anyone who sees that warning before your first sentence has already " +
      "discounted you. It's usually a free fix at the hosting level.";
  } else if (problems.length > 0) {
    headline = `Google is missing ${listOut(problems)} when it reads your site.`;
    body =
      "These are the fields Google uses to decide what your page is about and how to display it in " +
      "results. Structured data in particular is what feeds the business panel — the hours, rating and " +
      "call button that appear beside your listing. None of it is visible on the page, which is why it " +
      "tends to go unnoticed for years.";
  } else if (titleTooLong) {
    headline = `Your page title runs to ${onPage.title!.length} characters and gets cut off in results.`;
    body =
      "Everything else Google needs is in place. Titles get truncated around " +
      `${TITLE_MAX_CHARS} characters on mobile, so the end of yours — often where the location sits — ` +
      "never makes it in front of anyone.";
  } else {
    headline = "Google has what it needs to read and display your site properly.";
    body =
      "Title, description, structured data and HTTPS are all in place. That's better than most local " +
      "business sites we look at, and it means search visibility isn't the leak.";
  }

  return { id: "findability", title: "How Google reads your site", severity, metrics, headline, body };
}

// ─── The three things a URL cannot tell us ───────────────────────────────────

/**
 * Deliberately not findings. Missed calls, reply speed and ad return are the
 * most expensive numbers in a local business and none of them are visible from
 * outside — so they are named as call topics rather than estimated. This is
 * also, not coincidentally, the honest reason to get on the call.
 */
const CALL_TOPICS: AuditNarrative["callTopics"] = [
  {
    title: "Calls you never knew about",
    body:
      "After hours, on the tools, already on another job. We can't see your call logs from out here, " +
      "but we can walk through them with you and put a number on it.",
  },
  {
    title: "How fast enquiries get answered",
    body:
      "Reply time is usually the single most valuable number in the business, and it's the one almost " +
      "nobody measures. We'll time yours together on the call.",
  },
  {
    title: "What your marketing spend is producing",
    body:
      "If there's money going out on ads, SEO or a marketing retainer, we'll trace what's coming back " +
      "from it. Sometimes that's a comfortable conversation and sometimes it isn't.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DEFAULT_UNMEASURED_REASON =
  "Rather than guess at it, we've left it for the call — it takes about two minutes to go " +
  "through together with your site open in front of us.";

const JS_SHELL_REASON =
  "Your site builds itself in the visitor's browser rather than sending finished HTML, so what " +
  "we can read from outside isn't what a visitor sees. Checking this properly means opening it " +
  "together, which we'll do on the call.";

function unmeasured(
  id: AuditFinding["id"],
  title: string,
  reason: string = DEFAULT_UNMEASURED_REASON,
): AuditFinding {
  return {
    id,
    title,
    severity: "unmeasured",
    metrics: [],
    headline: "We couldn't measure this one automatically.",
    body: reason,
  };
}

const SEVERITY_ORDER: Record<FindingSeverity, number> = {
  critical: 0,
  warning: 1,
  ok: 2,
  unmeasured: 3,
};

export function rankBySeverity(findings: AuditFinding[]): AuditFinding[] {
  return [...findings].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );
}

function summarize(findings: AuditFinding[]): string {
  const critical = findings.filter((f) => f.severity === "critical").length;
  const warning = findings.filter((f) => f.severity === "warning").length;
  const unmeasured = findings.filter((f) => f.severity === "unmeasured").length;
  const measured = findings.length - unmeasured;

  if (measured === 0) {
    return (
      "We weren't able to measure your current setup automatically, so we'll do the whole thing " +
      "live on the call instead. The free build goes ahead either way."
    );
  }

  const parts: string[] = [];
  if (critical > 0) {
    parts.push(
      `${critical} ${critical === 1 ? "thing that's" : "things that are"} likely costing you enquiries right now`,
    );
  }
  if (warning > 0) {
    parts.push(`${warning} worth tidying up`);
  }
  if (parts.length === 0) {
    return (
      `We checked ${measured} things on your current setup and they all came back clean, which is rare. ` +
      "That's useful in itself — it means whatever's holding enquiries back is happening after someone " +
      "lands on the page, and those are the three things we go through on the call."
    );
  }

  const tail =
    unmeasured > 0
      ? ` ${unmeasured === 1 ? "One check" : `${unmeasured} checks`} couldn't be run automatically, so we've left ${unmeasured === 1 ? "it" : "them"} for the call.`
      : "";

  return `We checked ${measured} things on your current setup and found ${listOut(parts)}.${tail}`;
}

function listOut(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function truncate(value: string, max: number): string {
  return value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`;
}
