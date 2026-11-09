// ============================================================
// Settings Page
// ============================================================

import { SettingsForm } from '@/components/printer/PrinterSettings';
import { PrinterConnection } from '@/components/printer/PrinterConnection';

export function ReceiptSettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Sozlamalar</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Do'kon ma'lumotlari va chek chop etish konfiguratsiyasi
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <PrinterConnection />
        <SettingsForm />
      </div>
    </div>
  );
}
