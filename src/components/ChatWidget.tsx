import Script from "next/script";

// LeadConnector (GoHighLevel) chat widget, rendered site-wide from the root
// layout. Baked-in default widget id so the widget can't silently vanish if the
// Vercel env var is missing; the id is public in page source anyway.
// Env var still wins when set.
const WIDGET_ID =
  process.env.NEXT_PUBLIC_LC_CHAT_WIDGET_ID || "6a7532e0f39c9f20f8033a5b";

export function ChatWidget() {
  if (!WIDGET_ID) return null;
  return (
    <Script
      src="https://widgets.leadconnectorhq.com/loader.js"
      data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
      data-widget-id={WIDGET_ID}
      strategy="afterInteractive"
    />
  );
}
