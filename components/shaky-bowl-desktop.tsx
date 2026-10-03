"use client";
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Minus, Pencil, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { proteins, sides, sauces, type BowlConfig } from '@/app/bowl-data';
import { asset, money } from '@/app/data';

const BOWL_PRICE = 24900;

type Step = { n: number; title: string; need: string; names: string[]; prefix: 'protein' | 'side' | 'sauce' };

const STEPS: Step[] = [
  { n: 1, title: 'Elige tu proteína', need: '(1)', names: proteins, prefix: 'protein' },
  { n: 2, title: 'Elige tus acompañantes', need: '(3)', names: sides, prefix: 'side' },
  { n: 3, title: 'Elige tu vinagreta', need: '(1)', names: sauces, prefix: 'sauce' },
];

/** Vista de escritorio de "Arma tu Bowl": todo a la vista, resumen al lado. */
export function BowlDesktop({ onAdd, go }: { onAdd: (b: BowlConfig) => void; go: (r: string) => void }) {
  const [protein, setProtein] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [sauce, setSauce] = useState(0);
  const [qty, setQty] = useState(1);

  const full = picked.length === 3;
  const toggleSide = (i: number) =>
    setPicked(s => s.includes(i) ? s.filter(n => n !== i) : s.length < 3 ? [...s, i] : s);

  const chosen = (step: Step, i: number) =>
    step.prefix === 'protein' ? protein === i : step.prefix === 'sauce' ? sauce === i : picked.includes(i);

  const choose = (step: Step, i: number) =>
    step.prefix === 'protein' ? setProtein(i) : step.prefix === 'sauce' ? setSauce(i) : toggleSide(i);

  const focusStep = (n: number) => document.getElementById('bowl-step-' + n)?.scrollIntoView({ block: 'center' });

  return (
    <section className="bd">
      <div className="wrap bd-grid">
        <div className="bd-main">
          <button type="button" className="bd-back" onClick={() => go('menu')}><ArrowLeft size={20} aria-hidden="true" />Volver</button>

          <div className="bd-head">
            <div>
              <h1 className="bd-title">Arma tu <em>Bowl</em></h1>
              <p className="bd-lead">Crea un bowl a tu medida. Elige una proteína, tres acompañantes y una vinagreta.</p>
            </div>
            <span className="bd-sticker">Solo por<strong>{money(BOWL_PRICE)}</strong></span>
          </div>

          {STEPS.map(step => (
            <section className="bd-card" id={'bowl-step-' + step.n} key={step.n}>
              <header className="bd-card-head">
                <span className="bd-step-n">{step.n}</span>
                <h2>{step.title} {step.need}</h2>
                <span className="bd-required">Obligatorio</span>
                {step.prefix === 'side' && (
                  <span className="bd-counter">
                    Selecciona {picked.length} de 3
                    <span className="bd-dots" aria-hidden="true">
                      {[0, 1, 2].map(i => <i key={i} className={i < picked.length ? 'on' : ''} />)}
                    </span>
                  </span>
                )}
              </header>
              <div className="bd-options">
                {step.names.map((name, i) => {
                  const on = chosen(step, i);
                  const blocked = step.prefix === 'side' && full && !on;
                  return (
                    <button
                      type="button"
                      key={name}
                      className={'bd-option' + (on ? ' chosen' : '') + (blocked ? ' blocked' : '')}
                      aria-pressed={on}
                      disabled={blocked}
                      onClick={() => choose(step, i)}
                    >
                      <span className="bd-option-photo">
                        <img src={asset(`bowl-${step.prefix}-${i}`)} alt="" aria-hidden="true" />
                        {on && <span className="bd-check" aria-hidden="true"><Check size={16} strokeWidth={3} /></span>}
                      </span>
                      <span className="bd-option-name">{name}</span>
                    </button>
                  );
                })}
              </div>
              {step.prefix === 'side' && full && (
                <p className="bd-hint">Ya tienes tres. Desmarca uno para cambiarlo.</p>
              )}
            </section>
          ))}
        </div>

        <aside className="bd-aside" aria-label="Tu bowl personalizado">
          <header className="bd-aside-head">
            <span className="bd-bag"><ShoppingBag size={26} /></span>
            <h2>Tu Bowl Personalizado</h2>
          </header>

          <div className="bd-preview">
            <img src={asset('bowl-hero')} alt="" aria-hidden="true" />
            <span className="bd-preview-price">Precio del bowl<strong>{money(BOWL_PRICE)}</strong></span>
          </div>

          <ul className="bd-picks">
            <li>
              <img src={asset(`bowl-protein-${protein}`)} alt="" aria-hidden="true" />
              <div><span>Proteína</span><strong>{proteins[protein]}</strong></div>
              <button type="button" onClick={() => focusStep(1)}>Cambiar <Pencil size={15} aria-hidden="true" /></button>
            </li>
            <li className="bd-picks-sides">
              {/* Miniaturas pequeñas en fila, del tamaño de la proteína. */}
              <div className="bd-picks-thumbs" aria-hidden="true">
                {picked.length === 0
                  ? <span className="bd-empty-thumb" />
                  : [...picked].sort((a, b) => a - b).map(i => (
                    <img key={i} src={asset(`bowl-side-${i}`)} alt="" />
                  ))}
              </div>
              <div>
                <span>Acompañantes ({picked.length})</span>
                <strong>{picked.length ? [...picked].sort((a, b) => a - b).map(i => sides[i]).join(' · ') : 'Elige tres'}</strong>
              </div>
              <button type="button" onClick={() => focusStep(2)}>Cambiar <Pencil size={15} aria-hidden="true" /></button>
            </li>
            <li>
              <img src={asset(`bowl-sauce-${sauce}`)} alt="" aria-hidden="true" />
              <div><span>Vinagreta</span><strong>{sauces[sauce]}</strong></div>
              <button type="button" onClick={() => focusStep(3)}>Cambiar <Pencil size={15} aria-hidden="true" /></button>
            </li>
          </ul>

          <h3 className="bd-summary-title">Resumen de tu pedido</h3>
          <div className="bd-summary">
            <img src={asset('bowl-hero')} alt="" aria-hidden="true" />
            <div className="bd-summary-copy">
              <strong>Bowl Personalizado</strong>
              <p>{proteins[protein]} + {picked.length} acompañante{picked.length === 1 ? '' : 's'} + vinagreta {sauces[sauce].toLowerCase().replace(/^vinagreta /, '')}</p>
              <span className="bd-summary-price">{money(BOWL_PRICE * qty)}</span>
            </div>
            <div className="bd-summary-side">
              <div className="bd-qty">
                <button type="button" aria-label="Quitar una unidad" disabled={qty <= 1} onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={16} /></button>
                <output>{qty}</output>
                <button type="button" aria-label="Añadir una unidad" disabled={qty >= 20} onClick={() => setQty(q => Math.min(20, q + 1))}><Plus size={16} /></button>
              </div>
              <button type="button" className="bd-clear" aria-label="Reiniciar el bowl" onClick={() => { setPicked([]); setQty(1) }}><Trash2 size={18} /></button>
            </div>
          </div>

          <div className="bd-total">
            <span>Total</span>
            <strong>{money(BOWL_PRICE * qty)}</strong>
          </div>

          <button
            type="button"
            className="bd-submit"
            disabled={!full}
            onClick={() => { for (let i = 0; i < qty; i++) onAdd({ protein, sides: [...picked].sort((a, b) => a - b), sauce }); go('pedido') }}
          >
            <ShoppingBag size={20} aria-hidden="true" />Agregar al pedido <ArrowRight size={20} aria-hidden="true" />
          </button>
          {!full && <p className="bd-submit-hint">Elige {3 - picked.length} acompañante{3 - picked.length === 1 ? '' : 's'} más para continuar.</p>}
        </aside>
      </div>
    </section>
  );
}
