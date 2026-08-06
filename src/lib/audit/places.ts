// Google Places (New) — their rating and review count, and the same for three
// nearby businesses in the same category.
//
// The hard problem here is not fetching, it is *identity*. "Thompson Plumbing"
// matches a dozen businesses across Australia, and reading someone another
// firm's review count on a sales call is the fastest way to lose it. So a match
// is only accepted when it is corroborated: the listing's website is on the
// same domain they gave us, or — failing that — the names agree almost exactly.
// Anything less is reported as unmatched and covered live on the call.

import type { PlacesCompetitor, PlacesSignals } from "./types";

const SEARCH_TEXT = "https://places.googleapis.com/v1/places:searchText";
const SEARCH_NEARBY = "https://places.googleapis.com/v1/places:searchNearby";
const TIMEOUT_MS = 10_000;
const COMPETITOR_RADIUS_M = 10_000;

interface PlaceResult {
  id?: string;
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  websiteUri?: string;
  primaryType?: string;
  location?: { latitude?: number; longitude?: number };
}

export class PlacesError extends Error {}

export async function fetchPlaces(
  businessName: string,
  siteUrl: string | null,
): Promise<PlacesSignals> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) throw new PlacesError("GOOGLE_PLACES_API_KEY is not set.");

  const candidates = await searchText(key, businessName);
  const match = pickCorroboratedMatch(candidates, businessName, siteUrl);

  if (!match) {
    throw new PlacesError(
      `No Google Business Profile could be confidently matched to "${businessName}".`,
    );
  }

  return {
    name: match.displayName?.text ?? businessName,
    rating: match.rating ?? null,
    reviewCount: match.userRatingCount ?? null,
    mapsUrl: match.googleMapsUri ?? null,
    competitors: await fetchCompetitors(key, match).catch(() => []),
  };
}

async function searchText(
  key: string,
  businessName: string,
): Promise<PlaceResult[]> {
  const data = await postPlaces<{ places?: PlaceResult[] }>(
    SEARCH_TEXT,
    key,
    "places.id,places.displayName,places.rating,places.userRatingCount," +
      "places.googleMapsUri,places.websiteUri,places.primaryType,places.location",
    { textQuery: businessName, regionCode: "AU", maxResultCount: 5 },
  );
  return data.places ?? [];
}

async function fetchCompetitors(
  key: string,
  match: PlaceResult,
): Promise<PlacesCompetitor[]> {
  const lat = match.location?.latitude;
  const lng = match.location?.longitude;
  if (typeof lat !== "number" || typeof lng !== "number" || !match.primaryType) {
    return [];
  }

  const data = await postPlaces<{ places?: PlaceResult[] }>(
    SEARCH_NEARBY,
    key,
    "places.id,places.displayName,places.rating,places.userRatingCount",
    {
      includedTypes: [match.primaryType],
      maxResultCount: 6,
      rankPreference: "POPULARITY",
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: COMPETITOR_RADIUS_M,
        },
      },
    },
  );

  return (data.places ?? [])
    .filter((place) => place.id !== match.id)
    .filter((place) => typeof place.rating === "number")
    .slice(0, 3)
    .map((place) => ({
      name: place.displayName?.text ?? "Nearby business",
      rating: place.rating ?? null,
      reviewCount: place.userRatingCount ?? null,
    }));
}

async function postPlaces<T>(
  endpoint: string,
  key: string,
  fieldMask: string,
  body: unknown,
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": fieldMask,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new PlacesError("The Google Places API could not be reached.");
  }

  if (!res.ok) {
    throw new PlacesError(`The Google Places API returned ${res.status}.`);
  }
  return (await res.json()) as T;
}

/**
 * Accept a candidate only with corroboration. Domain agreement is strong
 * evidence; an near-exact name match is weaker but usable when the business has
 * no website at all (which is exactly the lead we most want to reach).
 */
function pickCorroboratedMatch(
  candidates: PlaceResult[],
  businessName: string,
  siteUrl: string | null,
): PlaceResult | null {
  const ourDomain = siteUrl ? registrableDomain(siteUrl) : null;

  if (ourDomain) {
    const byDomain = candidates.find(
      (place) =>
        place.websiteUri && registrableDomain(place.websiteUri) === ourDomain,
    );
    if (byDomain) return byDomain;
  }

  const wanted = normalizeName(businessName);
  return (
    candidates.find((place) => {
      const name = place.displayName?.text;
      return Boolean(name) && normalizeName(name!) === wanted;
    }) ?? null
  );
}

/** "www.thompsonplumbing.com.au" → "thompsonplumbing.com.au" */
function registrableDomain(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Strip case, punctuation and the suffixes owners use inconsistently. */
function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(pty\.? ?ltd\.?|ltd\.?|inc\.?|the)\b/g, "")
    .replace(/[^a-z0-9]/g, "");
}
