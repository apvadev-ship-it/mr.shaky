"use client";
import Link from 'next/link';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { products } from '@/lib/demo-data';
import { ProductCard } from '@/components/shaky-product-card';
import { useShaky } from '@/components/shaky-store';

export function MenuPreviewSection() {
  const { compare, setCompareOpen } = useShaky();
  const featured = products.slice(0, 4);
  return (
    <>
      <section className="wrap section" id="menu">
        <div className="section-head">
          <div><div className="eyebrow">EL COMBUSTIBLE DE TUS METAS</div><h2>NUESTRO <em>MENÚ</em></h2><p>Ingredientes reales. Todo el sabor. Cero excusas.</p></div>
          <button className="btn outline compare-button" onClick={() => setCompareOpen(true)}><BarChart3 size={17} />Comparar ({compare.length}/3)</button>
        </div>
        <div className="products">{featured.map(p => <ProductCard key={p.id} p={p} />)}</div>
        <Link className="btn outline more" href="/menu">Ver más <ArrowRight size={18} /></Link>
      </section>
      <div className="melt-white" />
      <p className="fineprint catalog-note menu-note">Precios en COP · Fotografías ilustrativas · Macros y puntuaciones de ejemplo.</p>
    </>
  );
}
