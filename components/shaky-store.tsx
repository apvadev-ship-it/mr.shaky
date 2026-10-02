"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { products, demoReviews } from '@/lib/demo-data';
import { getCouponPercent, applyDiscount } from '@/lib/coupons';
import { type BowlConfig, type CartItem, bowlId, bowlItem, validBowl } from '@/app/bowl-data';

export type Cart = Record<string, number>;
export type PaymentMethod = 'cash' | 'online';
export type Order = { id: string; branch: string; date: string; time: string; subtotal: number; discount: number; couponCode: string | null; total: number; items: { name: string; qty: number }[]; paymentMethod: PaymentMethod; status: string };
export type Review = { id: string; name: string; text: string; stars: number };
type CashOrderResponse = { orderId: string; branch: string; pickupDate: string; pickupTime: string; subtotal: number; discount: number; couponCode: string | null; total: number; items: { name: string; qty: number }[] };
type WompiInitResponse = { orderId: string; reference: string; amountInCents: number; currency: 'COP'; integritySignature: string; publicKey: string; redirectUrl: string };

const localDate = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` };

type Ctx = {
  cart: Cart; favorites: string[]; compare: string[];
  bowls: BowlConfig[]; catalog: CartItem[]; addBowl: (config: BowlConfig) => void;
  cartOpen: boolean; setCartOpen: (v: boolean) => void;
  navOpen: boolean; setNavOpen: (v: boolean) => void;
  compareOpen: boolean; setCompareOpen: (v: boolean) => void;
  branch: string; setBranch: (v: string) => void;
  date: string; setDate: (v: string) => void;
  time: string; setTime: (v: string) => void;
  slots: string[];
  customerName: string; setCustomerName: (v: string) => void;
  customerPhone: string; setCustomerPhone: (v: string) => void;
  paymentMethod: PaymentMethod; setPaymentMethod: (v: PaymentMethod) => void;
  submitting: boolean;
  order: Order | null; orders: Order[]; orderOpen: boolean; setOrderOpen: (v: boolean) => void;
  reviews: Review[]; reviewOpen: boolean; setReviewOpen: (v: boolean) => void;
  addReview: (name: string, text: string, stars: number) => void;
  count: number; subtotal: number; discount: number; total: number;
  couponInput: string; setCouponInput: (v: string) => void;
  appliedCoupon: string | null; couponError: string | null;
  applyCoupon: () => void; removeCoupon: () => void;
  add: (id: string) => void;
  changeQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleFavorite: (id: string) => void;
  toggleCompare: (id: string) => void;
  submitOrder: (e: React.FormEvent, onEmpty: () => void) => void;
};

const ShakyCtx = createContext<Ctx | null>(null);
export function useShaky() {
  const c = useContext(ShakyCtx);
  if (!c) throw new Error('useShaky must be used within ShakyProvider');
  return c;
}

export function ShakyProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const [bowls, setBowls] = useState<BowlConfig[]>([]);

  const [favorites, setFavorites] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [branch, setBranch] = useState('turbo');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  // Historial: el más reciente primero.
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderOpen, setOrderOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>(demoReviews);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('shaky-demo-v1') || '{}');
      const savedBowls: BowlConfig[] = Array.isArray(saved.bowls) ? saved.bowls.filter(validBowl) : [];
      setBowls(savedBowls);
      const known = [...products.map(p => p.id), ...savedBowls.map(bowlId)];
      setCart(Object.fromEntries(Object.entries(saved.cart || {}).filter(([id, n]) => known.includes(id) && Number.isInteger(n) && Number(n) > 0 && Number(n) <= 99)) as Cart);
      setFavorites(Array.isArray(saved.favorites) ? saved.favorites.filter((id: string) => products.some(p => p.id === id)) : []);
      if (Array.isArray(saved.reviews)) setReviews([...demoReviews, ...saved.reviews.filter((r: any) => typeof r.name === 'string' && typeof r.text === 'string' && r.stars >= 1 && r.stars <= 5).slice(0, 20)]);
      if (saved.order && typeof saved.order.id === 'string' && Array.isArray(saved.order.items)) setOrder(saved.order);
      if (Array.isArray(saved.orders)) setOrders(saved.orders.filter((o: Order) => o && typeof o.id === 'string' && Array.isArray(o.items)).slice(0, 25));
      if (typeof saved.customerName === 'string') setCustomerName(saved.customerName.slice(0, 80));
      if (typeof saved.customerPhone === 'string') setCustomerPhone(saved.customerPhone.slice(0, 20));
      if (typeof saved.appliedCoupon === 'string' && getCouponPercent(saved.appliedCoupon) !== null) { setAppliedCoupon(saved.appliedCoupon); setCouponInput(saved.appliedCoupon) }
    } catch { }
    setDate(localDate());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) try { localStorage.setItem('shaky-demo-v1', JSON.stringify({ cart, favorites, bowls, orders, reviews: reviews.filter(r => !r.id.startsWith('r')), order, customerName, customerPhone, appliedCoupon })) } catch { }
  }, [cart, favorites, bowls, orders, reviews, order, customerName, customerPhone, appliedCoupon, loaded]);

  const add = (id: string) => { setCart(c => ({ ...c, [id]: Math.min(99, (c[id] || 0) + 1) })); toast.success('Agregado a tu carrito', { id: 'cart-add', description: catalog.find(p => p.id === id)?.name }) };
  const changeQty = (id: string, delta: number) => setCart(c => { const next = { ...c, [id]: Math.min(99, (c[id] || 0) + delta) }; if (next[id] <= 0) delete next[id]; return next });
  const removeFromCart = (id: string) => setCart(c => { const next = { ...c }; delete next[id]; return next });
  const clearCart = () => { setCart({}); setBowls([]) };
  const toggleFavorite = (id: string) => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  const toggleCompare = (id: string) => { if (compare.includes(id)) setCompare(compare.filter(x => x !== id)); else if (compare.length < 3) setCompare([...compare, id]); else toast('Puedes comparar hasta 3 productos', { description: 'Retira uno para elegir otro.' }) };
  const addReview = (name: string, text: string, stars: number) => { setReviews(r => [...r, { id: 'local-' + Date.now(), name, text, stars }]); toast.success('Opinión guardada en este navegador') };

  const applyCoupon = () => {
    const pct = getCouponPercent(couponInput);
    if (pct === null) { setCouponError('Ese código no es válido'); setAppliedCoupon(null); return }
    setAppliedCoupon(couponInput.trim().toUpperCase());
    setCouponError(null);
    toast.success(`Cupón aplicado: ${pct}% de descuento`);
  };
  const removeCoupon = () => { setAppliedCoupon(null); setCouponInput(''); setCouponError(null) };

  // El carrito es uno solo: resuelve precios contra el catálogo del menú
  // más los bowls que el cliente haya armado.
  const catalog: CartItem[] = [...products, ...bowls.map(bowlItem)];
  const addBowl = (config: BowlConfig) => {
    const id = bowlId(config);
    setBowls(list => list.some(b => bowlId(b) === id) ? list : [...list, config]);
    setCart(c => ({ ...c, [id]: Math.min(99, (c[id] || 0) + 1) }));
    toast.success('Agregado a tu carrito', { id: 'cart-add', description: bowlItem(config).name });
  };
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const subtotal = catalog.reduce((sum, p) => sum + (cart[p.id] || 0) * p.price, 0);
  const couponPercent = getCouponPercent(appliedCoupon);
  const total = couponPercent !== null ? applyDiscount(subtotal, couponPercent) : subtotal;
  const discount = subtotal - total;

  const slots = Array.from({ length: 23 }, (_, i) => `${String(10 + Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`).filter(t => date && new Date(date + 'T' + t).getTime() > Date.now() + 30 * 60000);
  useEffect(() => { if (time && !slots.includes(time)) setTime('') }, [date, time, slots.join(',')]);

  const submitOrder = (e: React.FormEvent, onEmpty: () => void) => {
    e.preventDefault();
    if (!count) { toast('Agrega al menos un producto a tu carrito'); onEmpty(); return }
    if (!date || !time || new Date(date + 'T' + time).getTime() < Date.now() + 30 * 60000) { toast.error('Elige una hora con al menos 30 minutos de anticipación'); return }
    if (!customerName.trim() || !customerPhone.trim()) { toast.error('Ingresa tu nombre y celular para que te identifiquemos en la sucursal'); return }
    if (submitting) return;

    const payload = { branch, pickupDate: date, pickupTime: time, customerName: customerName.trim(), customerPhone: customerPhone.trim(), cart, couponCode: appliedCoupon ?? undefined };

    if (paymentMethod === 'cash') {
      setSubmitting(true);
      fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        .then(async res => {
          const data = await res.json().catch(() => ({})) as CashOrderResponse & { error?: string };
          if (!res.ok) throw new Error(data.error || 'order_failed');
          return data;
        })
        .then(data => {
          const placed: Order = { id: data.orderId, branch: data.branch, date: data.pickupDate, time: data.pickupTime, subtotal: data.subtotal, discount: data.discount, couponCode: data.couponCode, total: data.total, items: data.items, paymentMethod: 'cash', status: 'pending_pickup' };
          setOrder(placed);
          setOrders(list => [placed, ...list.filter(o => o.id !== placed.id)].slice(0, 25));
          setOrderOpen(true); setCart({}); removeCoupon();
        })
        .catch(() => toast.error('No pudimos programar tu pedido. Intenta de nuevo.'))
        .finally(() => setSubmitting(false));
      return;
    }

    // Online payment via Wompi Widget. The widget tokenizes card data itself — this app never
    // receives raw card numbers. Access/order confirmation is only granted once the
    // `transaction.updated` webhook confirms payment server-side, not from the widget callback.
    setSubmitting(true);
    fetch('/api/checkout/wompi/init', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(async res => {
        const data = await res.json().catch(() => ({})) as WompiInitResponse & { error?: string };
        if (!res.ok) throw new Error(data.error || 'init_failed');
        return data;
      })
      .then(data => {
        setSubmitting(false);
        const WidgetCheckoutCtor = (globalThis as { WidgetCheckout?: typeof WidgetCheckout }).WidgetCheckout;
        if (!WidgetCheckoutCtor) { toast.error('No pudimos cargar el pago en línea. Intenta de nuevo en unos segundos.'); return }
        const checkout = new WidgetCheckoutCtor({
          currency: data.currency,
          amountInCents: data.amountInCents,
          reference: data.reference,
          publicKey: data.publicKey,
          redirectUrl: data.redirectUrl,
          signature: { integrity: data.integritySignature },
        });
        checkout.open(result => {
          const status = result?.transaction?.status;
          window.location.href = `${data.redirectUrl}${status === 'APPROVED' ? '&status=success' : status === 'PENDING' ? '&status=pending' : '&status=failed'}`;
        });
      })
      .catch(() => { setSubmitting(false); toast.error('No pudimos iniciar el pago en línea. Intenta de nuevo o paga en efectivo al recoger.') });
  };

  return <ShakyCtx.Provider value={{
    cart, favorites, compare, bowls, catalog, addBowl, cartOpen, setCartOpen, navOpen, setNavOpen,
    compareOpen, setCompareOpen, branch, setBranch, date, setDate, time, setTime, slots,
    customerName, setCustomerName, customerPhone, setCustomerPhone, paymentMethod, setPaymentMethod, submitting,
    order, orders, orderOpen, setOrderOpen, reviews, reviewOpen, setReviewOpen, addReview,
    count, subtotal, discount, total, add, changeQty, removeFromCart, clearCart, toggleFavorite, toggleCompare, submitOrder,
    couponInput, setCouponInput, appliedCoupon, couponError, applyCoupon, removeCoupon,
  }}>{children}</ShakyCtx.Provider>;
}
