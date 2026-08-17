// The GHL booking widget prefills its form from query params (first_name,
// last_name, email, phone), so nobody retypes details they gave us two
// minutes ago. Used by the audit claim and the no-website fast path.

export function buildBookingUrl(lead: {
  name: string;
  email?: string;
  phone?: string;
}): string | null {
  const base = process.env.NEXT_PUBLIC_BOOKING_URL;
  if (!base) return null;
  try {
    const url = new URL(base);
    // A misconfigured value (e.g. the whole "NAME=value" line pasted into the
    // env var) must degrade to no redirect, never to sending a fresh lead to
    // a 404 — the lead is still recorded and we follow up by phone.
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      console.error(
        "[booking] NEXT_PUBLIC_BOOKING_URL is not an http(s) URL — skipping the redirect.",
      );
      return null;
    }
    const nameParts = lead.name.trim().split(/\s+/);
    const first = nameParts[0] ?? "";
    const last = nameParts.slice(1).join(" ");
    if (first) url.searchParams.set("first_name", first);
    if (last) url.searchParams.set("last_name", last);
    if (lead.email) url.searchParams.set("email", lead.email);
    if (lead.phone) url.searchParams.set("phone", lead.phone);
    return url.toString();
  } catch {
    console.error(
      "[booking] NEXT_PUBLIC_BOOKING_URL did not parse as a URL — skipping the redirect.",
    );
    return null;
  }
}
