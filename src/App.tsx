import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MenuItemCard } from './components/MenuItemCard';
import { CustomizeModal } from './components/CustomizeModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderStatusModal } from './components/OrderStatusModal';
import { SpicyLevelGuideModal } from './components/SpicyLevelGuideModal';
import { KitchenDisplayView } from './components/KitchenDisplayView';
import { MENU_ITEMS } from './data/menuData';
import { MenuItem, CartItem, MenuCategory, OrderType, PlacedOrder, OrderStatus } from './types';
import { calculateOrderTotals, generateQueueNumber, OrderItem } from './utils/orderMath';
import { playRestaurantBell } from './utils/audioNotification';
import { Flame, Utensils, Coffee, Box, Layers, Search, AlertCircle, ShoppingBag } from 'lucide-react';

// Deterministic seed orders for live restaurant queue and kitchen view
const INITIAL_SEED_ORDERS: PlacedOrder[] = [
  {
    orderId: 'ORD-9821',
    queueNumber: 'GC-A014',
    orderType: 'dine_in',
    tableNumber: '12',
    customerName: 'Bagus Pratama',
    items: [
      {
        cartItemId: 'seed_1',
        menuItem: MENU_ITEMS[0], // Mie Hompimpa
        quantity: 2,
        spicyLevel: 2,
        spiceStyle: 'asin',
        selectedExtras: [],
        notes: 'Satu porsi tanpa daun bawang',
      },
      {
        cartItemId: 'seed_2',
        menuItem: MENU_ITEMS[3], // Udang Keju
        quantity: 1,
        selectedExtras: [],
        notes: '',
      },
      {
        cartItemId: 'seed_3',
        menuItem: MENU_ITEMS[8], // Es Gobak Sodor
        quantity: 2,
        selectedExtras: [],
        notes: '',
      },
    ],
    subtotal: 49500,
    discount: 0,
    packagingFee: 0,
    pb1Tax: 4950,
    total: 54450,
    paymentMethod: 'qris',
    status: 'cooking',
    createdAt: Date.now() - 1000 * 60 * 8,
    estimatedMinutes: 5,
  },
  {
    orderId: 'ORD-9820',
    queueNumber: 'GC-A013',
    orderType: 'takeaway',
    customerName: 'Siti Rahma',
    customerPhone: '081234567890',
    items: [
      {
        cartItemId: 'seed_4',
        menuItem: MENU_ITEMS[1], // Mie Gacoan
        quantity: 1,
        spicyLevel: 4,
        spiceStyle: 'manis',
        selectedExtras: [],
        notes: 'Ekstra pedas cabe rawit ulek',
      },
      {
        cartItemId: 'seed_5',
        menuItem: MENU_ITEMS[4], // Udang Rambutan
        quantity: 1,
        selectedExtras: [],
        notes: '',
      },
    ],
    subtotal: 20000,
    discount: 0,
    packagingFee: 2000,
    pb1Tax: 2000,
    total: 24000,
    paymentMethod: 'gopay',
    status: 'ready',
    createdAt: Date.now() - 1000 * 60 * 15,
    estimatedMinutes: 0,
  },
];

