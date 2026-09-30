"use client";
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { products } from '@/lib/demo-data';
import { useShaky } from '@/components/shaky-store';

export function PopularSection() {
  const router = useRouter();
  const { setCompareOpen } = useShaky();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.style.transition = 'transform .6s cubic-bezier(.4,0,.2,1)';
    let index = 0;
    const goTo = (i: number) => {
      const kids = Array.from(el.children) as HTMLElement[];
      if (!kids.length) return;
      const cardWidth = kids[0].getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(el).columnGap || '0') || 0;
      index = i;
      el.style.transform = `translateX(${-(index * (cardWidth + gap))}px)`;
    };
    const id = setInterval(() => {
      const count = el.children.length;
      if (!count) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 1) return; // nothing to scroll (desktop grid)
      goTo((index + 1) % count);
    }, 3200);
    return () => { clearInterval(id); el.style.transform = ''; el.style.transition = '' };
  }, []);

  return (
    <section className="popular light">
      <div className="wrap popular-grid">
        <div className="popular-track" ref={trackRef}>
          <div className="compare-teaser">
            <span className="eyebrow">ELIGE CON TODO CLARO</span>
            <h3>COMPARA<br />TUS FAVORITOS</h3>
            <p>Hasta 3 productos, lado a lado.</p>
            <div className="mini-images">{products.slice(0, 3).map(p => <span className={`food-sprite food-${p.id}`} role="img" aria-label={p.name} key={p.id} />)}</div>
            <button className="btn" onClick={() => setCompareOpen(true)}>Comparar ahora <ArrowRight size={17} /></button>
          </div>
          {[products[0], products[3]].map((p, i) => (
            <div className={`popular-item popular-${p.id}`} key={p.id}>
              <div>
                <span className="eyebrow">{i ? 'EL SHAKE MÁS PEDIDO' : 'EL FAVORITO DEL MENÚ'}</span>
                <h3>{i ? 'BEBIDA MÁS' : 'PRODUCTO MÁS'}<br />POPULAR</h3>
                <h4>{p.name}</h4>
                <div className="rating">★★★★★ <span>{p.rating} ({p.reviews})</span></div>
                <p>{i ? 'Tu dosis deliciosa de proteína.' : 'El favorito de la familia Shaky.'}</p>
                <button className="btn dark" onClick={() => router.push(`/menu/${p.id}`)}>Ver detalle <ArrowUpRight size={17} /></button>
              </div>
              <span className={`popular-photo food-sprite food-${p.id}`} role="img" aria-label={p.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
