// ============================================================
// Receipt Status Badge Component
// ============================================================

import type { ReceiptStatus } from '@/types';
import { STATUS_LABELS } from '@/types';

interface StatusBadgeProps {
  status: ReceiptStatus;
}

const statusClasses: Record<ReceiptStatus, string> = {
  "toʻliq": 'badge-success',
  qisman: 'badge-warning',
  nasiya: 'badge-danger',
  bekor: 'badge-gray',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge ${statusClasses[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
