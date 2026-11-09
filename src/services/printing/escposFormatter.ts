// ============================================================
// ESC/POS Command Formatter
// ============================================================

import type { ReceiptPrintData } from '@/types';
import { formatDate, formatTime } from '@/utils/date';
import { formatAmount } from '@/utils/currency';
import { PAYMENT_TYPE_LABELS } from '@/types';

export class EscPosFormatter {
  // ESC/POS command bytes
  private static ESC = 0x1b;
  private static GS = 0x1d;
  private static LF = 0x0a;
  private static NUL = 0x00;

  static INIT = [EscPosFormatter.ESC, 0x40]; // Initialize printer
  static ALIGN_LEFT = [EscPosFormatter.ESC, 0x61, 0x00];
  static ALIGN_CENTER = [EscPosFormatter.ESC, 0x61, 0x01];
  static ALIGN_RIGHT = [EscPosFormatter.ESC, 0x61, 0x02];
  static BOLD_ON = [EscPosFormatter.ESC, 0x45, 0x01];
  static BOLD_OFF = [EscPosFormatter.ESC, 0x45, 0x00];
  static DOUBLE_HEIGHT = [EscPosFormatter.ESC, 0x21, 0x10];
  static NORMAL_SIZE = [EscPosFormatter.ESC, 0x21, 0x00];
  static CUT = [EscPosFormatter.GS, 0x56, 0x41, 0x00]; // Full cut
  static FEED_LINE = [EscPosFormatter.LF];
  static FEED_3_LINES = [EscPosFormatter.ESC, 0x64, 0x03];

  /**
   * Encode a string to Uint8Array (UTF-8)
   */
  static encode(text: string): Uint8Array {
    return new TextEncoder().encode(text);
  }

  /**
   * Merge multiple byte arrays into one
   */
  static merge(...arrays: (number[] | Uint8Array)[]): Uint8Array {
    const totalLen = arrays.reduce((s, a) => s + a.length, 0);
    const result = new Uint8Array(totalLen);
    let offset = 0;
    for (const arr of arrays) {
      result.set(arr instanceof Uint8Array ? arr : new Uint8Array(arr), offset);
      offset += arr.length;
    }
    return result;
  }

  /**
   * Create a separator line
   */
  static separator(width: 32 | 42 | 48): Uint8Array {
    return this.encode('-'.repeat(width) + '\n');
  }

  /**
   * Format a receipt for ESC/POS printing
   */
  static formatReceipt(data: ReceiptPrintData): Uint8Array {
    const { receipt, settings, paperWidth } = data;
    const lineWidth = paperWidth === 58 ? 32 : 42;
    const sep = this.separator(lineWidth as 32 | 42);

    const chunks: (number[] | Uint8Array)[] = [
      this.INIT,
      // Header
      this.ALIGN_CENTER,
      this.BOLD_ON,
      this.DOUBLE_HEIGHT,
      this.encode(settings.storeName + '\n'),
      this.NORMAL_SIZE,
      this.BOLD_OFF,
      this.encode(settings.storeAddress + '\n'),
      this.encode(settings.storePhone + '\n'),
      this.FEED_LINE,
      sep,

      // Receipt info
      this.ALIGN_LEFT,
      this.encode(`CHEK #: ${receipt.receiptNumber}\n`),
      this.encode(`Sana: ${formatDate(receipt.createdAt)}\n`),
      this.encode(`Vaqt: ${formatTime(receipt.createdAt)}\n`),
      this.FEED_LINE,
    ];

    if (settings.showCustomerInfo) {
      chunks.push(this.encode(`Xaridor: ${receipt.customer.name}\n`));
      if (receipt.customer.phone) {
        chunks.push(this.encode(`Tel: ${receipt.customer.phone}\n`));
      }
    }

    if (settings.showSellerInfo) {
      chunks.push(this.encode(`Savdogar: ${receipt.seller.name}\n`));
    }

    chunks.push(sep);
    chunks.push(this.BOLD_ON);
    chunks.push(this.encode('MAHSULOTLAR\n'));
    chunks.push(this.BOLD_OFF);
    chunks.push(sep);

    // Items
    for (const item of receipt.items) {
      chunks.push(this.BOLD_ON);
      chunks.push(this.encode(item.name + '\n'));
      chunks.push(this.BOLD_OFF);
      if (item.model) chunks.push(this.encode(`  Model: ${item.model}\n`));
      chunks.push(this.encode(`  Miqdor: ${item.quantity} ${item.unit}\n`));
      chunks.push(this.encode(`  Narxi: ${formatAmount(item.unitPrice)} so'm\n`));
      if (item.discount > 0) {
        chunks.push(this.encode(`  Chegirma: ${formatAmount(item.discount)} so'm\n`));
      }
      chunks.push(this.encode(`  Jami: ${formatAmount(item.total)} so'm\n`));
    }

    chunks.push(sep);

    // Totals
    chunks.push(this.encode(`Mahsulotlar summasi: ${formatAmount(receipt.subtotal)}\n`));
    if (receipt.discount > 0) {
      chunks.push(this.encode(`Chegirma: ${formatAmount(receipt.discount)}\n`));
    }
    chunks.push(this.BOLD_ON);
    chunks.push(this.encode(`JAMI TO'LOV: ${formatAmount(receipt.total)} so'm\n`));
    chunks.push(this.BOLD_OFF);
    chunks.push(this.FEED_LINE);
    chunks.push(this.encode(`To'langan: ${formatAmount(receipt.payment.paidAmount)} so'm\n`));
    if (receipt.payment.debtAmount > 0) {
      chunks.push(this.BOLD_ON);
      chunks.push(this.encode(`Qolgan qarz: ${formatAmount(receipt.payment.debtAmount)} so'm\n`));
      chunks.push(this.BOLD_OFF);
    }
    chunks.push(this.encode(`To'lov turi: ${PAYMENT_TYPE_LABELS[receipt.payment.type]}\n`));

    if (receipt.payment.type === 'aralash') {
      chunks.push(this.encode(`  Naqd: ${formatAmount(receipt.payment.cashAmount ?? 0)} so'm\n`));
      chunks.push(this.encode(`  Karta: ${formatAmount(receipt.payment.cardAmount ?? 0)} so'm\n`));
    }

    chunks.push(sep);

    // Footer
    chunks.push(this.ALIGN_CENTER);
    chunks.push(this.encode(settings.footerText + '\n'));
    chunks.push(this.BOLD_ON);
    chunks.push(this.encode(settings.storeName + '\n'));
    chunks.push(this.BOLD_OFF);
    chunks.push(this.FEED_3_LINES);
    chunks.push(this.CUT);

    return this.merge(...chunks);
  }
}
