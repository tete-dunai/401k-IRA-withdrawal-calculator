

// src/lib/calc.ts
// NRI-only computation logic (India tax = 0 for NRI/RNOR as per current rules).
// Keeps pure functions so React UI can call these directly or via a Web Worker later.

import {
  US_BRACKETS_2025_SINGLE,
  EARLY_WITHDRAWAL_PENALTY_RATE,
  round2,
  INDIA_SLABS_2025,
  FX,
} from "./bracket";

export type NriResult = {
  usaTaxUSD: number;
  indiaTaxUSD: number; // always 0 for NRI in current version
  penaltyUSD: number;
  totalDeductedUSD: number;
  receivableUSD: number;
};

// --- Helpers ---
function toNonNegativeNumber(v: unknown): number {
  const n = Number(v);
  if (!Number.isFinite(n) || Number.isNaN(n)) return 0;
  return Math.max(0, n);
}

// Progressive India tax (new regime slabs) on an INR amount.
// Slabs are tuples of [upperLimitINR, rate]. Anything above the last limit is taxed at 30%.
export function computeIndiaTaxINR(amountINR: unknown): number {
  const A = toNonNegativeNumber(amountINR);
  if (A === 0) return 0;

  let tax = 0;
  let prev = 0;

  for (const [limit, rate] of INDIA_SLABS_2025) {
    if (A > limit) {
      tax += (limit - prev) * rate;
      prev = limit;
    } else {
      tax += (A - prev) * rate;
      return round2(tax);
    }
  }

  // Top slab 30%
  tax += (A - prev) * 0.30;
  return round2(tax);
}

// Progressive US federal tax using the 2025 Single filer brackets.
// Brackets are tuples of [upperLimitUSD, rate]. Anything above the last limit
// is taxed at 37%.
export function computeUsTax(amountUSD: unknown): number {
  const A = toNonNegativeNumber(amountUSD);
  if (A === 0) return 0;

  let tax = 0;
  let prev = 0;

  for (const [limit, rate] of US_BRACKETS_2025_SINGLE) {
    if (A > limit) {
      tax += (limit - prev) * rate;
      prev = limit;
    } else {
      tax += (A - prev) * rate;
      return round2(tax);
    }
  }

  // Top bracket 37%
  tax += (A - prev) * 0.37;
  return round2(tax);
}

export function computePenalty(amountUSD: unknown, early: boolean): number {
  const A = toNonNegativeNumber(amountUSD);
  if (!early || A === 0) return 0;
  return round2(A * EARLY_WITHDRAWAL_PENALTY_RATE);
}

// Main NRI card computation: India tax = 0, Total = US tax + Penalty
export function computeNri(amountUSD: unknown, early: boolean): NriResult {
  const A = toNonNegativeNumber(amountUSD);
  const usaTaxUSD = computeUsTax(A);
  const penaltyUSD = computePenalty(A, early);
  const indiaTaxUSD = 0; // fixed at 0 per current business rule
  const totalDeductedUSD = round2(usaTaxUSD + indiaTaxUSD + penaltyUSD);
  const receivableUSD = round2(A - totalDeductedUSD);

  return { usaTaxUSD, indiaTaxUSD, penaltyUSD, totalDeductedUSD, receivableUSD };
}

// ROR computation with DTAA: compare India vs US tax in USD, pay only the excess India tax.
export function computeRor(amountUSD: unknown, early: boolean): NriResult {
  const A = toNonNegativeNumber(amountUSD);
  const usaTaxUSD = computeUsTax(A);
  const penaltyUSD = computePenalty(A, early);

  // India tax fully computed on INR base, then converted to USD for comparison
  const amtINR = A * FX;
  const indiaFullINR = computeIndiaTaxINR(amtINR);
  const indiaFullUSD = round2(indiaFullINR / FX);

  // DTAA: India payable only if India tax > US tax (compare in USD)
  const indiaPayUSD = Math.max(0, indiaFullUSD - usaTaxUSD);

  const totalDeductedUSD = round2(usaTaxUSD + indiaPayUSD + penaltyUSD);
  const receivableUSD = round2(A - totalDeductedUSD);

  return {
    usaTaxUSD,
    indiaTaxUSD: indiaPayUSD, // store in USD; UI can format to INR when displaying India Tax
    penaltyUSD,
    totalDeductedUSD,
    receivableUSD,
  };
}