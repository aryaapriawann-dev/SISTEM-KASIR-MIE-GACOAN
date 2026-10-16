import React from 'react';
import { X, Flame, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getSpicyDetails } from '../utils/orderMath';

interface SpicyLevelGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLevel?: (level: number) => void;
}

const ALL_LEVELS = [0, 1, 2, 3, 4, 6, 8];

export const SpicyLevelGuideModal: React.FC<SpicyLevelGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectLevel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-100 text-red-600">
              <Flame className="w-5 h-5 fill-red-600" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold text-stone-900 leading-tight">
                Kamus Level Pedas Mie Gacoan
              </h2>
              <p className="text-xs text-stone-500">
                Gacoan menggunakan 100% cabe rawit merah segar yang diulek langsung!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
            aria-label="Tutup Kamus Pedas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-5 overflow-y-auto space-y-3">
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-800">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Peringatan Lambung:</span> Level 6 ke atas mengandung lebih dari 70 cabe rawit ulek. Pastikan Anda sudah makan nasi atau siapkan pendamping minuman susu seperti Es Tea Tarik atau Es Gobak Sodor!
            </div>
          </div>

          <div className="space-y-2.5">
            {ALL_LEVELS.map((lvl) => {
              const details = getSpicyDetails(lvl);
              return (
                <div
                  key={lvl}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                    details.isExtremelySpicy
                      ? 'border-red-300 bg-red-50/50 hover:bg-red-50'
                      : 'border-stone-200 bg-stone-50/40 hover:bg-stone-50'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-extrabold ${details.colorClass}`}>
                        {details.name}
                      </span>
                      {details.isExtremelySpicy && (
                        <span className="text-[10px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                          Sangat Ekstrem
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-600 flex items-center gap-1.5">
                      <span className="font-semibold text-stone-900">{details.chiliCount}</span>
                    </div>
                  </div>

                  {onSelectLevel && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectLevel(lvl);
                        onClose();
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-red-700 bg-white border border-red-200 hover:bg-red-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Pilih Level Ini
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Flavor Guide Note */}
          <div className="pt-2 text-xs text-stone-600 space-y-1">
            <div className="font-bold text-stone-900">Perbedaan Varian Mie:</div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Mie Hompimpa:</strong> Dominan asin gurih + pedas cabe rawit (rekomendasi pencinta asin pedas).</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
              <span><strong>Mie Gacoan:</strong> Dominan manis gurih kecap pekat + pedas cabe rawit (rekomendasi pencinta manis pedas).</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Mie Suit:</strong> Putih gurih minyak bawang tanpa cabe (khusus yang tidak pedas / anak-anak).</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
