import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  VERTICAL_PATH_PARAMS,
  getVerticalByPath,
  siblingVerticals,
} from "@/lib/verticals";
import { VerticalPage } from "@/components/verticals/VerticalPage";

const SITE_URL = "https://www.xovera.io";

// Landing pages live at `/ai-for-<slug>`. The whole segment is dynamic, so the
// param is the full prefixed path (e.g. "ai-for-med-spas"). Static routes like
// /ai-for-gyms, /privacy, /agencies take precedence over this segment.
export function generateStaticParams() {
  return VERTICAL_PATH_PARAMS.map((vertical) => ({ vertical }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string }>;
}): Promise<Metadata> {
  const { vertical } = await params;
  const v = getVerticalByPath(vertical);
  if (!v) return {};
  const url = `${SITE_URL}/ai-for-${v.slug}`;
  return {
    title: v.seo.title,
    description: v.seo.description,
    keywords: v.seo.keywords,
    alternates: { canonical: url },
    openGraph: {
    images: ["/opengraph-image"],
      title: v.seo.title,
      description: v.seo.description,
      url,
      siteName: "Xovera",
      type: "website",
      locale: "en_US",
    },
    twitter: {
    images: ["/twitter-image"],
      card: "summary_large_image",
      title: v.seo.title,
      description: v.seo.description,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ vertical: string }>;
}) {
  const { vertical } = await params;
  const v = getVerticalByPath(vertical);
  if (!v) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: `AI for ${v.name}`,
        item: `${SITE_URL}/ai-for-${v.slug}`,
      },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "AI receptionist and appointment booking",
    name: v.seo.title,
    description: v.seo.description,
    url: `${SITE_URL}/ai-for-${v.slug}`,
    areaServed: "US",
    audience: { "@type": "Audience", audienceType: v.name },
    provider: {
      "@type": "Organization",
      name: "Xovera",
      url: SITE_URL,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <VerticalPage vertical={v} siblings={siblingVerticals(v.slug)} />
    </>
  );
}
