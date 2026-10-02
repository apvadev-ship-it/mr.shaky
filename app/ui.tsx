'use client';
import {useState} from 'react';
import {Plus,Minus,Crown,Heart,Scale,ArrowLeftRight} from 'lucide-react';
import {money,Product} from './data';
export function Quantity({value,onMinus,onPlus,name}:{value:number;onMinus:()=>void;onPlus:()=>void;name:string}){return <div className="quantity"><button aria-label={`Reducir ${name}`} onClick={onMinus}><Minus size={15}/></button><span>{value}</span><button aria-label={`Aumentar ${name}`} onClick={onPlus} disabled={value>=99}><Plus size={15}/></button></div>}
export function Macros({p}:{p:Product}){return <div className="macros"><span><b>{p.protein}g</b>Prot.</span><span><b>{p.carbs}g</b>Carbs</span><span><b>{p.fat}g</b>Grasas</span></div>}
export function ProductCard({p,favorite,compared,onFavorite,onCompare,onAdd,onDetail}:{p:Product;favorite:boolean;compared:boolean;onFavorite:()=>void;onCompare:()=>void;onAdd:()=>void;onDetail:()=>void}){
const [flipped,setFlipped]=useState(false);
return <article className="product flip-card">
<button className={'flip-btn '+(flipped?'chosen':'')} aria-label={(flipped?'Ver ':'Ver la ficha técnica de ')+p.name} aria-pressed={flipped} onClick={()=>setFlipped(!flipped)}><ArrowLeftRight size={17}/></button>
<div className={'flip-inner'+(flipped?' flipped':'')}>
  <div className="flip-face flip-front">
    <div className="product-picture">
      <button className="photo-button" onClick={onDetail} aria-label={`Ver ${p.name}`}><img src={p.image} alt={p.name}/></button>
      <button className={'favorite '+(favorite?'saved':'')} onClick={onFavorite} aria-label={`Favorito ${p.name}`} aria-pressed={favorite}><Heart size={22} fill={favorite?'currentColor':'none'}/></button>
      <button className="add" onClick={onAdd} aria-label={`Agregar ${p.name}`}><Plus size={22}/></button>
    </div>
    <div className="product-body">
      <button className="product-name" onClick={onDetail}>{p.name}</button>
      <p>{p.description}</p>
      <div className="rating"><span>★★★★★</span> {p.rating} <small>({p.reviews})</small></div>
      <strong className="price">{money(p.price)}</strong>
      <button className={'compare-product '+(compared?'active':'')} onClick={onCompare} aria-pressed={compared}><Scale size={14}/>{compared?'Seleccionado':'Comparar'}</button>
    </div>
  </div>
  <div className="flip-face flip-back">
    <img className="flip-back-photo" src={p.image} alt="" aria-hidden="true"/>
    <div className="flip-back-body">
      <h3>{p.name}</h3>
      <div className="flip-tiles">
        <span className="flip-tile macro-protein"><b>{p.protein}g</b>Proteína</span>
        <span className="flip-tile macro-carbs"><b>{p.carbs}g</b>Carbohidratos</span>
        <span className="flip-tile macro-fat"><b>{p.fat}g</b>Grasas</span>
        <span className="flip-tile macro-calories"><b>{p.calories}</b>Calorías</span>
      </div>
    </div>
  </div>
</div>
</article>}
export function Hero({type}:{type:string}){const order=type==='pedido',community=type==='comunidad';return <section className={'hero '+(order?'order-hero':community?'community-hero':'menu-hero')}><div className="hero-photo"/><div className="shell hero-inner"><div><h1>{order?'PLANIFICA':community?'NUESTRA':'NUESTRO'}<br/><em>{order?'TU PEDIDO':community?'COMUNIDAD':'MENÚ'}</em></h1><p>{order?'Selecciona sucursal, fecha y hora.':community?'Personas reales, resultados reales.':'Comida real para cada objetivo.'}</p>{order&&<p>Nosotros lo preparamos.</p>}</div><div className="hero-sticker handwritten">{order?'TU ESFUERZO':'DISCIPLINA'}<br/>TAMBIÉN<br/>{order?'CUENTA':community?'SE COMPARTE':'SE SABE DELICIOSA'}<Crown size={48}/></div></div><svg className="drip" viewBox="0 0 1440 38" preserveAspectRatio="none" aria-hidden="true"><path fill="#ffe500" d="M0 8 Q20 -5 37 16 T82 18 T135 25 L490 24 Q510 2 529 20 T590 15 T637 24 L910 26 Q955 6 991 24 T1100 21 L1300 25 Q1370 28 1390 9 T1440 3 L1440 38 Q1410 21 1380 33 L70 35 Q40 20 30 33 T0 27Z"/></svg></section>}
