"use client";
import { useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays, Check, ChevronRight, ClipboardList, Clock, CreditCard, Home,
  LayoutGrid, MapPin, Package, Receipt, RotateCw, Store, Truck, XCircle,
} from 'lucide-react';
import { money, products, storeAddress } from '@/lib/demo-data';
import { useShaky, type Order } from '@/components/shaky-store';

/* Los pedidos guardan el estado que maneja la tienda; aqui se traduce al
   lenguaje del seguimiento. El sistema no cancela pedidos todavia, asi que
   'cancelado' solo aparecera cuando exista esa operacion. */
const STAGES = [
  { key: 'confirmed', label: 'Pedido confirmado', icon: Check },
  { key: 'preparing', label: 'En preparación', icon: Package },
  { key: 'onway', label: 'En camino', icon: Truck },
  { key: 'done', label: 'Entregado', icon: Home },
] as const;

function stageOf(o: Order) {
  if (o.status === 'completed') return 3;
  if (o.status === 'paid' || o.status === 'pending_pickup') return 1;
  return 0;
}

const FILTERS = [
  { key: 'all', label: 'Todos', icon: LayoutGrid },
  { key: 'preparing', label: 'En preparación', icon: Package },
  { key: 'onway', label: 'En camino', icon: Truck },
  { key: 'done', label: 'Entregados', icon: Check },
  { key: 'cancelled', label: 'Cancelados', icon: XCircle },
] as const;

function filterOf(o: Order) {
  if (o.status === 'cancelled') return 'cancelled';
  if (o.status === 'completed') return 'done';
  return 'preparing';
}

const PAYMENT: Record<string, string> = { cash: 'Pago contraentrega', online: 'Pago en línea' };

const byName = (name: string) => products.find(p => p.name === name);
const units = (o: Order) => o.items.reduce((a, i) => a + i.qty, 0);
const label = (n: number) => `${n} ${n === 1 ? 'producto' : 'productos'}`;

/** La fecha guardada es la de recogida, en formato AAAA-MM-DD. */
function prettyDate(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
}

function StatusChip({ o }: { o: Order }) {
  const kind = filterOf(o);
  const Icon = kind === 'done' ? Check : kind === 'cancelled' ? XCircle : Package;
  const text = kind === 'done' ? 'Entregado' : kind === 'cancelled' ? 'Cancelado' : 'En preparación';
  return <span className={'mo-chip mo-chip-' + kind}><Icon size={16} aria-hidden="true" />{text}</span>;
}

/* --- Tarjeta del pedido en curso ------------------------------------- */
function CurrentOrder({ o }: { o: Order }) {
  const stage = stageOf(o);
  return (
    <section className="mo-current" aria-label="Tu pedido actual">
      <header className="mo-current-head">
        <span className="mo-eyebrow">Tu pedido actual</span>
        <StatusChip o={o} />
      </header>

      <h2 className="mo-current-title">
        {stage === 3 ? <>¡Tu pedido fue <em>entregado!</em></> : <>¡Tu pedido <em>va en camino!</em></>}
      </h2>
      <p className="mo-current-lead">
        {stage === 3
          ? 'Gracias por tu compra. Puedes repetirlo cuando quieras.'
          : 'Estamos preparando tu comida con todo el sabor y la calidad de siempre.'}
      </p>

      <ol className="mo-track">
        {STAGES.map(({ key, label: text, icon: Icon }, i) => (
          <li key={key} className={i < stage ? 'done' : i === stage ? 'now' : ''}>
            <span className="mo-track-dot"><Icon size={19} aria-hidden="true" /></span>
            <span className="mo-track-label">{text}</span>
          </li>
        ))}
      </ol>

      <dl className="mo-facts">
        <div><dt><CalendarDays size={17} aria-hidden="true" />Fecha de recogida</dt><dd>{prettyDate(o.date)}</dd></div>
        <div><dt><Clock size={17} aria-hidden="true" />Hora de recogida</dt><dd>{o.time}</dd></div>
        <div><dt><MapPin size={17} aria-hidden="true" />Dónde recogerlo</dt><dd>{storeAddress}</dd></div>
        <div><dt><Receipt size={17} aria-hidden="true" />Número de pedido</dt><dd>#{o.id.slice(0, 8)}</dd></div>
        <div><dt><CreditCard size={17} aria-hidden="true" />Método de pago</dt><dd>{PAYMENT[o.paymentMethod] ?? o.paymentMethod}</dd></div>
      </dl>

      <h3 className="mo-current-sub">Productos en tu pedido</h3>
      <ul className="mo-current-items">
        {o.items.map(i => {
          const p = byName(i.name);
          return (
            <li key={i.name}>
              {p ? <img src={p.image} alt="" aria-hidden="true" /> : <span className="mo-thumb"><Package size={18} /></span>}
              <b className="mo-qty">{i.qty}</b>
              <span className="mo-item-name">{i.name}</span>
              {p && <span className="mo-item-price">{money(p.price * i.qty)}</span>}
            </li>
          );
        })}
      </ul>

      <footer className="mo-current-total">
        <span>Total del pedido</span>
        <strong>{money(o.total)}</strong>
      </footer>
    </section>
  );
}

