import {products} from './data';
// Optional progressive enhancement. Browsers without modelContext use the exact same visible UI.
export function registerCatalogTool(){
const context=(document as Document & {modelContext?:{registerTool:(tool:unknown,options:{signal:AbortSignal})=>unknown}}).modelContext;
if(!context?.registerTool)return;
const lifecycle=new AbortController();
try{Promise.resolve(context.registerTool({name:'search_shaky_catalog',title:'Buscar en el menú Mr. Shaky',description:'Read the demo catalog by name or ingredient. Does not add products to the cart.',inputSchema:{type:'object',properties:{query:{type:'string',maxLength:100}},required:['query'],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:(input:unknown)=>{if(!input||typeof input!=='object'||!('query' in input)||typeof input.query!=='string'||input.query.length>100)throw new Error('query must be a string up to 100 characters');const q=input.query.toLocaleLowerCase('es');return {mode:'demo',products:products.filter(p=>(p.name+' '+p.description).toLocaleLowerCase('es').includes(q))}}},{signal:lifecycle.signal})).catch(()=>{})}catch{}
return ()=>lifecycle.abort();
}
