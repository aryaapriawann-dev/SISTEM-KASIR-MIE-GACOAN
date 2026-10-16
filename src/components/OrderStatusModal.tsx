import React from 'react';
import { X, CheckCircle2, Clock, ChefHat, BellRing, Printer, Utensils, Package, ShieldCheck } from 'lucide-react';
import { PlacedOrder, OrderStatus } from '../types';
import { formatRupiah } from '../utils/orderMath';

interface OrderStatusModalProps {
  order: PlacedOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onNewOrder: () => void;
}

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
  order,
  isOpen,
  onClose,
  onNewOrder,
}) => {
  if (!isOpen || !order) return null;

  const steps: { status: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      status: 'received',
      label: 'Pesanan Diterima',
      desc: 'Pesanan masuk ke sistem antrean POS',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      status: 'cooking',
      label: 'Sedang Diracik Dapur',
      desc: 'Koki merebus mie & menggoreng dimsum renyah',
      icon: <ChefHat className="w-5 h-5" />,
    },
    {
      status: 'ready',
      label: order.orderType === 'dine_in' ? 'Siap Diantar ke Meja' : 'Siap Diambil di Loket',
      desc: order.orderType === 'dine_in' ? `Pelayan mengantar ke Meja #${order.tableNumber}` : 'Ambil pesananmu di loket bungkus',
      icon: <BellRing className="w-5 h-5" />,
    },
    {
      status: 'completed',
      label: 'Selesai & Dinikmati',
      desc: 'Selamat menikmati pedas nikmat Gacoan!',
      icon: <Utensils className="w-5 h-5" />,
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'received': return 0;
      case 'cooking': return 1;
      case 'ready': return 2;
      case 'completed': return 3;
      default: return 0;
    }
  };

  const currentStepIndex = getStepIndex(order.status);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-stone-900 leading-tight">
                Bukti Transaksi & Tiket Antrean
              </h2>
              <span className="text-[11px] text-stone-500">ID: {order.orderId}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
            aria-label="Tutup tiket"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Receipt Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 print:p-0">
          {/* Big Queue Ticket Badge */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-red-600 via-red-600 to-amber-600 text-white text-center shadow-md space-y-1">
            <span className="text-[11px] font-bold tracking-widest uppercase opacity-90 block">
              Nomor Antrean Anda
            </span>
            <div className="text-4xl sm:text-5xl font-mono font-black tracking-tight py-1">
              {order.queueNumber}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
              {order.orderType === 'dine_in' ? (
                <>
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Makan di Meja #{order.tableNumber}</span>
                </>
              ) : (
                <>
                  <Package className="w-3.5 h-3.5" />
                  <span>Bungkus (a.n {order.customerName})</span>
                </>
              )}
            </div>
          </div>

          {/* Live Progress Stepper */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span>Status Pengerjaan Dapur:</span>
              <span className="flex items-center gap-1 text-amber-700 font-medium">
                <Clock className="w-3.5 h-3.5" />
                Estimasi ~{order.estimatedMinutes} Menit
              </span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {steps.map((st, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={st.status} className="relative flex items-start gap-3">
                    <div
                      className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-red-600 text-white ring-4 ring-red-100'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <div
                        className={`text-xs font-extrabold ${
                          isCurrent
                            ? 'text-red-700'
                            : isPassed
                            ? 'text-stone-900'
                            : 'text-stone-400'
                        }`}
                      >
                        {st.label}
                      </div>
                      <div className="text-[11px] text-stone-500 leading-tight">
                        {st.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Itemized Order Summary */}
          <div className="space-y-2 border-t border-stone-200 pt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Daftar Pesanan:
            </h4>
            <div className="space-y-2">
              {order.items.map((it) => (
                <div
                  key={it.cartItemId}
                  className="flex items-start justify-between text-xs py-1 border-b border-stone-100 last:border-0"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-stone-900">
                      {it.quantity}x {it.menuItem.name}
                    </div>
                    {it.spicyLevel !== undefined && (
                      <div className="text-[11px] text-red-600 font-semibold">
                        Pedas Lvl {it.spicyLevel} ({it.spiceStyle === 'manis' ? 'Manis' : 'Asin'})
                      </div>
                    )}
                    {it.selectedExtras.length > 0 && (
                      <div className="text-[10px] text-stone-500">
                        + {it.selectedExtras.map((e) => e.name).join(', ')}
                      </div>
                    )}
                    {it.notes && (
                      <div className="text-[10px] text-stone-400 italic">
                        "{it.notes}"
                      </div>
                    )}
                  </div>
                  <div className="font-mono font-bold text-stone-900 tabular-nums">
                    {formatRupiah((it.menuItem.price + it.selectedExtras.reduce((a, b) => a + b.price, 0)) * it.quantity)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Breakdown */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums">{formatRupiah(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Diskon Kupon ({order.appliedVoucherCode})</span>
                <span className="font-mono tabular-nums">-{formatRupiah(order.discount)}</span>
              </div>
            )}
            {order.packagingFee > 0 && (
              <div className="flex justify-between">
                <span>Biaya Kemasan Bungkus</span>
                <span className="font-mono tabular-nums">{formatRupiah(order.packagingFee)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Pajak Restoran PB1 (10%)</span>
              <span className="font-mono tabular-nums">{formatRupiah(order.pb1Tax)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-stone-950 pt-1 border-t border-stone-200">
              <span>Total Lunas ({order.paymentMethod.toUpperCase()})</span>
              <span className="font-mono text-red-600 tabular-nums text-base">
                {formatRupiah(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-2 text-xs font-bold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Struk</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 text-xs font-bold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onNewOrder();
              }}
              className="px-4 py-2 text-xs font-extrabold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              Pesan Menu Baru
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
