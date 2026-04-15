/**
 * Pricing Engine — Decorator Pattern
 * Decoupled from UI; computes total from base price + selected addons.
 */
import type { Addon } from '../types';

export interface PricingResult {
  basePrice: number;
  addonsTotal: number;
  total: number;
  breakdown: { label: string; amount: number }[];
}

/**
 * Calculates the total booking price by decorating the base price
 * with each selected addon's cost.
 */
export function calculateTotal(basePrice: number, selectedAddons: Addon[]): PricingResult {
  const breakdown = selectedAddons.map((a) => ({ label: a.name, amount: a.price }));
  const addonsTotal = breakdown.reduce((sum, b) => sum + b.amount, 0);
  return {
    basePrice,
    addonsTotal,
    total: basePrice + addonsTotal,
    breakdown,
  };
}
