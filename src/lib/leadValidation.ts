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