/* --- Una fila del historial ------------------------------------------ */
function HistoryRow({ o, onRepeat }: { o: Order; onRepeat: (o: Order) => void }) {
  const [open, setOpen] = useState(false);
  const thumbs = o.items.map(i => byName(i.name)?.image).filter(Boolean).slice(0, 3) as string[];
  return (
    <article className={'mo-row' + (open ? ' is-open' : '')}>
      <div className="mo-row-main">
        <div className="mo-row-thumbs" aria-hidden="true">
          {thumbs.length
            ? thumbs.map((src, i) => <img key={src + i} src={src} alt="" />)
            : <span className="mo-thumb"><Package size={20} /></span>}
        </div>

        <div className="mo-row-copy">
          <h3>Pedido #{o.id.slice(0, 6)}</h3>
          <p className="mo-row-when">{prettyDate(o.date)} · {o.time}</p>
          <p className="mo-row-sum"><span>{label(units(o))}</span><span>Total: <strong>{money(o.total)}</strong></span></p>
        </div>

        <div className="mo-row-side">
          <StatusChip o={o} />
          <div className="mo-row-actions">
            <button type="button" className="mo-details" onClick={() => setOpen(!open)} aria-expanded={open}>
              {open ? 'Ocultar' : 'Ver detalles'}
            </button>
            {o.status === 'completed' && (
              <button type="button" className="mo-repeat" onClick={() => onRepeat(o)}>
                <RotateCw size={17} aria-hidden="true" />Volver a pedir
              </button>
            )}
          </div>
        </div>

        <button type="button" className="mo-row-toggle" onClick={() => setOpen(!open)} aria-expanded={open}
          aria-label={(open ? 'Ocultar' : 'Ver') + ' detalles del pedido ' + o.id.slice(0, 6)}>
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      {open && (
        <div className="mo-row-detail">
          <ul>
            {o.items.map(i => {
              const p = byName(i.name);
              return (
                <li key={i.name}>
                  <b className="mo-qty">{i.qty}</b>
                  <span className="mo-item-name">{i.name}</span>
                  {p && <span className="mo-item-price">{money(p.price * i.qty)}</span>}
                </li>
              );
            })}
          </ul>
          <dl>
            <div><dt>Recogida en</dt><dd><Store size={15} aria-hidden="true" />{o.branch}</dd></div>
            <div><dt>Método de pago</dt><dd>{PAYMENT[o.paymentMethod] ?? o.paymentMethod}</dd></div>
            {o.couponCode && <div><dt>Cupón</dt><dd>{o.couponCode} (−{money(o.discount)})</dd></div>}
            <div><dt>Total</dt><dd><strong>{money(o.total)}</strong></dd></div>
          </dl>
        </div>
      )}
    </article>
  );
}

export function MyOrders() {
  const { order, orders, add } = useShaky();
  const [filter, setFilter] = useState<string>('all');

  const repeat = (o: Order) => {
    // Los pedidos guardan el nombre; el producto se resuelve del catálogo.
    // Los bowls personalizados no viven en el catálogo, así que se avisan.
    let missing = 0;
    for (const i of o.items) {
      const p = byName(i.name);
      if (!p) { missing++; continue }
      for (let n = 0; n < i.qty; n++) add(p.id);
    }
    if (missing) toastMissing(missing);
  };

  const shown = filter === 'all' ? orders : orders.filter(o => filterOf(o) === filter);
  const countOf = (key: string) => key === 'all' ? orders.length : orders.filter(o => filterOf(o) === key).length;

  return (
    <main className="mo">
      <div className="mo-grid">
        <div className="mo-left"><div className="mo-inner">
          {order
            ? <CurrentOrder o={order} />
            : (
              <section className="mo-current mo-current-empty">
                <span className="mo-eyebrow">Tu pedido actual</span>
                <h2 className="mo-current-title">Aún no tienes <em>un pedido en curso</em></h2>
                <p className="mo-current-lead">Cuando programes uno, aquí verás su estado paso a paso.</p>
                <Link className="mo-cta" href="/menu">Ver el menú <ChevronRight size={18} aria-hidden="true" /></Link>
              </section>
            )}
        </div></div>

        <div className="mo-right">
          {/* En celular las dos mitades son secciones a sangre y el cambio
              de negro a blanco lo hace el derretido, como en el menu. */}
          <span className="mo-drip" aria-hidden="true" />
          <div className="mo-inner">
          <header className="mo-head">
            <span className="mo-eyebrow">Mis pedidos</span>
            <h1>Últimos <em>pedidos</em></h1>
            <p>Revisa el estado de tus pedidos, repite tus favoritos o explora nuevas opciones.</p>
          </header>

          <div className="mo-filters" role="tablist" aria-label="Filtrar pedidos">
            {FILTERS.map(({ key, label: text, icon: Icon }) => (
              <button
                key={key} type="button" role="tab" aria-selected={filter === key}
                className={'mo-filter' + (filter === key ? ' chosen' : '')}
                onClick={() => setFilter(key)}
              >
                <Icon size={18} aria-hidden="true" />{text}
                <span className="mo-filter-count">{countOf(key)}</span>
              </button>
            ))}
          </div>

          {shown.length ? (
            <div className="mo-list">
              {shown.map(o => <HistoryRow key={o.id} o={o} onRepeat={repeat} />)}
            </div>
          ) : (
            <p className="mo-empty">
              <ClipboardList size={26} aria-hidden="true" />
              {orders.length
                ? 'No tienes pedidos en este estado.'
                : 'Todavía no has hecho ningún pedido. Los que programes aparecerán aquí.'}
            </p>
          )}
          </div>
        </div>
      </div>
    </main>
  );
}

function toastMissing(n: number) {
  import('sonner').then(({ toast }) => {
    toast('No pudimos repetir todo el pedido', {
      description: `${n} ${n === 1 ? 'producto ya no está' : 'productos ya no están'} en el menú.`,
    });
  });
}
