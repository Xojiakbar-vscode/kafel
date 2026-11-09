# TILE CRAFT — Professional POS Receipt System

Professional, production-grade POS receipt generation and printing module built specifically for **TILE CRAFT**, a tile and construction materials retailer.

---

## 1. Implemented Features

### 🏢 Brand & UI
- **Branding**: Full TILE CRAFT visual identity, logo, typography, and color palette.
- **Language**: Complete Uzbek language localization (`so'm`, `dona`, `m²`, `quti`, `kg`, `metr`, `litr`, `To'liq to'langan`, `Qisman`, `Nasiya`).
- **Live Clock**: Dynamic real-time date and time display formatted in Uzbek style (`DD.MM.YYYY HH:mm:ss`).
- **Responsive Layout**: Desktop-first POS view, responsive grid, mobile-optimized card layout.

### 📊 Dashboard & Analytics
- **Today's Receipts Counter**: Instant count of receipts issued today.
- **Today's Sales**: Aggregate revenue for today.
- **Cash Breakdown**: Separate cash payments tracking.
- **Card Breakdown**: Separate card / terminal payments tracking.
- **Unpaid Debt Tracking**: Real-time aggregate of customer debt.

### 🧾 Receipt History Table
- **Search**: Search by receipt number (`TC-YYYY-NNNNNN`), customer name, or seller.
- **Multi-Filter**: Filter by date, payment method (Naqd, Karta, Aralash, Nasiya), and status (To'liq, Qisman, Nasiya).
- **Pagination**: 10 receipts per page with clear controls.
- **Actions per Receipt**:
  - 👁️ **Ko'rish**: Open instant receipt preview modal.
  - 🖨️ **Chop etish**: One-click thermal printing (58mm / 80mm).
  - 📥 **PDF**: Direct structured vector PDF download.
  - 🗑️ **O'chirish**: Deletion with confirmation modal.

### ➕ Receipt Creation
- **Customer details**: Name, phone number, and seller name.
- **Product list**:
  - Add / remove products dynamically.
  - Name, model, quantity, unit of measurement, unit price, and discount.
  - Supported units: `dona`, `m²`, `quti`, `kg`, `metr`, `litr`.
  - Non-negative validation on prices, discounts, and quantities.
  - Instant live recalculation of subtotal, discounts, and total.
- **Payment processing**:
  - Methods: `Naqd`, `Plastik karta`, `Bank o'tkazmasi`, `Aralash to'lov`, `Nasiya`.
  - Mixed payment breakdown: split into cash and card with balance validation.
  - Automatic debt calculation: `Debt = Total - Paid`.
  - Automatic status derivation: `To'liq to'langan`, `Qisman`, `Nasiya`.
- **Unique Receipt Number**:
  - Automatically generated: `TC-YYYY-NNNNNN` (e.g. `TC-2026-000001`).
  - Strict uniqueness preserved in `localStorage`.
  - Historical receipt numbers never change during reprinting or viewing.

### 🖨️ Professional Thermal Templates
- **Template A (58 mm)**: Ultra-compact, high-contrast, strictly black & white, no clipping.
- **Template B (80 mm)**: Optimized for **Xprinter XP-80TS**, clear structured dividers, bold headings.
- Dynamic switching between 58mm and 80mm in the preview dialog.
- Proper handling of long product names (CSS word wrapping and hyphenation).
- Uzbek characters support (`o'`, `g'`, `sh`, `ch`, etc.).

### 🔌 Multi-Layer Printing Architecture
- **Browser Print (`window.print`)**: Zero-dependency print path with thermal `@page` media rules hiding all UI elements.
- **ESC/POS Command Generator**: Complete binary command pipeline (`INIT`, `ALIGN`, `BOLD`, `CUT`, `FEED`) ready for raw stream transmission.
- **WebUSB Driver**: Native WebUSB capability detection, device request dialog (`navigator.usb.requestDevice`), vendor ID filtering (`0x0416`, `0x04b8`, etc.), bulk endpoint discovery, and transfer.
- **Android Native Bridge Interface**: Fully typed `window.TileCraftPrinterBridge` specification for integration with Android USB Host API in WebView wrappers.
- **Graceful Fallbacks**: When hardware is unavailable, falls back gracefully to Browser Print or PDF download.

### 📄 PDF Generation (jsPDF)
- Vector-based PDF generation matching thermal paper dimensions (58mm and 80mm).
- Dynamic page height based on the exact line count.
- Native Unicode support for Uzbek text.

### ⚙️ Settings
- Store name, address, phone number.
- Default paper width (58mm / 80mm).
- Default printing method.
- Custom receipt footer note.
- Auto-preview after save toggle.

---

## 2. Project Folder Structure

```text
muhammadali/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── tile-craft.svg
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── components/
    │   ├── common/
    │   │   ├── ConfirmModal.tsx
    │   │   ├── EmptyState.tsx
    │   │   ├── Header.tsx
    │   │   ├── PaymentBadge.tsx
    │   │   └── StatusBadge.tsx
    │   ├── printer/
    │   │   ├── PrinterConnection.tsx
    │   │   └── PrinterSettings.tsx
    │   └── receipt/
    │       ├── DailyStatsCards.tsx
    │       ├── ReceiptForm.tsx
    │       ├── ReceiptHistory.tsx
    │       ├── ReceiptPreview.tsx
    │       ├── ReceiptTemplate58.tsx
    │       └── ReceiptTemplate80.tsx
    ├── context/
    │   └── receiptStore.ts
    ├── hooks/
    │   ├── useLiveClock.ts
    │   └── useReceiptForm.ts
    ├── mocks/
    │   └── receipts.ts
    ├── pages/
    │   ├── ReceiptCreatePage.tsx
    │   ├── ReceiptsPage.tsx
    │   └── ReceiptSettingsPage.tsx
    ├── services/
    │   ├── pdf/
    │   │   └── pdfService.ts
    │   ├── printing/
    │   │   ├── browserPrint.ts
    │   │   ├── escposFormatter.ts
    │   │   ├── nativeBridge.ts
    │   │   ├── printerDetection.ts
    │   │   ├── printingService.ts
    │   │   └── usbPrinter.ts
    │   └── storage/
    │       └── receiptStorage.ts
    ├── styles/
    │   └── receipt-print.css
    ├── types/
    │   ├── index.ts
    │   └── webusb.ts
    └── utils/
        ├── calculations.ts
        ├── currency.ts
        ├── date.ts
        └── receiptNumber.ts
```

---

## 3. Installation & Run Instructions

```bash
# 1. Enter the project folder
cd /home/xojiakbar/Documents/loyihalar/muhammadali

# 2. Dependencies are already installed! If needed:
npm install

# 3. Start local development server
npm run dev

# 4. Check TypeScript types
npm run type-check

# 5. Build for production
npm run build
```

---

## 4. How to Test 58 mm and 80 mm Printing

1. **In the Web Interface**:
   - Go to `http://localhost:5173`.
   - Click on the eye icon (👁️) or printer icon (🖨️) on any receipt row.
   - In the modal header, click `58 mm` or `80 mm` to toggle between templates in real time.
2. **Browser Print Test (`window.print`)**:
   - Click **Chop etish** in the modal.
   - The browser print preview will open with dedicated thermal styles.
   - Notice navigation, headers, buttons, and backgrounds are automatically hidden.
   - Select paper size: `58mm` or `80mm` roll.
3. **PDF Test**:
   - Click **PDF yuklab olish** in the modal.
   - Inspect the downloaded `.pdf` file. It renders with precise thermal dimensions (58mm or 80mm width with dynamic height).
4. **Physical Xprinter XP-80TS (USB)**:
   - Navigate to `/settings`.
   - Under **Printer ulanishi**, if using Chrome/Edge, click **USB printerga ulanish**.
   - Select your connected Xprinter from the browser's WebUSB dialog.

---

## 5. What is Ready for Production

✅ Complete React 18 + TypeScript POS frontend application.  
✅ Thermal-optimized 58 mm & 80 mm layouts strictly matching retail receipts.  
✅ ESC/POS binary command formatting with cutters and line feeds.  
✅ jsPDF generation with custom dynamic heights.  
✅ Full Uzbek localization and currency formatting (`so'm`).  
✅ LocalStorage data persistence and incremental receipt numbering (`TC-2026-XXXXXX`).  
✅ Product calculation engine (gross, discounts, net, debt, mixed payments).  
✅ Re-print support without mutating historical records.  

---

## 6. What Requires a Future Android Native Application

Normal mobile browsers (Chrome on Android, Samsung Internet) do NOT grant raw USB permissions to standard web pages for low-level USB Host API access. For production deployment on Android POS terminals:

1. **Android WebView Wrapper**:
   - An Android Java / Kotlin application containing a `WebView`.
   - Utilizes `android.hardware.usb.UsbManager` to claim the Xprinter USB interface with `android.permission.USB_PERMISSION`.
2. **JavaScript Interface**:
   - The Android app injects an object into the WebView:
     ```kotlin
     webView.addJavascriptInterface(AndroidPrinterBridge(), "TileCraftPrinterBridge")
     ```
   - Our frontend already implements the detection and typing for `window.TileCraftPrinterBridge` in `src/services/printing/nativeBridge.ts`.

---

## 7. What Requires Backend Integration

When TILE CRAFT connects to a centralized multi-terminal server:
1. **Receipt Numbering Authority**:
   - Replace client `localStorage` counter with an atomic database sequence (`TC-YYYY-000001`) to guarantee uniqueness across multiple cash registers.
2. **REST API Client**:
   - Point `src/services/storage/receiptStorage.ts` to API endpoints (`POST /api/v1/receipts`, `GET /api/v1/receipts`).
3. **Cashier Authentication**:
   - Tie seller information to JWT / session tokens rather than manual name inputs.
