import React from 'react';
import { MenuItem } from '../types';

interface DishIllustrationProps {
  type: MenuItem['imageSvgType'];
  className?: string;
}

export const DishIllustration: React.FC<DishIllustrationProps> = ({ type, className = 'w-full h-44' }) => {
  switch (type) {
    case 'mie_hompimpa':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-red-100/60 rounded-xl ${className}`}>
          <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Bowl base & shadow */}
            <ellipse cx="100" cy="138" rx="65" ry="12" fill="#000000" fillOpacity="0.12" />
            <path d="M42 68 C42 120 158 120 158 68 Z" fill="#1E293B" />
            <ellipse cx="100" cy="68" rx="58" ry="18" fill="#334155" />
            <ellipse cx="100" cy="67" rx="54" ry="15" fill="#475569" />

            {/* Savory chili noodle strands */}
            <path d="M60 66 Q80 48 100 66 T140 66" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
            <path d="M55 72 Q85 55 110 72 T145 70" stroke="#EA580C" strokeWidth="5" strokeLinecap="round" />
            <path d="M68 62 Q95 44 125 64 T135 74" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
            <path d="M72 76 Q100 60 130 76" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />

            {/* Crispy Pangsit Dumpling 1 */}
            <polygon points="128,45 162,28 152,65" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            <polygon points="134,48 156,36 148,60" fill="#FDE68A" />

            {/* Minced Chicken Crumbles & Chilies */}
            <circle cx="85" cy="64" r="4" fill="#E2E8F0" />
            <circle cx="95" cy="62" r="3.5" fill="#CBD5E1" />
            <circle cx="104" cy="65" r="4" fill="#F8FAFC" />
            <circle cx="112" cy="68" r="3" fill="#E2E8F0" />
            <circle cx="90" cy="70" r="3" fill="#F1F5F9" />

            {/* Sliced Red Chilies */}
            <ellipse cx="78" cy="66" rx="4" ry="2.5" fill="#EF4444" transform="rotate(-20 78 66)" />
            <ellipse cx="102" cy="58" rx="4.5" ry="2.5" fill="#DC2626" transform="rotate(30 102 58)" />
            <ellipse cx="120" cy="67" rx="4" ry="2.2" fill="#B91C1C" transform="rotate(-15 120 67)" />

            {/* Green Scallion flakes */}
            <rect x="75" y="73" width="4" height="4" rx="1" fill="#22C55E" />
            <rect x="88" y="58" width="4" height="4" rx="1" fill="#16A34A" transform="rotate(45 88 58)" />
            <rect x="110" y="60" width="4" height="3" rx="1" fill="#22C55E" />

            {/* Chopsticks */}
            <line x1="30" y1="20" x2="98" y2="66" stroke="#92400E" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="38" y1="14" x2="105" y2="64" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
          <span className="absolute top-2 left-2 text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-900 border border-amber-300">
            Asin Gurih Pedas
          </span>
        </div>
      );

    case 'mie_gacoan':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-100/70 via-red-50 to-orange-100 rounded-xl ${className}`}>
          <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="138" rx="65" ry="12" fill="#000000" fillOpacity="0.12" />
            <path d="M42 68 C42 120 158 120 158 68 Z" fill="#0F172A" />
            <ellipse cx="100" cy="68" rx="58" ry="18" fill="#1E293B" />
            <ellipse cx="100" cy="67" rx="54" ry="15" fill="#334155" />

            {/* Sweet dark soy spicy glazed noodles */}
            <path d="M58 66 Q80 46 102 66 T142 66" stroke="#7C2D12" strokeWidth="6" strokeLinecap="round" />
            <path d="M54 72 Q86 54 112 72 T146 69" stroke="#9A3412" strokeWidth="5" strokeLinecap="round" />
            <path d="M66 62 Q94 44 126 64 T136 74" stroke="#DC2626" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M70 76 Q100 62 130 76" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />

            {/* Crispy Pangsit Goreng Triangle */}
            <polygon points="130,42 165,24 154,62" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            <polygon points="136,46 158,32 150,57" fill="#FDE68A" />

            {/* Minced Chicken */}
            <circle cx="86" cy="63" r="4" fill="#F1F5F9" />
            <circle cx="96" cy="60" r="3.5" fill="#E2E8F0" />
            <circle cx="106" cy="64" r="4" fill="#F8FAFC" />
            <circle cx="114" cy="67" r="3" fill="#CBD5E1" />

            {/* Fiery Red Bird's Eye Chilies */}
            <ellipse cx="80" cy="64" rx="4" ry="2.5" fill="#EF4444" transform="rotate(-25 80 64)" />
            <ellipse cx="102" cy="56" rx="4.5" ry="2.5" fill="#DC2626" transform="rotate(35 102 56)" />
            <ellipse cx="122" cy="65" rx="4" ry="2.2" fill="#B91C1C" transform="rotate(-15 122 65)" />
            <circle cx="98" cy="70" r="2" fill="#DC2626" />

            {/* Scallion & fried shallots */}
            <rect x="74" y="70" width="4" height="4" rx="1" fill="#22C55E" />
            <rect x="90" y="55" width="4" height="4" rx="1" fill="#16A34A" transform="rotate(45 90 55)" />
            <circle cx="110" cy="72" r="2.5" fill="#B45309" />
          </svg>
          <span className="absolute top-2 left-2 text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-red-500/10 text-red-700 border border-red-300">
            Manis Pedas Favorit
          </span>
        </div>
      );

    case 'mie_suit':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-amber-50/50 to-emerald-50/40 rounded-xl ${className}`}>
          <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="138" rx="65" ry="12" fill="#000000" fillOpacity="0.1" />
            <path d="M42 68 C42 120 158 120 158 68 Z" fill="#334155" />
            <ellipse cx="100" cy="68" rx="58" ry="18" fill="#475569" />
            <ellipse cx="100" cy="67" rx="54" ry="15" fill="#64748B" />

            {/* White garlic oil savory noodles - NO CHILI */}
            <path d="M58 66 Q80 48 102 66 T142 66" stroke="#FEF3C7" strokeWidth="6" strokeLinecap="round" />
            <path d="M54 72 Q86 56 112 72 T146 70" stroke="#FDE68A" strokeWidth="5" strokeLinecap="round" />
            <path d="M66 62 Q94 45 126 64 T136 74" stroke="#FCD34D" strokeWidth="4.5" strokeLinecap="round" />

            {/* Crispy Pangsit */}
            <polygon points="128,44 162,26 152,63" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            <polygon points="134,47 156,34 148,58" fill="#FDE68A" />

            {/* Generous Chicken & Fried Garlic */}
            <circle cx="85" cy="64" r="4.5" fill="#F8FAFC" />
            <circle cx="96" cy="61" r="4" fill="#E2E8F0" />
            <circle cx="106" cy="64" r="4.5" fill="#FFFFFF" />
            <circle cx="115" cy="67" r="3.5" fill="#CBD5E1" />

            {/* Fresh Green Scallion Bits */}
            <rect x="76" y="68" width="4" height="4" rx="1" fill="#22C55E" />
            <rect x="92" y="56" width="4" height="4" rx="1" fill="#16A34A" transform="rotate(45 92 56)" />
            <rect x="110" y="60" width="4" height="3" rx="1" fill="#22C55E" />
          </svg>
          <span className="absolute top-2 left-2 text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-800 border border-emerald-300">
            Level 0 - Tanpa Cabe
          </span>
        </div>
      );

    case 'udang_keju':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 rounded-xl ${className}`}>
          <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ceramic Plate */}
            <ellipse cx="100" cy="115" rx="72" ry="24" fill="#E2E8F0" />
            <ellipse cx="100" cy="112" rx="66" ry="20" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />

            {/* 3 Crispy Golden Panko Breaded Shrimp Balls */}
            {/* Ball 1 */}
            <circle cx="70" cy="95" r="22" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <circle cx="70" cy="95" r="20" fill="#FBBF24" />
            <circle cx="65" cy="90" r="4" fill="#FDE68A" />
            <circle cx="76" cy="100" r="3" fill="#D97706" />

            {/* Ball 2 (Melted cheese pull!) */}
            <circle cx="130" cy="95" r="22" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <circle cx="130" cy="95" r="20" fill="#FBBF24" />
            <circle cx="125" cy="90" r="4" fill="#FDE68A" />

            {/* Ball 3 (Center foreground) */}
            <circle cx="100" cy="85" r="24" fill="#D97706" stroke="#B45309" strokeWidth="2" />
            <circle cx="100" cy="85" r="22" fill="#F59E0B" />
            {/* Breadcrumb textures */}
            <circle cx="92" cy="78" r="3" fill="#FDE68A" />
            <circle cx="108" cy="82" r="3.5" fill="#FDE68A" />
            <circle cx="95" cy="92" r="2.5" fill="#B45309" />

            {/* Mozzarella cheese pull streaming out */}
            <path d="M100 85 Q115 102 128 105" stroke="#FEF08A" strokeWidth="6" strokeLinecap="round" />
            <path d="M100 85 Q115 102 128 105" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />

            {/* Sweet chili dipping sauce dip */}
            <ellipse cx="145" cy="120" rx="14" ry="7" fill="#DC2626" />
            <ellipse cx="145" cy="119" rx="10" ry="4" fill="#EF4444" />
          </svg>
          <span className="absolute top-2 left-2 text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-900 border border-amber-300">
            Mozzarella Cheese Pull
          </span>
        </div>
      );

    case 'udang_rambutan':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl ${className}`}>
          <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="118" rx="68" ry="20" fill="#E2E8F0" />
            <ellipse cx="100" cy="115" rx="62" ry="17" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />

            {/* Rambutan style crispy fried wonton ribbons wrapping shrimp ball */}
            <g transform="translate(100, 85)">
              <circle cx="0" cy="0" r="24" fill="#F59E0B" />
              {/* Crispy noodle strings shooting out */}
              {[-60, -45, -30, -15, 0, 15, 30, 45, 60, 90, 120, 150, 180, 210, 240].map((deg, i) => (
                <line
                  key={i}
                  x1={Math.cos((deg * Math.PI) / 180) * 18}
                  y1={Math.sin((deg * Math.PI) / 180) * 18}
                  x2={Math.cos((deg * Math.PI) / 180) * 32}
                  y2={Math.sin((deg * Math.PI) / 180) * 32}
                  stroke="#D97706"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              ))}
              <circle cx="0" cy="0" r="20" fill="#FBBF24" />
              <circle cx="-5" cy="-5" r="4" fill="#FEF08A" />
            </g>

            {/* Second ball side */}
            <g transform="translate(62, 92) scale(0.8)">
              <circle cx="0" cy="0" r="20" fill="#F59E0B" />
              <circle cx="0" cy="0" r="16" fill="#FBBF24" />
            </g>
            {/* Third ball side */}
            <g transform="translate(138, 92) scale(0.8)">
              <circle cx="0" cy="0" r="20" fill="#F59E0B" />
              <circle cx="0" cy="0" r="16" fill="#FBBF24" />
            </g>
          </svg>
          <span className="absolute top-2 left-2 text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-orange-500/10 text-orange-800 border border-orange-300">
            Super Renyah Kriuk
          </span>
        </div>
      );

    case 'siomay':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 to-red-50 rounded-xl ${className}`}>
          <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Steamer Bamboo Basket Base */}
            <ellipse cx="100" cy="120" rx="70" ry="22" fill="#B45309" />
            <ellipse cx="100" cy="116" rx="66" ry="19" fill="#D97706" />
            <ellipse cx="100" cy="114" rx="62" ry="16" fill="#FEF3C7" />

            {/* 3 Steamed Dumplings */}
            <path d="M60 85 C55 95 62 108 75 108 C88 108 95 95 90 85 C85 78 65 78 60 85 Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
            <circle cx="75" cy="85" r="5" fill="#EF4444" />

            <path d="M110 85 C105 95 112 108 125 108 C138 108 145 95 140 85 C135 78 115 78 110 85 Z" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
            <circle cx="125" cy="85" r="5" fill="#EF4444" />

            <path d="M85 75 C80 85 87 98 100 98 C113 98 120 85 115 75 C110 68 90 68 85 75 Z" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
            <circle cx="100" cy="74" r="5.5" fill="#DC2626" />
          </svg>
          <span className="absolute top-2 left-2 text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-800 border border-amber-300">
            Kukus Ayam Lembut
          </span>
        </div>
      );

    case 'pangsit':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 to-orange-100 rounded-xl ${className}`}>
          <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="125" rx="65" ry="18" fill="#CBD5E1" />
            <polygon points="50,90 100,45 120,95" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
            <polygon points="90,95 145,50 160,105" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
            <polygon points="75,110 115,70 145,115" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
            {/* Center filling bump */}
            <circle cx="112" cy="100" r="7" fill="#D97706" />
          </svg>
          <span className="absolute top-2 left-2 text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-800 border border-yellow-400">
            5 Pcs Ekstra Garing
          </span>
        </div>
      );

    case 'lumpia':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl ${className}`}>
          <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="120" rx="60" ry="18" fill="#CBD5E1" />
            {/* 3 Golden rolls */}
            <rect x="60" y="80" width="80" height="18" rx="8" transform="rotate(-15 60 80)" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
            <rect x="65" y="95" width="80" height="18" rx="8" transform="rotate(-5 65 95)" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
            <rect x="70" y="110" width="80" height="18" rx="8" transform="rotate(5 70 110)" fill="#FCD34D" stroke="#D97706" strokeWidth="2" />
          </svg>
          <span className="absolute top-2 left-2 text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-900 border border-amber-300">
            Kulit Kembang Tahu
          </span>
        </div>
      );

    case 'es_gobak_sodor':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-red-50 to-amber-50 rounded-xl ${className}`}>
          <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="140" rx="40" ry="10" fill="#000000" fillOpacity="0.12" />
            {/* Tall Glass */}
            <path d="M72 40 L80 130 C80 135 120 135 120 130 L128 40 Z" fill="#FEE2E2" stroke="#FDA4AF" strokeWidth="2" fillOpacity="0.8" />
            {/* Fruit Layering & Syrup */}
            <path d="M74 55 L80 130 C80 135 120 135 120 130 L126 55 Z" fill="#FB7185" />
            {/* Grass jelly chunks */}
            <rect x="85" y="75" width="10" height="10" rx="2" fill="#0F172A" />
            <rect x="105" y="85" width="9" height="9" rx="2" fill="#0F172A" />
            <rect x="92" y="100" width="11" height="9" rx="2" fill="#0F172A" />
            {/* Fruit pieces */}
            <circle cx="95" cy="65" r="6" fill="#FBBF24" />
            <circle cx="112" cy="72" r="5" fill="#EF4444" />
            <circle cx="86" cy="118" r="4" fill="#F87171" />
            {/* Ice Cubes */}
            <rect x="88" y="48" width="14" height="12" rx="3" fill="#FFFFFF" fillOpacity="0.8" stroke="#E2E8F0" />
            <rect x="106" y="52" width="12" height="12" rx="3" fill="#FFFFFF" fillOpacity="0.8" stroke="#E2E8F0" />
            {/* Straw */}
            <line x1="85" y1="18" x2="108" y2="125" stroke="#F43F5E" strokeWidth="4" strokeLinecap="round" />
            {/* Mint leaves */}
            <ellipse cx="78" cy="35" rx="8" ry="4" fill="#22C55E" transform="rotate(-30 78 35)" />
          </svg>
          <span className="absolute top-2 left-2 text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-700 border border-rose-300">
            Pelepas Dahaga No. 1
          </span>
        </div>
      );

    case 'es_teklek':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-lime-50 rounded-xl ${className}`}>
          <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="140" rx="40" ry="10" fill="#000000" fillOpacity="0.1" />
            <path d="M72 40 L80 130 C80 135 120 135 120 130 L128 40 Z" fill="#DCFCE7" stroke="#86EFAC" strokeWidth="2" fillOpacity="0.8" />
            <path d="M74 58 L80 130 C80 135 120 135 120 130 L126 58 Z" fill="#4ADE80" />
            {/* Lime slice */}
            <circle cx="76" cy="42" r="14" fill="#84CC16" stroke="#65A30D" strokeWidth="2" />
            <circle cx="76" cy="42" r="11" fill="#BEF264" />
            {/* Straw */}
            <line x1="115" y1="18" x2="95" y2="125" stroke="#16A34A" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span className="absolute top-2 left-2 text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-800 border border-emerald-300">
            Jeruk Nipis & Melon
          </span>
        </div>
      );

    case 'es_sluku':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 to-stone-100 rounded-xl ${className}`}>
          <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="140" rx="40" ry="10" fill="#000000" fillOpacity="0.1" />
            <path d="M72 40 L80 130 C80 135 120 135 120 130 L128 40 Z" fill="#D7CCC8" stroke="#A1887F" strokeWidth="2" fillOpacity="0.9" />
            <path d="M74 58 L80 130 C80 135 120 135 120 130 L126 58 Z" fill="#8D6E63" />
            {/* Cream foam top */}
            <ellipse cx="100" cy="58" rx="26" ry="6" fill="#FFF8E1" />
            {/* Straw */}
            <line x1="115" y1="18" x2="95" y2="125" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span className="absolute top-2 left-2 text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-900 border border-amber-300">
            Creamy Mocca & Cincau
          </span>
        </div>
      );

    case 'es_petak':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-yellow-50 to-emerald-50 rounded-xl ${className}`}>
          <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="140" rx="40" ry="10" fill="#000000" fillOpacity="0.1" />
            <path d="M72 40 L80 130 C80 135 120 135 120 130 L128 40 Z" fill="#FEF08A" stroke="#FDE047" strokeWidth="2" fillOpacity="0.8" />
            <path d="M74 58 L80 130 C80 135 120 135 120 130 L126 58 Z" fill="#FACC15" />
            <circle cx="95" cy="75" r="4" fill="#FFFFFF" />
            <circle cx="108" cy="95" r="4" fill="#FFFFFF" />
            <line x1="115" y1="18" x2="95" y2="125" stroke="#EAB308" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span className="absolute top-2 left-2 text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-800 border border-yellow-300">
            Lemonade & Nata De Coco
          </span>
        </div>
      );

    case 'es_teh':
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl ${className}`}>
          <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="140" rx="40" ry="10" fill="#000000" fillOpacity="0.1" />
            <path d="M72 40 L80 130 C80 135 120 135 120 130 L128 40 Z" fill="#FED7AA" stroke="#FDBA74" strokeWidth="2" fillOpacity="0.8" />
            <path d="M74 58 L80 130 C80 135 120 135 120 130 L126 58 Z" fill="#EA580C" />
            <ellipse cx="100" cy="58" rx="26" ry="7" fill="#FFEDD5" />
            <line x1="115" y1="18" x2="95" y2="125" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <span className="absolute top-2 left-2 text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-orange-500/10 text-orange-800 border border-orange-300">
            Teh Susu Tarik Berbusa
          </span>
        </div>
      );

    case 'paket_mabar':
    case 'paket_puas':
    default:
      return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-100 via-red-50 to-yellow-100 rounded-xl ${className}`}>
          <svg viewBox="0 0 200 160" className="w-full h-full max-h-40 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="100" cy="140" rx="60" ry="12" fill="#000000" fillOpacity="0.1" />
            {/* Mini Noodle Bowl */}
            <path d="M40 85 C40 120 110 120 110 85 Z" fill="#1E293B" />
            <path d="M50 82 Q75 68 100 82" stroke="#F59E0B" strokeWidth="5" strokeLinecap="round" />
            {/* Dimsum side */}
            <circle cx="125" cy="100" r="14" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="125" cy="100" r="11" fill="#FBBF24" />
            {/* Drink Glass */}
            <path d="M142 55 L146 115 C146 118 165 118 165 115 L169 55 Z" fill="#FEE2E2" stroke="#FDA4AF" strokeWidth="1.5" />
            <path d="M143 68 L146 115 C146 118 165 118 165 115 L168 68 Z" fill="#F43F5E" />
          </svg>
          <span className="absolute top-2 left-2 text-[11px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-red-500/10 text-red-700 border border-red-300">
            Paket Komplit Hemat
          </span>
        </div>
      );
  }
};
