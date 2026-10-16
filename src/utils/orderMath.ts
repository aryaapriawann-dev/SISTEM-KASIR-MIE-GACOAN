export interface OrderExtra {
  name: string;
  price: number;
}

export interface OrderItem {
  id: string;
  menuId: string;
  name: string;
  price: number;
  quantity: number;
  category: 'mie' | 'dimsum' | 'minuman' | 'paket';
  spicyLevel?: number;
  flavor?: 'asin' | 'manis' | 'ori';
  extras?: OrderExtra[];
  notes?: string;
}

export type OrderType = 'dine_in' | 'takeaway';

export interface Voucher {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  minSpend: number;
  maxDiscount?: number;
  description: string;
}

export const AVAILABLE_VOUCHERS: Record<string, Voucher> = {
  GACOANPEDAS: {
    code: 'GACOANPEDAS',
    type: 'percent',
    value: 15,
    minSpend: 30000,
    maxDiscount: 15000,
    description: 'Diskon 15% (Maks. Rp 15.000) Min. Belanja Rp 30.000',
  },
  HEMAT10K: {
    code: 'HEMAT10K',
    type: 'flat',
    value: 10000,
    minSpend: 40000,
    description: 'Potongan Rp 10.000 Min. Belanja Rp 40.000',
  },
  HEMATKENYANG: {
    code: 'HEMATKENYANG',
    type: 'flat',
    value: 5000,
    minSpend: 25000,
    description: 'Potongan Rp 5.000 Min. Belanja Rp 25.000',
  },
};

export interface OrderTotals {
  subtotal: number;
  discount: number;
  packagingFee: number;
  pb1Tax: number;
  total: number;
  appliedVoucher?: Voucher;
}

export function formatRupiah(amount: number): string {
  const safeAmount = Math.max(0, Math.round(amount));
  return `Rp ${safeAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
}

export function calculateOrderTotals(
  items: OrderItem[],
  orderType: OrderType,
  voucherCode?: string
): OrderTotals {
  const subtotal = items.reduce((sum, item) => {
    const extrasTotal = item.extras?.reduce((acc, curr) => acc + curr.price, 0) || 0;
    return sum + (item.price + extrasTotal) * item.quantity;
  }, 0);

  // Takeaway packaging fee: Rp 1.000 per food item (mie, dimsum, paket)
  let packagingFee = 0;
  if (orderType === 'takeaway') {
    const foodItemCount = items
      .filter((i) => i.category !== 'minuman')
      .reduce((sum, i) => sum + i.quantity, 0);
    packagingFee = foodItemCount * 1000;
  }

  let discount = 0;
  let appliedVoucher: Voucher | undefined;

  if (voucherCode) {
    const cleanCode = voucherCode.trim().toUpperCase();
    const voucher = AVAILABLE_VOUCHERS[cleanCode];
    if (voucher && subtotal >= voucher.minSpend) {
      if (voucher.type === 'percent') {
        const calculated = Math.round((subtotal * voucher.value) / 100);
        discount = voucher.maxDiscount ? Math.min(calculated, voucher.maxDiscount) : calculated;
      } else {
        discount = voucher.value;
      }
      appliedVoucher = voucher;
    }
  }

  const taxableAmount = Math.max(0, subtotal - discount);
  // PB1 Restaurant Local Tax is 10%
  const pb1Tax = Math.round(taxableAmount * 0.1);
  const total = taxableAmount + packagingFee + pb1Tax;

  return {
    subtotal,
    discount,
    packagingFee,
    pb1Tax,
    total,
    appliedVoucher,
  };
}

export interface SpicyLevelInfo {
  level: number;
  name: string;
  chiliCount: string;
  isExtremelySpicy: boolean;
  colorClass: string;
}

export function getSpicyDetails(level: number): SpicyLevelInfo {
  switch (level) {
    case 0:
      return {
        level: 0,
        name: 'Level 0 (Original)',
        chiliCount: '0 Cabe - Gurih Tanpa Pedas',
        isExtremelySpicy: false,
        colorClass: 'text-amber-600',
      };
    case 1:
      return {
        level: 1,
        name: 'Level 1 (Pemula)',
        chiliCount: '±12 Cabe Rawit Merah',
        isExtremelySpicy: false,
        colorClass: 'text-orange-500',
      };
    case 2:
      return {
        level: 2,
        name: 'Level 2 (Santai)',
        chiliCount: '±25 Cabe Rawit Merah',
        isExtremelySpicy: false,
        colorClass: 'text-orange-600',
      };
    case 3:
      return {
        level: 3,
        name: 'Level 3 (Mulai Keringetan)',
        chiliCount: '±35 Cabe Rawit Merah',
        isExtremelySpicy: false,
        colorClass: 'text-red-500',
      };
    case 4:
      return {
        level: 4,
        name: 'Level 4 (Nendang Banget)',
        chiliCount: '±45 Cabe Rawit Merah',
        isExtremelySpicy: false,
        colorClass: 'text-red-600',
      };
    case 6:
      return {
        level: 6,
        name: 'Level 6 (Setan / Iblis)',
        chiliCount: '±70 Cabe Rawit Ulek',
        isExtremelySpicy: true,
        colorClass: 'text-red-700',
      };
    case 8:
      return {
        level: 8,
        name: 'Level 8 (Hati-Hati Meledak!)',
        chiliCount: '±100+ Cabe Rawit Setan',
        isExtremelySpicy: true,
        colorClass: 'text-rose-800',
      };
    default:
      return {
        level,
        name: `Level ${level}`,
        chiliCount: `${level * 12} Cabe`,
        isExtremelySpicy: level >= 6,
        colorClass: 'text-red-600',
      };
  }
}

export function generateQueueNumber(sequence: number): string {
  const letters = ['A', 'B', 'C', 'D'];
  const blockIndex = Math.floor((sequence - 1) / 50) % letters.length;
  const block = letters[blockIndex];
  const num = (((sequence - 1) % 50) + 1).toString().padStart(3, '0');
  return `GC-${block}${num}`;
}

export function validateOrder(input: {
  orderType: OrderType;
  tableNumber: string;
  customerName: string;
  itemCount: number;
}): { valid: boolean; error?: string } {
  if (input.itemCount <= 0) {
    return { valid: false, error: 'Keranjang belanja masih kosong. Pilih menu favoritmu dulu!' };
  }

  if (input.orderType === 'dine_in') {
    const tableNum = parseInt(input.tableNumber, 10);
    if (!input.tableNumber || isNaN(tableNum) || tableNum < 1 || tableNum > 99) {
      return { valid: false, error: 'Silakan masukkan nomor meja yang valid (1 - 99).' };
    }
  } else {
    if (!input.customerName || input.customerName.trim().length < 2) {
      return { valid: false, error: 'Silakan isi nama pemesan untuk panggilan antrean bungkus.' };
    }
  }

  return { valid: true };
}
