import React, { useState } from 'react';
import { X, QrCode, Wallet, Banknote, ShieldCheck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { CartItem, OrderType } from '../types';
import { formatRupiah, calculateOrderTotals, validateOrder, OrderItem } from '../utils/orderMath';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  orderType: OrderType;
  tableNumber: string;
  setTableNumber: (val: string) => void;
  customerName: string;
  setCustomerName: (val: string) => void;
  customerPhone: string;
  setCustomerPhone: (val: string) => void;
  appliedVoucherCode: string;
  onConfirmOrder: (paymentMethod: 'qris' | 'gopay' | 'ovo' | 'shopeepay' | 'tunai') => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  orderType,
  tableNumber,
  setTableNumber,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  appliedVoucherCode,
  onConfirmOrder,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'qris' | 'gopay' | 'ovo' | 'shopeepay' | 'tunai'>('qris');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

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

  const handlePayNow = () => {
    const val = validateOrder({
      orderType,
      tableNumber,
      customerName,
      itemCount: cartItems.length,
    });

    if (!val.valid) {
      setValidationError(val.error || 'Mohon lengkapi data pemesanan.');
      return;
    }

    setValidationError(null);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onConfirmOrder(selectedMethod);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-red-100 text-red-600">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h2 className="text-base font-extrabold text-stone-900 leading-tight">
              Konfirmasi & Pembayaran
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
            aria-label="Tutup pembayaran"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Order Identity Summary */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider">
              <span>Rincian Meja & Pemesan</span>
              <span className="text-red-600">
                {orderType === 'dine_in' ? 'Makan di Tempat' : 'Bungkus Bawa Pulang'}
              </span>
            </div>

            {orderType === 'dine_in' ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-600">Nomor Meja:</span>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Contoh: 18"
                    className="w-24 px-2 py-1 text-sm font-bold text-stone-900 border border-stone-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-600">Nama Pelanggan (opsional):</span>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nama kamu"
                    className="flex-1 px-2 py-1 text-xs text-stone-900 border border-stone-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-600 w-28">Nama Pemesan:</span>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nama untuk dipanggil loket"
                    className="flex-1 px-2 py-1 text-xs text-stone-900 border border-stone-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-600 w-28">Nomor HP / WhatsApp:</span>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0812xxxx (opsional info siap)"
                    className="flex-1 px-2 py-1 text-xs text-stone-900 border border-stone-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Pilih Metode Pembayaran:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('qris')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedMethod === 'qris'
                    ? 'border-red-600 bg-red-50/70 text-red-950 shadow-2xs'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <QrCode className="w-6 h-6 text-red-600" />
                <span className="text-xs font-bold">QRIS Instant</span>
                <span className="text-[10px] text-stone-500">Scan BCA, Mandiri, dll</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('gopay')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedMethod === 'gopay' || selectedMethod === 'ovo' || selectedMethod === 'shopeepay'
                    ? 'border-red-600 bg-red-50/70 text-red-950 shadow-2xs'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <Wallet className="w-6 h-6 text-stone-800" />
                <span className="text-xs font-bold">E-Wallet</span>
                <span className="text-[10px] text-stone-500">GoPay, OVO, Shopee</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('tunai')}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  selectedMethod === 'tunai'
                    ? 'border-red-600 bg-red-50/70 text-red-950 shadow-2xs'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 text-stone-700'
                }`}
              >
                <Banknote className="w-6 h-6 text-emerald-700" />
                <span className="text-xs font-bold">Bayar di Kasir</span>
                <span className="text-[10px] text-stone-500">Uang Tunai Cash</span>
              </button>
            </div>
          </div>

          {/* Interactive QRIS visual preview when QRIS selected */}
          {selectedMethod === 'qris' && (
            <div className="p-4 rounded-xl border border-red-200 bg-gradient-to-b from-stone-50 to-white text-center space-y-2">
              <div className="text-xs font-bold text-stone-900 flex items-center justify-center gap-1.5">
                <QrCode className="w-4 h-4 text-red-600" />
                <span>QRIS Standar Pembayaran Nasional</span>
              </div>
              <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border border-stone-300 shadow-xs flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-stone-900" fill="currentColor">
                  {/* Outer corner 1 */}
                  <rect x="5" y="5" width="28" height="28" rx="2" />
                  <rect x="9" y="9" width="20" height="20" rx="1" fill="white" />
                  <rect x="13" y="13" width="12" height="12" />

                  {/* Outer corner 2 */}
                  <rect x="67" y="5" width="28" height="28" rx="2" />
                  <rect x="71" y="9" width="20" height="20" rx="1" fill="white" />
                  <rect x="75" y="13" width="12" height="12" />

                  {/* Outer corner 3 */}
                  <rect x="5" y="67" width="28" height="28" rx="2" />
                  <rect x="9" y="71" width="20" height="20" rx="1" fill="white" />
                  <rect x="13" y="75" width="12" height="12" />

                  {/* Matrix dots simulating QR code */}
                  <rect x="40" y="8" width="6" height="6" />
                  <rect x="52" y="8" width="8" height="6" />
                  <rect x="40" y="20" width="8" height="8" />
                  <rect x="52" y="22" width="6" height="6" />

                  <rect x="8" y="42" width="8" height="8" />
                  <rect x="22" y="42" width="6" height="10" />
                  <rect x="36" y="38" width="10" height="6" />
                  <rect x="52" y="38" width="12" height="12" />
                  <rect x="70" y="42" width="8" height="8" />
                  <rect x="84" y="40" width="8" height="6" />

                  <rect x="40" y="56" width="6" height="12" />
                  <rect x="52" y="56" width="10" height="6" />
                  <rect x="68" y="58" width="8" height="8" />
                  <rect x="84" y="56" width="8" height="10" />

                  <rect x="40" y="74" width="8" height="8" />
                  <rect x="54" y="74" width="6" height="10" />
                  <rect x="68" y="74" width="10" height="6" />
                  <rect x="84" y="74" width="8" height="8" />

                  <rect x="44" y="88" width="12" height="6" />
                  <rect x="64" y="86" width="14" height="6" />
                  <rect x="84" y="88" width="8" height="6" />
                </svg>
              </div>
              <p className="text-[11px] text-stone-500">
                Dapat di-scan dengan GoPay, OVO, Dana, ShopeePay, BCA, Mandiri, BRI, dll.
              </p>
            </div>
          )}

          {/* Validation Error Message */}
          {validationError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Price Summary Breakdown */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal Item ({cartItems.reduce((a, b) => a + b.quantity, 0)} porsi)</span>
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
                <span>Biaya Kemasan Bungkus</span>
                <span className="font-mono tabular-nums">{formatRupiah(totals.packagingFee)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Pajak Restoran PB1 (10%)</span>
              <span className="font-mono tabular-nums">{formatRupiah(totals.pb1Tax)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-stone-900 pt-1 border-t border-stone-200">
              <span>Total yang Dibayarkan</span>
              <span className="font-mono text-red-600 tabular-nums text-base">
                {formatRupiah(totals.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Confirmation */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            type="button"
            onClick={handlePayNow}
            disabled={isProcessing}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Memproses Pembayaran...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Bayar Sekarang ({formatRupiah(totals.total)})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
