// ============================================================
// Top Navigation Header
// ============================================================

import { Link, useLocation } from 'react-router-dom';
import { Plus, Settings, ReceiptText, Clock } from 'lucide-react';
import { useLiveClock } from '@/hooks/useLiveClock';

export function Header() {
  const location = useLocation();
  const timeString = useLiveClock();

  const navLinks = [
    { href: '/', label: 'Cheklar', icon: ReceiptText },
    { href: '/settings', label: 'Sozlamalar', icon: Settings },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                TC
              </div>
              <div>
                <span className="font-bold text-gray-900 text-base tracking-tight">TILE CRAFT</span>
                <span className="text-xs text-gray-500 block -mt-0.5">POS Tizimi</span>
              </div>
            </Link>

            {/* Navigation links */}
            <nav className="hidden sm:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = location.pathname === href;
                return (
                  <Link
                    key={href}
                    to={href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Clock */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
              <Clock size={13} />
              <span className="font-mono">{timeString}</span>
            </div>

            {/* New Receipt Button */}
            <Link to="/create" className="btn-primary text-xs sm:text-sm">
              <Plus size={16} />
              <span>Yangi chek</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
