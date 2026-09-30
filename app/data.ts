// Catálogo, marca y navegación: una sola fuente para todo el sitio.
// Los productos, categorías y el formato de moneda viven en lib/demo-data.
import {
  products as catalog,
  categories as catalogCategories,
  money as formatMoney,
  branches as storeBranches,
  storeAddress,
  instagramUrl,
  spotifyPlaylistId,
  type Product,
} from '@/lib/demo-data';

export type { Product };
export const products = catalog;
export const categories = catalogCategories;
export const money = formatMoney;

export const goals = ['Ganancia muscular', 'Pérdida de grasa', 'Mantenimiento', 'Salud y bienestar'];
export const branches = storeBranches.map(b => ({ name: b.name, address: storeAddress }));
export const brand = { instagram: instagramUrl, spotify: spotifyPlaylistId as string | null };
export const asset = (name: string) => `/assets/${name}.webp`;
export const nav = [['inicio', 'Inicio'], ['menu', 'Menú'], ['bowl', 'Arma tu bowl'], ['calculadoras', 'Calculadoras'], ['pedido', 'Planifica'], ['nosotros', 'Nosotros'], ['comunidad', 'Comunidad']];
