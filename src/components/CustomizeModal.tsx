import React, { useState, useEffect } from 'react';
import { X, Flame, AlertTriangle, Plus, Minus, Check } from 'lucide-react';
import { MenuItem, ExtraOption, CartItem } from '../types';
import { DishIllustration } from './DishIllustration';
import { formatRupiah, getSpicyDetails } from '../utils/orderMath';
import { playRestaurantBell } from '../utils/audioNotification';

interface CustomizeModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (cartItem: Omit<CartItem, 'cartItemId'>) => void;
}

const SPICY_LEVELS = [0, 1, 2, 3, 4, 6, 8];

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  item,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [spicyLevel, setSpicyLevel] = useState<number>(1);
  const [spiceStyle, setSpiceStyle] = useState<'asin' | 'manis'>('asin');
  const [selectedExtras, setSelectedExtras] = useState<ExtraOption[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSpicyLevel(item.defaultLevel ?? 1);
      setSpiceStyle(item.spiceStyle === 'manis' ? 'manis' : 'asin');
      setSelectedExtras([]);
      setNotes('');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const itemUnitPrice = item.price + extrasTotal;
  const totalPrice = itemUnitPrice * quantity;

  const currentSpicyInfo = getSpicyDetails(spicyLevel);

  const toggleExtra = (extra: ExtraOption) => {
    setSelectedExtras((prev) => {
      const exists = prev.some((e) => e.id === extra.id);
      if (exists) {
        return prev.filter((e) => e.id !== extra.id);
      } else {
        return [...prev, extra];
      }
    });
  };

  const handleLevelChange = (lvl: number) => {
    setSpicyLevel(lvl);
    if (lvl >= 6) {
      playRestaurantBell('spicy_warning');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToCart({
      menuItem: item,
      quantity,
      spicyLevel: item.allowSpicyLevel ? spicyLevel : undefined,
      spiceStyle: item.allowSpicyLevel ? spiceStyle : undefined,
      selectedExtras,
      notes: notes.trim(),
    });
    playRestaurantBell('order_placed');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <h2 className="text-base font-extrabold text-stone-900 leading-tight">
            Kustomisasi {item.name}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Item Preview */}
          <div className="flex gap-4 items-center p-3 rounded-xl bg-stone-50 border border-stone-200">
            <div className="w-20 h-16 shrink-0 overflow-hidden rounded-lg">
              <DishIllustration type={item.imageSvgType} className="w-full h-full" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-900">{item.name}</h3>
              <p className="text-xs text-stone-500 line-clamp-1">{item.tagline}</p>
              <div className="text-xs font-mono font-bold text-red-600 mt-1">
                {formatRupiah(item.price)}
              </div>
            </div>
          </div>

          {/* Spicy Level Picker (Only if item allows spicy level) */}
          {item.allowSpicyLevel && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-red-600" />
                  Pilih Tingkat Kepedasan:
                </label>
                <span className={`text-xs font-extrabold ${currentSpicyInfo.colorClass}`}>
                  {currentSpicyInfo.name}
                </span>
              </div>

              {/* Spicy Level Buttons */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {SPICY_LEVELS.filter((lvl) => lvl <= (item.maxSpicyLevel ?? 8)).map((lvl) => {
                  const isSelected = spicyLevel === lvl;
                  const isDangerous = lvl >= 6;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => handleLevelChange(lvl)}
                      className={`py-2 px-1 rounded-xl text-xs font-extrabold border transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                        isSelected
                          ? isDangerous
                            ? 'bg-rose-700 text-white border-rose-800 shadow-sm scale-105'
                            : 'bg-red-600 text-white border-red-700 shadow-sm scale-105'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <span className="text-sm">Lvl {lvl}</span>
                      <span className="text-[10px] font-normal opacity-90">
                        {lvl === 0 ? 'Tanpa' : `${lvl * 12} 🌶️`}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Warning box if high level */}
              {currentSpicyInfo.isExtremelySpicy && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>
                    Level ekstrem ({currentSpicyInfo.chiliCount})! Disarankan pesan minuman manis/es untuk meredakan pedas.
                  </span>
                </div>
              )}

              {/* Flavor Profile Choice if both available */}
              {item.spiceStyle && (
                <div className="pt-2">
                  <label className="block text-xs font-bold text-stone-600 mb-1.5">
                    Rasa Dominan:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSpiceStyle('asin')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                        spiceStyle === 'asin'
                          ? 'border-amber-500 bg-amber-50/70 text-amber-950'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      <div className="font-extrabold">Asin Gurih (Hompimpa)</div>
                      <div className="text-[11px] text-stone-500 font-normal">Bumbu gurih asin tanpa kecap</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpiceStyle('manis')}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                        spiceStyle === 'manis'
                          ? 'border-red-500 bg-red-50/70 text-red-950'
                          : 'border-stone-200 bg-white text-stone-700'
                      }`}
                    >
                      <div className="font-extrabold">Manis Pedas (Gacoan)</div>
                      <div className="text-[11px] text-stone-500 font-normal">Kecap manis spesial khas Gacoan</div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Optional Extras */}
          {item.availableExtras && item.availableExtras.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Tambah Ekstra Topping (Opsional):
              </label>
              <div className="space-y-2">
                {item.availableExtras.map((extra) => {
                  const isChecked = selectedExtras.some((e) => e.id === extra.id);
                  return (
                    <div
                      key={extra.id}
                      onClick={() => toggleExtra(extra)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? 'border-red-500 bg-red-50/40 text-stone-900'
                          : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${
                            isChecked
                              ? 'bg-red-600 border-red-600 text-white'
                              : 'border-stone-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-semibold">{extra.name}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-stone-900">
                        +{formatRupiah(extra.price)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Notes */}
          <div className="space-y-1.5 pt-2 border-t border-stone-200">
            <label htmlFor="order-notes-input" className="block text-xs font-bold text-stone-700">
              Catatan Khusus ke Koki Dapur:
            </label>
            <input
              id="order-notes-input"
              type="text"
              placeholder="Contoh: Tanpa daun bawang, bumbu dipisah, jangan terlalu asin..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs text-stone-900 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
          </div>

          {/* Quantity Stepper */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-200">
            <span className="text-xs font-bold text-stone-700">Jumlah Porsi:</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-lg border border-stone-300 flex items-center justify-center text-stone-700 disabled:opacity-30 hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Kurangi porsi"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-mono font-extrabold text-base w-6 text-center text-stone-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-lg border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Tambah porsi"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Action Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm flex items-center justify-between shadow-sm active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>Tambahkan ke Pesanan</span>
              <span className="font-mono tabular-nums text-amber-200">
                {formatRupiah(totalPrice)}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
