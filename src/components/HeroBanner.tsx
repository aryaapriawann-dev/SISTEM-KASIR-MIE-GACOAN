import React from 'react';
import { Utensils, Package, Search, Sparkles, Clock, ShieldCheck, Flame } from 'lucide-react';

interface HeroBannerProps {
  orderType: 'dine_in' | 'takeaway';
  setOrderType: (type: 'dine_in' | 'takeaway') => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenSpicyGuide: () => void;
  onApplyVoucherSuggestion: (code: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  orderType,
  setOrderType,
  tableNumber,
  setTableNumber,
  customerName,
  setCustomerName,
  searchQuery,
  setSearchQuery,
  onOpenSpicyGuide,
  onApplyVoucherSuggestion,
}) => {
  return (
    <section className="bg-gradient-to-b from-amber-500/10 via-white to-white pt-8 pb-6 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading, Dining Mode & Dining Form */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-stone-600">
              <span className="flex items-center gap-1 text-red-600 font-bold">
                <Flame className="w-3.5 h-3.5 fill-red-600" />
                Resmi Online Order
              </span>
              <span className="hidden sm:inline text-stone-300">·</span>
              <span className="text-stone-500">Cabang Pusat</span>
              <span className="hidden sm:inline text-stone-300">·</span>
              <span className="text-emerald-700 font-bold">Buka (10:00 - 22:00)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-stone-950 tracking-tight leading-[1.15] text-balance">
              Pesan Mie Gacoan <br className="hidden sm:inline" />
              <span className="text-red-600">Langsung dari Mejamu!</span>
            </h1>

            <p className="text-stone-600 text-xs sm:text-base max-w-xl leading-relaxed">
              Nikmati sensasi pedas gurih Mie Hompimpa, manis pedas Mie Gacoan, renyahnya Udang Keju, dan segarnya Es Gobak Sodor. Duduk manis, pesanan diantar!
            </p>

            {/* Dining Mode Selector & Table / Name Input */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-stone-500">
                  Pilih Cara Menikmati:
                </label>
                <button
                  type="button"
                  onClick={onOpenSpicyGuide}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 underline flex items-center gap-1 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Level Cabe (0-8)</span>
                </button>
              </div>

              {/* Mode Tabs */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setOrderType('dine_in')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    orderType === 'dine_in'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5 shrink-0" />
                  <span>Dine In (Makan di Meja)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    orderType === 'takeaway'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Package className="w-3.5 h-3.5 shrink-0" />
                  <span>Take Away (Bungkus)</span>
                </button>
              </div>

              {/* Dynamic Form based on Dining Mode */}
              {orderType === 'dine_in' ? (
                <div className="space-y-1.5">
                  <label htmlFor="table-number-input" className="block text-xs font-bold text-stone-700">
                    Nomor Meja Anda <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="table-number-input"
                      type="number"
                      min="1"
                      max="99"
                      placeholder="Contoh: 18"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-32 px-3 py-2 text-base font-bold text-stone-900 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    />
                    <div className="text-xs text-stone-500">
                      Cek stiker angka di atas permukaan mejamu agar pelayan tepat mengantarkan pesanan.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label htmlFor="customer-name-input" className="block text-xs font-bold text-stone-700">
                    Nama Pemesan Bungkus <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="customer-name-input"
                    type="text"
                    placeholder="Nama untuk dipanggil kasir / loket bungkus"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-sm text-stone-900 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Search, Highlights & Voucher Promo Banner */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search Input Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Mie Hompimpa, Udang Keju, Es Gobak..."
                className="w-full pl-10 pr-4 py-3 bg-white text-sm text-stone-900 border border-stone-200 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700"
                >
                  Hapus
                </button>
              )}
            </div>

            {/* Voucher Banner with Direct 1-Click Apply */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Kupon Diskon Hari Ini</span>
                </div>
                <span className="text-[11px] font-semibold text-amber-900">Klik untuk pakai</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onApplyVoucherSuggestion('GACOANPEDAS')}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-white border border-amber-300 text-stone-800 hover:border-amber-500 hover:bg-amber-50 transition-colors shadow-2xs text-left"
                >
                  <span className="text-red-600 font-mono font-extrabold">GACOANPEDAS</span>
                  <span className="block text-[10px] text-stone-600 font-normal">Diskon 15% Min. 30rb</span>
                </button>
                <button
                  type="button"
                  onClick={() => onApplyVoucherSuggestion('HEMAT10K')}
                  className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-white border border-amber-300 text-stone-800 hover:border-amber-500 hover:bg-amber-50 transition-colors shadow-2xs text-left"
                >
                  <span className="text-emerald-700 font-mono font-extrabold">HEMAT10K</span>
                  <span className="block text-[10px] text-stone-600 font-normal">Potongan Rp 10.000</span>
                </button>
              </div>
            </div>

            {/* Quick Proof Metrics Strip */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <Clock className="w-4 h-4 text-stone-600 mx-auto mb-1" />
                <span className="font-bold text-stone-900 block">10-15 Mnt</span>
                <span className="text-[11px] text-stone-500">Estimasi Masak</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <ShieldCheck className="w-4 h-4 text-stone-600 mx-auto mb-1" />
                <span className="font-bold text-stone-900 block">100% Halal</span>
                <span className="text-[11px] text-stone-500">Higienis & Bersih</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                <Flame className="w-4 h-4 text-red-600 mx-auto mb-1" />
                <span className="font-bold text-stone-900 block">Cabe Asli</span>
                <span className="text-[11px] text-stone-500">Bukan Bubuk</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