export default function App() {
  // Navigation & View State
  const [isKitchenMode, setIsKitchenMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('semua');
  const [spicyFilter, setSpicyFilter] = useState<'all' | 'level0' | 'level1_4' | 'level6_8'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dining Mode & User Identity
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [tableNumber, setTableNumber] = useState('18');
  const [customerName, setCustomerName] = useState('Pelanggan Gacoan');
  const [customerPhone, setCustomerPhone] = useState('');

  // Cart & Voucher
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedVoucherCode, setAppliedVoucherCode] = useState<string>('');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSpicyGuideOpen, setIsSpicyGuideOpen] = useState(false);
  const [isOrderStatusOpen, setIsOrderStatusOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Orders Store
  const [orders, setOrders] = useState<PlacedOrder[]>(INITIAL_SEED_ORDERS);
  const [currentOrder, setCurrentOrder] = useState<PlacedOrder | null>(INITIAL_SEED_ORDERS[0]);
  const [queueSequence, setQueueSequence] = useState<number>(15);

  // Calculate cart totals
  const mappedOrderItems: OrderItem[] = useMemo(() => {
    return cartItems.map((item) => ({
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
  }, [cartItems]);

  const cartTotals = useMemo(() => {
    return calculateOrderTotals(mappedOrderItems, orderType, appliedVoucherCode);
  }, [mappedOrderItems, orderType, appliedVoucherCode]);

  const totalCartCount = useMemo(() => {
    return cartItems.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cartItems]);

  // Filtered menu items
  const filteredMenuItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category filter
      if (activeCategory !== 'semua' && item.category !== activeCategory) {
        return false;
      }

      // Spicy filter
      if (spicyFilter === 'level0') {
        if (item.allowSpicyLevel) return false;
      } else if (spicyFilter === 'level1_4') {
        if (!item.allowSpicyLevel) return false;
      } else if (spicyFilter === 'level6_8') {
        if (!item.allowSpicyLevel || (item.maxSpicyLevel && item.maxSpicyLevel < 6)) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(query);
        const matchTagline = item.tagline.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        return matchName || matchTagline || matchDesc;
      }

      return true;
    });
  }, [activeCategory, spicyFilter, searchQuery]);

  // Add Item to Cart
  const handleAddToCart = (newItem: Omit<CartItem, 'cartItemId'>) => {
    setCartItems((prev) => {
      // Check if identical item already exists (same menuId, level, flavor, extras, notes)
      const existingIndex = prev.findIndex((i) => {
        const sameId = i.menuItem.id === newItem.menuItem.id;
        const sameLevel = i.spicyLevel === newItem.spicyLevel;
        const sameFlavor = i.spiceStyle === newItem.spiceStyle;
        const sameNotes = i.notes === newItem.notes;
        const sameExtras =
          i.selectedExtras.length === newItem.selectedExtras.length &&
          i.selectedExtras.every((e) => newItem.selectedExtras.some((ne) => ne.id === e.id));
        return sameId && sameLevel && sameFlavor && sameNotes && sameExtras;
      });

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      } else {
        const cartItemId = `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        return [...prev, { ...newItem, cartItemId }];
      }
    });
  };

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
    setAppliedVoucherCode('');
  };

  // Checkout and Order Placement
  const handleConfirmOrder = (paymentMethod: 'qris' | 'gopay' | 'ovo' | 'shopeepay' | 'tunai') => {
    const queueCode = generateQueueNumber(queueSequence);
    setQueueSequence((q) => q + 1);

    const newOrder: PlacedOrder = {
      orderId: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      queueNumber: queueCode,
      orderType,
      tableNumber: orderType === 'dine_in' ? tableNumber : undefined,
      customerName: customerName || 'Pelanggan Gacoan',
      customerPhone,
      items: [...cartItems],
      subtotal: cartTotals.subtotal,
      discount: cartTotals.discount,
      packagingFee: cartTotals.packagingFee,
      pb1Tax: cartTotals.pb1Tax,
      total: cartTotals.total,
      appliedVoucherCode: cartTotals.appliedVoucher?.code,
      paymentMethod,
      status: 'received',
      createdAt: Date.now(),
      estimatedMinutes: 12,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    setCartItems([]);
    setAppliedVoucherCode('');
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setIsOrderStatusOpen(true);
    playRestaurantBell('order_placed');
  };

  // Update order status in KDS
  const handleUpdateOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.orderId === orderId ? { ...ord, status: nextStatus } : ord))
    );
    if (currentOrder && currentOrder.orderId === orderId) {
      setCurrentOrder((prev) => (prev ? { ...prev, status: nextStatus } : null));
    }
  };

  // Auto-progress demo order simulation after 10 seconds for fun interactive showcase
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.status === 'received' && Date.now() - ord.createdAt > 8000) {
            return { ...ord, status: 'cooking' };
          }
          return ord;
        })
      );
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 font-sans selection:bg-red-500 selection:text-white flex flex-col">
      {/* 3-Zone Clean Header */}
      <Navbar
        cartItemCount={totalCartCount}
        cartTotal={cartTotals.total}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSpicyGuide={() => setIsSpicyGuideOpen(true)}
        onOpenLiveQueue={() => {
          if (orders.length > 0) {
            setCurrentOrder(orders[0]);
            setIsOrderStatusOpen(true);
          }
        }}
        onToggleKitchenMode={() => setIsKitchenMode((prev) => !prev)}
        isKitchenMode={isKitchenMode}
        orderType={orderType}
        tableNumber={tableNumber}
      />

      {isKitchenMode ? (
        /* Kitchen / POS Staff View */
        <KitchenDisplayView
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onBackToCustomer={() => setIsKitchenMode(false)}
        />
      ) : (
        /* Customer Ordering Experience */
        <main className="flex-1 pb-24">
          {/* Hero Section & Dining Mode */}
          <HeroBanner
            orderType={orderType}
            setOrderType={setOrderType}
            tableNumber={tableNumber}
            setTableNumber={setTableNumber}
            customerName={customerName}
            setCustomerName={setCustomerName}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenSpicyGuide={() => setIsSpicyGuideOpen(true)}
            onApplyVoucherSuggestion={(code) => {
              setAppliedVoucherCode(code);
              setIsCartOpen(true);
            }}
          />

          {/* Menu Catalog & Filters Section */}
          <section id="menu-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
            {/* Category Segmented Tabs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              {/* Category buttons */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveCategory('semua')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeCategory === 'semua'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Semua Menu
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory('mie')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeCategory === 'mie'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  Mie Pedas ({MENU_ITEMS.filter((i) => i.category === 'mie').length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory('dimsum')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeCategory === 'dimsum'
                      ? 'bg-amber-500 text-stone-950 shadow-xs'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  <Utensils className="w-3.5 h-3.5" />
                  Dimsum & Sides ({MENU_ITEMS.filter((i) => i.category === 'dimsum').length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory('minuman')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeCategory === 'minuman'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  <Coffee className="w-3.5 h-3.5" />
                  Minuman Es ({MENU_ITEMS.filter((i) => i.category === 'minuman').length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory('paket')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    activeCategory === 'paket'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-950'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  Paket Hemat
                </button>
              </div>

              {/* Spicy heat quick-filter */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-stone-500 font-medium hidden md:inline">Filter Pedas:</span>
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setSpicyFilter('all')}
                    className={`px-2 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                      spicyFilter === 'all'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpicyFilter('level0')}
                    className={`px-2 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                      spicyFilter === 'level0'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Tidak Pedas
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpicyFilter('level1_4')}
                    className={`px-2 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                      spicyFilter === 'level1_4'
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Lvl 1 - 4
                  </button>
                  <button
                    type="button"
                    onClick={() => setSpicyFilter('level6_8')}
                    className={`px-2 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                      spicyFilter === 'level6_8'
                        ? 'bg-red-700 text-white shadow-2xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Lvl 6 - 8 (Setan)
                  </button>
                </div>
              </div>
            </div>

            {/* Menu Items Grid */}
            {filteredMenuItems.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-stone-200 text-stone-400">
                <Search className="w-12 h-12 mx-auto stroke-[1.5] text-stone-300 mb-2" />
                <h3 className="text-sm font-bold text-stone-700">Menu tidak ditemukan</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Coba cari dengan kata kunci lain atau reset filter kategori.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('semua');
                    setSpicyFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                >
                  Reset Semua Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMenuItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onSelect={(selected) => setCustomizingItem(selected)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Floating Mobile Sticky Cart CTA Bar (Conforms to <= 15% viewport height cap) */}
          {totalCartCount > 0 && (
            <div className="sm:hidden fixed bottom-3 left-3 right-3 z-40">
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-red-600 text-white font-extrabold text-sm flex items-center justify-between shadow-lg active:scale-98 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-xs font-bold font-mono">
                    {totalCartCount}
                  </span>
                  <span>Lihat Keranjang Pesanan</span>
                </div>
                <span className="font-mono tabular-nums text-amber-200">
                  {cartTotals.total ? `Rp ${cartTotals.total.toLocaleString('id-ID')}` : ''}
                </span>
              </button>
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-stone-900 text-stone-400 py-10 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-200 font-bold">
            <Flame className="w-4 h-4 text-red-500 fill-red-500" />
            <span>MIE GACOAN - Jagonya Mie Pedas No. 1 di Indonesia</span>
          </div>
          <div className="text-stone-500 text-center sm:text-right">
            Sistem Pemesanan Mandiri & Antrean Meja Terintegrasi · 100% Halal
          </div>
        </div>
      </footer>

      {/* Item Customizer Modal */}
      <CustomizeModal
        item={customizingItem}
        isOpen={!!customizingItem}
        onClose={() => setCustomizingItem(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        orderType={orderType}
        setOrderType={setOrderType}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
        customerName={customerName}
        setCustomerName={setCustomerName}
        appliedVoucherCode={appliedVoucherCode}
        setAppliedVoucherCode={setAppliedVoucherCode}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Payment & Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        orderType={orderType}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
        customerName={customerName}
        setCustomerName={setCustomerName}
        customerPhone={customerPhone}
        setCustomerPhone={setCustomerPhone}
        appliedVoucherCode={appliedVoucherCode}
        onConfirmOrder={handleConfirmOrder}
      />

      {/* Live Order Status Ticket Modal */}
      <OrderStatusModal
        order={currentOrder}
        isOpen={isOrderStatusOpen}
        onClose={() => setIsOrderStatusOpen(false)}
        onNewOrder={() => {
          setCartItems([]);
          setIsOrderStatusOpen(false);
        }}
      />

      {/* Spicy Level Guide Modal */}
      <SpicyLevelGuideModal
        isOpen={isSpicyGuideOpen}
        onClose={() => setIsSpicyGuideOpen(false)}
        onSelectLevel={(lvl) => {
          // Open Mie Hompimpa or Gacoan customized with this level
          const noodle = MENU_ITEMS[0];
          setCustomizingItem({ ...noodle, defaultLevel: lvl });
        }}
      />
    </div>
  );
}
