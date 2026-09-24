"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, Check, Clock, MapPin, ShoppingBag, Tag } from 'lucide-react';
import { money, products } from '@/lib/demo-data';
import { useShaky } from '@/components/shaky-store';

type LiveOrder = {
  id: string; branch: string; pickupDate: string; pickupTime: string;
  items: { id?: string; name: string; qty: number }[]; subtotal: number; discount: number; couponCode: string | null; total: number;
  paymentMethod: 'cash' | 'online'; status: string;
};

const STATUS_LABEL: Record<string, { label: string; tone: string }> = {
  pending_payment: { label: 'Esperando el pago', tone: 'pending' },
  pending_pickup: { label: 'Confirmado · te esperamos', tone: 'ok' },
  paid: { label: 'Pagado · te esperamos', tone: 'ok' },
  failed: { label: 'El pago no se completó', tone: 'error' },
  refunded: { label: 'Reembolsado', tone: 'error' },
};

export function OrderStatusSection() {
  const { order, setCartOpen } = useShaky();
  const [live, setLive] = useState<LiveOrder | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!order?.id) { setLive(null); return }
    let cancelled = false;
    const fetchStatus = () => {
      setLoading(true);
      fetch(`/api/orders/${order.id}`)
        .then(res => res.ok ? res.json() as Promise<LiveOrder & { error?: string }> : null)
        .then(data => { if (!cancelled && data && !data.error) setLive(data) })
        .catch(() => {})
        .finally(() => { if (!cancelled) setLoading(false) });
    };
    fetchStatus();
    const shouldPoll = order.paymentMethod === 'online';
    const interval = shouldPoll ? setInterval(fetchStatus, 8000) : undefined;
    return () => { cancelled = true; if (interval) clearInterval(interval) };
  }, [order?.id, order?.paymentMethod]);

  const shown = live ?? (order ? { ...order, pickupDate: order.date, pickupTime: order.time } : null);
  const statusInfo = shown ? (STATUS_LABEL[shown.status] ?? { label: shown.status, tone: 'pending' }) : null;

  return (
    <section className="plan-section" id="planifica">
      <div className="wrap order-status-wrap">
        <div className="eyebrow"><CalendarDays size={18} />TU PEDIDO</div>
        {shown ? (
          <div className="order-status-card">
            <div className="section-head">
              <div>
                <h2>Pedido #{shown.id.slice(0, 8)}</h2>
                <p>Actualizado {loading ? 'ahora…' : 'en tiempo real'}</p>
              </div>
              {statusInfo && <span className={'order-status-badge ' + statusInfo.tone}>{statusInfo.label}</span>}
            </div>
            <div className="order-status-details">
              <div><MapPin size={16} /><span>{shown.branch}</span></div>
              <div><Clock size={16} /><span>{shown.pickupDate} · {shown.pickupTime}</span></div>
            </div>
            <div className="order-status-items">{shown.items.map((i, idx) => {
              const pid = ('id' in i ? i.id : undefined) ?? products.find(p => p.name === i.name)?.id;
              return (
                <div className="order-status-item" key={idx}>
                  {pid ? <div className={`food-sprite order-status-photo food-${pid}`} role="img" aria-label={i.name} /> : <div className="order-status-photo order-status-photo-fallback"><ShoppingBag size={18} /></div>}
                  <span>{i.name}</span>
                  <strong>×{i.qty}</strong>
                </div>
              );
            })}</div>
            {shown.discount > 0 && (
              <div className="order-status-coupon"><Tag size={14} />Cupón {shown.couponCode} aplicado · ahorraste {money(shown.discount)}</div>
            )}
            <div className="order-status-total"><span>Total</span><strong>{money(shown.total)}</strong></div>
            <Link className="btn outline" href="/checkout">Programar otro pedido <ArrowUpRight size={18} /></Link>
          </div>
        ) : (
          <div className="order-status-empty">
            <Check size={40} />
            <h2>Aún no tienes pedidos activos</h2>
            <p>Arma tu carrito y programa la recogida cuando quieras.</p>
            <div className="order-status-empty-actions">
              <Link className="btn" href="/menu">Ver menú <ArrowUpRight size={18} /></Link>
              <button className="text-button" type="button" onClick={() => setCartOpen(true)}>Ver mi carrito <ShoppingBag size={17} /></button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
