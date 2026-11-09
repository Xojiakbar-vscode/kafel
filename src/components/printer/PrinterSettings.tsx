// ============================================================
// Settings Form
// ============================================================

import { useState } from 'react';
import { Save, RotateCcw, CheckCircle } from 'lucide-react';
import type { ReceiptSettings, PaperWidth, PrintMethod } from '@/types';
import { DEFAULT_SETTINGS } from '@/services/storage/receiptStorage';
import { useReceiptStore } from '@/context/receiptStore';

export function SettingsForm() {
  const { settings, updateSettings } = useReceiptStore();
  const [formData, setFormData] = useState<ReceiptSettings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setFormData(DEFAULT_SETTINGS);
    updateSettings(DEFAULT_SETTINGS);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold text-gray-900">Do'kon ma'lumotlari</h3>
        </div>
        <div className="card-body grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label-text">Do'kon nomi *</label>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label-text">Telefon raqam *</label>
            <input
              type="text"
              value={formData.storePhone}
              onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="label-text">Do'kon manzili *</label>
            <input
              type="text"
              value={formData.storeAddress}
              onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
              className="input-field"
              required
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold text-gray-900">Chop etish sozlamalari</h3>
        </div>
        <div className="card-body space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Standart qog'oz kengligi</label>
              <select
                value={formData.defaultPaperWidth}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    defaultPaperWidth: Number(e.target.value) as PaperWidth,
                  })
                }
                className="select-field"
              >
                <option value={80}>80 mm (Xprinter XP-80TS)</option>
                <option value={58}>58 mm</option>
              </select>
            </div>

            <div>
              <label className="label-text">Standart chop etish usuli</label>
              <select
                value={formData.defaultPrintMethod}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    defaultPrintMethod: e.target.value as PrintMethod,
                  })
                }
                className="select-field"
              >
                <option value="browser">Brauzer orqali (window.print)</option>
                <option value="webusb">WebUSB printer</option>
                <option value="native_bridge">Android Native Bridge</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label-text">Chek pastki matni (Footer)</label>
            <input
              type="text"
              value={formData.footerText}
              onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoPrintAfterSave}
                onChange={(e) =>
                  setFormData({ ...formData, autoPrintAfterSave: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">
                Chek saqlangandan so'ng avtomatik ko'rib chiqishni ochish
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showCustomerInfo}
                onChange={(e) =>
                  setFormData({ ...formData, showCustomerInfo: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Chekda xaridor ma'lumotlarini ko'rsatish</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.showSellerInfo}
                onChange={(e) =>
                  setFormData({ ...formData, showSellerInfo: e.target.checked })
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Chekda savdogar ismini ko'rsatish</span>
            </label>
          </div>
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle size={16} className="text-green-600" />
          <p className="text-sm text-green-800">Sozlamalar muvaffaqiyatli saqlandi!</p>
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <button type="button" onClick={handleReset} className="btn-secondary">
          <RotateCcw size={15} />
          Standart holatga qaytarish
        </button>
        <button type="submit" className="btn-primary">
          <Save size={15} />
          Sozlamalarni saqlash
        </button>
      </div>
    </form>
  );
}
