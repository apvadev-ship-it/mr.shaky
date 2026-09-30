"use client";
import Link from 'next/link';
import { ArrowUpRight, Leaf, Dumbbell, Timer, Heart, Calculator, CalendarDays, Utensils } from 'lucide-react';
import { MenuPreviewSection } from '@/components/shaky-menu-preview';
import { PopularSection } from '@/components/shaky-popular-section';
import { ComunidadSection } from '@/components/shaky-comunidad-section';

const QUICK_LINKS: [any, string, string, string][] = [
  [Calculator, 'Calcula tus macros', 'Descubre lo que tu cuerpo necesita.', '/calculadoras'],
  [Dumbbell, 'Encuentra tu plato', 'Cuéntanos qué entrenaste hoy.', '/calculadoras#quiz'],
  [CalendarDays, 'Programa tu pedido', 'Tú entrenas. Nosotros cocinamos.', '/checkout'],
  [Utensils, 'Explora el menú', 'Comer bien también sabe brutal.', '/menu'],
];

export default function HomePage() {
  return (
    <>
      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow">COMIDA REAL. OBJETIVOS REALES.</div>
          <h1>ENTRENA.<br />COME.<br /><em>LOGRA.</em></h1>
          <p>Platos deliciosos, balanceados y listos<br /> cuando los necesitas.</p>
          <div className="actions">
            <Link className="btn" href="/menu">Haz tu pedido <ArrowUpRight size={20} /></Link>
            <Link className="btn outline" href="/menu">Explorar menú</Link>
          </div>
          <div className="benefits">
            <span><Leaf />Ingredientes<br /> reales</span>
            <span><Dumbbell />Nutrición<br /> balanceada</span>
            <span><Timer />Listo en<br /> minutos</span>
            <span><Heart />Sabor sin<br /> culpa</span>
          </div>
        </div>
        <div className="hero-art">
          <img src="/hero-bowl.png" alt="Gran bowl de pollo con arroz, aguacate y vegetales" fetchPriority="high" />
        </div>
      </section>
      <div className="melt melt-hero" />

      <section className="quick light">
        <div className="wrap">
          <div className="section-head">
            <div><h2>¿QUÉ QUIERES HACER HOY?</h2><p>Tu rutina, tu comida, tu ritmo.</p></div>
            <span className="eyebrow">HECHO PARA TI ↗</span>
          </div>
          <div className="quick-grid">{QUICK_LINKS.map(([Icon, t, d, href]) => (
            <Link className="quick-card" href={href} key={href}><Icon /><ArrowUpRight className="corner" /><h3>{t}</h3><p>{d}</p></Link>
          ))}</div>
        </div>
      </section>

      <PopularSection />
      <MenuPreviewSection />
      <Link className="mobile-macros" href="/calculadoras"><Calculator /><span><strong>Calcula tus macros</strong><small>Descubre cuánta proteína necesitas según tu rutina.</small></span><ArrowUpRight /></Link>
      <Link className="mobile-macros" href="/calculadoras#quiz"><Dumbbell /><span><strong>Encuentra tu plato</strong><small>Cuéntanos qué entrenaste hoy y te recomendamos uno.</small></span><ArrowUpRight /></Link>

      <section className="plan-teaser">
        <div className="wrap plan-teaser-card">
          <div className="plan-teaser-icon"><CalendarDays size={26} /></div>
          <div className="plan-teaser-body">
            <span className="eyebrow">A TU HORA, A TU RITMO</span>
            <h3>Puedes planificar tu pedido</h3>
            <p>Elige sucursal, hora y cómo pagar. Nosotros ponemos el sabor.</p>
          </div>
          <Link className="btn dark" href="/checkout">Planificar pedido <ArrowUpRight size={18} /></Link>
        </div>
      </section>
      <div className="melt melt-community" />
      <ComunidadSection />
    </>
  );
}
