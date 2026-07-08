import type { Vertical } from "@/lib/verticals/types";
import { medSpas } from "@/lib/verticals/med-spas";
import { dental } from "@/lib/verticals/dental";
import { medicalWeightLoss } from "@/lib/verticals/medical-weight-loss";
import { homeServices } from "@/lib/verticals/home-services";
import { chiropractic } from "@/lib/verticals/chiropractic";

// Registry of every data-driven vertical. Order here is the order they appear
// in the sitemap and in the sibling-vertical internal-link strips. The gym
// page (`/ai-for-gyms`) is bespoke and intentionally not part of this system.
export const VERTICALS: Vertical[] = [
  medSpas,
  dental,
  medicalWeightLoss,
  homeServices,
  chiropractic,
];

export const VERTICAL_SLUGS = VERTICALS.map((v) => v.slug);

// Landing pages live at `/ai-for-<slug>`. Because that whole path segment is
// dynamic (Next can't do a partial `ai-for-[vertical]` segment), the route
// param is the full prefixed path, e.g. "ai-for-med-spas".
export const VERTICAL_PATH_PREFIX = "ai-for-";

/** Route params for the `[vertical]` segment: ["ai-for-med-spas", …]. */
export const VERTICAL_PATH_PARAMS = VERTICALS.map(
  (v) => `${VERTICAL_PATH_PREFIX}${v.slug}`,
);

const BY_SLUG = new Map(VERTICALS.map((v) => [v.slug, v]));

export function getVertical(slug: string): Vertical | undefined {
  return BY_SLUG.get(slug);
}

/** Resolve a vertical from a route param like "ai-for-med-spas". */
export function getVerticalByPath(param: string): Vertical | undefined {
  if (!param.startsWith(VERTICAL_PATH_PREFIX)) return undefined;
  return getVertical(param.slice(VERTICAL_PATH_PREFIX.length));
}

/** Siblings for the internal-link strip (everything except the given slug). */
export function siblingVerticals(slug: string): Vertical[] {
  return VERTICALS.filter((v) => v.slug !== slug);
}

export type { Vertical } from "@/lib/verticals/types";
