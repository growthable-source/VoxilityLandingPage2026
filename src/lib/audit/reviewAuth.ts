import { timingSafeEqual } from "node:crypto";

/**
 * Whether a supplied `?key=` grants review access.
 *
 * Fails closed: with AUDIT_REVIEW_SECRET unset nobody gets the approve bar,
 * because the alternative — an unset secret meaning "no check" — would put a
 * send button on every audit page on the internet.
 */
export function isReviewer(key: string | undefined): boolean {
  const secret = process.env.AUDIT_REVIEW_SECRET;
  if (!secret || !key) return false;

  const a = Buffer.from(key);
  const b = Buffer.from(secret);
  // timingSafeEqual throws on a length mismatch, which is itself a leak of one
  // bit; compare lengths first and keep the constant-time path for equal ones.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
