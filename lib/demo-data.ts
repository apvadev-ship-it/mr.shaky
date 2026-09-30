export type Product={id:string;name:string;category:string;description:string;image:string;price:number;protein:number;carbs:number;fat:number;calories:number;rating:number;reviews:number;veggie?:boolean;allergens:string;goals:string[]};
// Replace this module with a catalog API adapter. All prices, nutrition and reviews are illustrative.
export const products:Product[]=[
{id:'pollo',name:'Pollo Power Bowl',category:'Bowls',description:'Pollo a la parrilla, arroz integral, aguacate y vegetales.',image:'/assets/pollo.webp',price:28900,protein:42,carbs:54,fat:18,calories:546,rating:4.9,reviews:120,allergens:'Puede contener soya y sésamo.',goals:['Ganancia muscular','Mantenimiento']},
{id:'beef',name:'Beef Fit Bowl',category:'Bowls',description:'Carne, arroz, huevo y vegetales. Para darlo todo.',image:'/assets/beef.webp',price:31900,protein:46,carbs:50,fat:20,calories:564,rating:4.8,reviews:98,allergens:'Contiene huevo y soya.',goals:['Ganancia muscular','Mantenimiento']},
{id:'wrap',name:'Wrap Protein',category:'Wraps',description:'Tortilla integral, pollo, vegetales y salsa de la casa.',image:'/assets/wrap.webp',price:24900,protein:32,carbs:40,fat:14,calories:414,rating:4.8,reviews:76,allergens:'Contiene trigo y leche.',goals:['Pérdida de grasa','Mantenimiento']},
{id:'shake',name:'Shaky Chocolate',category:'Shakes',description:'Chocolate, proteína, leche y un toque de frutos rojos.',image:'/assets/chocolate.webp',price:18900,protein:28,carbs:26,fat:8,calories:288,rating:4.9,reviews:142,allergens:'Contiene leche. Puede contener frutos secos.',goals:['Ganancia muscular']},
{id:'salmon',name:'Salmón Balance',category:'Bowls',description:'Salmón, arroz integral, vegetales y aderezo natural.',image:'/assets/salmon.webp',price:36900,protein:40,carbs:36,fat:14,calories:470,rating:4.9,reviews:110,allergens:'Contiene pescado. Puede contener sésamo.',goals:['Salud y bienestar','Mantenimiento']},
{id:'vainilla',name:'Shaky Vainilla',category:'Shakes',description:'Proteína, banana, vainilla y avena.',image:'/assets/vainilla.webp',price:18900,protein:48,carbs:30,fat:5,calories:357,rating:4.7,reviews:96,allergens:'Contiene leche y avena. Puede contener frutos secos.',goals:['Ganancia muscular']},
{id:'cookie',name:'Snack Protein',category:'Snacks',description:'Galleta proteica, avena y chips de chocolate.',image:'/assets/cookie.webp',price:9900,protein:12,carbs:20,fat:8,calories:200,rating:4.6,reviews:80,allergens:'Contiene trigo, leche y avena. Puede contener frutos secos.',goals:['Salud y bienestar']},
{id:'veggie',name:'Green Power Bowl',category:'Bowls',description:'Garbanzos, arroz, aguacate y vegetales de temporada.',image:'/bowl.jpg',price:26900,protein:20,carbs:58,fat:16,calories:456,rating:4.7,reviews:61,veggie:true,allergens:'Puede contener sésamo.',goals:['Pérdida de grasa','Salud y bienestar']},
{id:'snack',name:'Mini Wrap',category:'Snacks',description:'Todo el sabor de nuestro wrap, en una porción pequeña.',image:'/assets/veggie.webp',price:13900,protein:16,carbs:20,fat:7,calories:207,rating:4.7,reviews:43,allergens:'Contiene trigo y leche.',goals:['Pérdida de grasa']},
{id:'cacao',name:'Cacao Cold',category:'Bebidas',description:'Cacao frío con bebida de almendras, sin proteína añadida.',image:'/assets/chocolate.webp',price:12900,protein:5,carbs:18,fat:6,calories:146,rating:4.8,reviews:57,veggie:true,allergens:'Contiene almendras.',goals:['Salud y bienestar']}
];
export const categories=['Todos','Bowls','Wraps','Shakes','Snacks','Bebidas','Veggie','Alto en proteína','Bajo en carbohidratos'];
export const branches=[{id:'turbo',name:'Turbo'}];
export const storeAddress='Al lado del parqueadero del Imperio, Turbo, Antioquia';
export const spotifyPlaylistId='0weiv18dAKsxRre2LeTDqD';
export const instagramHandle='mr_shaky_nutribar';
export const instagramUrl='https://www.instagram.com/mr_shaky_nutribar/';
export const demoReviews=[{id:'r1',name:'Alejandra M.',stars:5,text:'La mejor comida post-entreno. Sabe increíble y me ahorra tiempo.'},{id:'r2',name:'Sebastián R.',stars:5,text:'Programo mi pedido y cuando llego ya está listo. ¡Una locura!'},{id:'r3',name:'Valentina G.',stars:4,text:'El wrap se volvió mi favorito. Una opción práctica para mi rutina.'}];
export const money=(value:number)=>new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(value);
