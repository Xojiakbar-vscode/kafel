// ============================================================
// Local Storage Abstraction
// ============================================================

import type { Receipt, ReceiptSettings } from '@/types';
import { STORAGE_KEYS } from '@/types';

// ── Default Settings ──────────────────────────────────────────
export const DEFAULT_SETTINGS: ReceiptSettings = {
  storeName: 'TILE CRAFT',
  storeAddress: "Toshkent sh., Mirobod ko'chasi 15",
  storePhone: '+998 90 123 45 67',
  defaultPaperWidth: 80,
  defaultPrintMethod: 'browser',
  footerText: 'Xaridingiz uchun rahmat!',
  autoPrintAfterSave: false,
  showCustomerInfo: true,
  showSellerInfo: true,
};

// ── Safe JSON Helpers ─────────────────────────────────────────
function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[Storage] Failed to write key:', key, e);
  }
}

// ── Receipts ──────────────────────────────────────────────────
export function getReceipts(): Receipt[] {
  return safeGet<Receipt[]>(STORAGE_KEYS.RECEIPTS, []);
}

export function getReceiptById(id: string): Receipt | null {
  const receipts = getReceipts();
  return receipts.find((r) => r.id === id) ?? null;
}

export function saveReceipt(receipt: Receipt): void {
  const receipts = getReceipts();
  const idx = receipts.findIndex((r) => r.id === receipt.id);
  if (idx >= 0) {
    receipts[idx] = receipt;
  } else {
    receipts.unshift(receipt); // newest first
  }
  safeSet(STORAGE_KEYS.RECEIPTS, receipts);
}

export function deleteReceipt(id: string): void {
  const receipts = getReceipts().filter((r) => r.id !== id);
  safeSet(STORAGE_KEYS.RECEIPTS, receipts);
}

export function updateReceiptPrintCount(id: string): void {
  const receipts = getReceipts();
  const idx = receipts.findIndex((r) => r.id === id);
  if (idx >= 0) {
    receipts[idx] = { ...receipts[idx], printCount: receipts[idx].printCount + 1 };
    safeSet(STORAGE_KEYS.RECEIPTS, receipts);
  }
}

// ── Settings ──────────────────────────────────────────────────
export function getSettings(): ReceiptSettings {
  const stored = safeGet<Partial<ReceiptSettings>>(STORAGE_KEYS.SETTINGS, {});
  return { ...DEFAULT_SETTINGS, ...stored };
}

export function saveSettings(settings: ReceiptSettings): void {
  safeSet(STORAGE_KEYS.SETTINGS, settings);
}

// ── Today Statistics ─────────────────────────────────────────
export interface DailyStats {
  count: number;
  total: number;
  cash: number;
  card: number;
  debt: number;
}

export function getTodayStats(): DailyStats {
  const today = new Date().toDateString();
  const receipts = getReceipts().filter(
    (r) => new Date(r.createdAt).toDateString() === today
  );

  return receipts.reduce(
    (acc, r) => {
      acc.count++;
      acc.total += r.total;
      acc.debt += r.payment.debtAmount;

      if (r.payment.type === 'naqd') acc.cash += r.payment.paidAmount;
      else if (r.payment.type === 'plastik_karta') acc.card += r.payment.paidAmount;
      else if (r.payment.type === 'aralash') {
        acc.cash += r.payment.cashAmount ?? 0;
        acc.card += r.payment.cardAmount ?? 0;
      }
      return acc;
    },
    { count: 0, total: 0, cash: 0, card: 0, debt: 0 } as DailyStats
  );
}
