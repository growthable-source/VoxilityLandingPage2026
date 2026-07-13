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
      title: v.seo.title,
      description: v.seo.description,
      url,
      siteName: "Xovera",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: `${SITE_URL}/og.png`,
          width: 1200,
          height: 630,
          alt: v.seo.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: v.seo.title,
      description: v.seo.description,
      images: [`${SITE_URL}/og.png`],
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
      <VerticalPage vertical={v} siblings={siblingVerticals(v.slug)} />
    </>
  );
}
