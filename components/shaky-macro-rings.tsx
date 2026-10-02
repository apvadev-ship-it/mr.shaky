"use client";
import type { Product } from '@/lib/demo-data';

/* Un solo amarillo para los cuatro macros, igual que las fichas amarillas
   del reverso de la tarjeta. El arco mide la porción frente a una comida
   grande; no es un porcentaje del día. */
const RINGS = [
  { key: 'calories', label: 'Calorías', unit: 'kcal', max: 800 },
  { key: 'protein', label: 'Proteína', unit: 'g', max: 60 },
  { key: 'carbs', label: 'Carbohidratos', unit: 'g', max: 80 },
  { key: 'fat', label: 'Grasas', unit: 'g', max: 30 },
] as const;

const R = 44;
const C = 2 * Math.PI * R;

export function MacroRings({ p, compact }: { p: Product; compact?: boolean }) {
  return (
    <div className={'macro-rings' + (compact ? ' macro-rings-compact' : '')}>
      {RINGS.map(({ key, label, unit, max }) => {
        const value = p[key] as number;
        const pct = Math.max(.04, Math.min(1, value / max));
        return (
          <figure className="macro-ring" key={key}>
            <span className="macro-dial">
              <svg viewBox="0 0 100 100" role="img" aria-label={`${label}: ${value} ${unit}`}>
                <circle cx="50" cy="50" r={R} className="macro-track" />
                <circle
                  cx="50" cy="50" r={R}
                  className="macro-arc"
                  strokeDasharray={`${C * pct} ${C}`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <b>{value}{unit === 'g' ? 'g' : ''}</b>
            </span>
            <figcaption>{label}</figcaption>
          </figure>
        );
      })}
    </div>
  );
}

/** Diferencias entre dos productos, para la comparativa. */
export function macroDeltas(a: Product, b: Product) {
  return RINGS.map(({ key, label, unit }) => ({
    key, label, unit,
    diff: (a[key] as number) - (b[key] as number),
    a: a[key] as number,
    b: b[key] as number,
  }));
}
