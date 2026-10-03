"use client";
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Bike, CreditCard, Check, Crosshair, Lock, Mail, MapPin, Phone, ShoppingBag, Smartphone, Store, Tag, Truck, UserRound, Wallet } from 'lucide-react';
import { branches, money, storeAddress } from '@/lib/demo-data';
import { useShaky } from '@/components/shaky-store';
import { useNow } from '@/components/shaky-now';

const PAYMENTS = [
  { id: 'cash', icon: Wallet, name: 'Pago contraentrega', copy: 'Paga en efectivo cuando recibas tu pedido.' },
  { id: 'card', icon: CreditCard, name: 'Tarjeta de crédito o débito', copy: 'Pago seguro en línea con tu tarjeta.' },
  { id: 'nequi', icon: Smartphone, name: 'Nequi / Daviplata', copy: 'Paga fácilmente con Nequi o Daviplata.' },
];

/** Paso final en escritorio: datos, entrega, pago y resumen. */
export function CheckoutDesktop({ onBack }: { onBack: () => void }) {
  const {
    cart, catalog, count, subtotal, discount, total,
    branch, setBranch, date, time, customerName, setCustomerName, customerPhone, setCustomerPhone,
    couponInput, setCouponInput, appliedCoupon, couponError, applyCoupon, removeCoupon, submitOrder,
  } = useShaky();

  const now = useNow();
  const [email, setEmail] = useState('');
  const [delivery, setDelivery] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('cash');
  const [touched, setTouched] = useState(false);

  const lines = catalog.filter(p => cart[p.id]);
  const missingAddress = delivery === 'delivery' && address.trim().length < 8;
  const schedule = Boolean(date && time) && new Date(date + 'T' + time).getTime() > now + 30 * 60000;
  const ready = Boolean(customerName.trim() && customerPhone.trim() && !missingAddress && count && schedule);

  return (
    <section className="ck">
      {/* Misma estructura que el menú: título sobre el negro, el derretido
          y el contenido sobre el crema. */}
      <div className="sect-top">
        <div className="sect-top-inner">
          <button type="button" className="sect-back" onClick={onBack}><ArrowLeft size={20} aria-hidden="true" />Volver</button>
          <h1 className="sect-title">Completa <em>tus datos</em></h1>
          <p className="sect-lead">Finaliza tu pedido con tu información, método de entrega y pago.</p>
        </div>
      </div>

      <div className="sect-light">
        <span className="sect-drip" aria-hidden="true" />
        <form
          noValidate
          className="wrap ck-grid"
          onSubmit={e => {
            setTouched(true);
            if (!ready) { e.preventDefault(); return }
            submitOrder(e, () => { });
          }}
        >
        <div className="ck-main">
          <section className="ck-card">
            <header><span className="ck-card-icon"><UserRound size={24} /></span><h2>Tus datos personales</h2></header>
            <div className="ck-fields">
              <label className="ck-field">
                <span>Nombre completo <i aria-hidden="true">*</i></span>
                <input required placeholder="Ej. Juan Pérez" value={customerName} onChange={e => setCustomerName(e.target.value)} autoComplete="name" />
                {touched && !customerName.trim() && <small className="ck-error">Escribe tu nombre.</small>}
              </label>
              <label className="ck-field">
                <span>Número de teléfono <i aria-hidden="true">*</i></span>
                <span className="ck-input"><Phone size={18} aria-hidden="true" />
                  <input required inputMode="tel" placeholder="Ej. 300 123 4567" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} autoComplete="tel" />
                </span>
                {touched && !customerPhone.trim() && <small className="ck-error">Escribe tu celular.</small>}
              </label>
              <label className="ck-field">
                <span>Correo electrónico <i className="ck-opt">(opcional)</i></span>
                <span className="ck-input"><Mail size={18} aria-hidden="true" />
                  <input type="email" placeholder="Ej. juan@email.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                </span>
              </label>
            </div>
          </section>

          <section className="ck-card ck-card-cream">
            <header>
              <span className="ck-card-icon"><Truck size={24} /></span>
              <div><h2>Método de entrega</h2><p>Elige cómo quieres recibir tu pedido.</p></div>
            </header>
            <div className="ck-choices" role="radiogroup" aria-label="Método de entrega">
              <button type="button" role="radio" aria-checked={delivery === 'delivery'} className={'ck-choice' + (delivery === 'delivery' ? ' chosen' : '')} onClick={() => setDelivery('delivery')}>
                <Bike size={30} aria-hidden="true" />
                <span><strong>A domicilio</strong>Te llevamos tu pedido a la dirección que indiques.</span>
                <i className="ck-radio" aria-hidden="true">{delivery === 'delivery' && <Check size={14} strokeWidth={3} />}</i>
              </button>
              <button type="button" role="radio" aria-checked={delivery === 'pickup'} className={'ck-choice' + (delivery === 'pickup' ? ' chosen' : '')} onClick={() => setDelivery('pickup')}>
                <Store size={30} aria-hidden="true" />
                <span><strong>Recoger en tienda</strong>Retira tu pedido en la sucursal más cercana.</span>
                <i className="ck-radio" aria-hidden="true">{delivery === 'pickup' && <Check size={14} strokeWidth={3} />}</i>
              </button>
            </div>
            <div className="ck-fields ck-fields-two">
              <label className="ck-field">
                <span><MapPin size={16} aria-hidden="true" />Dirección de entrega {delivery === 'delivery' && <i aria-hidden="true">*</i>}</span>
                <span className="ck-input">
                  <input placeholder="Ingresa tu dirección completa" value={address} disabled={delivery === 'pickup'} onChange={e => setAddress(e.target.value)} autoComplete="street-address" />
                  <Crosshair size={18} aria-hidden="true" />
                </span>
                {touched && missingAddress && <small className="ck-error">Escribe una dirección completa.</small>}
              </label>
              <label className="ck-field">
                <span><Store size={16} aria-hidden="true" />Selecciona sucursal {delivery === 'delivery' && <i className="ck-opt">(opcional)</i>}</span>
                <span className="ck-input">
                  <select value={branch} onChange={e => setBranch(e.target.value)}>
                    {branches.map(b => <option key={b.id} value={b.name}>{b.name} · {storeAddress}</option>)}
                  </select>
                </span>
              </label>
            </div>
          </section>

          <section className="ck-card">
            <header>
              <span className="ck-card-icon"><CreditCard size={24} /></span>
              <div><h2>Método de pago</h2><p>Selecciona tu método de pago.</p></div>
            </header>
            <div className="ck-choices ck-choices-three" role="radiogroup" aria-label="Método de pago">
              {PAYMENTS.map(({ id, icon: Icon, name, copy }) => (
                <button type="button" role="radio" aria-checked={payment === id} key={id} className={'ck-choice' + (payment === id ? ' chosen' : '')} onClick={() => setPayment(id)}>
                  <Icon size={28} aria-hidden="true" />
                  <span><strong>{name}</strong>{copy}</span>
                  <i className="ck-radio" aria-hidden="true">{payment === id && <Check size={14} strokeWidth={3} />}</i>
                </button>
              ))}
            </div>
            <p className="ck-secure"><Lock size={16} aria-hidden="true" />Tus pagos son 100% seguros y protegidos.</p>
          </section>
        </div>

        <aside className="ck-aside" aria-label="Resumen de tu pedido">
          <div className="ck-aside-card">
            <header className="ck-aside-head">
              <span className="ck-bag"><ShoppingBag size={26} /></span>
              <h2>Resumen de tu pedido</h2>
            </header>
            <ul className="ck-lines">
              {lines.map(p => (
                <li key={p.id}>
                  <img src={p.image} alt="" aria-hidden="true" />
                  <div><strong>{p.name}</strong><span>{money(p.price)}</span></div>
                  <span className="ck-qty">x {cart[p.id]}</span>
                </li>
              ))}
              {!lines.length && <li className="ck-empty">Tu pedido está vacío.</li>}
            </ul>
            <dl className="ck-totals">
              <div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
              {discount > 0 && <div><dt>Descuento</dt><dd>−{money(discount)}</dd></div>}
              <div><dt>Costo de entrega</dt><dd>{delivery === 'delivery' ? 'Por confirmar' : '—'}</dd></div>
            </dl>
            <div className="ck-grand"><span>Total a pagar</span><strong>{money(total)}</strong></div>

            <div className="ck-coupon">
              <span className="ck-coupon-head"><Tag size={18} aria-hidden="true" />¿Tienes un cupón de descuento?</span>
              {appliedCoupon ? (
                <div className="ck-coupon-on">
                  <span>{appliedCoupon}</span>
                  <button type="button" onClick={removeCoupon}>Quitar</button>
                </div>
              ) : (
                <div className="ck-coupon-row">
                  <input placeholder="Ingresa tu código" value={couponInput} onChange={e => setCouponInput(e.target.value)} aria-label="Código de descuento" />
                  <button type="button" onClick={applyCoupon}>Aplicar</button>
                </div>
              )}
              {couponError && <small className="ck-error">{couponError}</small>}
            </div>
          </div>

          <button className="ck-submit" type="submit" disabled={!count}>
            <ShoppingBag size={22} aria-hidden="true" />Confirmar pedido y pagar <ArrowRight size={22} aria-hidden="true" />
          </button>
          {touched && !schedule && count > 0 && (
            <p className="ck-submit-hint">
              Falta la fecha y la hora de recogida, con 30 minutos de margen.{' '}
              <button type="button" onClick={onBack}>Elegirlas</button>
            </p>
          )}
          {touched && !ready && schedule && count > 0 && <p className="ck-submit-hint">Completa los campos marcados para continuar.</p>}
          <p className="ck-terms">Al confirmar, aceptas nuestros <Link href="/nosotros">Términos y Condiciones</Link> y nuestra <Link href="/nosotros">Política de Privacidad</Link>.</p>
        </aside>
        </form>
      </div>
    </section>
  );
}
