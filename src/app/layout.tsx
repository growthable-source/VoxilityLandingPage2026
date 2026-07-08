import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { MetaPixel } from "@/components/MetaPixel";
import { GoogleTag } from "@/components/GoogleTag";
import "./globals.css";

const SITE_URL = "https://xovera.io";
const TITLE =
  "Xovera — Booked appointments, end-to-end. Revenue architecture for appointment-driven service businesses.";
const DESCRIPTION =
  "Meta ads, landing pages, and Xovera AI on one accountable system. We answer the call, qualify the lead, and book the appointment — usually before your front desk has read the email.";
const OG_IMAGE = `${SITE_URL}/og.png`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  applicationName: "Xovera",
  authors: [{ name: "Xovera" }],
  generator: "Next.js",
  keywords: [
    "Xovera",
    "Xovera AI",
    "Xovera Ads",
    "Xovera Go",
    "Meta ads management",
    "Google ads management",
    "AI receptionist",
    "agentic AI",
    "appointment booking AI",
    "GoHighLevel whitelabel",
    "HubSpot integration",
    "service business marketing",
    "med spa marketing",
    "dental marketing",
    "lead response automation",
    "missed call rescue",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Xovera — Booked appointments, end-to-end.",
    description:
      "Revenue architecture for appointment-driven service businesses. Meta ads + landing pages + Xovera AI on one accountable system.",
    url: SITE_URL,
    siteName: "Xovera",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Xovera — Booked appointments, end-to-end.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xovera — Booked appointments, end-to-end.",
    description:
      "Meta ads, landing pages, and Xovera AI on one accountable system.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F4" },
    { media: "(prefers-color-scheme: dark)", color: "#070708" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeInitScript = `(function(){try{var s=localStorage.getItem('vx-theme');var sys=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';var t=(s==='light'||s==='dark')?s:sys;var d=document.documentElement;d.classList.toggle('dark',t==='dark');d.classList.toggle('light',t==='light');d.style.colorScheme=t;}catch(e){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}})();`;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Xovera",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/xovera-color.svg`,
  description:
    "Xovera is a global revenue-architecture company for appointment-driven service businesses. We bundle Meta ads, landing pages, and the Xovera AI conversational + agentic platform into one accountable system from ad click to booked appointment.",
  brand: {
    "@type": "Brand",
    name: "Xovera",
  },
  sameAs: [
    "https://app.xovera.io",
    "https://ads.xovera.io",
    "https://go.xovera.io",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "hello@xovera.io",
    availableLanguage: ["English"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Xovera",
  url: SITE_URL,
  inLanguage: "en-US",
  publisher: {
    "@type": "Organization",
    name: "Xovera",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-US"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <MetaPixel />
        <GoogleTag />
        <Script
          src="https://app.xovera.io/widget.js"
          data-widget-id="cmoh5l1c8000004l4yp6k1m4y"
          data-public-key="widget_pub_7131eb1c5f35cd851b96c5f73b8f6db72cf2"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
