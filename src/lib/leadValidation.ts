// Lead-quality validation shared by the campaign forms and their API routes.
//
// The bar: block what is clearly junk — a phone number typed into the name
// box, a keyboard-lean of repeated digits, twelve-digit "mobiles" — without
// ever bouncing a legitimate business. A determined human typing a plausible
// fake will always get through; the point is that "0404040404" and
// "+61040404040404" don't. The API routes apply the same rules, so a bot
// POSTing past the browser hits the same wall.

/** Everything but digits and a leading +. */
function normalisePhone(raw: string): string {
  const stripped = raw.replace(/[^\d+]/g, "");
  return stripped.startsWith("+")
    ? `+${stripped.slice(1).replace(/\+/g, "")}`
    : stripped.replace(/\+/g, "");
}

/**
 * A plausible Australian phone number: 10 digits starting 02/03/04/07/08,
 * or the same with +61 in place of the leading zero. Obvious junk —
 * all-one-digit, a two-digit pattern repeated end to end, straight
 * ascending/descending runs — is rejected even when the shape is right.
 */
export function isValidAuPhone(raw: string): boolean {
  let digits = normalisePhone(raw);
  if (digits.startsWith("+")) {
    if (!digits.startsWith("+61")) return false;
    digits = `0${digits.slice(3)}`;
  }
  if (!/^\d{10}$/.test(digits)) return false;
  if (!/^0[23478]/.test(digits)) return false;

  if (/^(\d)\1{9}$/.test(digits)) return false;
  if (/^(\d{2})\1{4}$/.test(digits)) return false;
  if ("01234567890123456789".includes(digits)) return false;
  if ("98765432109876543210".includes(digits)) return false;

  return true;
}

/**
 * A person's actual name: passes the plausibility rules AND has at least two
 * words — a first name and a surname (an initial counts).
 */
export function isFullName(raw: string): boolean {
  if (!isPlausibleName(raw)) return false;
  const words = raw.trim().split(/\s+/);
  return words.length >= 2 && words.every((w) => /[a-zA-Z]/.test(w));
}

/**
 * Looks like a website, not an email or free text: no @ (rejects
 * "gunkbusters@outlook.com" typed into the website box), no spaces, and a
 * host with a real TLD once any scheme is stripped. Paths are fine —
 * "facebook.com/gunkbusters" passes.
 */
export function isWebsiteLike(raw: string): boolean {
  const s = raw.trim().toLowerCase();
  if (!s || s.includes("@") || /\s/.test(s)) return false;
  const host = s.replace(/^https?:\/\//, "").split(/[/?#]/)[0];
  return /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/.test(host);
}

/**
 * A plausible person or business name: at least two letters, not mostly
 * digits (a phone number pasted in the wrong box), and not a URL or email.
 */
export function isPlausibleName(raw: string): boolean {
  const s = raw.trim();
  if (s.length < 2 || s.length > 80) return false;

  const letters = (s.match(/[a-zA-Z]/g) ?? []).length;
  if (letters < 2) return false;

  const digits = (s.match(/\d/g) ?? []).length;
  if (digits > letters) return false;

  if (/https?:\/\/|www\.|@/.test(s)) return false;

  return true;
}
