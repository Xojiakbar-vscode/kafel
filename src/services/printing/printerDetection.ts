// ============================================================
// Printer Detection Service
// ============================================================

import type { PrinterStatus } from '@/types';
import { isNativeBridgeAvailable } from './nativeBridge';

/**
 * Check if WebUSB is supported by the current browser
 */
export function isWebUsbSupported(): boolean {
  return typeof navigator !== 'undefined' && 'usb' in navigator;
}

/**
 * Get a comprehensive printer status overview
 */
export function detectPrinterCapabilities(): PrinterStatus {
  const webUsbSupported = isWebUsbSupported();
  const nativeBridgeAvailable = isNativeBridgeAvailable();

  if (nativeBridgeAvailable) {
    return {
      state: 'disconnected',
      method: 'native_bridge',
      webUsbSupported,
      nativeBridgeAvailable: true,
    };
  }

  if (webUsbSupported) {
    return {
      state: 'disconnected',
      method: 'webusb',
      webUsbSupported: true,
      nativeBridgeAvailable: false,
    };
  }

  return {
    state: 'unsupported',
    method: 'browser',
    errorMessage:
      "Bu brauzer WebUSB texnologiyasini qo'llab-quvvatlamaydi. " +
      "USB printer uchun Chrome yoki Edge ishlatiladi, yoki Android ilovasiga o'ting.",
    webUsbSupported: false,
    nativeBridgeAvailable: false,
  };
}
