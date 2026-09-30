"use client";
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Check, ShoppingBag, Tag, X } from 'lucide-react';
import { branches, money } from '@/lib/demo-data';
import { Choice } from '@/components/shaky-shared';
import { useShaky } from '@/components/shaky-store';

const localDate = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` };

export function PlanificaSection() {
  const router = useRouter();
  const {
    branch, setBranch, date, setDate, time, setTime, slots, count, subtotal, discount, total, order, setOrderOpen, setCartOpen, submitOrder,
    customerName, setCustomerName, customerPhone, setCustomerPhone, paymentMethod, setPaymentMethod, submitting,
    couponInput, setCouponInput, appliedCoupon, couponError, applyCoupon, removeCoupon,
  } = useShaky();
  return (
    <section className="plan-section" id="planifica">
      <div className="wrap plan-grid">
        <div>
          <form onSubmit={e => submitOrder(e, () => router.push('/menu'))}>
            <div className="schedule-fields">
              <label className="field"><span>Nombre</span><input aria-label="Nombre" type="text" name="customerName" autoComplete="name" required maxLength={80} value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="¿A nombre de quién?" /></label>
              <label className="field"><span>Celular</span><input aria-label="Celular" type="tel" name="customerPhone" autoComplete="tel" required maxLength={20} value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} placeholder="Para avisarte cuando esté listo" /></label>
              <Choice label="Sucursal" value={branch} onChange={setBranch} options={branches.map(b => ({ value: b.id, label: b.name }))} />
              <label className="field"><span>Fecha de recogida</span><input aria-label="Fecha de recogida" type="date" name="pickupDate" required min={localDate()} value={date} onInput={e => setDate(e.currentTarget.value)} onChange={e => setDate(e.target.value)} /></label>
              <Choice label="Hora de recogida" value={time} onChange={setTime} options={slots.length ? slots.map(t => ({ value: t, label: t })) : [{ value: 'unavailable', label: 'Sin horarios hoy' }]} />
              <Choice label="Pago" value={paymentMethod} onChange={v => setPaymentMethod(v as 'cash' | 'online')} options={[{ value: 'cash', label: 'Efectivo al recoger' }, { value: 'online', label: 'Pagar en línea (Wompi)' }]} />
            </div>
            <div className="coupon-box">
              {appliedCoupon ? (
                <div className="coupon-applied"><Tag size={15} /><span>{appliedCoupon}</span><button type="button" aria-label="Quitar cupón" onClick={removeCoupon}><X size={14} /></button></div>
              ) : (
                <div className="coupon-inline">
                  <input aria-label="Código de descuento" placeholder="Código de descuento" value={couponInput} onChange={e => setCouponInput(e.target.value)} />
                  <button className="btn outline" type="button" onClick={applyCoupon}>Aplicar</button>
                </div>
              )}
              {couponError && <span className="coupon-error">{couponError}</span>}
            </div>
            <div className="schedule-bottom">
              <button className="btn" type="submit" disabled={!slots.length || !time || time === 'unavailable' || submitting}>{submitting ? 'Procesando…' : 'Programar pedido'} <ArrowUpRight size={18} /></button>
              <button className="text-button" type="button" onClick={() => setCartOpen(true)}>
                {count} productos · {discount > 0 && <s className="coupon-strike">{money(subtotal)}</s>} {money(total)} <ShoppingBag size={17} />
              </button>
            </div>
            <p className="fineprint">{paymentMethod === 'cash' ? 'Sin cobro en línea: pagas en la sucursal al recoger.' : 'Pago seguro con Wompi (tarjeta, PSE, Nequi y más).'} Recogida de 10:00 a 21:00, con 30 minutos de anticipación.</p>
          </form>
          {order && <button className="last-order" onClick={() => setOrderOpen(true)}><Check size={17} />Ver último pedido · {order.id.slice(0, 8)}</button>}
        </div>
        <div className="plan-visual" role="img" aria-label="Entrenamiento y comida, imagen del mockup proporcionado" />
      </div>
    </section>
  );
}
