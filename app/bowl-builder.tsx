'use client';
import {useState} from 'react';
import {ArrowLeft,ArrowRight,Check,ShoppingCart} from 'lucide-react';
import {RadioGroup,RadioGroupItem} from '@/components/ui/radio-group';
import {Checkbox} from '@/components/ui/checkbox';
import {proteins,sides,sauces,BowlConfig} from './bowl-data';
import {asset,money} from './data';
import {BowlDesktop} from '@/components/shaky-bowl-desktop';

const STEPS=['Proteína','Acompañantes','Vinagreta','Tu bowl'];

export function BowlBuilder({onAdd,go}:{onAdd:(b:BowlConfig)=>void;go:(r:string)=>void}){
const [protein,setProtein]=useState(0),[selected,setSelected]=useState<number[]>([]),[sauce,setSauce]=useState(0),[added,setAdded]=useState(false);
const [step,setStep]=useState(0);

const options=(names:string[],prefix:string,value:number,set:(n:number)=>void)=>
  <RadioGroup className="ingredient-grid" value={String(value)} onValueChange={v=>{set(Number(v));setAdded(false)}} aria-label={prefix==='protein'?'Proteína':'Vinagreta'}>
    {names.map((name,i)=>
      <label className={'ingredient '+(value===i?'chosen':'')} key={name}>
        <img src={asset(`bowl-${prefix}-${i}`)} alt=""/><b>{name}</b>
        <RadioGroupItem value={String(i)} aria-label={name}/>{value===i&&<Check className="ingredient-check"/>}
      </label>)}
  </RadioGroup>;

const choices=[{name:proteins[protein],image:`protein-${protein}`},...[...selected].sort((a,b)=>a-b).map(i=>({name:sides[i],image:`side-${i}`})),{name:sauces[sauce],image:`sauce-${sauce}`}];
// Cada paso se valida antes de dejar avanzar.
const canContinue=step===1?selected.length===3:true;

return <><BowlDesktop onAdd={onAdd} go={go}/><main className="bowl-page">
  <section className="bowl-hero shell">
    <span className="drip" aria-hidden="true"/>
    <img className="bowl-hero-photo" src={asset('bowl-hero')} alt="Bowl de pollo, arroz y vegetales"/>
    <div className="bowl-hero-copy"><h1>ARMA<br/><em>TU BOWL</em></h1></div>
  </section>

  <div className="shell bowl-content">
    <nav className="bowl-steps" aria-label="Pasos para armar tu bowl">
      {STEPS.map((label,i)=>
        <button key={label} type="button"
          className={step===i?'current':i<step?'done':''}
          disabled={i>step}
          aria-current={step===i?'step':undefined}
          onClick={()=>setStep(i)}><span>{i+1}</span>{label}</button>)}
    </nav>

    {step===0&&<section className="bowl-section">
      <div className="bowl-section-heading"><span>1</span><h2>Elige tu proteína</h2><small>1 opción obligatoria</small></div>
      {options(proteins,'protein',protein,setProtein)}
    </section>}

    {step===1&&<section className="bowl-section">
      <div className="bowl-section-heading"><span>2</span><h2>Elige 3 acompañantes</h2><small aria-live="polite">{selected.length} de 3 seleccionados</small></div>
      <div className="ingredient-grid sides-grid" role="group" aria-label="Acompañantes">
        {sides.map((name,i)=>
          <label key={name} className={'ingredient '+(selected.includes(i)?'chosen':'')+(selected.length===3&&!selected.includes(i)?' selection-full':'')}>
            <img src={asset(`bowl-side-${i}`)} alt=""/><b>{name}</b>
            <Checkbox aria-label={name} checked={selected.includes(i)} disabled={selected.length===3&&!selected.includes(i)}
              onCheckedChange={checked=>{setSelected(s=>checked?[...s,i]:s.filter(n=>n!==i));setAdded(false)}}/>
          </label>)}
      </div>
      <p className="bowl-help">Para cambiar un acompañante, desmarca uno de los seleccionados.</p>
    </section>}

    {step===2&&<section className="bowl-section">
      <div className="bowl-section-heading"><span>3</span><h2>Elige tu vinagreta</h2><small>1 opción obligatoria</small></div>
      {options(sauces,'sauce',sauce,setSauce)}
    </section>}

    {step===3&&<section className="bowl-summary">
      <div>
        <h2>Tu bowl</h2>
        <div className="bowl-selection">{choices.map(c=><div key={c.image}><img src={asset('bowl-'+c.image)} alt=""/><span>{c.name}</span></div>)}</div>
      </div>
      <div className="bowl-total">Precio final<strong>{money(24900)}</strong></div>
      <button disabled={selected.length!==3} className="yellow full" onClick={()=>{onAdd({protein,sides:[...selected].sort(),sauce});setAdded(true)}}>
        <ShoppingCart/>Agregar al pedido <ArrowRight/>
      </button>
      {added&&<button className="outline full" onClick={()=>go('pedido')}>Planificar mi pedido <ArrowRight/></button>}
      
    </section>}

    {step<3&&<div className="bowl-nav">
      {step>0&&<button type="button" className="outline" onClick={()=>setStep(step-1)}><ArrowLeft size={18}/> Atrás</button>}
      <button type="button" className="yellow" disabled={!canContinue} onClick={()=>setStep(step+1)}>
        Siguiente <ArrowRight size={18}/>
      </button>
    </div>}
  </div>
</main></>;
}
