// ============================================================
// Automated Acceptance Tests Suite for TILE CRAFT POS
// Run via: npx tsx src/tests/acceptance.test.ts
// ============================================================

import { calculateItemTotal, calculateSubtotal, calculateTotal, calculateDebt, deriveReceiptStatus, validateMixedPayment } from '../utils/calculations';
import { generateReceiptNumber } from '../utils/receiptNumber';
import { EscPosFormatter } from '../services/printing/escposFormatter';
import type { Receipt, ReceiptSettings } from '../types';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

console.log('\n--- TILE CRAFT POS ACCEPTANCE TESTS --- \n');

// 1. Single product calculation
const item1Total = calculateItemTotal(10, 150000, 0);
assert(item1Total === 1500000, 'Scenario 1: Single product total calculation (10 * 150,000 = 1,500,000)');

// 2. Multiple products subtotal
const mockItems = [
  { id: '1', name: 'Item 1', model: 'M1', quantity: 2, unit: 'm²' as const, unitPrice: 50000, discount: 0, total: 100000 },
  { id: '2', name: 'Item 2', model: 'M2', quantity: 3, unit: 'kg' as const, unitPrice: 20000, discount: 0, total: 60000 },
];
const subtotal = calculateSubtotal(mockItems);
assert(subtotal === 160000, 'Scenario 2: Multiple products subtotal calculation (100k + 60k = 160k)');

// 3. Discount calculation
const totalWithDiscount = calculateTotal(160000, 10000);
assert(totalWithDiscount === 150000, 'Scenario 3: Total with discount (160k - 10k = 150k)');

// 4. Remaining debt calculation
const debt = calculateDebt(150000, 100000);
assert(debt === 50000, 'Scenario 4: Remaining debt calculation (150k - 100k = 50k)');

// 5. Unique receipt number generation
const num1 = generateReceiptNumber();
const num2 = generateReceiptNumber();
assert(num1 !== num2, `Scenario 5: Receipt numbers are unique (${num1} !== ${num2})`);
assert(/^TC-\d{4}-\d{6}$/.test(num1), `Scenario 6: Receipt number format matches TC-YYYY-NNNNNN (${num1})`);

// 6. Receipt status derivation
assert(deriveReceiptStatus(1000, 1000, 'naqd') === 'toʻliq', 'Scenario 7: Full payment status is "toʻliq"');
assert(deriveReceiptStatus(1000, 500, 'naqd') === 'qisman', 'Scenario 8: Partial payment status is "qisman"');
assert(deriveReceiptStatus(1000, 0, 'nasiya') === 'nasiya', 'Scenario 9: Debt payment status is "nasiya"');

// 7. Mixed payment validation
assert(validateMixedPayment(100000, 60000, 40000) === null, 'Scenario 10: Valid mixed payment returns null error');
assert(validateMixedPayment(100000, 50000, 40000) !== null, 'Scenario 11: Invalid mixed payment returns error string');

// 8. ESC/POS Formatting
const testReceipt: Receipt = {
  id: 'test-1',
  receiptNumber: 'TC-2026-000001',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  customer: { name: "O'ktam Qodirov", phone: '+998901234567' },
  seller: { name: 'Alisher B.' },
  items: [
    { id: '1', name: "Kafel 'O'zbekiston'", model: 'UZ-01', quantity: 10, unit: 'm²', unitPrice: 100000, discount: 0, total: 1000000 }
  ],
  subtotal: 1000000,
  discount: 0,
  total: 1000000,
  payment: { type: 'naqd', totalAmount: 1000000, paidAmount: 1000000, debtAmount: 0 },
  status: 'toʻliq',
  printCount: 0
};

const testSettings: ReceiptSettings = {
  storeName: 'TILE CRAFT',
  storeAddress: 'Toshkent',
  storePhone: '+998901234567',
  defaultPaperWidth: 80,
  defaultPrintMethod: 'browser',
  footerText: 'Rahmat!',
  autoPrintAfterSave: false,
  showCustomerInfo: true,
  showSellerInfo: true,
};

const escposBytes58 = EscPosFormatter.formatReceipt({ receipt: testReceipt, settings: testSettings, paperWidth: 58 });
const escposBytes80 = EscPosFormatter.formatReceipt({ receipt: testReceipt, settings: testSettings, paperWidth: 80 });

assert(escposBytes58.length > 50, 'Scenario 12: ESC/POS 58mm binary commands generated');
assert(escposBytes80.length > 50, 'Scenario 13: ESC/POS 80mm binary commands generated');

console.log(`\nResults: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  throw new Error(`${failed} acceptance test(s) failed`);
}
