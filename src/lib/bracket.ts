

// src/lib/bracket.ts
// Central place for tax-related constants and bracket tables used by the calculator.
// Keep this file free of any calculation logic so it can be reused in workers or other modules.

// USD → INR conversion rate used for display/calculation parity when needed.
export const FX = 87; // adjust later if you want a live rate

// Early withdrawal penalty (10%) applied when withdrawing before age 59½.
export const EARLY_WITHDRAWAL_PENALTY_RATE = 0.10;

// Generic tuple type for progressive tax brackets: [upperLimitInclusive, rate]
export type Bracket = readonly [limit: number, rate: number];

// --- US Federal Income Tax Brackets (2025, Single Filer) ---
// Each tuple is [upper limit in USD, marginal rate]. Amounts above the last
// limit are taxed at the top rate (0.37) by the consumer code.
export const US_BRACKETS_2025_SINGLE: Bracket[] = [
  [11_925, 0.10],
  [48_475, 0.12],
  [103_350, 0.22],
  [197_300, 0.24],
  [250_525, 0.32],
  [626_350, 0.35],
  // > 626,350 → 37% (handled by compute code)
];

// --- India New Regime Slabs (kept for future ROR support) ---
// Each tuple is [upper limit in INR, rate]. Amounts above the last limit
// are taxed at 30% by the consumer code. Currently NRI/RNOR India tax is 0.
export const INDIA_SLABS_2025: Bracket[] = [
  [300_000, 0.00],
  [700_000, 0.05],
  [1_000_000, 0.10],
  [1_200_000, 0.15],
  [1_500_000, 0.20],
  // > 1,500,000 → 30% (handled by compute code)
];

// Small helper for consistent rounding across the app when needed by constants users.
export const round2 = (n: number) => Math.round(n * 100) / 100;