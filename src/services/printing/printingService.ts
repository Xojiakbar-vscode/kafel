// ============================================================
// Unified Printing Service
// ============================================================

import type { ReceiptPrintData, PrinterStatus, PrintMethod } from '@/types';
import { browserPrint } from './browserPrint';
import { webUsbPrinter } from './usbPrinter';
import { NativeBridgeAdapter } from './nativeBridge';
import { detectPrinterCapabilities } from './printerDetection';

export type PrintResult = {
  success: boolean;
  method: PrintMethod;
  error?: string;
};

export class PrintingService {
  private nativeBridge = new NativeBridgeAdapter();

  /**
   * Get current printer capabilities
   */
  getCapabilities(): PrinterStatus {
    return detectPrinterCapabilities();
  }

  /**
   * Print using the specified method with automatic fallback
   */
  async print(data: ReceiptPrintData, method: PrintMethod): Promise<PrintResult> {
    switch (method) {
      case 'browser':
        return this.printBrowser(data);
      case 'webusb':
        return this.printWebUsb(data);
      case 'native_bridge':
        return this.printNative(data);
      case 'pdf':
        // PDF is handled separately via pdfService
        return { success: false, method: 'pdf', error: 'PDF uchun PDF xizmatidan foydalaning.' };
      default:
        return this.printBrowser(data);
    }
  }

  private async printBrowser(data: ReceiptPrintData): Promise<PrintResult> {
    try {
      browserPrint(data);
      return { success: true, method: 'browser' };
    } catch (err) {
      return {
        success: false,
        method: 'browser',
        error: (err as Error).message,
      };
    }
  }

  private async printWebUsb(data: ReceiptPrintData): Promise<PrintResult> {
    if (!webUsbPrinter.isConnected) {
      return {
        success: false,
        method: 'webusb',
        error:
          'USB printer ulanmagan. Printer ulanish tugmasini bosing.',
      };
    }
    try {
      await webUsbPrinter.printReceipt(data);
      return { success: true, method: 'webusb' };
    } catch (err) {
      return {
        success: false,
        method: 'webusb',
        error: (err as Error).message,
      };
    }
  }

  private async printNative(data: ReceiptPrintData): Promise<PrintResult> {
    if (!this.nativeBridge.available) {
      return {
        success: false,
        method: 'native_bridge',
        error:
          'Android native bridge mavjud emas. Bu funksiya faqat TILE CRAFT Android ilovasida ishlaydi.',
      };
    }
    try {
      const success = await this.nativeBridge.printReceipt(data);
      return { success, method: 'native_bridge' };
    } catch (err) {
      return {
        success: false,
        method: 'native_bridge',
        error: (err as Error).message,
      };
    }
  }
}

export const printingService = new PrintingService();
