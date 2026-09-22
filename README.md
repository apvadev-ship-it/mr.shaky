# Mr. Shaky Nutribar

Frontend React + TypeScript + Tailwind CSS, con Vinext/Vite y componentes accesibles de Radix/Shadcn.

## Ejecutar

Requiere Node 22.13 o posterior.

```sh
npm install
npm run dev
```

Vista local: `http://localhost:5173`. Validación: `npx tsc --noEmit`. Producción: `npm run build`.

## Funciones

- Menú con búsqueda por nombre/ingredientes, filtros, ordenación, favoritos y estados vacíos.
- Tarjetas con macros desplegables y detalle de producto con ingredientes/alérgenos.
- Comparación de hasta tres productos con tabla de precio, proteínas, carbohidratos, grasas y calorías.
- Carrito con cantidades, eliminación y total; favoritos y carrito guardados en este navegador.
- Calculadora orientativa de macros y proteína, con explicación de fórmula y fuentes.
- Quiz por rutina, intensidad y preferencia veggie.
- Programación demo por sucursal, fecha y hora, validada con 30 minutos de anticipación.
- Reseñas demo y formulario de opinión local.
- Muro preparado para playlist oficial de Spotify; muestra enlace de exploración mientras falta el ID.
- Adaptación móvil, navegación inferior, diálogos con teclado y reducción de movimiento.
- WebMCP `search_menu`: filtra el menú visible; valida entradas y no crea pedidos.

## Datos y futuras APIs

`lib/demo-data.ts` concentra el catálogo, precios COP, macros, alérgenos, reseñas, sucursales y `spotifyPlaylistId`. Los datos son ilustrativos. Sustituir ese módulo por un adaptador de catálogo y conectar `submitOrder` en `components/shaky-app.tsx` a una API validada antes de recibir pedidos reales. Los pagos, inventario, disponibilidad de sucursales, usuarios y moderación de reseñas no están conectados.

La persistencia es local (`shaky-demo-v1` en localStorage); no hay pedidos reales ni datos enviados a terceros. La calculadora mantiene sus datos solo en memoria.

## Dirección visual y assets

- `public/reference.png`: mockup proporcionado por el usuario. Se reutilizan regiones visuales mediante fondos CSS para reproducir el logotipo tipográfico, platos y fotografía del gimnasio sin inventar otro logo.
- `public/logo.png`: logo original completo aportado por el usuario, conservado en el pie y favicon.
- `public/hero-bowl.png`: fotografía generada a partir del plato de referencia, sin texto, para una portada nítida y adaptable.
- `public/drip*.svg`: separadores vectoriales adaptables.
- Poppins para texto; Barlow Condensed y Permanent Marker para aproximar la rotulación del mockup. Fuentes servidas por Google Fonts.
- Las imágenes de catálogo extraídas visualmente del mockup tienen su resolución original; para una tienda comercial conviene sustituirlas por fotografías fuente de alta resolución.

Los archivos `bowl.jpg`, `beef.jpg`, `wrap.jpg` y `shake.jpg` son fotografías de respaldo ilustrativas: Unsplash (abdelkader1001, OlHZpma28eU), Pexels (31303466, 12464909, 3028139). La interfaz final prioriza los elementos visuales del mockup.

## Nutrición

La estimación usa Mifflin–St Jeor para energía de reposo y ajustes orientativos de actividad y objetivo; proteína 1,6–1,8 g/kg, grasas 30% de energía y carbohidratos restantes. Solo para adultos sanos, no para uso clínico.

- https://pubmed.ncbi.nlm.nih.gov/2305711/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC5477153/

## Verificación

Revisión visual de escritorio y móvil. Comprobación de carrito, cantidades, confirmación demo, calculadora, quiz, macros, comparador y límite de tres productos. Tipado TypeScript comprobado sin errores.
