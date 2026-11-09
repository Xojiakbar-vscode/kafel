// ============================================================
// Receipt Preview Modal — with print/pdf/template switching
// ============================================================

import { useState, useRef } from 'react';
import { X, Printer, Download, Monitor } from 'lucide-react';
import type { Receipt, ReceiptSettings, PaperWidth } from '@/types';
import { ReceiptTemplate58 } from './ReceiptTemplate58';
import { ReceiptTemplate80 } from './ReceiptTemplate80';
import { browserPrint } from '@/services/printing/browserPrint';
import { pdfService } from '@/services/pdf/pdfService';

interface ReceiptPreviewProps {
  receipt: Receipt;
  settings: ReceiptSettings;
  defaultPaperWidth?: PaperWidth;
  onClose: () => void;
  onPrintSuccess?: () => void;
}

export function ReceiptPreview({
  receipt,
  settings,
  defaultPaperWidth,
  onClose,
  onPrintSuccess,
}: ReceiptPreviewProps) {
  const [paperWidth, setPaperWidth] = useState<PaperWidth>(
    defaultPaperWidth ?? settings.defaultPaperWidth
  );
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const printData = { receipt, settings, paperWidth };

  const handleBrowserPrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      browserPrint(printData);
      setIsPrinting(false);
      onPrintSuccess?.();
    }, 100);
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await pdfService.generateAndDownload(printData);
      onPrintSuccess?.();
    } catch (err) {
      console.error('PDF download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-100 rounded-xl shadow-2xl flex flex-col max-h-[95vh] w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-white rounded-t-xl px-5 py-3 border-b border-gray-200 no-print">
          <div className="flex items-center gap-3">
            <Monitor size={20} className="text-blue-600" />
            <div>
              <h2 className="font-semibold text-gray-900 text-sm">Chek ko'rinishi</h2>
              <p className="text-xs text-gray-500">{receipt.receiptNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Paper Width Selector */}
        <div className="bg-white border-b border-gray-200 px-5 py-2 flex items-center gap-4 no-print">
          <span className="text-xs font-medium text-gray-600">Qog'oz kengligi:</span>
          <div className="flex gap-2">
            {([58, 80] as PaperWidth[]).map((w) => (
              <button
                key={w}
                onClick={() => setPaperWidth(w)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  paperWidth === w
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {w} mm
              </button>
            ))}
          </div>
        </div>

        {/* Receipt Preview */}
        <div className="flex-1 overflow-y-auto flex justify-center p-6 bg-gray-100" ref={printRef}>
          <div className="shadow-lg">
            {paperWidth === 58 ? (
              <ReceiptTemplate58 receipt={receipt} settings={settings} />
            ) : (
              <ReceiptTemplate80 receipt={receipt} settings={settings} />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-b-xl px-5 py-3 border-t border-gray-200 flex flex-wrap gap-2 justify-end no-print">
          <button onClick={onClose} className="btn-secondary">
            Yopish
          </button>
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="btn-secondary"
          >
            <Download size={16} />
            {isDownloading ? 'Yuklanmoqda...' : 'PDF yuklab olish'}
          </button>
          <button
            onClick={handleBrowserPrint}
            disabled={isPrinting}
            className="btn-primary"
          >
            <Printer size={16} />
            {isPrinting ? 'Chop etilmoqda...' : 'Chop etish'}
          </button>
        </div>
      </div>
    </div>
  );
}
