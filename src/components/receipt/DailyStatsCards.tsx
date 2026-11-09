// ============================================================
// Daily Statistics Cards
// ============================================================

import { ReceiptText, DollarSign, CreditCard, Banknote, AlertCircle } from 'lucide-react';
import { useReceiptStore } from '@/context/receiptStore';
import { formatAmount } from '@/utils/currency';

export function DailyStatsCards() {
  const { todayStats } = useReceiptStore();

  const cards = [
    {
      title: "Bugungi cheklar",
      value: todayStats.count.toString(),
      sub: "ta chek",
      icon: ReceiptText,
      color: "blue",
    },
    {
      title: "Bugungi savdo",
      value: formatAmount(todayStats.total),
      sub: "so'm",
      icon: DollarSign,
      color: "emerald",
    },
    {
      title: "Naqd to'lovlar",
      value: formatAmount(todayStats.cash),
      sub: "so'm",
      icon: Banknote,
      color: "green",
    },
    {
      title: "Karta to'lovlar",
      value: formatAmount(todayStats.card),
      sub: "so'm",
      icon: CreditCard,
      color: "indigo",
    },
    {
      title: "To'lanmagan qarz",
      value: formatAmount(todayStats.debt),
      sub: "so'm",
      icon: AlertCircle,
      color: "red",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.title} className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">{c.title}</span>
              <div className="p-1.5 rounded-lg bg-gray-50 text-gray-600">
                <Icon size={14} />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-gray-900 truncate">
                {c.value}
              </span>
              <span className="text-xs text-gray-400 shrink-0">{c.sub}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
