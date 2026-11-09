// ============================================================
// Receipt Template 80mm — Thermal Printer Optimized
// ============================================================

import type { Receipt, ReceiptSettings } from '@/types';
import { formatDate, formatTime } from '@/utils/date';
import { formatAmount } from '@/utils/currency';
import { PAYMENT_TYPE_LABELS } from '@/types';

interface Props {
  receipt: Receipt;
  settings: ReceiptSettings;
}

function Separator() {
  return <div className="receipt-separator border-t border-dashed border-black my-1.5" />;
}

export function ReceiptTemplate80({ receipt, settings }: Props) {
  return (
    <div className="receipt-80 receipt-print" id="receipt-print-root">
      {/* Header */}
      <div className="receipt-header">
        <h1>{settings.storeName}</h1>
        <p>{settings.storeAddress}</p>
        <p>{settings.storePhone}</p>
      </div>

      <Separator />

      {/* Receipt Info */}
      <div>
        <div className="receipt-info-row">
          <span className="receipt-label">CHEK RAQAMI:</span>
          <span>{receipt.receiptNumber}</span>
        </div>
        <div className="receipt-info-row">
          <span>Sana:</span>
          <span>{formatDate(receipt.createdAt)}</span>
        </div>
        <div className="receipt-info-row">
          <span>Vaqt:</span>
          <span>{formatTime(receipt.createdAt)}</span>
        </div>
      </div>

      {settings.showCustomerInfo && (
        <>
          <div className="receipt-info-row">
            <span>Xaridor:</span>
            <span style={{ textAlign: 'right', maxWidth: '55%', wordBreak: 'break-word' }}>
              {receipt.customer.name}
            </span>
          </div>
          {receipt.customer.phone && (
            <div className="receipt-info-row">
              <span>Telefon:</span>
              <span>{receipt.customer.phone}</span>
            </div>
          )}
        </>
      )}

      {settings.showSellerInfo && (
        <div className="receipt-info-row">
          <span>Savdogar:</span>
          <span style={{ textAlign: 'right', maxWidth: '55%', wordBreak: 'break-word' }}>
            {receipt.seller.name}
          </span>
        </div>
      )}

      <Separator />

      {/* Items */}
      <div
        className="receipt-section-title"
        style={{ fontSize: '9pt', letterSpacing: '1px' }}
      >
        ═══════ MAHSULOTLAR ═══════
      </div>
      <Separator />

      {receipt.items.map((item, idx) => (
        <div key={item.id} className="receipt-item">
          <div
            className="receipt-item-name"
            style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
          >
            {idx + 1}. {item.name}
          </div>
          {item.model && (
            <div className="receipt-item-detail">   Model: {item.model}</div>
          )}
          <div className="receipt-item-detail">
            &nbsp;&nbsp;&nbsp;Miqdor: {item.quantity} {item.unit}
          </div>
          <div className="receipt-item-detail">
            &nbsp;&nbsp;&nbsp;Narxi: {formatAmount(item.unitPrice)} so'm
          </div>
          {item.discount > 0 && (
            <div className="receipt-item-detail">
              &nbsp;&nbsp;&nbsp;Chegirma: -{formatAmount(item.discount)} so'm
            </div>
          )}
          <div
            className="receipt-info-row receipt-label"
            style={{ borderTop: '1px dotted #aaa', marginTop: '1mm', paddingTop: '0.5mm' }}
          >
            <span>&nbsp;&nbsp;&nbsp;Jami:</span>
            <span>{formatAmount(item.total)} so'm</span>
          </div>
        </div>
      ))}

      <Separator />

      {/* Totals */}
      <div className="receipt-total-section">
        <div className="receipt-info-row">
          <span>Mahsulotlar summasi:</span>
          <span>{formatAmount(receipt.subtotal)} so'm</span>
        </div>
        {receipt.discount > 0 && (
          <div className="receipt-info-row">
            <span>Chegirma:</span>
            <span>-{formatAmount(receipt.discount)} so'm</span>
          </div>
        )}
      </div>

      <div
        className="receipt-grand-total"
        style={{
          border: '1px solid #000',
          margin: '2mm 0',
          padding: '1.5mm',
        }}
      >
        JAMI TO'LOV: {formatAmount(receipt.total)} so'm
      </div>

      <div className="receipt-info-row">
        <span>To'langan:</span>
        <span>{formatAmount(receipt.payment.paidAmount)} so'm</span>
      </div>

      {receipt.payment.debtAmount > 0 && (
        <div className="receipt-info-row receipt-debt-row" style={{ fontSize: '9pt' }}>
          <span>★ Qolgan qarz:</span>
          <span>{formatAmount(receipt.payment.debtAmount)} so'm</span>
        </div>
      )}

      <div className="receipt-info-row">
        <span>To'lov turi:</span>
        <span>{PAYMENT_TYPE_LABELS[receipt.payment.type]}</span>
      </div>

      {receipt.payment.type === 'aralash' && (
        <div style={{ paddingLeft: '3mm', fontSize: '7pt' }}>
          <div className="receipt-info-row">
            <span>Naqd:</span>
            <span>{formatAmount(receipt.payment.cashAmount ?? 0)} so'm</span>
          </div>
          <div className="receipt-info-row">
            <span>Karta:</span>
            <span>{formatAmount(receipt.payment.cardAmount ?? 0)} so'm</span>
          </div>
        </div>
      )}

      <Separator />

      {/* Footer */}
      <div className="receipt-footer">
        <div>{'─'.repeat(32)}</div>
        <div style={{ fontSize: '8pt', margin: '1mm 0' }}>{settings.footerText}</div>
        <div style={{ fontWeight: 'bold', fontSize: '10pt', letterSpacing: '1px' }}>
          {settings.storeName}
        </div>
        <div>{'─'.repeat(32)}</div>
      </div>
    </div>
  );
}
