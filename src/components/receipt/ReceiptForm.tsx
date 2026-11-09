// ============================================================
// Receipt Form — Create / Edit Receipt
// ============================================================

import { useState } from 'react';
import {
  Plus, Trash2, ChevronDown, AlertCircle, CheckCircle,
  User, Package, CreditCard, FileText
} from 'lucide-react';
import type { UnitOfMeasure, PaymentType, Receipt } from '@/types';
import { UNIT_LABELS, PAYMENT_TYPE_LABELS } from '@/types';
import { useReceiptForm } from '@/hooks/useReceiptForm';
import { formatCurrency, formatAmount } from '@/utils/currency';
import { useReceiptStore } from '@/context/receiptStore';
import { ReceiptPreview } from './ReceiptPreview';

const UNITS: UnitOfMeasure[] = ['dona', 'm²', 'quti', 'kg', 'metr', 'litr'];
const PAYMENT_TYPES: PaymentType[] = [
  'naqd', 'plastik_karta', 'bank_otkazmasi', 'aralash', 'nasiya',
];

interface ReceiptFormProps {
  existingReceipt?: Receipt;
  onSaved: (receipt: Receipt) => void;
  onCancel: () => void;
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="text-blue-600">{icon}</div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    </div>
  );
}

export function ReceiptForm({ existingReceipt, onSaved, onCancel }: ReceiptFormProps) {
  const { settings } = useReceiptStore();
  const { addReceipt, updateReceipt } = useReceiptStore();

  const {
    form, errors, setField, addItem, removeItem, updateItem, updateItemUnit,
    validate, buildReceipt, subtotal, totalDiscount, total, debt,
  } = useReceiptForm(existingReceipt);

  const [showPreview, setShowPreview] = useState(false);
  const [savedReceipt, setSavedReceipt] = useState<Receipt | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    if (!validate()) return;
    setIsSaving(true);

    setTimeout(() => {
      const receipt = buildReceipt();
      if (existingReceipt) {
        updateReceipt(receipt);
      } else {
        addReceipt(receipt);
      }
      setSavedReceipt(receipt);
      setIsSaving(false);
      setSaveSuccess(true);

      if (settings.autoPrintAfterSave) {
        setShowPreview(true);
      } else {
        onSaved(receipt);
      }
    }, 300);
  };

  const handlePreviewAndSave = () => {
    if (!validate()) return;
    const receipt = buildReceipt();
    if (existingReceipt) {
      updateReceipt(receipt);
    } else {
      addReceipt(receipt);
    }
    setSavedReceipt(receipt);
    setShowPreview(true);
  };

  const isNasiya = form.paymentType === 'nasiya';
  const isAralash = form.paymentType === 'aralash';

  return (
    <>
      <div className="space-y-6">
        {/* ── Customer Info ───────────────────────────────── */}
        <div className="card">
          <div className="card-body">
            <SectionTitle icon={<User size={18} />} title="Xaridor ma'lumotlari" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label-text">Xaridor ismi *</label>
                <input
                  type="text"
                  value={form.customerName}
                  onChange={(e) => setField('customerName', e.target.value)}
                  placeholder="Ism, familiya"
                  className={`input-field ${errors.customerName ? 'border-red-400 focus:ring-red-500' : ''}`}
                />
                {errors.customerName && (
                  <p className="error-text">{errors.customerName}</p>
                )}
              </div>
              <div>
                <label className="label-text">Telefon raqam</label>
                <input
                  type="tel"
                  value={form.customerPhone}
                  onChange={(e) => setField('customerPhone', e.target.value)}
                  placeholder="+998 90 000 00 00"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-text">Savdogar *</label>
                <input
                  type="text"
                  value={form.sellerName}
                  onChange={(e) => setField('sellerName', e.target.value)}
                  placeholder="Savdogar ismi"
                  className={`input-field ${errors.sellerName ? 'border-red-400 focus:ring-red-500' : ''}`}
                />
                {errors.sellerName && (
                  <p className="error-text">{errors.sellerName}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Products ─────────────────────────────────────── */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <SectionTitle icon={<Package size={18} />} title="Mahsulotlar" />
              <button onClick={addItem} className="btn-secondary text-xs">
                <Plus size={14} />
                Mahsulot qo'shish
              </button>
            </div>

            <div className="space-y-4">
              {form.items.map((item, idx) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-500 uppercase">
                      Mahsulot {idx + 1}
                    </span>
                    {form.items.length > 1 && (
                      <button
                        onClick={() => removeItem(item.id)}
                        className="btn-icon text-red-500 hover:bg-red-50"
                        title="O'chirish"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Name */}
                    <div className="sm:col-span-2">
                      <label className="label-text">Mahsulot nomi *</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        placeholder="Mahsulot nomi"
                        className={`input-field ${errors[`item_${idx}_name`] ? 'border-red-400' : ''}`}
                      />
                      {errors[`item_${idx}_name`] && (
                        <p className="error-text">{errors[`item_${idx}_name`]}</p>
                      )}
                    </div>

                    {/* Model */}
                    <div>
                      <label className="label-text">Model</label>
                      <input
                        type="text"
                        value={item.model}
                        onChange={(e) => updateItem(item.id, 'model', e.target.value)}
                        placeholder="Model raqami"
                        className="input-field"
                      />
                    </div>

                    {/* Unit */}
                    <div>
                      <label className="label-text">O'lchov birligi</label>
                      <div className="relative">
                        <select
                          value={item.unit}
                          onChange={(e) => updateItemUnit(item.id, e.target.value as UnitOfMeasure)}
                          className="select-field pr-8 appearance-none"
                        >
                          {UNITS.map((u) => (
                            <option key={u} value={u}>{UNIT_LABELS[u]}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="label-text">Miqdor *</label>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className={`input-field ${errors[`item_${idx}_qty`] ? 'border-red-400' : ''}`}
                      />
                      {errors[`item_${idx}_qty`] && (
                        <p className="error-text">{errors[`item_${idx}_qty`]}</p>
                      )}
                    </div>

                    {/* Unit Price */}
                    <div>
                      <label className="label-text">Narxi (so'm) *</label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className={`input-field ${errors[`item_${idx}_price`] ? 'border-red-400' : ''}`}
                      />
                      {errors[`item_${idx}_price`] && (
                        <p className="error-text">{errors[`item_${idx}_price`]}</p>
                      )}
                    </div>

                    {/* Discount */}
                    <div>
                      <label className="label-text">Chegirma (so'm)</label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={item.discount}
                        onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="input-field"
                      />
                    </div>

                    {/* Item Total */}
                    <div>
                      <label className="label-text">Jami</label>
                      <div className="input-field bg-gray-100 text-gray-700 font-semibold cursor-default">
                        {formatCurrency(item.total)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addItem}
              className="mt-4 w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Mahsulot qo'shish
            </button>
          </div>
        </div>

        {/* ── Payment ──────────────────────────────────────── */}
        <div className="card">
          <div className="card-body">
            <SectionTitle icon={<CreditCard size={18} />} title="To'lov ma'lumotlari" />

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Mahsulotlar summasi:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Chegirma:</span>
                  <span>-{formatCurrency(totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-2">
                <span>Jami to'lov:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Order Discount */}
              <div>
                <label className="label-text">Umumiy chegirma (so'm)</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={form.orderDiscount}
                  onChange={(e) => setField('orderDiscount', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="input-field"
                />
              </div>

              {/* Payment Type */}
              <div>
                <label className="label-text">To'lov turi *</label>
                <div className="relative">
                  <select
                    value={form.paymentType}
                    onChange={(e) => {
                      const type = e.target.value as PaymentType;
                      setField('paymentType', type);
                      if (type === 'nasiya') {
                        setField('paidAmount', 0);
                      }
                    }}
                    className="select-field pr-8 appearance-none"
                  >
                    {PAYMENT_TYPES.map((t) => (
                      <option key={t} value={t}>{PAYMENT_TYPE_LABELS[t]}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Paid Amount */}
              {!isNasiya && (
                <div>
                  <label className="label-text">To'langan summa (so'm)</label>
                  <input
                    type="number"
                    min="0"
                    max={total}
                    step="1000"
                    value={form.paidAmount}
                    onChange={(e) => setField('paidAmount', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className={`input-field ${errors.paidAmount ? 'border-red-400' : ''}`}
                  />
                  {errors.paidAmount && <p className="error-text">{errors.paidAmount}</p>}
                </div>
              )}

              {/* Mixed Payment Fields */}
              {isAralash && (
                <>
                  <div>
                    <label className="label-text">Naqd (so'm)</label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={form.cashAmount}
                      onChange={(e) => setField('cashAmount', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label-text">Karta (so'm)</label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={form.cardAmount}
                      onChange={(e) => setField('cardAmount', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="input-field"
                    />
                  </div>
                </>
              )}
            </div>

            {errors.mixed && (
              <div className="mt-3 flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {errors.mixed}
              </div>
            )}

            {/* Debt Summary */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600 font-medium">To'langan</p>
                <p className="text-lg font-bold text-blue-800">
                  {formatAmount(isNasiya ? 0 : form.paidAmount)} so'm
                </p>
              </div>
              <div className={`rounded-lg p-3 ${debt > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                <p className={`text-xs font-medium ${debt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  Qolgan qarz
                </p>
                <p className={`text-lg font-bold ${debt > 0 ? 'text-red-800' : 'text-green-800'}`}>
                  {formatAmount(isNasiya ? total : debt)} so'm
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Notes ────────────────────────────────────────── */}
        <div className="card">
          <div className="card-body">
            <SectionTitle icon={<FileText size={18} />} title="Izoh (ixtiyoriy)" />
            <textarea
              value={form.notes}
              onChange={(e) => setField('notes', e.target.value)}
              placeholder="Qo'shimcha ma'lumot..."
              rows={3}
              className="input-field resize-none"
            />
          </div>
        </div>

        {/* ── Error Summary ─────────────────────────────────── */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Formani to'ldirishda xatolar mavjud:
              </p>
              <ul className="mt-1 space-y-0.5">
                {Object.values(errors).map((err, i) => (
                  <li key={i} className="text-xs text-red-600">• {err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {saveSuccess && !showPreview && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle size={18} className="text-green-500" />
            <p className="text-sm text-green-800 font-medium">
              Chek muvaffaqiyatli saqlandi!
            </p>
          </div>
        )}

        {/* ── Action Buttons ────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end pb-4">
          <button onClick={onCancel} className="btn-secondary">
            Bekor qilish
          </button>
          <button onClick={handlePreviewAndSave} className="btn-secondary">
            Ko'rib chiqish va saqlash
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary"
          >
            {isSaving ? 'Saqlanmoqda...' : existingReceipt ? 'Yangilash' : 'Chekni saqlash'}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && savedReceipt && (
        <ReceiptPreview
          receipt={savedReceipt}
          settings={settings}
          onClose={() => {
            setShowPreview(false);
            onSaved(savedReceipt);
          }}
          onPrintSuccess={() => {
            // Print count updated internally
          }}
        />
      )}
    </>
  );
}
