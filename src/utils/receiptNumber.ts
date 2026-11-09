// ============================================================
// Receipt Number Generator
// ============================================================

import { STORAGE_KEYS } from '@/types';

const RECEIPT_NUMBER_PREFIX = 'TC';

/**
 * Get the current year
 */
function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Pad a counter to 6 digits: 1 → "000001"
 */
function padCounter(n: number): string {
  return String(n).padStart(6, '0');
}

/**
 * Generate the next unique receipt number.
 * Format: TC-YYYY-NNNNNN
 * Persists counter in localStorage.
 */
export function generateReceiptNumber(): string {
  const year = getCurrentYear();
  const storageKey = `${STORAGE_KEYS.RECEIPT_COUNTER}_${year}`;

  let counter = 1;
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      counter = parseInt(stored, 10) + 1;
      if (isNaN(counter) || counter < 1) counter = 1;
    }
  } catch {
    counter = 1;
  }

  // Persist the new counter
  try {
    localStorage.setItem(storageKey, String(counter));
  } catch {
    // localStorage full or unavailable — continue with in-memory counter
  }

  return `${RECEIPT_NUMBER_PREFIX}-${year}-${padCounter(counter)}`;
}

/**
 * Peek at the next receipt number without consuming it
 */
export function peekNextReceiptNumber(): string {
  const year = getCurrentYear();
  const storageKey = `${STORAGE_KEYS.RECEIPT_COUNTER}_${year}`;

  let next = 1;
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      next = parseInt(stored, 10) + 1;
    }
  } catch {
    next = 1;
  }

  return `${RECEIPT_NUMBER_PREFIX}-${year}-${padCounter(next)}`;
}

/**
 * Generate a unique UUID v4
 */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
