// On-page signals, parsed from the HTML we fetched.
//
// Everything here is a fact about the markup — present or absent, counted or
// measured. Nothing is scored or interpreted at this layer; that happens in
// findings.ts against explicit thresholds.

import * as cheerio from "cheerio";
import type { FetchedSite } from "./fetchSite";
import type { OnPageSignals } from "./types";

/** Words that signal "here is how you get in touch", for the CTA heuristic. */
const CTA_WORDS =
  /\b(book|booking|call|contact|enquir|inquir|quote|get started|request|appointment|schedule|free consult)/i;

/** How much body text counts as "near the top" for the CTA heuristic. */
const ABOVE_FOLD_CHARS = 3000;

export function extractOnPageSignals(site: FetchedSite): OnPageSignals {
  const $ = cheerio.load(site.html);

  // Scripts and styles are not reading material — strip before sampling text.
  $("script, style, noscript").remove();

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const h1s = $("h1");
  const images = $("img");

  return {
    finalUrl: site.finalUrl,
    statusCode: site.statusCode,
    usesHttps: site.finalUrl.startsWith("https://"),
    title: textOrNull($("title").first().text()),
    metaDescription: attrOrNull($('meta[name="description"]').attr("content")),
    h1: textOrNull(h1s.first().text()),
    h1Count: h1s.length,
    hasViewportMeta: $('meta[name="viewport"]').length > 0,
    hasTelLink: $('a[href^="tel:"]').length > 0,
    formCount: $("form").length,
    hasLocalBusinessSchema: hasLocalBusinessSchema($),
    imageCount: images.length,
    imagesMissingAlt: images.filter((_, el) => !$(el).attr("alt")?.trim()).length,
    htmlBytes: site.bytes,
    bodyTextLength: bodyText.length,
    ctaNearTop: CTA_WORDS.test(bodyText.slice(0, ABOVE_FOLD_CHARS)),
  };
}

function textOrNull(value: string | undefined): string | null {
  const trimmed = value?.replace(/\s+/g, " ").trim();
  return trimmed ? trimmed : null;
}

function attrOrNull(value: string | undefined): string | null {
  return textOrNull(value);
}

/**
 * Google reads LocalBusiness (and its subtypes — Dentist, Plumber, HealthClub)
 * to build the knowledge panel. Its absence is one of the most common and most
 * cheaply fixed findings on a local business site.
 */
function hasLocalBusinessSchema($: cheerio.CheerioAPI): boolean {
  let found = false;

  $('script[type="application/ld+json"]').each((_, el) => {
    if (found) return;
    const raw = $(el).contents().text();
    if (!raw.trim()) return;
    try {
      found = mentionsLocalBusiness(JSON.parse(raw));
    } catch {
      // Malformed JSON-LD is common and is itself worth nothing here — a broken
      // block gives Google nothing, same as no block at all.
    }
  });

  // Microdata is the older but still widely used way to say the same thing.
  if (!found && $('[itemtype*="LocalBusiness"]').length > 0) found = true;

  return found;
}

const LOCAL_BUSINESS_TYPES =
  /^(LocalBusiness|Dentist|Physician|MedicalBusiness|MedicalClinic|HealthAndBeautyBusiness|BeautySalon|DaySpa|HairSalon|HealthClub|SportsActivityLocation|Plumber|Electrician|HomeAndConstructionBusiness|GeneralContractor|RoofingContractor|HVACBusiness|Locksmith|MovingCompany|AutoRepair|ProfessionalService|Store|FoodEstablishment|Restaurant|VeterinaryCare|LegalService|Attorney|RealEstateAgent|TravelAgency|ChildCare|Optician)$/;

/** Walk the JSON-LD graph looking for any LocalBusiness-ish @type. */
function mentionsLocalBusiness(node: unknown): boolean {
  if (Array.isArray(node)) return node.some(mentionsLocalBusiness);
  if (!node || typeof node !== "object") return false;

  const record = node as Record<string, unknown>;
  const type = record["@type"];
  const types = Array.isArray(type) ? type : [type];
  if (types.some((t) => typeof t === "string" && LOCAL_BUSINESS_TYPES.test(t))) {
    return true;
  }

  return Object.values(record).some(mentionsLocalBusiness);
}
