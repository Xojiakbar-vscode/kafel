// ============================================================
// Receipt History — searchable, filterable table
// ============================================================

import { useState, useMemo } from 'react';
import {
  Search, Filter, Eye, Printer, Download,
  Trash2, ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';
import type { Receipt, PaymentType, ReceiptStatus, PaperWidth } from '@/types';
import { PAYMENT_TYPE_LABELS, STATUS_LABELS } from '@/types';
import { formatDateTime } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';
import { StatusBadge } from '@/components/common/StatusBadge';
import { PaymentBadge } from '@/components/common/PaymentBadge';
import { EmptyState } from '@/components/common/EmptyState';
import { ConfirmModal } from '@/components/common/ConfirmModal';
import { ReceiptPreview } from './ReceiptPreview';
import { pdfService } from '@/services/pdf/pdfService';
import { useReceiptStore } from '@/context/receiptStore';

const PAGE_SIZE = 10;

interface Filters {
  search: string;
  date: string;
  paymentType: PaymentType | '';
  status: ReceiptStatus | '';
}

export function ReceiptHistory() {
  const { receipts, settings, removeReceipt, loadReceipts } = useReceiptStore();

  const [filters, setFilters] = useState<Filters>({
    search: '',
    date: '',
    paymentType: '',
    status: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [previewReceipt, setPreviewReceipt] = useState<Receipt | null>(null);
  const [previewWidth, setPreviewWidth] = useState<PaperWidth>(settings.defaultPaperWidth);
  const [deleteTarget, setDeleteTarget] = useState<Receipt | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // ── Filter Logic ───────────────────────────────────────────
  const filtered = useMemo(() => {
    return receipts.filter((r) => {
      const searchLower = filters.search.toLowerCase();
      const matchSearch =
        !filters.search ||
        r.receiptNumber.toLowerCase().includes(searchLower) ||
        r.customer.name.toLowerCase().includes(searchLower) ||
        r.seller.name.toLowerCase().includes(searchLower);

      const matchDate =
        !filters.date ||
        new Date(r.createdAt).toISOString().startsWith(filters.date);

      const matchPayment =
        !filters.paymentType || r.payment.type === filters.paymentType;

      const matchStatus = !filters.status || r.status === filters.status;

      return matchSearch && matchDate && matchPayment && matchStatus;
    });
  }, [receipts, filters]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleFilterChange = <K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleDelete = (receipt: Receipt) => {
    setDeleteTarget(receipt);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      removeReceipt(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  const handleDownloadPdf = async (receipt: Receipt, width: PaperWidth) => {
    setDownloadingId(receipt.id);
    try {
      await pdfService.generateAndDownload({ receipt, settings, paperWidth: width });
    } finally {
      setDownloadingId(null);
      loadReceipts();
    }
  };

  const handleView = (receipt: Receipt, width?: PaperWidth) => {
    setPreviewWidth(width ?? settings.defaultPaperWidth);
    setPreviewReceipt(receipt);
  };

  const clearFilters = () => {
    setFilters({ search: '', date: '', paymentType: '', status: '' });
    setCurrentPage(1);
  };

  const hasFilters =
    filters.search || filters.date || filters.paymentType || filters.status;

  return (
    <div className="card">
      {/* ── Filter Bar ──────────────────────────────────────── */}
      <div className="card-header">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Chek raqami, xaridor..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input-field pl-9"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={15} className="text-gray-400" />

            <input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange('date', e.target.value)}
              className="select-field w-auto"
            />

            <select
              value={filters.paymentType}
              onChange={(e) => handleFilterChange('paymentType', e.target.value as PaymentType | '')}
              className="select-field w-auto"
            >
              <option value="">Barcha to'lovlar</option>
              {(Object.entries(PAYMENT_TYPE_LABELS) as [PaymentType, string][]).map(
                ([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                )
              )}
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value as ReceiptStatus | '')}
              className="select-field w-auto"
            >
              <option value="">Barcha statuslar</option>
              {(Object.entries(STATUS_LABELS) as [ReceiptStatus, string][]).map(
                ([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                )
              )}
            </select>

            {hasFilters && (
              <button onClick={clearFilters} className="btn-ghost text-xs">
                <RefreshCw size={13} />
                Tozalash
              </button>
            )}
          </div>
        </div>

        <div className="mt-2 text-xs text-gray-500">
          {filtered.length} ta chek topildi
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────── */}
      <div className="table-container">
        {paginated.length === 0 ? (
          <EmptyState
            title="Cheklar topilmadi"
            description={
              hasFilters
                ? 'Filtrlash shartlariga mos chek yo\'q. Filtrlarni tozalang.'
                : 'Hozircha cheklar mavjud emas.'
            }
            action={
              hasFilters ? (
                <button onClick={clearFilters} className="btn-secondary">
                  Filtrlarni tozalash
                </button>
              ) : undefined
            }
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Chek raqami</th>
                <th>Sana</th>
                <th>Xaridor</th>
                <th>Savdogar</th>
                <th className="text-center">Mahsulotlar</th>
                <th className="text-right">Jami summa</th>
                <th className="text-right">To'langan</th>
                <th className="text-right">Qarz</th>
                <th>To'lov turi</th>
                <th>Status</th>
                <th className="text-center">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((receipt) => (
                <tr key={receipt.id}>
                  <td>
                    <span className="font-mono text-xs font-semibold text-blue-700">
                      {receipt.receiptNumber}
                    </span>
                  </td>
                  <td className="text-xs text-gray-500 whitespace-nowrap">
                    {formatDateTime(receipt.createdAt)}
                  </td>
                  <td>
                    <div className="text-sm font-medium text-gray-900">
                      {receipt.customer.name}
                    </div>
                    {receipt.customer.phone && (
                      <div className="text-xs text-gray-400">{receipt.customer.phone}</div>
                    )}
                  </td>
                  <td className="text-sm">{receipt.seller.name}</td>
                  <td className="text-center">
                    <span className="badge badge-gray">{receipt.items.length}</span>
                  </td>
                  <td className="text-right font-medium text-sm">
                    {formatCurrency(receipt.total)}
                  </td>
                  <td className="text-right text-sm text-green-700">
                    {formatCurrency(receipt.payment.paidAmount)}
                  </td>
                  <td className="text-right text-sm">
                    {receipt.payment.debtAmount > 0 ? (
                      <span className="text-red-600 font-medium">
                        {formatCurrency(receipt.payment.debtAmount)}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td><PaymentBadge type={receipt.payment.type} /></td>
                  <td><StatusBadge status={receipt.status} /></td>
                  <td>
                    <div className="flex items-center justify-center gap-1">
                      {/* View */}
                      <button
                        onClick={() => handleView(receipt)}
                        className="btn-icon"
                        title="Ko'rish"
                      >
                        <Eye size={15} />
                      </button>

                      {/* Reprint 80mm */}
                      <button
                        onClick={() => handleView(receipt, 80)}
                        className="btn-icon"
                        title="80mm chop etish"
                      >
                        <Printer size={15} />
                      </button>

                      {/* Download PDF */}
                      <button
                        onClick={() => handleDownloadPdf(receipt, settings.defaultPaperWidth)}
                        disabled={downloadingId === receipt.id}
                        className="btn-icon"
                        title="PDF yuklab olish"
                      >
                        <Download size={15} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(receipt)}
                        className="btn-icon text-red-500 hover:bg-red-50"
                        title="O'chirish"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ───────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} / {filtered.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn-icon"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn-icon"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewReceipt && (
        <ReceiptPreview
          receipt={previewReceipt}
          settings={settings}
          defaultPaperWidth={previewWidth}
          onClose={() => {
            setPreviewReceipt(null);
            loadReceipts();
          }}
          onPrintSuccess={loadReceipts}
        />
      )}

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Chekni o'chirish"
        message={`"${deleteTarget?.receiptNumber}" chekini o'chirishni tasdiqlaysizmi? Bu amal qaytarilmaydi.`}
        confirmLabel="Ha, o'chirish"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
