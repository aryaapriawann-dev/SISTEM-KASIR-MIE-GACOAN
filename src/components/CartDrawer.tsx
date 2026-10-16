import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Tag, Check, ArrowRight, Utensils, Package, AlertCircle } from 'lucide-react';
import { CartItem, OrderType } from '../types';
import { calculateOrderTotals, formatRupiah, OrderItem, AVAILABLE_VOUCHERS } from '../utils/orderMath';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  appliedVoucherCode: string;
  setAppliedVoucherCode: (code: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  orderType,
  setOrderType,
  tableNumber,
  setTableNumber,
  customerName,
  setCustomerName,
  appliedVoucherCode,
  setAppliedVoucherCode,
  onProceedToCheckout,
}) => {
  const [voucherInput, setVoucherInput] = useState(appliedVoucherCode);
  const [voucherError, setVoucherError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Convert CartItem to OrderItem for calculation
  const orderItems: OrderItem[] = cartItems.map((item) => ({
    id: item.cartItemId,
    menuId: item.menuItem.id,
    name: item.menuItem.name,
    price: item.menuItem.price,
    quantity: item.quantity,
    category: item.menuItem.category,
    spicyLevel: item.spicyLevel,
    flavor: item.spiceStyle,
    extras: item.selectedExtras.map((e) => ({ name: e.name, price: e.price })),
    notes: item.notes,
  }));

  const totals = calculateOrderTotals(orderItems, orderType, appliedVoucherCode);

  const handleApplyVoucher = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = voucherInput.trim().toUpperCase();
    if (!clean) {
      setAppliedVoucherCode('');
      setVoucherError(null);
      return;
    }

    const testTotals = calculateOrderTotals(orderItems, orderType, clean);
    if (testTotals.appliedVoucher) {
      setAppliedVoucherCode(clean);
      setVoucherError(null);
    } else {
      setVoucherError('Kode voucher tidak berlaku atau belum memenuhi minimum belanja.');
    }
  };

  const handleApplyPreset = (code: string) => {
    setVoucherInput(code);
    const testTotals = calculateOrderTotals(orderItems, orderType, code);
    if (testTotals.appliedVoucher) {
      setAppliedVoucherCode(code);
      setVoucherError(null);
    } else {
      setAppliedVoucherCode(code);
      const minSpend = AVAILABLE_VOUCHERS[code]?.minSpend || 30000;
      setVoucherError(`Kupon ${code} butuh minimum belanja ${formatRupiah(minSpend)}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-stone-900">Keranjang Pesanan</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-mono">
              {cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} Item
            </span>
          </div>

          <div className="flex items-center gap-2">
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={onClearCart}
                className="text-xs text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                title="Kosongkan keranjang"
              >
                Hapus Semua
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
              aria-label="Tutup keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dining Type Switcher in Drawer */}
        <div className="p-3 bg-stone-100/80 border-b border-stone-200 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOrderType('dine_in')}
            className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              orderType === 'dine_in'
                ? 'bg-red-600 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Makan di Meja</span>
          </button>
          <button
            type="button"
            onClick={() => setOrderType('takeaway')}
            className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              orderType === 'takeaway'
                ? 'bg-red-600 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900 bg-white border border-stone-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Bungkus (Take Away)</span>
          </button>
        </div>

        {/* Input Details based on mode */}
        <div className="px-4 py-2.5 bg-stone-50 border-b border-stone-200 text-xs">
          {orderType === 'dine_in' ? (
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="drawer-table" className="font-bold text-stone-700">
                Nomor Meja:
              </label>
              <input
                id="drawer-table"
                type="number"
                min="1"
                max="99"
                placeholder="No. Meja (1-99)"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="w-28 px-2.5 py-1 text-sm font-bold text-stone-900 border border-stone-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="drawer-name" className="font-bold text-stone-700">
                Nama Pemesan:
              </label>
              <input
                id="drawer-name"
                type="text"
                placeholder="Isi nama pemesan"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="flex-1 px-2.5 py-1 text-xs text-stone-900 border border-stone-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          )}
        </div>

        {/* Scrollable Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <Utensils className="w-12 h-12 stroke-[1.5] text-stone-300 mb-2" />
              <p className="text-sm font-bold text-stone-700">Keranjang Masih Kosong</p>
              <p className="text-xs text-stone-500 mt-1 max-w-xs">
                Yuk pilih Mie Hompimpa, Udang Keju, atau Es Gobak Sodor favoritmu di daftar menu!
              </p>
            </div>
          ) : (
            cartItems.map((item) => {
              const itemExtrasTotal = item.selectedExtras.reduce((sum, e) => sum + e.price, 0);
              const itemSubtotal = (item.menuItem.price + itemExtrasTotal) * item.quantity;

              return (
                <div
                  key={item.cartItemId}
                  className="p-3 rounded-xl border border-stone-200 bg-white space-y-2 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="text-sm font-bold text-stone-900 leading-snug">
                        {item.menuItem.name}
                      </div>
                      {item.spicyLevel !== undefined && (
                        <div className="text-[11px] font-semibold text-red-600">
                          Pedas Level {item.spicyLevel} ({item.spiceStyle === 'manis' ? 'Manis Pedas' : 'Asin Gurih'})
                        </div>
                      )}
                      {item.selectedExtras.length > 0 && (
                        <div className="text-[11px] text-stone-500">
                          + {item.selectedExtras.map((e) => e.name).join(', ')}
                        </div>
                      )}
                      {item.notes && (
                        <div className="text-[11px] text-stone-500 italic bg-stone-50 px-2 py-0.5 rounded">
                          "{item.notes}"
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.cartItemId)}
                      className="p-1 text-stone-300 hover:text-red-600 transition-colors cursor-pointer"
                      title="Hapus menu ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity Stepper & Subtotal */}
                  <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-6 h-6 rounded border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100 cursor-pointer text-xs"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-xs font-bold w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-6 h-6 rounded border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100 cursor-pointer text-xs"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono font-bold text-xs text-stone-900 tabular-nums">
                      {formatRupiah(itemSubtotal)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Voucher, Summary & Checkout Button */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50/80 space-y-3">
            {/* Voucher Input */}
            <form onSubmit={handleApplyVoucher} className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Kode Kupon Diskon"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                    className="w-full pl-8 pr-2 py-1.5 text-xs uppercase font-mono font-bold text-stone-900 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Terapkan
                </button>
              </div>

              {/* Preset suggestion tags */}
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('GACOANPEDAS')}
                  className="text-[10px] font-mono font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-0.5 rounded transition-colors"
                >
                  GACOANPEDAS (-15%)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('HEMAT10K')}
                  className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded transition-colors"
                >
                  HEMAT10K (-10rb)
                </button>
              </div>

              {voucherError && (
                <div className="flex items-center gap-1 text-[11px] text-red-600">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{voucherError}</span>
                </div>
              )}

              {totals.appliedVoucher && !voucherError && (
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                  <Check className="w-3 h-3 shrink-0" />
                  <span>Kupon {totals.appliedVoucher.code} aktif! Hemat {formatRupiah(totals.discount)}</span>
                </div>
              )}
            </form>

            {/* Price Calculations */}
            <div className="space-y-1 text-xs text-stone-600 border-t border-stone-200 pt-2 font-medium">
              <div className="flex justify-between">
                <span>Subtotal Pesanan</span>
                <span className="font-mono tabular-nums">{formatRupiah(totals.subtotal)}</span>
              </div>

              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Diskon Kupon</span>
                  <span className="font-mono tabular-nums">-{formatRupiah(totals.discount)}</span>
                </div>
              )}

              {orderType === 'takeaway' && totals.packagingFee > 0 && (
                <div className="flex justify-between">
                  <span>Biaya Kemasan Paper Box (Bungkus)</span>
                  <span className="font-mono tabular-nums">{formatRupiah(totals.packagingFee)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Pajak Restoran PB1 (10%)</span>
                <span className="font-mono tabular-nums">{formatRupiah(totals.pb1Tax)}</span>
              </div>

              <div className="flex justify-between text-sm font-extrabold text-stone-950 pt-1 border-t border-stone-200">
                <span>Total Pembayaran</span>
                <span className="font-mono text-red-600 tabular-nums">
                  {formatRupiah(totals.total)}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-extrabold text-sm flex items-center justify-between shadow-sm transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <span>Lanjut ke Pembayaran</span>
                <ArrowRight className="w-4 h-4" />
              </div>
              <span className="font-mono tabular-nums text-amber-200">
                {formatRupiah(totals.total)}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
