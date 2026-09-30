"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ArrowLeftRight, Plus, BarChart3, Check } from 'lucide-react';
import { money, type Product } from '@/lib/demo-data';
import { Macros } from './shaky-shared';
import { useShaky } from './shaky-store';

export function ProductCard({ p }: { p: Product }) {
  const router = useRouter();
  const { favorites, compare, toggleFavorite, toggleCompare, add } = useShaky();
  const favorite = favorites.includes(p.id);
  const compared = compare.includes(p.id);
  const [flipped, setFlipped] = useState(false);
  return (
    <article className="product">
      <div className="product-flip">
        <button className={'flip-btn ' + (flipped ? 'chosen' : '')} aria-label={(flipped ? 'Ver detalle de ' : 'Ver macros de ') + p.name} aria-pressed={flipped} onClick={() => setFlipped(!flipped)}><ArrowLeftRight size={18} /></button>
        <div className={'product-flip-inner' + (flipped ? ' flipped' : '')}>
          <div className="product-face product-front">
            <div className="product-photo">
              <button className="photo-button" aria-label={'Ver detalle de ' + p.name} onClick={() => router.push(`/menu/${p.id}`)}><span className={`product-image food-sprite food-${p.id}`} role="img" aria-label={p.name} /></button>
              <button className={'heart ' + (favorite ? 'chosen' : '')} aria-label={(favorite ? 'Quitar de' : 'Guardar en') + ' favoritos: ' + p.name} aria-pressed={favorite} onClick={() => toggleFavorite(p.id)}><Heart size={20} fill={favorite ? 'currentColor' : 'none'} /></button>
              <span className="protein-tag">{p.protein} g proteína</span>
            </div>
            <div className="product-body">
              <button className="product-title" onClick={() => router.push(`/menu/${p.id}`)}><h3>{p.name}</h3></button>
              <p>{p.description}</p>
              <div className="rating" aria-label={`${p.rating} de 5, ${p.reviews} reseñas`}>★★★★★ <span>{p.rating} ({p.reviews})</span></div>
              <div className="product-bottom"><strong>{money(p.price)}</strong><button className="round" aria-label={'Agregar ' + p.name} onClick={() => add(p.id)}><Plus size={20} /></button></div>
              <button className={'compare-chip' + (compared ? ' active' : '')} aria-pressed={compared} onClick={() => toggleCompare(p.id)}>
                {compared ? <Check size={14} /> : <BarChart3 size={14} />}
                {compared ? 'En comparación' : 'Comparar'}
              </button>
            </div>
          </div>
          <div className="product-face product-back">
            <span className={`product-back-photo food-sprite food-${p.id}`} role="img" aria-hidden="true" />
            <div className="product-back-body">
              <span className="eyebrow">MACROS POR PORCIÓN</span>
              <h3>{p.name}</h3>
              <Macros p={p} />
              <div className="product-bottom"><strong>{money(p.price)}</strong><button className="round" aria-label={'Agregar ' + p.name} onClick={() => add(p.id)}><Plus size={20} /></button></div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
