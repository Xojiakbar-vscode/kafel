// ============================================================
// Realistic Mock Data for TILE CRAFT POS
// ============================================================

import type { Receipt } from '@/types';

export const MOCK_RECEIPTS: Receipt[] = [
  {
    id: 'mock-001',
    receiptNumber: 'TC-2026-000001',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    customer: { name: 'Alisher Nazarov', phone: '+998 90 111 22 33' },
    seller: { name: 'Sardor Toshmatov' },
    items: [
      {
        id: 'item-001-1',
        name: 'Italiya kafelь "Marazzi"',
        model: 'MRZ-60x60-BG',
        quantity: 20,
        unit: 'm²',
        unitPrice: 85000,
        discount: 0,
        total: 1700000,
      },
      {
        id: 'item-001-2',
        name: 'Plitka yopishtiruvchi "Ceresit"',
        model: 'CM-11',
        quantity: 5,
        unit: 'quti',
        unitPrice: 42000,
        discount: 10000,
        total: 200000,
      },
    ],
    subtotal: 1910000,
    discount: 10000,
    total: 1900000,
    payment: {
      type: 'plastik_karta',
      totalAmount: 1900000,
      paidAmount: 1900000,
      debtAmount: 0,
    },
    status: "toʻliq",
    printCount: 1,
  },
  {
    id: 'mock-002',
    receiptNumber: 'TC-2026-000002',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    customer: { name: 'Malika Yusupova', phone: '+998 93 444 55 66' },
    seller: { name: 'Zafar Rahimov' },
    items: [
      {
        id: 'item-002-1',
        name: 'Granit plitka "Porcelanosa"',
        model: 'PRC-80x80-GR',
        quantity: 35,
        unit: 'm²',
        unitPrice: 120000,
        discount: 50000,
        total: 4150000,
      },
    ],
    subtotal: 4200000,
    discount: 50000,
    total: 4150000,
    payment: {
      type: 'aralash',
      totalAmount: 4150000,
      paidAmount: 3000000,
      debtAmount: 1150000,
      cashAmount: 1500000,
      cardAmount: 1500000,
    },
    status: 'qisman',
    printCount: 2,
  },
  {
    id: 'mock-003',
    receiptNumber: 'TC-2026-000003',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    customer: { name: "Bobur To'xtasinov", phone: '+998 91 777 88 99' },
    seller: { name: 'Sardor Toshmatov' },
    items: [
      {
        id: 'item-003-1',
        name: 'Devor mozaikasi "Ametista"',
        model: 'AMT-30x30-WH',
        quantity: 15,
        unit: 'm²',
        unitPrice: 65000,
        discount: 0,
        total: 975000,
      },
      {
        id: 'item-003-2',
        name: 'Fuga "Mapei Ultracolor"',
        model: 'UC-114-CH',
        quantity: 10,
        unit: 'kg',
        unitPrice: 18000,
        discount: 0,
        total: 180000,
      },
      {
        id: 'item-003-3',
        name: 'Plitka gidroizolyatsiya',
        model: 'HI-5KG',
        quantity: 3,
        unit: 'kg',
        unitPrice: 55000,
        discount: 0,
        total: 165000,
      },
    ],
    subtotal: 1320000,
    discount: 0,
    total: 1320000,
    payment: {
      type: 'nasiya',
      totalAmount: 1320000,
      paidAmount: 0,
      debtAmount: 1320000,
    },
    status: 'nasiya',
    printCount: 1,
  },
  {
    id: 'mock-004',
    receiptNumber: 'TC-2026-000004',
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // yesterday
    updatedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    customer: { name: 'Shahlo Ergasheva', phone: '+998 94 222 33 44' },
    seller: { name: 'Zafar Rahimov' },
    items: [
      {
        id: 'item-004-1',
        name: 'Pol plitka "Estima Ceramica"',
        model: 'EC-45x45-BG',
        quantity: 50,
        unit: 'm²',
        unitPrice: 48000,
        discount: 0,
        total: 2400000,
      },
    ],
    subtotal: 2400000,
    discount: 0,
    total: 2400000,
    payment: {
      type: 'naqd',
      totalAmount: 2400000,
      paidAmount: 2400000,
      debtAmount: 0,
    },
    status: "toʻliq",
    printCount: 1,
  },
  {
    id: 'mock-005',
    receiptNumber: 'TC-2026-000005',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    customer: { name: 'Nodir Qodirov', phone: '+998 97 555 66 77' },
    seller: { name: 'Sardor Toshmatov' },
    items: [
      {
        id: 'item-005-1',
        name: 'Ispaniya kafelь "Keraben Premium Ultra Long Name For Testing Wrapping"',
        model: 'KPL-60x120-WH-PREMIUM',
        quantity: 8,
        unit: 'm²',
        unitPrice: 210000,
        discount: 100000,
        total: 1580000,
      },
    ],
    subtotal: 1680000,
    discount: 100000,
    total: 1580000,
    payment: {
      type: 'naqd',
      totalAmount: 1580000,
      paidAmount: 1580000,
      debtAmount: 0,
    },
    status: "toʻliq",
    printCount: 0,
  },
];

/**
 * Load mock data into localStorage if no data exists
 */
export function seedMockData(): void {
  const key = 'tilecraft_receipts';
  const existing = localStorage.getItem(key);
  if (!existing || JSON.parse(existing).length === 0) {
    localStorage.setItem(key, JSON.stringify(MOCK_RECEIPTS));
    // Set counter to 5
    const year = new Date().getFullYear();
    localStorage.setItem(`tilecraft_receipt_counter_${year}`, '5');
  }
}
