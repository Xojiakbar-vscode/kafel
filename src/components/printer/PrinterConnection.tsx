// ============================================================
// Printer Connection Component
// ============================================================

import { useState } from 'react';
import { Usb, Wifi, WifiOff, AlertTriangle, CheckCircle, Smartphone, Printer } from 'lucide-react';
import type { PrinterStatus } from '@/types';
import { isWebUsbSupported } from '@/services/printing/printerDetection';
import { webUsbPrinter } from '@/services/printing/usbPrinter';
import { isNativeBridgeAvailable } from '@/services/printing/nativeBridge';
import { useReceiptStore } from '@/context/receiptStore';

export function PrinterConnection() {
  const { printerStatus, setPrinterStatus } = useReceiptStore();
  const [isConnecting, setIsConnecting] = useState(false);

  const webUsbSupported = isWebUsbSupported();
  const nativeBridgeAvailable = isNativeBridgeAvailable();

  const handleConnectWebUsb = async () => {
    setIsConnecting(true);
    setPrinterStatus({ ...printerStatus, state: 'connecting' });

    try {
      const status = await webUsbPrinter.requestDevice();
      setPrinterStatus(status);
    } catch (err) {
      setPrinterStatus({
        state: 'error',
        method: 'webusb',
        errorMessage: (err as Error).message,
        webUsbSupported: true,
        nativeBridgeAvailable,
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await webUsbPrinter.disconnect();
    setPrinterStatus({
      state: 'disconnected',
      method: 'webusb',
      webUsbSupported,
      nativeBridgeAvailable,
    });
  };

  const statusIcon = () => {
    switch (printerStatus.state) {
      case 'connected':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'connecting':
        return <Wifi size={16} className="text-blue-500 animate-pulse" />;
      case 'error':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'unsupported':
        return <WifiOff size={16} className="text-gray-400" />;
      default:
        return <WifiOff size={16} className="text-gray-400" />;
    }
  };

  const statusText: Record<PrinterStatus['state'], string> = {
    disconnected: "Ulanmagan",
    connecting: "Ulanmoqda...",
    connected: `Ulangan: ${printerStatus.deviceName ?? 'Printer'}`,
    error: "Xatolik",
    unsupported: "Qo'llab-quvvatlanmaydi",
  };

  return (
    <div className="card">
      <div className="card-header flex items-center gap-2">
        <Printer size={18} className="text-blue-600" />
        <h3 className="font-semibold text-gray-900">Printer ulanishi</h3>
      </div>
      <div className="card-body space-y-4">

        {/* Status Row */}
        <div className="flex items-center gap-2 text-sm">
          {statusIcon()}
          <span className="font-medium">{statusText[printerStatus.state]}</span>
          {printerStatus.errorMessage && (
            <span className="text-red-500 text-xs">— {printerStatus.errorMessage}</span>
          )}
        </div>

        {/* WebUSB */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Usb size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-800">WebUSB (Chrome/Edge)</span>
            {webUsbSupported ? (
              <span className="badge badge-success">Mavjud</span>
            ) : (
              <span className="badge badge-gray">Mavjud emas</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-3">
            {webUsbSupported
              ? 'Brauzeringiz WebUSB texnologiyasini qo\'llab-quvvatlaydi. Printerga ulanish uchun tugmani bosing.'
              : 'Bu brauzer WebUSB texnologiyasini qo\'llab-quvvatlamaydi. Chrome 61+ yoki Edge ishlatiladi.'}
          </p>
          {webUsbSupported && (
            printerStatus.state === 'connected' ? (
              <button onClick={handleDisconnect} className="btn-secondary text-xs">
                <WifiOff size={13} />
                Uzish
              </button>
            ) : (
              <button
                onClick={handleConnectWebUsb}
                disabled={isConnecting || !webUsbSupported}
                className="btn-primary text-xs"
              >
                <Usb size={13} />
                {isConnecting ? 'Ulanmoqda...' : 'USB printerga ulanish'}
              </button>
            )
          )}
        </div>

        {/* Native Bridge */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-800">Android Native Bridge</span>
            {nativeBridgeAvailable ? (
              <span className="badge badge-success">Faol</span>
            ) : (
              <span className="badge badge-gray">Mavjud emas</span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {nativeBridgeAvailable
              ? 'TILE CRAFT Android ilovasi aniqlandi. USB printer bilan to\'g\'ridan-to\'g\'ri chop etish mumkin.'
              : 'Android native bridge faqat TILE CRAFT Android ilovasida ishlaydi. ' +
                'Ilova USB Host API orqali Xprinter XP-80TS bilan ishlaydi.'}
          </p>
          {!nativeBridgeAvailable && (
            <div className="mt-2 text-xs text-amber-700 bg-amber-50 rounded p-2">
              💡 Kelgusida: Android ilovasi window.TileCraftPrinterBridge interfeysini inject qiladi.
            </div>
          )}
        </div>

        {/* Browser Print */}
        <div className="border border-green-200 bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={16} className="text-green-600" />
            <span className="text-sm font-medium text-green-800">Brauzer orqali chop etish</span>
          </div>
          <p className="text-xs text-green-700">
            Har doim ishlaydi. Chek ko'rinishidan "Chop etish" tugmasini bosing.
            Brauzer print dialogida printer va qog'oz o'lchamini tanlang.
          </p>
        </div>

      </div>
    </div>
  );
}
