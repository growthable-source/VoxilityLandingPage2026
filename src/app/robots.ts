import type { MetadataRoute } from "next";

const BASE_URL = "https://www.xovera.io";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /audit/* holds a lead's own teardown behind an unguessable token, and
        // /free-website is a paid-traffic page that must not compete with the
        // real site in search. Both also carry a noindex tag.
        disallow: ["/api/", "/audit/", "/free-website"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
