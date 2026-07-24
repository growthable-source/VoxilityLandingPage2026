import Script from "next/script";

// Google tag (gtag.js) for GA4 and/or Google Ads, rendered site-wide from the
// root layout. Set either id in the environment; both are optional and the
// component is a no-op when neither is present. Funnel events are fired from
// src/lib/tracking.ts via window.gtag. Import the GA4 events into Google Ads as
// conversions (GA4 ↔ Ads link) to optimize Search campaigns.
const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
// Voxility Google Ads account (570-724-0444). Baked-in default so conversion
// tracking can't silently vanish if the Vercel env var is missing; the id is
// public in page source anyway. Env var still wins when set.
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-11078657396";

export function GoogleTag() {
  const primary = GA4_ID || ADS_ID;
  if (!primary) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primary}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());` +
          (GA4_ID ? `gtag('config','${GA4_ID}');` : "") +
          (ADS_ID ? `gtag('config','${ADS_ID}');` : "")}
      </Script>
    </>
  );
}
