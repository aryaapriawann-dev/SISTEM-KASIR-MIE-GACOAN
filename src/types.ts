export type MenuCategory = 'semua' | 'mie' | 'dimsum' | 'minuman' | 'paket';
export type OrderType = 'dine_in' | 'takeaway';

export interface ExtraOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category: 'mie' | 'dimsum' | 'minuman' | 'paket';
  allowSpicyLevel: boolean;
  maxSpicyLevel?: number;
  defaultLevel?: number;
  spiceStyle?: 'asin' | 'manis' | 'none';
  popular?: boolean;
  recommended?: boolean;
  availableExtras?: ExtraOption[];
  imageSvgType: 'mie_hompimpa' | 'mie_gacoan' | 'mie_suit' | 'udang_keju' | 'udang_rambutan' | 'siomay' | 'pangsit' | 'lumpia' | 'es_gobak_sodor' | 'es_teklek' | 'es_sluku' | 'es_petak' | 'es_teh' | 'paket_mabar' | 'paket_puas';
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  spicyLevel?: number;
  spiceStyle?: 'asin' | 'manis';
  selectedExtras: ExtraOption[];
  notes: string;
}

export type OrderStatus = 'received' | 'cooking' | 'ready' | 'completed';

export interface PlacedOrder {
  orderId: string;
  queueNumber: string;
  orderType: 'dine_in' | 'takeaway';
  tableNumber?: string;
  customerName: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  packagingFee: number;
  pb1Tax: number;
  total: number;
  appliedVoucherCode?: string;
  paymentMethod: 'qris' | 'gopay' | 'ovo' | 'shopeepay' | 'tunai';
  status: OrderStatus;
  createdAt: number;
  estimatedMinutes: number;
}
