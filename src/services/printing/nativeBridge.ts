// ============================================================
// Native Android Bridge
// (Future integration point for Android USB Host API)
// ============================================================

import type { NativePrinterBridge, PrinterStatus, ReceiptPrintData } from '@/types';

/**
 * Check if running inside a native Android WebView with
 * the TILE CRAFT native bridge injected.
 *
 * The Android application injects a JavaScript object at:
 *   window.TileCraftPrinterBridge
 *
 * The bridge must implement NativePrinterBridge methods.
 */
export function isNativeBridgeAvailable(): boolean {
  return typeof (window as Window & { TileCraftPrinterBridge?: unknown })
    .TileCraftPrinterBridge === 'object';
}

/**
 * Get the native bridge object (typed).
 * Returns null if not available.
 */
export function getNativeBridge(): NativePrinterBridge | null {
  const win = window as Window & { TileCraftPrinterBridge?: NativePrinterBridge };
  if (win.TileCraftPrinterBridge) {
    return win.TileCraftPrinterBridge;
  }
  return null;
}

/**
 * Native bridge adapter.
 * When running in an ordinary browser, all methods throw
 * clear errors explaining the limitation.
 */
export class NativeBridgeAdapter {
  private bridge: NativePrinterBridge | null;

  constructor() {
    this.bridge = getNativeBridge();
  }

  get available(): boolean {
    return this.bridge !== null;
  }

  async requestUsbPermission(): Promise<boolean> {
    if (!this.bridge) {
      throw new Error(
        'Android native bridge mavjud emas. ' +
          'Bu funksiya faqat TILE CRAFT Android ilovasida ishlaydi.'
      );
    }
    return this.bridge.requestUsbPermission();
  }

  async connectPrinter(): Promise<boolean> {
    if (!this.bridge) {
      throw new Error(
        'Android native bridge mavjud emas. ' +
          'Printerga ulanish uchun Android ilovasidan foydalaning.'
      );
    }
    return this.bridge.connectPrinter();
  }

  async printReceipt(data: ReceiptPrintData): Promise<boolean> {
    if (!this.bridge) {
      throw new Error(
        'Android native bridge mavjud emas. ' +
          'Chop etish uchun Android ilovasidan foydalaning yoki PDF yuklab oling.'
      );
    }
    return this.bridge.printReceipt(data);
  }

  async disconnectPrinter(): Promise<void> {
    if (!this.bridge) return;
    return this.bridge.disconnectPrinter();
  }

  async getPrinterStatus(): Promise<PrinterStatus> {
    if (!this.bridge) {
      return {
        state: 'unsupported',
        method: null,
        errorMessage: 'Android native bridge mavjud emas.',
        webUsbSupported: false,
        nativeBridgeAvailable: false,
      };
    }
    return this.bridge.getPrinterStatus();
  }
}
