// ============================================================
// TILE CRAFT POS — Core Type Definitions
// ============================================================

export type PaymentType =
  | 'naqd'
  | 'plastik_karta'
  | 'bank_otkazmasi'
  | 'aralash'
  | 'nasiya';

export type ReceiptStatus = 'toʻliq' | 'qisman' | 'nasiya' | 'bekor';

export type UnitOfMeasure = 'dona' | 'm²' | 'quti' | 'kg' | 'metr' | 'litr';

export type PaperWidth = 58 | 80;

export type PrintMethod = 'browser' | 'webusb' | 'native_bridge' | 'pdf';

// ============================================================
// Receipt Item
// ============================================================
export interface ReceiptItem {
  id: string;
  name: string;
  model: string;
  quantity: number;
  unit: UnitOfMeasure;
  unitPrice: number;
  discount: number; // absolute UZS value
  total: number; // (quantity * unitPrice) - discount
}

// ============================================================
// Payment
// ============================================================
export interface Payment {
  type: PaymentType;
  totalAmount: number;
  paidAmount: number;
  debtAmount: number;
  cashAmount?: number;    // for mixed payment
  cardAmount?: number;    // for mixed payment
}

// ============================================================
// Customer
// ============================================================
export interface Customer {
  name: string;
  phone: string;
}

// ============================================================
// Seller
// ============================================================
export interface Seller {
  name: string;
}

// ============================================================
// Receipt
// ============================================================
export interface Receipt {
  id: string;
  receiptNumber: string;         // e.g. TC-2026-000001
  createdAt: string;             // ISO 8601
  updatedAt: string;             // ISO 8601
  customer: Customer;
  seller: Seller;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  total: number;
  payment: Payment;
  status: ReceiptStatus;
  notes?: string;
  printCount: number;
}

// ============================================================
// Receipt Settings
// ============================================================
export interface ReceiptSettings {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  defaultPaperWidth: PaperWidth;
  defaultPrintMethod: PrintMethod;
  footerText: string;
  autoPrintAfterSave: boolean;
  showCustomerInfo: boolean;
  showSellerInfo: boolean;
}

// ============================================================
// Printer Status
// ============================================================
export type PrinterConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error'
  | 'unsupported';

export interface PrinterStatus {
  state: PrinterConnectionState;
  method: PrintMethod | null;
  deviceName?: string;
  errorMessage?: string;
  webUsbSupported: boolean;
  nativeBridgeAvailable: boolean;
}

// ============================================================
// Receipt Print Data (for printing services)
// ============================================================
export interface ReceiptPrintData {
  receipt: Receipt;
  settings: ReceiptSettings;
  paperWidth: PaperWidth;
}

// ============================================================
// Native Android Bridge Interface
// (Future integration point for Android USB Host API)
// ============================================================
export interface NativePrinterBridge {
  requestUsbPermission(): Promise<boolean>;
  connectPrinter(): Promise<boolean>;
  printReceipt(data: ReceiptPrintData): Promise<boolean>;
  disconnectPrinter(): Promise<void>;
  getPrinterStatus(): Promise<PrinterStatus>;
}

// ============================================================
// Storage Keys
// ============================================================
export const STORAGE_KEYS = {
  RECEIPTS: 'tilecraft_receipts',
  RECEIPT_COUNTER: 'tilecraft_receipt_counter',
  SETTINGS: 'tilecraft_settings',
  PRINTER_PREFS: 'tilecraft_printer_prefs',
} as const;

// ============================================================
// Payment Type Labels
// ============================================================
export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  naqd: 'Naqd',
  plastik_karta: 'Plastik karta',
  bank_otkazmasi: "Bank o'tkazmasi",
  aralash: "Aralash to'lov",
  nasiya: 'Nasiya',
};

export const UNIT_LABELS: Record<UnitOfMeasure, string> = {
  dona: 'dona',
  'm²': 'm²',
  quti: 'quti',
  kg: 'kg',
  metr: 'metr',
  litr: 'litr',
};

export const STATUS_LABELS: Record<ReceiptStatus, string> = {
  "toʻliq": "To'liq to'langan",
  qisman: "Qisman to'langan",
  nasiya: 'Nasiya',
  bekor: 'Bekor qilingan',
};
