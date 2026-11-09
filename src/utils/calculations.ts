// ============================================================
// Business Logic Calculations
// ============================================================

import type { ReceiptItem, Payment, PaymentType, ReceiptStatus } from '@/types';
import { clampPositive } from './currency';

/**
 * Calculate a single item's total
 */
export function calculateItemTotal(
  quantity: number,
  unitPrice: number,
  discount: number
): number {
  const gross = clampPositive(quantity) * clampPositive(unitPrice);
  return clampPositive(gross - clampPositive(discount));
}

/**
 * Calculate subtotal (sum of all item gross values before item discounts)
 */
export function calculateSubtotal(items: ReceiptItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

/**
 * Calculate total item-level discount
 */
export function calculateItemsDiscount(items: ReceiptItem[]): number {
  return items.reduce((sum, item) => sum + item.discount, 0);
}

/**
 * Calculate order total after all discounts
 */
export function calculateTotal(
  subtotal: number,
  orderDiscount: number
): number {
  return clampPositive(subtotal - clampPositive(orderDiscount));
}

/**
 * Calculate debt
 */
export function calculateDebt(total: number, paidAmount: number): number {
  return clampPositive(total - clampPositive(paidAmount));
}

/**
 * Derive receipt status from payment
 */
export function deriveReceiptStatus(
  total: number,
  paidAmount: number,
  paymentType: PaymentType
): ReceiptStatus {
  if (paymentType === 'nasiya') return 'nasiya';
  if (paidAmount <= 0) return 'nasiya';
  if (paidAmount >= total) return 'toʻliq';
  return 'qisman';
}

/**
 * Build a Payment object from form values
 */
export function buildPayment(
  total: number,
  paidAmount: number,
  paymentType: PaymentType,
  cashAmount?: number,
  cardAmount?: number
): Payment {
  const paid = clampPositive(Math.min(paidAmount, total + 0.01)); // small tolerance
  const debt = calculateDebt(total, paid);

  return {
    type: paymentType,
    totalAmount: total,
    paidAmount: paid,
    debtAmount: debt,
    cashAmount: paymentType === 'aralash' ? clampPositive(cashAmount ?? 0) : undefined,
    cardAmount: paymentType === 'aralash' ? clampPositive(cardAmount ?? 0) : undefined,
  };
}

/**
 * Validate mixed payment: cash + card must equal paidAmount
 */
export function validateMixedPayment(
  paidAmount: number,
  cashAmount: number,
  cardAmount: number
): string | null {
  const sum = cashAmount + cardAmount;
  if (Math.abs(sum - paidAmount) > 1) {
    return `Naqd (${cashAmount}) + Karta (${cardAmount}) = ${sum} — Toʻlangan summa (${paidAmount}) bilan mos emas`;
  }
  return null;
}
