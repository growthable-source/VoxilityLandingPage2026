// Missed-revenue model for the gym calculator (/gym-calculator).
// Pure and dependency-free so the API route can recompute results
// server-side from raw inputs — client-side numbers are display-only.

export type ResponseSpeed = "under5" | "hour" | "sameday" | "nextday";
export type AfterHours = "always" | "sometimes" | "voicemail";

export interface GymCalcInputs {
  monthlyInquiries: number;
  membershipPrice: number; // $/month
  memberStayMonths: number;
  responseSpeed: ResponseSpeed;
  afterHours: AfterHours;
}

export interface GymCalcResults {
  lostLeadsPerMonth: number;
  lostMembersPerMonth: number;
  missedMonthlyRevenue: number;
  twelveMonthRevenue: number;
}

// Industry-average assumptions. The 23% missed-call figure matches the stat
// already published in the home-page Leak section; the rest come from
// lead-response and missed-call studies. All results are framed to the user
// as estimates.
const CALL_SHARE = 0.6;
const FORM_SHARE = 0.4;
const LOST_FOR_GOOD = 0.75; // missed callers who never reconnect
const CLOSE_RATE = 0.35; // inquiry → joined member

const MISSED_CALL_RATE: Record<AfterHours, number> = {
  always: 0.06,
  sometimes: 0.23,
  voicemail: 0.37,
};

const SPEED_LOSS: Record<ResponseSpeed, number> = {
  under5: 0.05,
  hour: 0.2,
  sameday: 0.4,
  nextday: 0.6,
};

export const RESPONSE_SPEED_LABELS: Record<ResponseSpeed, string> = {
  under5: "Under 5 minutes",
  hour: "Within the hour",
  sameday: "Same day",
  nextday: "Next day or later",
};

export const AFTER_HOURS_LABELS: Record<AfterHours, string> = {
  always: "Someone always answers",
  sometimes: "Sometimes answered",
  voicemail: "Goes to voicemail",
};

export const INPUT_LIMITS = {
  monthlyInquiries: { min: 10, max: 500, step: 5, default: 80 },
  membershipPrice: { min: 40, max: 400, step: 5, default: 150 },
  memberStayMonths: { min: 3, max: 36, step: 1, default: 12 },
} as const;

function clampNumber(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export function sanitizeInputs(raw: {
  monthlyInquiries?: unknown;
  membershipPrice?: unknown;
  memberStayMonths?: unknown;
  responseSpeed?: unknown;
  afterHours?: unknown;
}): GymCalcInputs {
  const speed = raw.responseSpeed as ResponseSpeed;
  const hours = raw.afterHours as AfterHours;
  return {
    monthlyInquiries: clampNumber(
      Number(raw.monthlyInquiries),
      INPUT_LIMITS.monthlyInquiries.min,
      INPUT_LIMITS.monthlyInquiries.max,
    ),
    membershipPrice: clampNumber(
      Number(raw.membershipPrice),
      INPUT_LIMITS.membershipPrice.min,
      INPUT_LIMITS.membershipPrice.max,
    ),
    memberStayMonths: clampNumber(
      Number(raw.memberStayMonths),
      INPUT_LIMITS.memberStayMonths.min,
      INPUT_LIMITS.memberStayMonths.max,
    ),
    responseSpeed: speed in SPEED_LOSS ? speed : "sameday",
    afterHours: hours in MISSED_CALL_RATE ? hours : "voicemail",
  };
}

export function calculateMissedRevenue(inputs: GymCalcInputs): GymCalcResults {
  const missedCallLoss =
    CALL_SHARE * MISSED_CALL_RATE[inputs.afterHours] * LOST_FOR_GOOD;
  const slowReplyLoss = FORM_SHARE * SPEED_LOSS[inputs.responseSpeed];

  const lostLeadsPerMonth =
    inputs.monthlyInquiries * (missedCallLoss + slowReplyLoss);
  const lostMembersPerMonth = lostLeadsPerMonth * CLOSE_RATE;
  const missedMonthlyRevenue = lostMembersPerMonth * inputs.membershipPrice;

  // Revenue those members would have paid within the next 12 months:
  // one cohort joins each month and pays until min(stay, months remaining).
  let memberMonths = 0;
  for (let i = 0; i < 12; i++) {
    memberMonths += Math.min(inputs.memberStayMonths, 12 - i);
  }
  const twelveMonthRevenue =
    lostMembersPerMonth * inputs.membershipPrice * memberMonths;

  return {
    lostLeadsPerMonth,
    lostMembersPerMonth,
    missedMonthlyRevenue,
    twelveMonthRevenue,
  };
}

export function roundResults(r: GymCalcResults): GymCalcResults {
  return {
    lostLeadsPerMonth: Math.round(r.lostLeadsPerMonth * 10) / 10,
    lostMembersPerMonth: Math.round(r.lostMembersPerMonth * 10) / 10,
    missedMonthlyRevenue: Math.round(r.missedMonthlyRevenue / 50) * 50,
    twelveMonthRevenue: Math.round(r.twelveMonthRevenue / 500) * 500,
  };
}

export function formatUSD(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
