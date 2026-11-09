// ============================================================
// Receipt Template 58mm — Thermal Printer Optimized
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
  return <div className="receipt-separator border-t border-dashed border-black my-1" />;
}

export function ReceiptTemplate58({ receipt, settings }: Props) {
  return (
    <div className="receipt-58 receipt-print" id="receipt-print-root">
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
          <span className="receipt-label">CHEK #:</span>
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
              <span>Tel:</span>
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

      {/* Items Section */}
      <div className="receipt-section-title" style={{ fontSize: '7.5pt' }}>
        MAHSULOTLAR
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
            <div className="receipt-item-detail">Model: {item.model}</div>
          )}
          <div className="receipt-item-detail">
            Miqdor: {item.quantity} {item.unit}
          </div>
          <div className="receipt-item-detail">
            Narxi: {formatAmount(item.unitPrice)} so'm
          </div>
          {item.discount > 0 && (
            <div className="receipt-item-detail">
              Chegirma: -{formatAmount(item.discount)} so'm
            </div>
          )}
          <div className="receipt-item-detail receipt-label">
            Jami: {formatAmount(item.total)} so'm
          </div>
        </div>
      ))}

      <Separator />

      {/* Totals */}
      <div className="receipt-total-section">
        <div className="receipt-info-row">
          <span>Jami:</span>
          <span>{formatAmount(receipt.subtotal)} so'm</span>
        </div>
        {receipt.discount > 0 && (
          <div className="receipt-info-row">
            <span>Chegirma:</span>
            <span>-{formatAmount(receipt.discount)} so'm</span>
          </div>
        )}
        <div className="receipt-grand-total" style={{ borderTop: '1px solid #000', marginTop: '1mm', paddingTop: '1mm' }}>
          JAMI: {formatAmount(receipt.total)} so'm
        </div>
        <div className="receipt-info-row" style={{ marginTop: '1mm' }}>
          <span>To'langan:</span>
          <span>{formatAmount(receipt.payment.paidAmount)} so'm</span>
        </div>
        {receipt.payment.debtAmount > 0 && (
          <div className="receipt-info-row receipt-debt-row">
            <span>Qarz:</span>
            <span>{formatAmount(receipt.payment.debtAmount)} so'm</span>
          </div>
        )}
        <div className="receipt-info-row">
          <span>To'lov:</span>
          <span>{PAYMENT_TYPE_LABELS[receipt.payment.type]}</span>
        </div>
        {receipt.payment.type === 'aralash' && (
          <>
            <div className="receipt-item-detail">
              Naqd: {formatAmount(receipt.payment.cashAmount ?? 0)} so'm
            </div>
            <div className="receipt-item-detail">
              Karta: {formatAmount(receipt.payment.cardAmount ?? 0)} so'm
            </div>
          </>
        )}
      </div>

      <Separator />

      {/* Footer */}
      <div className="receipt-footer">
        <div>{settings.footerText}</div>
        <div style={{ fontWeight: 'bold', marginTop: '1mm' }}>{settings.storeName}</div>
      </div>
    </div>
  );
}
