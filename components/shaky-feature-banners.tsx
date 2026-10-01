"use client";
import Link from 'next/link';
import { ArrowRight, Calculator, CalendarDays, Dumbbell } from 'lucide-react';

const BANNERS: {
  id: string;
  icon: typeof Calculator;
  eyebrow?: string;
  title: string;
  accent: string;
  copy: string;
  cta: string;
  href: string;
  image: string;
}[] = [
  {
    id: 'macros',
    icon: Calculator,
    title: 'Calcula tus',
    accent: 'MACROS',
    copy: 'Descubre cuánta proteína necesitas según tu rutina.',
    cta: 'Calcular ahora',
    href: '/calculadoras',
    image: '/assets/feature-macros.webp',
  },
  {
    id: 'plato',
    icon: Dumbbell,
    title: 'Encuentra',
    accent: 'TU PLATO',
    copy: 'Cuéntanos qué entrenaste hoy y te recomendamos uno.',
    cta: 'Buscar mi plato',
    href: '/calculadoras#quiz',
    image: '/assets/feature-plato.webp',
  },
  {
    id: 'pedido',
    icon: CalendarDays,
    eyebrow: 'A TU HORA, A TU RITMO',
    title: 'PLANIFICA',
    accent: 'TU PEDIDO',
    copy: 'Elige sucursal, fecha y cómo pagar. Nosotros ponemos el sabor.',
    cta: 'Planificar pedido',
    href: '/pedido',
    image: '/assets/feature-pedido.webp',
  },
];

export function FeatureBanners() {
  return (
    <section className="feature-banners wrap" aria-label="Herramientas de Mr. Shaky">
      {BANNERS.map(({ id, icon: Icon, eyebrow, title, accent, copy, cta, href, image }) => (
        <Link className={`feature-banner feature-${id}`} href={href} key={id}>
          <img className="feature-banner-photo" src={image} alt="" aria-hidden="true" />
          <div className="feature-banner-body">
            <span className="feature-banner-icon"><Icon size={30} /></span>
            <div>
              {eyebrow && <span className="feature-banner-eyebrow">{eyebrow}</span>}
              <h3>{title}<br /><em>{accent}</em></h3>
              <p>{copy}</p>
              <span className="feature-banner-cta">{cta} <ArrowRight size={18} /></span>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}
