# Checklist de producción — Wompi

Antes de activar el cobro real, completa cada punto. PagoKit dejó todo listo para sandbox; el
paso a producción es intencionalmente manual.

## 1. Reemplaza las llaves de prueba por llaves reales

- [ ] En el dashboard de Wompi, activa el modo producción y genera las llaves reales.
- [ ] Reemplaza `WOMPI_PUBLIC_KEY` por el valor `pub_prod_…` (esta sí puede ir en el frontend).
- [ ] Reemplaza `WOMPI_PRIVATE_KEY` por el valor `prv_prod_…` — **NUNCA** en `.env.example`, solo
      en el gestor de secretos de tu plataforma de despliegue.
- [ ] Reemplaza `WOMPI_EVENTS_SECRET` — se regenera para cada nuevo endpoint de eventos que crees
      en el dashboard de producción.
- [ ] Reemplaza `WOMPI_INTEGRITY_SECRET` — también se regenera en modo producción; es el que firma
      el Widget en `app/api/checkout/wompi/init/route.ts`.

## 2. Configura el endpoint de eventos en el dashboard de producción

- [ ] Crea un endpoint de eventos apuntando a `https://<tu-dominio>/api/webhook/wompi`.
- [ ] Suscríbelo al evento `transaction.updated` (el único requerido — ver `PAGOKIT_INTEGRATION.md`).
- [ ] Copia el nuevo secreto y guárdalo en el gestor de secretos de tu plataforma.

## 3. Secretos en Cloudflare Workers

Este proyecto se despliega en Cloudflare Workers (via vinext/wrangler), no en Vercel/Railway.

- [ ] Configura las variables como secretos de Worker (no en `.env`, no en el repo):
```bash
npx wrangler secret put WOMPI_PRIVATE_KEY
npx wrangler secret put WOMPI_EVENTS_SECRET
npx wrangler secret put WOMPI_INTEGRITY_SECRET
```
  `WOMPI_PUBLIC_KEY` y `PUBLIC_URL` no son secretos sensibles del lado servidor, pero igual
  configúralas como variables de entorno del Worker en el panel/plataforma que gestiona este
  proyecto (no las dejes hardcodeadas).
- [ ] Confirma que el binding D1 (`DB`, ver `.openai/hosting.json`) apunta a la base de datos D1
      real de producción, no a la de desarrollo/preview.
- [ ] Aplica la migración generada (`drizzle/0000_remarkable_bromley.sql`) contra el D1 de
      producción — normalmente lo hace tu plataforma de despliegue al desplegar; si administras
      wrangler directamente: `npx wrangler d1 migrations apply <nombre-db> --remote`.

## 4. Registra tu dominio de retorno

- [ ] Registra la URL de retorno (`https://<tu-dominio>/checkout/wompi/return`) en el dashboard —
      Wompi rechaza `redirect-url` no registradas.
- [ ] Actualiza `PUBLIC_URL` a tu dominio real de producción.

## 5. Facturación / DIAN

Wompi **no** es Merchant of Record — la responsabilidad de facturar sigue siendo de Mr. Shaky
Nutribar.

- [ ] Define tu flujo de facturación (factura electrónica DIAN si tus ingresos lo requieren).
- [ ] Revisa con tu contador si necesitas emitir factura por cada pedido pagado en línea.

## 6. Prueba final de sanidad

- [ ] Haz un pedido real de bajo monto desde otro dispositivo con tu cuenta en modo producción.
- [ ] Confirma que el webhook llegó y que la orden pasó a `paid` en la base de datos.
- [ ] Prueba el camino de efectivo también (`pending_pickup`) para confirmar que ambos flujos
      coexisten sin interferirse.
- [ ] Prueba un voucher en efectivo (Efecty/Baloto) en sandbox antes de ir a producción — quedan
      en `pending_payment` hasta 72 horas; confirma que tu UI no lo trata como fallido.

## 7. Monitoreo

- [ ] Configura una alerta para pedidos que queden en `pending_payment` por más de 72 horas
      (posible voucher vencido sin reconciliar).
- [ ] Revisa con atención las primeras 24-48 horas en producción.
- [ ] No olvides: el checksum de Wompi solo cubre los campos listados en `signature.properties`
      del evento; el webhook ya vuelve a consultar la transacción (`GET /transactions/{id}`) antes
      de confiar en campos como `amount_in_cents` — no quites ese re-fetch al modificar el código.
