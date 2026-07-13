import type { MetadataRoute } from "next";
import { VERTICAL_SLUGS } from "@/lib/verticals";

const BASE_URL = "https://www.xovera.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // One landing page + one calculator funnel per data-driven vertical.
  const verticalRoutes: MetadataRoute.Sitemap = VERTICAL_SLUGS.flatMap((slug) => [
    {
      url: `${BASE_URL}/ai-for-${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ai-for-${slug}/calculator`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ]);

  return [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/agencies`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ai-for-gyms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/gym-calculator`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...verticalRoutes,
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/acceptable-use`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
