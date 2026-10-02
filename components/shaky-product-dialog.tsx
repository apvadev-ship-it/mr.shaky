"use client";
import { Fragment, useState } from 'react';
import { ArrowLeftRight, Bird, Dumbbell, Flame, Heart, Leaf, Minus, Plus, Scale, ShoppingBag, Sparkles, Wheat, X } from 'lucide-react';
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
  p, onAdd, onClose, favorite, onFavorite,
}: {
  p: Product; onAdd: (qty: number) => void;
  onClose: () => void; favorite: boolean; onFavorite: () => void;
}) {
  const [qty, setQty] = useState(1);
  const { icon: BadgeIcon, text: badgeText } = badge(p);

  return (
    <div className="pd">
      <button type="button" className="pd-close" onClick={onClose} aria-label="Cerrar"><X size={21} /></button>

      <div className="pd-hero">
        <figure className="pd-shot">
          <img src={p.image} alt={p.name} />
          <figcaption className="pd-badge"><BadgeIcon size={15} aria-hidden="true" />{badgeText}</figcaption>
        </figure>

        <div className="pd-copy">
          <div className="pd-headline">
            <h3>{p.name}</h3>
            <button type="button" className="pd-fav" onClick={onFavorite} aria-pressed={favorite}
              aria-label={(favorite ? 'Quitar de' : 'Guardar en') + ' favoritos'}>
              <Heart size={20} fill={favorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          <p className="pd-lead">{p.description}</p>

          <div className="pd-meta">
            <span className="pd-rating"><span aria-hidden="true">★★★★★</span>{p.rating}<small>({p.reviews})</small></span>
            <span className="pd-dot" aria-hidden="true" />
            <span className="pd-cat">{p.category}</span>
          </div>

          <div className="pd-buy">
            <strong className="pd-price">{money(p.price)}</strong>
            <div className="pd-qty">
              <button type="button" aria-label="Quitar una unidad" disabled={qty <= 1} onClick={() => setQty(n => Math.max(1, n - 1))}><Minus size={17} /></button>
              <output aria-label="Cantidad">{qty}</output>
              <button type="button" aria-label="Añadir una unidad" disabled={qty >= 20} onClick={() => setQty(n => Math.min(20, n + 1))}><Plus size={17} /></button>
            </div>
          </div>
        </div>
      </div>

      <section className="pd-nutrition">
        <header><h4>Información nutricional</h4><span>Por porción</span></header>
        <MacroRings p={p} />
      </section>

      <ul className="pd-traits">
        {traits(p).map(({ icon: Icon, text }) => (
          <li key={text}><Icon size={19} aria-hidden="true" />{text}</li>
        ))}
      </ul>

      <footer className="pd-foot">
        <p className="pd-allergens">{p.allergens}</p>
        <button type="button" className="pd-add" onClick={() => onAdd(qty)}>
          <ShoppingBag size={20} aria-hidden="true" />
          Agregar al pedido
          <span>{money(p.price * qty)}</span>
        </button>
      </footer>
    </div>
  );
}

export function CompareView({ items, onClose }: { items: Product[]; onClose: () => void }) {
  const [a, b] = items;
  const pair = items.length === 2;
  return (
    <div className="cmp">
      <button type="button" className="cmp-close" onClick={onClose} aria-label="Cerrar"><X size={21} /></button>
      <h2 className="cmp-title">COMPARATIVA</h2>

      {items.length < 2 ? (
        <p className="cmp-empty"><Scale size={24} aria-hidden="true" />Elige dos productos del menú para compararlos.</p>
      ) : (
        <>
          <div className={'cmp-grid' + (pair ? '' : ' cmp-grid-wide')}>
            {items.map((p, i) => (
              <Fragment key={p.id}>
                {pair && i === 1 && (
                  <div className="cmp-middle" aria-hidden="true">
                    <span className="cmp-vs"><ArrowLeftRight size={20} /></span>
                  </div>
                )}
                <article className="cmp-side">
                  <img src={p.image} alt="" aria-hidden="true" />
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <strong>{money(p.price)}</strong>
                  <MacroRings p={p} compact />
                </article>
              </Fragment>
            ))}
          </div>

          {!pair && (
            <p className="cmp-note">
              Las diferencias se muestran al comparar dos productos. Quita uno para verlas.
            </p>
          )}

          {pair && <>
          <h4 className="cmp-sub">Diferencia entre los dos</h4>
          <ul className="cmp-deltas">
            {macroDeltas(a, b).map(({ key, label, unit, tone, diff, a: va, b: vb }) => {
              const g = unit === 'g' ? 'g' : '';
              const total = va + vb || 1;
              const winner = diff === 0 ? null : diff > 0 ? a.name : b.name;
              return (
                <li key={key} style={{ ['--tone' as string]: `var(--macro-${tone})` }}>
                  <b className="cmp-val">{va}{g}</b>
                  <span className="cmp-bar" aria-hidden="true">
                    <i className={diff >= 0 ? 'lead' : ''} style={{ width: (va / total * 100) + '%' }} />
                    <i className={diff <= 0 ? 'lead' : ''} style={{ width: (vb / total * 100) + '%' }} />
                  </span>
                  <b className="cmp-val">{vb}{g}</b>
                  <span className="cmp-delta-head">{label}</span>
                  <small>{winner ? `${Math.abs(diff)}${g} más en ${winner}` : 'Igual en ambos'}</small>
                </li>
              );
            })}
          </ul>
          </>}
        </>
      )}
    </div>
  );
}
