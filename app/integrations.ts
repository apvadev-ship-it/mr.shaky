// All remote integrations are deliberately server-side contracts. No secrets belong in NEXT_PUBLIC_*.
import {products,Product} from './data';
export interface InstagramPost {id:string;image:string;caption:string;permalink?:string;kind:'image'|'reel'}
export interface InstagramProvider {listPosts(signal?:AbortSignal):Promise<InstagramPost[]>}
export const demoPosts:InstagramPost[]=[
['Tu almuerzo después de entrenar','0'],['Sabor que se prepara de verdad','1'],['Disciplina también se comparte','2'],['Meal prep para la semana','3'],['Un shake. Mucha actitud.','4'],['Tu wrap favorito te espera','5'],['Somos Shaky Team','6'],['El snack que va contigo','7']
].map(([caption,id])=>({id,image:`/assets/post-${id}.webp`,caption,kind:'reel'}));
export const instagramProvider:InstagramProvider={async listPosts(){return demoPosts}};
export interface CatalogProvider{listProducts(signal?:AbortSignal):Promise<Product[]>}
export const catalogProvider:CatalogProvider={async listProducts(){return products}};
export interface OrderDraft{branch:string;date:string;time:string;items:{productId:string;quantity:number}[];paymentMethod:string;deliveryMethod:'pickup'|'delivery';deliveryAddress?:{city:string;street:string;notes?:string}}
export interface OrderProvider{getAvailability(branch:string,date:string):Promise<string[]>;createOrder(draft:OrderDraft):Promise<{id:string;paymentUrl?:string}>}
export interface PaymentProvider{createCheckout(orderId:string):Promise<{redirectUrl:string}>}
export interface SpotifyProvider{getPlaylist():Promise<{name:string;embedUrl:string}|null>}
export const integrationStatus={catalog:'demo',orders:'demo',instagram:'demo',payments:'not-connected',spotify:'not-connected'} as const;
// Implement OrderProvider on the backend: verify prices/stock, reserve slot, create an idempotent order,
// then create hosted payment session. Verify webhook signatures; never trust client totals.
// Instagram: replace demo provider with GET /api/instagram; keep Meta token in server secrets,
// normalize records to InstagramPost, cache responses and preserve explicit failure/empty states.
// Spotify: configure an approved playlist ID; do not fabricate a branded playlist or OAuth state.
