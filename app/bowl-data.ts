import {asset} from './data';
export const proteins=['Pollo a la parrilla','Carne desmechada','Carne a la plancha','Atún','Huevo'];
export const sides=['Arroz integral','Arroz blanco','Frijoles negros','Papas doradas','Ensalada fresca','Maíz dulce'];
export const sauces=['Vinagreta clásica','Cítrica','BBQ ligera','Miel mostaza','Aguacate','Chipotle'];
export type BowlConfig={protein:number;sides:number[];sauce:number};
export type CartItem={id:string;name:string;description:string;price:number;image?:string};
export function validBowl(v:unknown):v is BowlConfig{if(!v||typeof v!=='object')return false;const b=v as BowlConfig;return Number.isInteger(b.protein)&&b.protein>=0&&b.protein<proteins.length&&Number.isInteger(b.sauce)&&b.sauce>=0&&b.sauce<sauces.length&&Array.isArray(b.sides)&&b.sides.length===3&&new Set(b.sides).size===3&&b.sides.every(i=>Number.isInteger(i)&&i>=0&&i<sides.length)}
export const bowlId=(b:BowlConfig)=>`bowl-${b.protein}-${[...b.sides].sort().join('')}-${b.sauce}`;
export const bowlItem=(b:BowlConfig):CartItem=>({id:bowlId(b),name:'Tu bowl · '+proteins[b.protein],description:[...b.sides.map(i=>sides[i]),sauces[b.sauce]].join(' · '),price:24900,image:asset('bowl-hero')});
