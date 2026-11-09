// ============================================================
// Receipt Create Page
// ============================================================

import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ReceiptForm } from '@/components/receipt/ReceiptForm';
import type { Receipt } from '@/types';

export function ReceiptCreatePage() {
  const navigate = useNavigate();

  const handleSaved = (_receipt: Receipt) => {
    navigate('/');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button and page title */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn-icon">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Yangi chek yaratish</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Xaridor va mahsulot ma'lumotlarini kiriting
          </p>
        </div>
      </div>

      <ReceiptForm onSaved={handleSaved} onCancel={() => navigate('/')} />
    </div>
  );
}
