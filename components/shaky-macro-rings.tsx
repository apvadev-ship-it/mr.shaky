"use client";
import type { Product } from '@/lib/demo-data';

/* Topes de referencia para el arco: lo que ocupa el anillo es la porción
   frente a una comida grande, no un porcentaje del día. */
const RINGS = [
  { key: 'calories', label: 'CALORÍAS', unit: 'kcal', max: 800, color: '#ff4d4d' },
  { key: 'protein', label: 'PROTEÍNA', unit: 'g', max: 60, color: '#2fd36f' },
  { key: 'carbs', label: 'CARBOHIDRATOS', unit: 'g', max: 80, color: '#ffe500' },
  { key: 'fat', label: 'GRASAS', unit: 'g', max: 30, color: '#3aa0ff' },
] as const;

const R = 42;
const C = 2 * Math.PI * R;

export function MacroRings({ p, compact }: { p: Product; compact?: boolean }) {
  return (
    <div className={'rings' + (compact ? ' rings-compact' : '')}>
      {RINGS.map(({ key, label, unit, max, color }) => {
        const value = p[key] as number;
        const pct = Math.max(0, Math.min(1, value / max));
        return (
          <figure className="ring" key={key}>
            <svg viewBox="0 0 100 100" role="img" aria-label={`${label}: ${value} ${unit}`}>
              <circle cx="50" cy="50" r={R} className="ring-track" />
              <circle
                cx="50" cy="50" r={R}
                className="ring-value"
                stroke={color}
                strokeDasharray={`${C * pct} ${C}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <span className="ring-figure">
              <b>{value}{unit === 'g' ? 'g' : ''}</b>
              {unit === 'kcal' && <small>kcal</small>}
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
  return RINGS.map(({ key, label, unit, color }) => {
    const diff = (a[key] as number) - (b[key] as number);
    return { key, label: label.toLowerCase(), unit, color, diff };
  });
}
