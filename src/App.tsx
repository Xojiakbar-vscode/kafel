// ============================================================
// Main Application Component
// ============================================================

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@/components/common/Header';
import { ReceiptsPage } from '@/pages/ReceiptsPage';
import { ReceiptCreatePage } from '@/pages/ReceiptCreatePage';
import { ReceiptSettingsPage } from '@/pages/ReceiptSettingsPage';

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Navigation Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Routes>
            <Route path="/" element={<ReceiptsPage />} />
            <Route path="/create" element={<ReceiptCreatePage />} />
            <Route path="/settings" element={<ReceiptSettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
            <div>
              <span className="font-semibold text-gray-700">TILE CRAFT POS</span> — Kafel va qurilish mollari do'koni
            </div>
            <div>
              Xprinter XP-80TS (58mm / 80mm) qo'llab-quvvatlanadi
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
