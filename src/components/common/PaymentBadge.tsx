// ============================================================
// Payment Type Badge
// ============================================================

import type { PaymentType } from '@/types';
import { PAYMENT_TYPE_LABELS } from '@/types';

const paymentClasses: Record<PaymentType, string> = {
  naqd: 'badge-info',
  plastik_karta: 'badge-info',
  bank_otkazmasi: 'badge-info',
  aralash: 'badge-warning',
  nasiya: 'badge-danger',
};

export function PaymentBadge({ type }: { type: PaymentType }) {
  return (
    <span className={`badge ${paymentClasses[type]}`}>
      {PAYMENT_TYPE_LABELS[type]}
    </span>
  );
}
