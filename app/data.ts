export type Product={id:string;name:string;description:string;category:string;price:number;protein:number;carbs:number;fat:number;rating:number;reviews:number;goals:string[]};
export const products:Product[]=[
{id:'pollo',name:'Pollo Power Bowl',description:'Pollo a la parrilla, arroz integral, aguacate y vegetales.',category:'Bowls',price:28900,protein:36,carbs:45,fat:12,rating:4.8,reviews:120,goals:['Ganancia muscular','Mantenimiento']},
{id:'beef',name:'Beef Fit Bowl',description:'Carne magra, quinoa, brócoli y vegetales.',category:'Bowls',price:31900,protein:32,carbs:38,fat:10,rating:4.7,reviews:98,goals:['Ganancia muscular','Mantenimiento']},
{id:'salmon',name:'Salmón Balance',description:'Salmón, arroz integral, vegetales y aderezo natural.',category:'Bowls',price:36900,protein:40,carbs:36,fat:14,rating:4.9,reviews:110,goals:['Salud y bienestar','Mantenimiento']},
{id:'wrap',name:'Wrap Protein',description:'Tortilla integral, pollo, vegetales y salsa de la casa.',category:'Wraps',price:24900,protein:28,carbs:34,fat:9,rating:4.6,reviews:76,goals:['Pérdida de grasa','Mantenimiento']},
{id:'chocolate',name:'Shaky Chocolate',description:'Proteína, cacao, banana y avena.',category:'Shakes',price:18900,protein:48,carbs:30,fat:5,rating:4.8,reviews:142,goals:['Ganancia muscular']},
{id:'vainilla',name:'Shaky Vainilla',description:'Proteína, banana, vainilla y avena.',category:'Shakes',price:18900,protein:48,carbs:30,fat:5,rating:4.7,reviews:96,goals:['Ganancia muscular']},
{id:'cookie',name:'Snack Protein',description:'Galleta proteica, avena y chips de chocolate.',category:'Snacks',price:9900,protein:12,carbs:20,fat:8,rating:4.6,reviews:80,goals:['Salud y bienestar']},
{id:'veggie',name:'Wrap Veggie',description:'Tortilla integral, vegetales, hummus y aguacate.',category:'Veggie',price:22900,protein:14,carbs:28,fat:9,rating:4.5,reviews:64,goals:['Pérdida de grasa','Salud y bienestar']}
];
export const categories=['Todos','Bowls','Wraps','Shakes','Snacks','Bebidas','Veggie'];
export const goals=['Ganancia muscular','Pérdida de grasa','Mantenimiento','Salud y bienestar'];
export const branches=[{name:'El Poblado',address:'Cra. 43A # 7-50'},{name:'Laureles',address:'Cl. 33 # 76-12'},{name:'Envigado',address:'Cra. 48 # 32B Sur–12'},{name:'Sabaneta',address:'Cl. 75 Sur # 45-10'}];
export const brand={instagram:'https://www.instagram.com/mr.shaky.nutribar/',spotify:null as string|null};
export const money=(v:number)=>new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(v);
export const asset=(name:string)=>`/assets/${name}.webp`;
export const nav=[['inicio','Inicio'],['menu','Menú'],['bowl','Arma tu bowl'],['calculadoras','Calculadoras'],['pedido','Planifica'],['nosotros','Nosotros'],['comunidad','Comunidad']];
