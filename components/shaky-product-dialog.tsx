"use client";
import { useState } from 'react';
import { ArrowLeft, Bird, Dumbbell, Flame, Heart, Leaf, Minus, Plus, Scale, ShoppingBag, Sparkles, Wheat, X } from 'lucide-react';
import { money, type Product } from '@/lib/demo-data';
import { MacroRings, macroDeltas } from '@/components/shaky-macro-rings';

/* Sellos y rasgos derivados de los datos del producto, no escritos a mano. */
function badge(p: Product) {
  if (p.reviews >= 120) return { icon: Flame, text: 'Más vendido' };
  if (p.calories <= 250) return { icon: Leaf, text: 'Opción ligera' };
  if (p.protein >= 40) return { icon: Dumbbell, text: 'Alto en proteína' };
  return { icon: Sparkles, text: 'Favorito de la casa' };
}

function traits(p: Product) {
  const out: { icon: typeof Leaf; text: string }[] = [];
  if (p.protein >= 28) out.push({ icon: Dumbbell, text: 'Alto en proteína' });
  if (p.veggie) out.push({ icon: Leaf, text: 'Opción veggie' });
  else out.push({ icon: Bird, text: 'Proteína real' });
  out.push({ icon: Flame, text: `${p.calories} kcal por porción` });
  out.push({ icon: Wheat, text: p.category });
  return out.slice(0, 4);
}

export function ProductDetail({
  p, qty, onQty, onAdd, onClose, favorite, onFavorite,
}: {
  p: Product; qty: number; onQty: (n: number) => void; onAdd: () => void;
  onClose: () => void; favorite: boolean; onFavorite: () => void;
}) {
  const [shot, setShot] = useState(0);
  // El catálogo guarda una foto por producto; la galería ya admite varias.
  const gallery = [p.image];
  const { icon: BadgeIcon, text: badgeText } = badge(p);

  return (
    <div className="pd">
      <header className="pd-top">
        <button type="button" onClick={onClose} aria-label="Volver"><ArrowLeft size={22} /></button>
        <h2>Detalle del producto</h2>
        <button type="button" onClick={onFavorite} aria-pressed={favorite} aria-label={(favorite ? 'Quitar de' : 'Guardar en') + ' favoritos'}>
          <Heart size={22} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </header>

      <div className="pd-hero">
        <div className="pd-gallery">
          <img className="pd-shot" src={gallery[shot]} alt={p.name} />
          {gallery.length > 1 && (
            <div className="pd-thumbs">
              {gallery.map((src, i) => (
                <button type="button" key={src} className={i === shot ? 'chosen' : ''} aria-label={`Foto ${i + 1}`} onClick={() => setShot(i)}>
                  <img src={src} alt="" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pd-copy">
          <span className="pd-badge"><BadgeIcon size={16} aria-hidden="true" />{badgeText}</span>
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <span className="pd-rating">
            <span aria-hidden="true">★★★★★</span>{p.rating} <small>({p.reviews})</small>
          </span>
          <strong className="pd-price">{money(p.price)}</strong>
          <div className="pd-qty">
            <button type="button" aria-label="Quitar una unidad" disabled={qty <= 1} onClick={() => onQty(qty - 1)}><Minus size={18} /></button>
            <output>{qty}</output>
            <button type="button" aria-label="Añadir una unidad" disabled={qty >= 20} onClick={() => onQty(qty + 1)}><Plus size={18} /></button>
          </div>
        </div>
      </div>

      <section className="pd-nutrition">
        <h4>Información nutricional<small>Por porción</small></h4>
        <MacroRings p={p} />
      </section>

      <ul className="pd-traits">
        {traits(p).map(({ icon: Icon, text }) => (
          <li key={text}><Icon size={24} aria-hidden="true" />{text}</li>
        ))}
      </ul>

      <p className="pd-allergens">{p.allergens}</p>

      <button type="button" className="pd-add" onClick={onAdd}>
        <ShoppingBag size={22} aria-hidden="true" />Agregar al pedido <span>{money(p.price * qty)}</span>
      </button>
    </div>
  );
}

export function CompareView({ items, onClose }: { items: Product[]; onClose: () => void }) {
  const [a, b] = items;
  return (
    <div className="cmp">
      <button type="button" className="cmp-close" onClick={onClose} aria-label="Cerrar"><X size={22} /></button>
      <h2 className="cmp-title">COMPARATIVA</h2>

      {items.length < 2 ? (
        <p className="cmp-empty"><Scale size={26} aria-hidden="true" />Elige dos productos del menú para compararlos.</p>
      ) : (
        <div className="cmp-grid">
          <article className="cmp-side">
            <img src={a.image} alt="" aria-hidden="true" />
            <h3>{a.name}</h3>
            <p>{a.description}</p>
            <MacroRings p={a} compact />
          </article>

          <ul className="cmp-deltas">
            {macroDeltas(a, b).map(({ key, label, unit, color, diff }) => (
              <li key={key}>
                <span className="cmp-dot" style={{ background: color }} aria-hidden="true" />
                <strong style={{ color }}>{diff > 0 ? '+' : ''}{diff}{unit === 'g' ? 'g' : ''}</strong>
                <span className="cmp-delta-label">{unit === 'kcal' ? 'kcal' : label}</span>
                <small>
                  {diff === 0
                    ? `Igual en ambos`
                    : `Más ${unit === 'kcal' ? 'energía' : label} en ${diff > 0 ? a.name : b.name}`}
                </small>
              </li>
            ))}
          </ul>

          <article className="cmp-side">
            <img src={b.image} alt="" aria-hidden="true" />
            <h3>{b.name}</h3>
            <p>{b.description}</p>
            <MacroRings p={b} compact />
          </article>
        </div>
      )}
    </div>
  );
}
