"use client";
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, BarChart3, Check, Heart } from 'lucide-react';
import { products, money, type Product } from '@/lib/demo-data';
import { Macros } from './shaky-shared';
import { useShaky } from './shaky-store';
import { ProductCard } from './shaky-product-card';

export function ProductPage({ p }: { p: Product }) {
  const { favorites, compare, toggleFavorite, toggleCompare, add } = useShaky();
  const favorite = favorites.includes(p.id);
  const compared = compare.includes(p.id);
  const related = products.filter(x => x.id !== p.id && x.category === p.category).slice(0, 3);

  return (
    <section className="wrap product-page">
      <Link className="product-page-back" href="/menu"><ArrowLeft size={16} />Volver al menú</Link>
      <div className="product-page-grid">
        <div className="product-page-photo">
          <span className={`food-sprite food-${p.id}`} role="img" aria-label={p.name} />
          <button className={'heart ' + (favorite ? 'chosen' : '')} aria-label={(favorite ? 'Quitar de' : 'Guardar en') + ' favoritos: ' + p.name} aria-pressed={favorite} onClick={() => toggleFavorite(p.id)}><Heart size={20} fill={favorite ? 'currentColor' : 'none'} /></button>
        </div>
        <div className="product-page-body">
          <span className="eyebrow">{p.category}</span>
          <h1>{p.name}</h1>
          <div className="rating" aria-label={`${p.rating} de 5, ${p.reviews} reseñas de ejemplo`}>★★★★★ <span>{p.rating} ({p.reviews} puntuaciones)</span></div>
          <p className="product-page-desc">{p.description}</p>
          <Macros p={p} />
          <p className="fineprint">{p.allergens} Las fotografías son ilustrativas; confirma la receta y los alérgenos con la sucursal.</p>
          <div className="product-bottom"><strong>{money(p.price)}</strong><button className="btn" onClick={() => add(p.id)}>Agregar al carrito +</button></div>
          <button className={'compare-chip' + (compared ? ' active' : '')} aria-pressed={compared} onClick={() => toggleCompare(p.id)}>
            {compared ? <Check size={14} /> : <BarChart3 size={14} />}
            {compared ? 'En comparación' : 'Comparar'}
          </button>
        </div>
      </div>
      {related.length > 0 && (
        <div className="product-page-related">
          <div className="section-head"><div><h2>TAMBIÉN TE PUEDE GUSTAR</h2></div></div>
          <div className="products">{related.map(r => <ProductCard key={r.id} p={r} />)}</div>
          <Link className="text-button" href="/menu">Ver todo el menú <ArrowUpRight size={17} /></Link>
        </div>
      )}
    </section>
  );
}
