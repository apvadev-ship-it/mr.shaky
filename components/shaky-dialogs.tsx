"use client";
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, BarChart3, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { products, money } from '@/lib/demo-data';
import { Choice } from './shaky-shared';
import { useShaky } from './shaky-store';

function Review({ r }: { r: { name: string; stars: number; text: string } }) {
  return <article className="review"><div className="rating" aria-label={`${r.stars} de 5 estrellas`}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div><p>“{r.text}”</p><div className="review-person"><span>{r.name.charAt(0)}</span><strong>{r.name}</strong></div></article>;
}

export function ShakyDialogs() {
  const { add, compare, compareOpen, setCompareOpen, toggleCompare, orderOpen, setOrderOpen, order, reviewOpen, setReviewOpen, reviews, addReview } = useShaky();
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [stars, setStars] = useState('5');
  return (
    <>
      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="home-legacy shaky-dialog compare-dialog">
          <DialogTitle>COMPARA TUS FAVORITOS</DialogTitle>
          <DialogDescription>Selecciona hasta 3 productos en las tarjetas del menú.</DialogDescription>
          {compare.length ? <>
            <div className="compare-cards">{compare.map(id => {
              const p = products.find(p => p.id === id)!;
              const stats: [keyof typeof p, string, string][] = [['protein', 'Proteína', 'g'], ['carbs', 'Carbohidratos', 'g'], ['fat', 'Grasas', 'g'], ['calories', 'Energía', 'kcal']];
              const maxes = Object.fromEntries(stats.map(([key]) => [key, Math.max(...compare.map(cid => Number(products.find(p => p.id === cid)![key])))]));
              return (
                <div className="compare-card" key={id}>
                  <button className="compare-card-remove" onClick={() => toggleCompare(id)} aria-label={'Retirar ' + p.name}>×</button>
                  <div className={`food-sprite compare-photo food-${p.id}`} />
                  <h3>{p.name}</h3>
                  <strong className="compare-price">{money(p.price)}</strong>
                  <div className="compare-stats">{stats.map(([key, label, unit]) => {
                    const val = Number(p[key]);
                    const max = maxes[key] || 1;
                    const isTop = val === max && max > 0;
                    return (
                      <div className="compare-stat" key={String(key)}>
                        <div className="compare-stat-label"><span>{label}</span><span>{val} {unit}</span></div>
                        <div className="compare-stat-bar"><div className={'compare-stat-fill' + (isTop ? ' top' : '')} style={{ width: `${max ? (val / max) * 100 : 0}%` }} /></div>
                      </div>
                    );
                  })}</div>
                  <button className="btn" onClick={() => add(id)}>Agregar +</button>
                </div>
              );
            })}</div>
            <Link className="text-button" href="/menu"><ArrowRight size={17} />Elegir otro producto</Link>
          </> : <div className="empty"><BarChart3 size={40} /><p>Marca «Comparar» en tus productos favoritos.</p><Link className="btn" href="/menu">Elegir productos</Link></div>}
        </DialogContent>
      </Dialog>
      <Dialog open={orderOpen} onOpenChange={setOrderOpen}>
        <DialogContent className="home-legacy shaky-dialog">
          <DialogTitle>¡PEDIDO PROGRAMADO!</DialogTitle>
          <DialogDescription>
            {order?.paymentMethod === 'cash'
              ? 'Pagas en efectivo al recoger en la sucursal.'
              : 'Tu pago en línea se está confirmando. Te avisaremos apenas se acredite.'}
          </DialogDescription>
          {order && <div className="order-confirm">
            <div className="success-icon"><Check /></div>
            <h3>Pedido #{order.id.slice(0, 8)}</h3>
            <p>{order.branch}<br />{order.date} · {order.time}</p>
            <ul>{order.items.map(i => <li key={i.name}>{i.qty} × {i.name}</li>)}</ul>
            {order.discount > 0 && <p className="fineprint">Cupón {order.couponCode} · -{money(order.discount)}</p>}
            <strong>Total: {money(order.total)}</strong>
            <button className="btn" onClick={() => setOrderOpen(false)}>Listo <Check size={18} /></button>
          </div>}
        </DialogContent>
      </Dialog>
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="home-legacy shaky-dialog review-dialog">
          <DialogTitle>OPINIONES DE LA FAMILIA</DialogTitle>
          <DialogDescription>Tu opinión se guarda solo en este navegador.</DialogDescription>
          <div className="all-reviews">{reviews.map(r => <Review key={r.id} r={r} />)}</div>
          <form className="review-form" onSubmit={e => { e.preventDefault(); if (!reviewName.trim() || !reviewText.trim()) return; addReview(reviewName.trim(), reviewText.trim(), Number(stars)); setReviewName(''); setReviewText('') }}>
            <h3>Cuéntanos qué te pareció</h3>
            <label className="field"><span>Nombre</span><input required maxLength={40} value={reviewName} onChange={e => setReviewName(e.target.value)} /></label>
            <Choice label="Puntuación" value={stars} onChange={setStars} options={[5, 4, 3, 2, 1].map(n => ({ value: String(n), label: `${n} ${n === 1 ? 'estrella' : 'estrellas'}` }))} />
            <label className="field full"><span>Tu opinión</span><textarea required minLength={8} maxLength={500} value={reviewText} onChange={e => setReviewText(e.target.value)} /></label>
            <button className="btn" type="submit">Guardar opinión</button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
export { Review };
