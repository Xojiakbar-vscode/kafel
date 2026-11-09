// ============================================================
// PDF Generation Service
// ============================================================

import jsPDF from 'jspdf';
import type { ReceiptPrintData } from '@/types';
import { formatDate, formatTime } from '@/utils/date';
import { formatAmount } from '@/utils/currency';
import { PAYMENT_TYPE_LABELS } from '@/types';
import { updateReceiptPrintCount } from '@/services/storage/receiptStorage';

export class PdfService {
  /**
   * Generate and download a PDF receipt
   */
  async generateAndDownload(data: ReceiptPrintData): Promise<void> {
    const { receipt, settings, paperWidth } = data;

    // Page dimensions in mm
    const pageWidth = paperWidth === 58 ? 58 : 80;
    const margin = 3;
    const contentWidth = pageWidth - margin * 2;

    // We'll build the PDF line by line and track Y position
    const lines: Array<{
      text: string;
      y: number;
      align?: 'left' | 'center' | 'right';
      bold?: boolean;
      size?: number;
    }> = [];

    let y = 5;
    const lineH = 4; // line height in mm
    const addLine = (
      text: string,
      opts: { align?: 'left' | 'center' | 'right'; bold?: boolean; size?: number } = {}
    ) => {
      lines.push({ text, y, ...opts });
      y += opts.size ? opts.size * 0.5 + 1 : lineH;
    };

    const addSep = () => {
      const sepWidth = paperWidth === 58 ? 30 : 42;
      addLine('-'.repeat(sepWidth));
    };

    // Build content
    addLine(settings.storeName, { align: 'center', bold: true, size: 7 });
    y += 1;
    addLine(settings.storeAddress, { align: 'center', size: 5 });
    addLine(settings.storePhone, { align: 'center', size: 5 });
    y += 1;
    addSep();

    addLine(`CHEK #: ${receipt.receiptNumber}`, { bold: true });
    addLine(`Sana: ${formatDate(receipt.createdAt)}`);
    addLine(`Vaqt: ${formatTime(receipt.createdAt)}`);
    y += 1;

    if (settings.showCustomerInfo) {
      addLine(`Xaridor: ${receipt.customer.name}`);
      if (receipt.customer.phone) addLine(`Tel: ${receipt.customer.phone}`);
    }
    if (settings.showSellerInfo) {
      addLine(`Savdogar: ${receipt.seller.name}`);
    }

    addSep();
    addLine('MAHSULOTLAR', { bold: true, align: 'center' });
    addSep();

    for (const item of receipt.items) {
      addLine(item.name, { bold: true });
      if (item.model) addLine(`  Model: ${item.model}`);
      addLine(`  Miqdor: ${item.quantity} ${item.unit}`);
      addLine(`  Narxi: ${formatAmount(item.unitPrice)} so'm`);
      if (item.discount > 0) addLine(`  Chegirma: ${formatAmount(item.discount)} so'm`);
      addLine(`  Jami: ${formatAmount(item.total)} so'm`);
      y += 1;
    }

    addSep();
    addLine(`Jami: ${formatAmount(receipt.subtotal)} so'm`);
    if (receipt.discount > 0) {
      addLine(`Chegirma: ${formatAmount(receipt.discount)} so'm`);
    }
    addLine(`JAMI TO'LOV: ${formatAmount(receipt.total)} so'm`, { bold: true });
    y += 1;
    addLine(`To'langan: ${formatAmount(receipt.payment.paidAmount)} so'm`);
    if (receipt.payment.debtAmount > 0) {
      addLine(`Qolgan qarz: ${formatAmount(receipt.payment.debtAmount)} so'm`, { bold: true });
    }
    addLine(`To'lov turi: ${PAYMENT_TYPE_LABELS[receipt.payment.type]}`);
    if (receipt.payment.type === 'aralash') {
      addLine(`  Naqd: ${formatAmount(receipt.payment.cashAmount ?? 0)} so'm`);
      addLine(`  Karta: ${formatAmount(receipt.payment.cardAmount ?? 0)} so'm`);
    }

    addSep();
    addLine(settings.footerText, { align: 'center' });
    addLine(settings.storeName, { align: 'center', bold: true });
    y += 3;

    // Create PDF with dynamic height
    const pageHeight = y + 5;
    const doc = new jsPDF({
      unit: 'mm',
      format: [pageWidth, pageHeight],
      orientation: 'portrait',
    });

    // Render lines
    for (const line of lines) {
      const fontSize = line.size ?? 6;
      doc.setFontSize(fontSize);
      if (line.bold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }

      const x =
        line.align === 'center'
          ? pageWidth / 2
          : line.align === 'right'
            ? pageWidth - margin
            : margin;

      doc.text(line.text, x, line.y, {
        align: line.align ?? 'left',
        maxWidth: contentWidth,
      });
    }

    // Download
    const filename = `${receipt.receiptNumber}.pdf`;
    doc.save(filename);

    // Update print count
    updateReceiptPrintCount(receipt.id);
  }
}

export const pdfService = new PdfService();
