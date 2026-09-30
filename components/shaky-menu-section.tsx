"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Heart, BarChart3, SlidersHorizontal } from 'lucide-react';
import { products, categories } from '@/lib/demo-data';
import { Choice } from '@/components/shaky-shared';
import { ProductCard } from '@/components/shaky-product-card';
import { useShaky } from '@/components/shaky-store';

export function MenuSection() {
  const { favorites, compare, setCompareOpen } = useShaky();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState('Todos');
  const [query, setQuery] = useState('');
  const [favOnly, setFavOnly] = useState(false);
  const [sort, setSort] = useState('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const context = (document as any).modelContext;
    if (!context?.registerTool) return;
    const life = new AbortController();
    Promise.resolve(context.registerTool({
      name: 'search_menu', title: 'Buscar platos', description: 'Filtra el catálogo visible por nombre o ingrediente. No crea pedidos.',
      inputSchema: { type: 'object', properties: { query: { type: 'string', maxLength: 100 } }, required: ['query'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: async (input: any) => {
        if (!input || typeof input.query !== 'string' || input.query.length > 100) throw new Error('La búsqueda debe tener hasta 100 caracteres');
        setQuery(input.query); setCategory('Todos'); setFavOnly(false);
        document.getElementById('menu')?.scrollIntoView();
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        return { query: input.query };
      },
    }, { signal: life.signal })).catch(() => { });
    return () => life.abort();
  }, []);

  let filtered = products.filter(p => (!favOnly || favorites.includes(p.id)) &&
    (category === 'Todos' || p.category === category || (category === 'Veggie' && p.veggie) || (category === 'Alto en proteína' && p.protein >= 25) || (category === 'Bajo en carbohidratos' && p.carbs <= 25)) &&
    (`${p.name} ${p.description}`.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().includes(query.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase())));
  if (sort === 'price') filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === 'protein') filtered = [...filtered].sort((a, b) => b.protein - a.protein);

  return (
    <section className="wrap section show-all" id="menu">
      <div className="section-head">
        <div><div className="eyebrow">EL COMBUSTIBLE DE TUS METAS</div><h2>NUESTRO <em>MENÚ</em></h2><p>Ingredientes reales. Todo el sabor. Cero excusas.</p></div>
      </div>
      <div className="menu-controls">
        <div className="search-box">
          <Search size={18} />
          <input id="search" aria-label="Buscar en el menú" placeholder="¿Qué se te antoja?" value={query} onChange={e => setQuery(e.target.value)} />
          {query && <button aria-label="Limpiar búsqueda" onClick={() => setQuery('')}>×</button>}
        </div>
        <button className="btn outline compare-button" onClick={() => setCompareOpen(true)}><BarChart3 size={17} />Comparar ({compare.length}/3)</button>
        <div className="filters-menu">
          <button className={'btn outline filters-toggle ' + (filtersOpen ? 'active' : '')} aria-expanded={filtersOpen} onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={16} />Filtros</button>
          {filtersOpen && (
            <div className="filters-popover">
              <Choice label="Ordenar por" value={sort} onChange={setSort} options={[{ value: 'featured', label: 'Recomendados' }, { value: 'price', label: 'Menor precio' }, { value: 'protein', label: 'Más proteína' }]} />
              <button className={'favorite-filter ' + (favOnly ? 'active' : '')} aria-pressed={favOnly} onClick={() => setFavOnly(!favOnly)}><Heart size={18} fill={favOnly ? 'currentColor' : 'none'} />Favoritos ({favorites.length})</button>
            </div>
          )}
        </div>
      </div>
      <div className="filters" aria-label="Categorías">{categories.map(c => (
        <button key={c} aria-pressed={category === c} className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>{c}</button>
      ))}</div>
      <div className="products">{filtered.map(p => <ProductCard key={p.id} p={p} />)}</div>
      {!filtered.length && (
        <div className="empty"><Search /><h3>No encontramos ese antojo</h3><p>Prueba otra búsqueda o explora todos los platos.</p><button className="btn" onClick={() => { setQuery(''); setCategory('Todos'); setFavOnly(false) }}>Ver todo el menú</button></div>
      )}
      <p className="fineprint catalog-note">Precios en COP · Fotografías ilustrativas.</p>
    </section>
  );
}
