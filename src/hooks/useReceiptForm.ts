// ============================================================
// useReceipt Form Hook — manages receipt creation state
// ============================================================

import { useState, useCallback } from 'react';
import type {
  ReceiptItem,
  PaymentType,
  UnitOfMeasure,
  Receipt,
} from '@/types';
import {
  calculateItemTotal,
  calculateSubtotal,
  calculateItemsDiscount,
  calculateTotal,
  calculateDebt,
  buildPayment,
  deriveReceiptStatus,
  validateMixedPayment,
} from '@/utils/calculations';
import { generateId, generateReceiptNumber } from '@/utils/receiptNumber';
import { nowISO } from '@/utils/date';
import { clampPositive } from '@/utils/currency';

export interface ReceiptFormState {
  customerName: string;
  customerPhone: string;
  sellerName: string;
  items: ReceiptItem[];
  orderDiscount: number;
  paidAmount: number;
  paymentType: PaymentType;
  cashAmount: number;
  cardAmount: number;
  notes: string;
}

function newItem(): ReceiptItem {
  return {
    id: generateId(),
    name: '',
    model: '',
    quantity: 1,
    unit: 'dona',
    unitPrice: 0,
    discount: 0,
    total: 0,
  };
}

function initialState(): ReceiptFormState {
  return {
    customerName: '',
    customerPhone: '',
    sellerName: '',
    items: [newItem()],
    orderDiscount: 0,
    paidAmount: 0,
    paymentType: 'naqd',
    cashAmount: 0,
    cardAmount: 0,
    notes: '',
  };
}

export function useReceiptForm(existingReceipt?: Receipt) {
  const [form, setForm] = useState<ReceiptFormState>(() => {
    if (existingReceipt) {
      return {
        customerName: existingReceipt.customer.name,
        customerPhone: existingReceipt.customer.phone,
        sellerName: existingReceipt.seller.name,
        items: existingReceipt.items,
        orderDiscount: existingReceipt.discount,
        paidAmount: existingReceipt.payment.paidAmount,
        paymentType: existingReceipt.payment.type,
        cashAmount: existingReceipt.payment.cashAmount ?? 0,
        cardAmount: existingReceipt.payment.cardAmount ?? 0,
        notes: existingReceipt.notes ?? '',
      };
    }
    return initialState();
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // ── Computed Values ───────────────────────────────────────
  const subtotal = calculateSubtotal(form.items);
  const itemsDiscount = calculateItemsDiscount(form.items);
  const totalDiscount = itemsDiscount + form.orderDiscount;
  const total = calculateTotal(subtotal, totalDiscount);
  const debt = calculateDebt(total, form.paidAmount);

  // ── Field Updates ──────────────────────────────────────────
  const setField = useCallback(<K extends keyof ReceiptFormState>(
    key: K,
    value: ReceiptFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  // ── Item Operations ───────────────────────────────────────
  const addItem = useCallback(() => {
    setForm((prev) => ({ ...prev, items: [...prev.items, newItem()] }));
  }, []);

  const removeItem = useCallback((id: string) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.length > 1 ? prev.items.filter((i) => i.id !== id) : prev.items,
    }));
  }, []);

  const updateItem = useCallback(
    (id: string, field: keyof ReceiptItem, value: string | number) => {
      setForm((prev) => ({
        ...prev,
        items: prev.items.map((item) => {
          if (item.id !== id) return item;
          const updated = { ...item, [field]: value } as ReceiptItem;
          // Recalculate item total
          if (
            field === 'quantity' ||
            field === 'unitPrice' ||
            field === 'discount'
          ) {
            updated.quantity = clampPositive(Number(updated.quantity));
            updated.unitPrice = clampPositive(Number(updated.unitPrice));
            updated.discount = clampPositive(Number(updated.discount));
            updated.total = calculateItemTotal(
              updated.quantity,
              updated.unitPrice,
              updated.discount
            );
          }
          return updated;
        }),
      }));
    },
    []
  );

  const updateItemUnit = useCallback((id: string, unit: UnitOfMeasure) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, unit } : item)),
    }));
  }, []);

  // ── Validation ─────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.customerName.trim()) {
      newErrors.customerName = 'Xaridor ismini kiriting';
    }
    if (!form.sellerName.trim()) {
      newErrors.sellerName = 'Savdogar ismini kiriting';
    }

    form.items.forEach((item, idx) => {
      if (!item.name.trim()) {
        newErrors[`item_${idx}_name`] = `${idx + 1}-mahsulot nomi kiritilmagan`;
      }
      if (item.unitPrice <= 0) {
        newErrors[`item_${idx}_price`] = `${idx + 1}-mahsulot narxi 0 dan katta bo'lishi kerak`;
      }
      if (item.quantity <= 0) {
        newErrors[`item_${idx}_qty`] = `${idx + 1}-mahsulot miqdori 0 dan katta bo'lishi kerak`;
      }
    });

    if (form.paymentType === 'aralash') {
      const mixedError = validateMixedPayment(form.paidAmount, form.cashAmount, form.cardAmount);
      if (mixedError) newErrors.mixed = mixedError;
    }

    if (form.paidAmount < 0) {
      newErrors.paidAmount = "To'langan summa manfiy bo'lmasin";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Build Receipt ──────────────────────────────────────────
  const buildReceipt = useCallback((): Receipt => {
    const id = existingReceipt?.id ?? generateId();
    const receiptNumber = existingReceipt?.receiptNumber ?? generateReceiptNumber();
    const now = nowISO();

    const payment = buildPayment(
      total,
      form.paidAmount,
      form.paymentType,
      form.cashAmount,
      form.cardAmount
    );

    const status = deriveReceiptStatus(total, form.paidAmount, form.paymentType);

    return {
      id,
      receiptNumber,
      createdAt: existingReceipt?.createdAt ?? now,
      updatedAt: now,
      customer: { name: form.customerName.trim(), phone: form.customerPhone.trim() },
      seller: { name: form.sellerName.trim() },
      items: form.items.filter((i) => i.name.trim()),
      subtotal,
      discount: totalDiscount,
      total,
      payment,
      status,
      notes: form.notes.trim() || undefined,
      printCount: existingReceipt?.printCount ?? 0,
    };
  }, [form, total, subtotal, totalDiscount, existingReceipt]);

  const reset = useCallback(() => {
    setForm(initialState());
    setErrors({});
  }, []);

  return {
    form,
    errors,
    setField,
    addItem,
    removeItem,
    updateItem,
    updateItemUnit,
    validate,
    buildReceipt,
    reset,
    // Computed
    subtotal,
    itemsDiscount,
    totalDiscount,
    total,
    debt,
  };
}
