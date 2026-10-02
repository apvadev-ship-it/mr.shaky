"use client";
import { useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, ChevronRight, Clock, Gift, Lightbulb, MapPin, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { branches, money, products, storeAddress } from '@/lib/demo-data';
import { useShaky } from '@/components/shaky-store';

const QUICK_TIMES = ['11:00', '13:00', '15:00', '17:00'];
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Vista de escritorio de "Tu pedido actual": repasar, ajustar y confirmar. */
export function OrderCurrent({ onCheckout }: { onCheckout: () => void }) {
  const {
    cart, catalog, changeQty, removeFromCart, add,
    count, total, branch, setBranch, date, setDate, time, setTime,
  } = useShaky();
  const [custom, setCustom] = useState(false);

  const lines = catalog.filter(p => cart[p.id]);
  const suggestions = useMemo(() => products.filter(p => !cart[p.id]).slice(0, 4), [cart]);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i);
    const label = d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
    return { value: dateKey(d), label: (i === 0 ? 'Hoy, ' : i === 1 ? 'Mañana, ' : '') + label };
  }), []);

  const rating = (id: string) => products.find(p => p.id === id);

  return (
    <section className="oc">
      <div className="wrap oc-grid">
        <div className="oc-main">
          <span className="oc-crumb"><ChevronRight size={14} aria-hidden="true" />PLANIFICA TU PEDIDO</span>
          <h1 className="oc-title">Tu pedido <em>actual</em></h1>
          <p className="oc-lead">Revisa tu pedido, ajusta las cantidades o elimina productos.</p>

          <div className="oc-controls">
            <div className="oc-control">
              <span className="oc-control-icon"><CalendarDays size={22} /></span>
              <div>
                <span className="oc-control-label">Fecha de entrega</span>
                <label className="oc-select">
                  <CalendarDays size={16} aria-hidden="true" />
                  <select aria-label="Fecha de entrega" value={date || days[0].value} onChange={e => setDate(e.target.value)}>
                    {days.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </label>
              </div>
            </div>

            <div className="oc-control">
              <span className="oc-control-icon"><Clock size={22} /></span>
              <div>
                <span className="oc-control-label">Hora de entrega</span>
                <div className="oc-times">
                  <button type="button" className={!custom && !time ? 'chosen' : ''} onClick={() => { setCustom(false); setTime('') }}>Ahora</button>
                  {QUICK_TIMES.map(t => (
                    <button type="button" key={t} className={!custom && time === t ? 'chosen' : ''} onClick={() => { setCustom(false); setTime(t) }}>{t}</button>
                  ))}
                </div>
                <div className="oc-times oc-times-custom">
                  <button type="button" className={'oc-custom' + (custom ? ' chosen' : '')} onClick={() => setCustom(true)}>Personalizada</button>
                  <label className="oc-select oc-time-field">
                    <Clock size={15} aria-hidden="true" />
                    <input type="time" step={600} min="07:00" max="20:00" aria-label="Hora personalizada"
                      value={time} onChange={e => { setCustom(true); setTime(e.target.value) }} />
                  </label>
                </div>
              </div>
            </div>

            <div className="oc-control">
              <span className="oc-control-icon"><MapPin size={22} /></span>
              <div>
                <span className="oc-control-label">Selecciona sucursal</span>
                <label className="oc-select">
                  <select aria-label="Sucursal" value={branch} onChange={e => setBranch(e.target.value)}>
                    {branches.map(b => <option key={b.id} value={b.name}>{b.name} · {storeAddress}</option>)}
                  </select>
                </label>
              </div>
            </div>
          </div>

          {lines.length === 0 ? (
            <p className="oc-empty">Tu pedido está vacío. Agrega productos desde el menú.</p>
          ) : (
            <ul className="oc-lines">
              {lines.map(p => {
                const meta = rating(p.id);
                return (
                  <li className="oc-line" key={p.id}>
                    <img src={p.image} alt="" aria-hidden="true" />
                    <div className="oc-line-copy">
                      <h3>{p.name}</h3>
                      <p>{p.description}</p>
                      {meta && (
                        <span className="oc-line-rating">
                          <span aria-hidden="true">★★★★★</span>
                          {meta.rating} <small>({meta.reviews})</small>
                        </span>
                      )}
                    </div>
                    <div className="oc-qty">
                      <button type="button" aria-label={'Quitar una unidad de ' + p.name} onClick={() => changeQty(p.id, -1)}><Minus size={17} /></button>
                      <output>{cart[p.id]}</output>
                      <button type="button" aria-label={'Añadir una unidad de ' + p.name} onClick={() => changeQty(p.id, 1)}><Plus size={17} /></button>
                    </div>
                    <strong className="oc-line-price">{money(p.price * cart[p.id])}</strong>
                    <button type="button" className="oc-remove" aria-label={'Eliminar ' + p.name} onClick={() => removeFromCart(p.id)}><Trash2 size={19} /></button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="oc-total">
            <span className="oc-total-icon"><ShoppingBag size={24} /></span>
            <div className="oc-total-copy">
              <strong>Total del pedido</strong>
              <span>{count} {count === 1 ? 'producto' : 'productos'}</span>
            </div>
            <span className="oc-total-amount">{money(total)}</span>
            <button className="oc-confirm" type="button" disabled={!count} onClick={onCheckout}>
              <ShoppingBag size={20} aria-hidden="true" />Confirmar pedido <ArrowRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        <aside className="oc-aside" aria-label="Sugerencias">
          <div className="oc-aside-head">
            <span className="oc-bulb"><Lightbulb size={26} /></span>
            <h2>Sugerencias para<br /><em>tu pedido</em></h2>
          </div>
          <p className="oc-aside-lead">Completa tu pedido con estos productos que combinan perfecto.</p>
          <ul className="oc-suggestions">
            {suggestions.map(p => (
              <li key={p.id}>
                <img src={p.image} alt="" aria-hidden="true" />
                <div>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <strong>{money(p.price)}</strong>
                </div>
                <button type="button" aria-label={'Agregar ' + p.name} onClick={() => add(p.id)}><Plus size={22} /></button>
              </li>
            ))}
          </ul>
          <div className="oc-more">
            <span className="oc-more-icon"><Gift size={24} /></span>
            <div>
              <strong>¿Algo más?</strong>
              <p>Agrega snacks o bebidas y disfruta tu pedido completo.</p>
            </div>
            <ArrowRight size={22} aria-hidden="true" />
          </div>
        </aside>
      </div>
    </section>
  );
}
