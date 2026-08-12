import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { MetaPixel } from "@/components/MetaPixel";
import { GoogleTag } from "@/components/GoogleTag";
import { Clarity } from "@/components/Clarity";
import { ChatWidget } from "@/components/ChatWidget";
import "./globals.css";

const SITE_URL = "https://www.xovera.io";
const TITLE = "Xovera — AI Receptionist & Ads That Book Appointments";
const DESCRIPTION =
  "Meta ads, landing pages, and an AI receptionist on one accountable system. Xovera answers every call, qualifies the lead, and books the appointment 24/7.";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Xovera — Booked appointments, end-to-end.",
    description:
      "Meta ads, landing pages, and Xovera AI on one accountable system.",
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

// Google Tag Manager, site-wide. The container manages its own tags; the
// dataLayer pushes in src/lib/tracking.ts are what it consumes.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-MZJFTGNK";

const gtmScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`;

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
        <script dangerouslySetInnerHTML={{ __html: gtmScript }} />
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
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          />
        </noscript>
        {children}
        <MetaPixel />
        <GoogleTag />
        <Clarity />
        <ChatWidget />
      </body>
    </html>
  );
}
