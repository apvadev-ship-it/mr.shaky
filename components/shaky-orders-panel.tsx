"use client";
import { useState } from 'react';
import { CheckCircle2, Clock, Package, Receipt } from 'lucide-react';
import { money } from '@/lib/demo-data';
import { useShaky } from '@/components/shaky-store';

const STATUS: Record<string, string> = {
  pending_pickup: 'Pendiente de recogida',
  pending_payment: 'Pago pendiente',
  paid: 'Pagado',
  completed: 'Entregado',
};

function OrderCard({ o, current }: { o: ReturnType<typeof useShaky>['orders'][number]; current?: boolean }) {
  const count = o.items.reduce((a, i) => a + i.qty, 0);
  return (
    <article className={'order-entry' + (current ? ' is-current' : '')}>
      <header>
        <span className="order-entry-icon">{current ? <Clock size={18} /> : <CheckCircle2 size={18} />}</span>
        <div>
          <strong>Pedido #{o.id.slice(0, 8)}</strong>
          <span>{o.branch} · {o.date} · {o.time}</span>
        </div>
        <span className="order-entry-status">{STATUS[o.status] ?? o.status}</span>
      </header>
      <ul>{o.items.map(i => <li key={i.name}><span>{i.qty}×</span>{i.name}</li>)}</ul>
      <footer>
        <span>{count} {count === 1 ? 'producto' : 'productos'}</span>
        <strong>{money(o.total)}</strong>
      </footer>
    </article>
  );
}

export function OrdersPanel() {
  const { orders } = useShaky();
  const [open, setOpen] = useState(false);
  if (!orders.length) return null;
  const [current, ...history] = orders;
  return (
    <section className="orders-panel" aria-label="Tus pedidos">
      <div className="orders-panel-head">
        <h2><Package size={20} aria-hidden="true" />Tu pedido actual</h2>
      </div>
      <OrderCard o={current} current />
      {history.length > 0 && (
        <>
          <button
            type="button"
            className="orders-history-toggle"
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
          >
            <Receipt size={17} aria-hidden="true" />
            Historial de pedidos ({history.length})
          </button>
          {open && <div className="orders-history">{history.map(o => <OrderCard key={o.id} o={o} />)}</div>}
        </>
      )}
    </section>
  );
}
