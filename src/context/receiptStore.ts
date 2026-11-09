// ============================================================
// Zustand Receipt Store
// ============================================================

import { create } from 'zustand';
import type { Receipt, ReceiptSettings, PrinterStatus } from '@/types';
import {
  getReceipts,
  saveReceipt as storageSaveReceipt,
  deleteReceipt as storageDeleteReceipt,
  getSettings,
  saveSettings as storageSaveSettings,
  getTodayStats,
  type DailyStats,
} from '@/services/storage/receiptStorage';
import { detectPrinterCapabilities } from '@/services/printing/printerDetection';

interface ReceiptStore {
  // Data
  receipts: Receipt[];
  settings: ReceiptSettings;
  todayStats: DailyStats;
  printerStatus: PrinterStatus;

  // Actions
  loadReceipts: () => void;
  addReceipt: (receipt: Receipt) => void;
  updateReceipt: (receipt: Receipt) => void;
  removeReceipt: (id: string) => void;
  refreshStats: () => void;

  loadSettings: () => void;
  updateSettings: (settings: ReceiptSettings) => void;

  refreshPrinterStatus: () => void;
  setPrinterStatus: (status: PrinterStatus) => void;
}

export const useReceiptStore = create<ReceiptStore>((set) => ({
  receipts: [],
  settings: getSettings(),
  todayStats: { count: 0, total: 0, cash: 0, card: 0, debt: 0 },
  printerStatus: detectPrinterCapabilities(),

  loadReceipts: () => {
    const receipts = getReceipts();
    const todayStats = getTodayStats();
    set({ receipts, todayStats });
  },

  addReceipt: (receipt) => {
    storageSaveReceipt(receipt);
    set((state) => ({
      receipts: [receipt, ...state.receipts.filter((r) => r.id !== receipt.id)],
      todayStats: getTodayStats(),
    }));
  },

  updateReceipt: (receipt) => {
    storageSaveReceipt(receipt);
    set((state) => ({
      receipts: state.receipts.map((r) => (r.id === receipt.id ? receipt : r)),
      todayStats: getTodayStats(),
    }));
  },

  removeReceipt: (id) => {
    storageDeleteReceipt(id);
    set((state) => ({
      receipts: state.receipts.filter((r) => r.id !== id),
      todayStats: getTodayStats(),
    }));
  },

  refreshStats: () => {
    set({ todayStats: getTodayStats() });
  },

  loadSettings: () => {
    set({ settings: getSettings() });
  },

  updateSettings: (settings) => {
    storageSaveSettings(settings);
    set({ settings });
  },

  refreshPrinterStatus: () => {
    set({ printerStatus: detectPrinterCapabilities() });
  },

  setPrinterStatus: (status) => {
    set({ printerStatus: status });
  },
}));
