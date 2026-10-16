import React, { useState } from 'react';
import { ChefHat, BellRing, CheckCircle2, Clock, Utensils, Package, Volume2, ArrowLeft } from 'lucide-react';
import { PlacedOrder, OrderStatus } from '../types';
import { formatRupiah } from '../utils/orderMath';
import { playRestaurantBell } from '../utils/audioNotification';

interface KitchenDisplayViewProps {
  orders: PlacedOrder[];
  onUpdateOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
  onBackToCustomer: () => void;
}

export const KitchenDisplayView: React.FC<KitchenDisplayViewProps> = ({
  orders,
  onUpdateOrderStatus,
  onBackToCustomer,
}) => {
  const [filter, setFilter] = useState<'all' | OrderStatus>('all');

  const filteredOrders = orders.filter((o) => (filter === 'all' ? true : o.status === filter));

  const activeCount = orders.filter((o) => o.status !== 'completed').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  const handleCallQueue = (order: PlacedOrder) => {
    playRestaurantBell('order_ready');
    // Also use SpeechSynthesis to announce queue number in Indonesian if available!
    if ('speechSynthesis' in window) {
      try {
        const text =
          order.orderType === 'dine_in'
            ? `Nomor antrean ${order.queueNumber}, pesanan meja ${order.tableNumber} siap diantar.`
            : `Panggilan nomor antrean ${order.queueNumber}, atas nama ${order.customerName}, silakan ambil di loket.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'id-ID';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback to bell ring
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 pb-16">
      {/* KDS Header */}
      <div className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToCustomer}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Menu</span>
            </button>
            <div className="h-5 w-px bg-stone-700" />
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-amber-400" />
              <h1 className="text-base font-extrabold tracking-tight">
                Kitchen & Cashier Order Display (KDS)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="px-3 py-1 bg-stone-800 rounded-lg border border-stone-700">
              <span className="text-stone-400">Antrean Aktif:</span>{' '}
              <span className="font-mono font-bold text-amber-400">{activeCount}</span>
            </div>
            <div className="px-3 py-1 bg-stone-800 rounded-lg border border-stone-700">
              <span className="text-stone-400">Siap Panggil:</span>{' '}
              <span className="font-mono font-bold text-emerald-400">{readyCount}</span>
            </div>
            <div className="px-3 py-1 bg-stone-800 rounded-lg border border-stone-700">
              <span className="text-stone-400">Omzet Masuk:</span>{' '}
              <span className="font-mono font-bold text-red-400">{formatRupiah(totalRevenue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-white rounded-xl border border-stone-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Semua Pesanan ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('received')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              filter === 'received'
                ? 'bg-red-600 text-white'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Baru Masuk ({orders.filter((o) => o.status === 'received').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('cooking')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              filter === 'cooking'
                ? 'bg-amber-600 text-white'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Sedang Dimasak ({orders.filter((o) => o.status === 'cooking').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('ready')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              filter === 'ready'
                ? 'bg-emerald-600 text-white'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Siap Diambil / Diantar ({orders.filter((o) => o.status === 'ready').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              filter === 'completed'
                ? 'bg-stone-600 text-white'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            Selesai ({orders.filter((o) => o.status === 'completed').length})
          </button>
        </div>

        {/* Orders Cards Grid */}
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-400">
            <ChefHat className="w-12 h-12 mx-auto stroke-[1.5] text-stone-300 mb-2" />
            <h3 className="text-sm font-bold text-stone-700">Tidak ada pesanan di kategori ini</h3>
            <p className="text-xs text-stone-500 mt-1">
              Pesanan baru dari pelanggan akan otomatis muncul di sini.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrders.map((ord) => {
              const isReceived = ord.status === 'received';
              const isCooking = ord.status === 'cooking';
              const isReady = ord.status === 'ready';
              const isCompleted = ord.status === 'completed';

              return (
                <div
                  key={ord.orderId}
                  className={`flex flex-col justify-between bg-white rounded-2xl border transition-all shadow-xs ${
                    isReceived
                      ? 'border-red-400 ring-2 ring-red-100'
                      : isCooking
                      ? 'border-amber-400 ring-2 ring-amber-100'
                      : isReady
                      ? 'border-emerald-400 ring-2 ring-emerald-100'
                      : 'border-stone-200 opacity-80'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-stone-100">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                          Tiket Antrean
                        </span>
                        <div className="text-2xl font-black font-mono text-stone-900">
                          {ord.queueNumber}
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            isReceived
                              ? 'bg-red-100 text-red-700'
                              : isCooking
                              ? 'bg-amber-100 text-amber-800'
                              : isReady
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {isReceived
                            ? 'Baru Masuk'
                            : isCooking
                            ? 'Dimasak'
                            : isReady
                            ? 'Siap Saji'
                            : 'Selesai'}
                        </span>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-stone-700">
                      {ord.orderType === 'dine_in' ? (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                          <Utensils className="w-3.5 h-3.5 text-amber-700" />
                          <span>Meja #{ord.tableNumber}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
                          <Package className="w-3.5 h-3.5 text-blue-700" />
                          <span>Bungkus (a.n {ord.customerName})</span>
                        </div>
                      )}
                      <span className="text-[11px] text-stone-500 font-mono">
                        {ord.paymentMethod.toUpperCase()} · Lunas
                      </span>
                    </div>
                  </div>

                  {/* Card Order Items */}
                  <div className="p-4 flex-1 space-y-2.5">
                    <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      Item Pesanan:
                    </div>
                    <div className="space-y-2">
                      {ord.items.map((it) => (
                        <div key={it.cartItemId} className="text-xs space-y-0.5 border-b border-stone-50 pb-1.5 last:border-0">
                          <div className="flex justify-between font-bold text-stone-900">
                            <span>
                              {it.quantity}x {it.menuItem.name}
                            </span>
                            {it.spicyLevel !== undefined && (
                              <span className="text-red-600 font-extrabold">
                                Level {it.spicyLevel}
                              </span>
                            )}
                          </div>
                          {it.selectedExtras.length > 0 && (
                            <div className="text-[11px] text-stone-500">
                              Topping: {it.selectedExtras.map((e) => e.name).join(', ')}
                            </div>
                          )}
                          {it.notes && (
                            <div className="text-[11px] text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded font-medium">
                              Catatan: {it.notes}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions & State Transition */}
                  <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                    {/* Call bell button for Ready orders */}
                    {isReady && (
                      <button
                        type="button"
                        onClick={() => handleCallQueue(ord)}
                        className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="Panggil Antrean (Pengeras Suara)"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Panggil</span>
                      </button>
                    )}

                    <div className="flex-1 flex justify-end gap-2">
                      {isReceived && (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(ord.orderId, 'cooking');
                            playRestaurantBell('order_placed');
                          }}
                          className="w-full py-2 px-3 text-xs font-extrabold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <ChefHat className="w-4 h-4" />
                          <span>Mulai Masak</span>
                        </button>
                      )}

                      {isCooking && (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(ord.orderId, 'ready');
                            handleCallQueue(ord);
                          }}
                          className="w-full py-2 px-3 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <BellRing className="w-4 h-4" />
                          <span>Siap Diambil / Diantar</span>
                        </button>
                      )}

                      {isReady && (
                        <button
                          type="button"
                          onClick={() => onUpdateOrderStatus(ord.orderId, 'completed')}
                          className="w-full py-2 px-3 text-xs font-extrabold text-white bg-stone-800 hover:bg-stone-900 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Tandai Selesai</span>
                        </button>
                      )}

                      {isCompleted && (
                        <span className="text-xs font-semibold text-stone-500 py-1">
                          Pesanan Selesai Dinikmati
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
