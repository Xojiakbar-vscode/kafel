// ============================================================
// Currency Formatting Utilities
// ============================================================

/**
 * Format a number as UZS currency
 * Example: 1500000 → "1 500 000 so'm"
 */
export function formatCurrency(amount: number, showSymbol = true): string {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return showSymbol ? `${formatted} so'm` : formatted;
}

/**
 * Format currency for compact display
 * Example: 1500000 → "1 500 000"
 */
export function formatAmount(amount: number): string {
  return Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Parse a currency string back to number
 * Example: "1 500 000" → 1500000
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/\s/g, '').replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

/**
 * Clamp a number to a minimum of 0
 */
export function clampPositive(value: number): number {
  return Math.max(0, value);
}
