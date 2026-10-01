"use client";
import Link from 'next/link';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { products } from '@/lib/demo-data';
import { ProductCard } from '@/app/ui';
import { useShaky } from '@/components/shaky-store';

export function MenuPreviewSection() {
  const { compare, favorites, setCompareOpen, toggleCompare, toggleFavorite, add } = useShaky();
  const featured = products.slice(0, 4);
  return (
    <>
      <section className="wrap section" id="menu">
        <div className="section-head">
          <div><div className="eyebrow">EL COMBUSTIBLE DE TUS METAS</div><h2>NUESTRO <em>MENÚ</em></h2><p>Ingredientes reales. Todo el sabor. Cero excusas.</p></div>
          <button className="btn outline compare-button" onClick={() => setCompareOpen(true)}><BarChart3 size={17} />Comparar ({compare.length}/3)</button>
        </div>
        <div className="products product-grid">{featured.map(p => (
          <ProductCard
            key={p.id}
            p={p}
            favorite={favorites.includes(p.id)}
            compared={compare.includes(p.id)}
            onFavorite={() => toggleFavorite(p.id)}
            onCompare={() => toggleCompare(p.id)}
            onAdd={() => add(p.id)}
            onDetail={() => { window.location.href = '/menu'; }}
          />
        ))}</div>
        <Link className="btn outline more" href="/menu">Ver más <ArrowRight size={18} /></Link>
      </section>
      <div className="melt-white" />
      <p className="fineprint catalog-note menu-note">Precios en COP · Fotografías ilustrativas.</p>
    </>
  );
}
