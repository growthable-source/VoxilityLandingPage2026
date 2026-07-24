import Script from "next/script";

// Microsoft Clarity (session replay + heatmaps), rendered site-wide from the
// root layout. Baked-in default project id so analytics can't silently vanish
// if the Vercel env var is missing; the id is public in page source anyway.
// Env var still wins when set.
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "xrfpe83ckl";

export function Clarity() {
  if (!CLARITY_ID) return null;
  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
    </Script>
  );
}
