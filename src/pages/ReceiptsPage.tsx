// ============================================================
// Receipts Page (Main Page)
// ============================================================

import { useEffect } from 'react';
import { DailyStatsCards } from '@/components/receipt/DailyStatsCards';
import { ReceiptHistory } from '@/components/receipt/ReceiptHistory';
import { useReceiptStore } from '@/context/receiptStore';
import { seedMockData } from '@/mocks/receipts';

export function ReceiptsPage() {
  const { loadReceipts } = useReceiptStore();

  useEffect(() => {
    seedMockData();
    loadReceipts();
  }, [loadReceipts]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Cheklar</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Barcha cheklar, to'lovlar va qarzdorliklar tarixi
          </p>
        </div>
      </div>

      {/* Daily Statistics */}
      <DailyStatsCards />

      {/* Receipts Table */}
      <ReceiptHistory />
    </div>
  );
}
