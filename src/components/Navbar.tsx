import React from 'react';
import { ShoppingBag, Flame, UtensilsCrossed } from 'lucide-react';
import { formatRupiah } from '../utils/orderMath';

interface NavbarProps {
  cartItemCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenSpicyGuide: () => void;
  onOpenLiveQueue: () => void;
  onToggleKitchenMode: () => void;
  isKitchenMode: boolean;
  orderType: 'dine_in' | 'takeaway';
  tableNumber: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItemCount,
  cartTotal,
  onOpenCart,
  onOpenSpicyGuide,
  onOpenLiveQueue,
  onToggleKitchenMode,
  isKitchenMode,
  orderType,
  tableNumber,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element brand wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 hover:opacity-95 transition-opacity"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500 text-white font-extrabold shadow-xs">
            <Flame className="w-5 h-5 fill-white text-white" />
          </span>
          <div className="flex flex-col">
            <span className="leading-tight font-extrabold tracking-wider text-stone-950 font-sans">
              MIE GACOAN
            </span>
            <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">
              Jagonya Mie Pedas No. 1
            </span>
          </div>
        </a>

        {/* Zone 2: 4 clean single-line text nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <a
            href="#menu-section"
            className="hover:text-red-600 transition-colors whitespace-nowrap shrink-0"
          >
            Daftar Menu
          </a>
          <button
            onClick={onOpenSpicyGuide}
            className="hover:text-red-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            Panduan Pedas
          </button>
          <button
            onClick={onOpenLiveQueue}
            className="hover:text-red-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left"
          >
            Cek Antrean
          </button>
          <button
            onClick={onToggleKitchenMode}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer text-left font-semibold ${
              isKitchenMode ? 'text-amber-600' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            {isKitchenMode ? 'Kembali ke Pemesan' : 'Mode Dapur & Kasir'}
          </button>
        </nav>

        {/* Zone 3: 1 primary action (Keranjang / Cart Trigger) */}
        <div className="flex items-center gap-3 shrink-0">
          {orderType === 'dine_in' && tableNumber && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-stone-100 text-stone-800 border border-stone-200">
              <UtensilsCrossed className="w-3.5 h-3.5 text-red-600" />
              <span>Meja #{tableNumber}</span>
            </div>
          )}

          <button
            onClick={onOpenCart}
            aria-label="Buka Keranjang Pesanan"
            className="relative flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 active:scale-[0.98] transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Keranjang</span>
            {cartItemCount > 0 ? (
              <span className="flex items-center gap-1">
                <span className="px-1.5 py-0.2 bg-amber-400 text-stone-950 font-bold text-xs rounded-full">
                  {cartItemCount}
                </span>
                <span className="hidden md:inline text-xs font-semibold opacity-95">
                  ({formatRupiah(cartTotal)})
                </span>
              </span>
            ) : (
              <span className="text-xs opacity-90">(0)</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
