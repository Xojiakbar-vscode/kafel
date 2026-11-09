// ============================================================
// WebUSB Printer Service
// ============================================================

import type { PrinterStatus, ReceiptPrintData } from '@/types';
import type { USBDevice } from '@/types/webusb';
import { EscPosFormatter } from './escposFormatter';
import { updateReceiptPrintCount } from '@/services/storage/receiptStorage';

// Xprinter XP-80TS USB VID/PID (common POS vendor IDs)
const XPRINTER_VENDOR_IDS = [0x0416, 0x04b8, 0x0483];

export class WebUsbPrinter {
  private device: USBDevice | null = null;
  private endpointNumber = 1;

  get isConnected(): boolean {
    return this.device !== null && this.device.opened;
  }

  /**
   * Request a USB device from the user.
   * MUST be called from a user interaction event handler.
   */
  async requestDevice(): Promise<PrinterStatus> {
    if (typeof navigator === 'undefined' || !navigator.usb) {
      return {
        state: 'unsupported',
        method: 'webusb',
        errorMessage:
          "Bu brauzer WebUSB texnologiyasini qo'llab-quvvatlamaydi. Chrome yoki Edge ishlatiladi.",
        webUsbSupported: false,
        nativeBridgeAvailable: false,
      };
    }

    try {
      const filters = XPRINTER_VENDOR_IDS.map((vendorId) => ({ vendorId }));
      this.device = await navigator.usb.requestDevice({ filters });

      await this.device.open();
      await this.device.selectConfiguration(1);
      await this.device.claimInterface(0);

      // Find bulk OUT endpoint
      const iface = this.device.configuration?.interfaces[0];
      if (iface) {
        for (const alt of iface.alternates) {
          for (const ep of alt.endpoints) {
            if (ep.direction === 'out' && ep.type === 'bulk') {
              this.endpointNumber = ep.endpointNumber;
            }
          }
        }
      }

      return {
        state: 'connected',
        method: 'webusb',
        deviceName: this.device.productName ?? 'USB Printer',
        webUsbSupported: true,
        nativeBridgeAvailable: false,
      };
    } catch (err) {
      const error = err as Error;
      if (error.name === 'NotFoundError') {
        return {
          state: 'disconnected',
          method: 'webusb',
          errorMessage: "Printer topilmadi yoki tanlash bekor qilindi.",
          webUsbSupported: true,
          nativeBridgeAvailable: false,
        };
      }
      if (error.name === 'SecurityError') {
        return {
          state: 'error',
          method: 'webusb',
          errorMessage: "Ruxsat berilmadi. Brauzer USB printerga kirishni blokladi.",
          webUsbSupported: true,
          nativeBridgeAvailable: false,
        };
      }
      return {
        state: 'error',
        method: 'webusb',
        errorMessage: `USB xatosi: ${error.message}`,
        webUsbSupported: true,
        nativeBridgeAvailable: false,
      };
    }
  }

  async disconnect(): Promise<void> {
    if (this.device) {
      try {
        await this.device.close();
      } catch {
        // ignore
      }
      this.device = null;
    }
  }

  async printReceipt(data: ReceiptPrintData): Promise<boolean> {
    if (!this.device || !this.device.opened) {
      throw new Error('Printer ulanmagan. Avval USB printerga ulaning.');
    }

    const bytes = EscPosFormatter.formatReceipt(data);
    await this.device.transferOut(this.endpointNumber, bytes);
    updateReceiptPrintCount(data.receipt.id);
    return true;
  }
}

// Singleton instance
export const webUsbPrinter = new WebUsbPrinter();
