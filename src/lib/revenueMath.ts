// Generalized missed-revenue model powering every vertical calculator
// (`/ai-for-<slug>/calculator`). Pure and dependency-free so the API route can
// recompute results server-side from raw inputs — client numbers are
// display-only. Parameterized by each vertical's `CalcConfig` (labels, limits,
// close/loss rates), so med spas, dental, weight-loss, home services and
// chiropractic all share one honest model.
//
// The gym calculator keeps its own `gymMath.ts` — this module is for the new
// data-driven verticals only.

import type { CalcConfig } from "@/lib/verticals/types";

export type ResponseSpeed = "under5" | "hour" | "sameday" | "nextday";
export type AfterHours = "always" | "sometimes" | "voicemail";

export interface CalcInputs {
  monthlyInquiries: number;
  avgValue: number; // $ per booked period (first visit / month / job)
  repeatFactor: number; // repeat periods a won customer brings
  responseSpeed: ResponseSpeed;
  afterHours: AfterHours;
}

export interface CalcResults {
  lostCustomersPerMonth: number;
  missedMonthlyRevenue: number;
  annualRevenue: number;
  customerValue: number; // lifetime-ish value of one won customer
}

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

/** Industry-average defaults a vertical can reuse rather than re-specify. */
export const DEFAULT_MISSED_CALL_RATE: Record<AfterHours, number> = {
  always: 0.06,
  sometimes: 0.23,
  voicemail: 0.37,
};

export const DEFAULT_SPEED_LOSS: Record<ResponseSpeed, number> = {
  under5: 0.05,
  hour: 0.2,
  sameday: 0.4,
  nextday: 0.6,
};

function clampNumber(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

export function sanitizeInputs(
  raw: {
    monthlyInquiries?: unknown;
    avgValue?: unknown;
    repeatFactor?: unknown;
    responseSpeed?: unknown;
    afterHours?: unknown;
  },
  calc: CalcConfig,
): CalcInputs {
  const speed = raw.responseSpeed as ResponseSpeed;
  const hours = raw.afterHours as AfterHours;
  return {
    monthlyInquiries: clampNumber(
      Number(raw.monthlyInquiries),
      calc.inputs.monthlyInquiries.min,
      calc.inputs.monthlyInquiries.max,
    ),
    avgValue: clampNumber(
      Number(raw.avgValue),
      calc.inputs.avgValue.min,
      calc.inputs.avgValue.max,
    ),
    repeatFactor: clampNumber(
      Number(raw.repeatFactor),
      calc.inputs.repeatFactor.min,
      calc.inputs.repeatFactor.max,
    ),
    responseSpeed: speed in calc.speedLoss ? speed : "sameday",
    afterHours: hours in calc.missedCallRate ? hours : "voicemail",
  };
}

export function calculateMissedRevenue(
  inputs: CalcInputs,
  calc: CalcConfig,
): CalcResults {
  const formShare = Math.max(0, 1 - calc.callShare);
  const missedCallLoss =
    calc.callShare * calc.missedCallRate[inputs.afterHours] * calc.lostForGood;
  const slowReplyLoss = formShare * calc.speedLoss[inputs.responseSpeed];

  const lostLeadsPerMonth =
    inputs.monthlyInquiries * (missedCallLoss + slowReplyLoss);
  const lostCustomersPerMonth = lostLeadsPerMonth * calc.closeRate;
  const missedMonthlyRevenue = lostCustomersPerMonth * inputs.avgValue;

  // Revenue realized within the next 12 months: one cohort of lost customers
  // "arrives" each month and brings up to `repeatFactor` more periods of value,
  // but only those falling inside the 12-month window are counted. Same cohort
  // cap the gym model uses, so the number stays conservative.
  let periods = 0;
  for (let i = 0; i < 12; i++) {
    periods += Math.min(inputs.repeatFactor, 12 - i);
  }
  const annualRevenue = lostCustomersPerMonth * inputs.avgValue * periods;

  return {
    lostCustomersPerMonth,
    missedMonthlyRevenue,
    annualRevenue,
    customerValue: inputs.avgValue * inputs.repeatFactor,
  };
}

export function roundResults(r: CalcResults): CalcResults {
  return {
    lostCustomersPerMonth: Math.round(r.lostCustomersPerMonth * 10) / 10,
    missedMonthlyRevenue: Math.round(r.missedMonthlyRevenue / 50) * 50,
    annualRevenue: Math.round(r.annualRevenue / 500) * 500,
    customerValue: Math.round(r.customerValue / 50) * 50,
  };
}

export function formatUSD(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
