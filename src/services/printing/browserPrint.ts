// ============================================================
// Browser Print Service (window.print)
// ============================================================

import type { ReceiptPrintData } from '@/types';
import { updateReceiptPrintCount } from '@/services/storage/receiptStorage';

/**
 * Print a receipt using the browser's native print dialog.
 * The correct CSS is handled by receipt-print.css.
 */
export function browserPrint(data: ReceiptPrintData): void {
  const { receipt } = data;

  // Set paper size hint via meta tag (for browsers that support it)
  const paperWidth = data.paperWidth;
  const widthMm = paperWidth === 58 ? '58mm' : '80mm';

  // Inject a temporary style to set page dimensions
  const styleId = 'tilecraft-print-style';
  let style = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement('style');
    style.id = styleId;
    document.head.appendChild(style);
  }
  style.textContent = `
    @page {
      size: ${widthMm} auto;
      margin: 0;
    }
  `;

  // Trigger print
  window.print();

  // Update print count
  updateReceiptPrintCount(receipt.id);
}
