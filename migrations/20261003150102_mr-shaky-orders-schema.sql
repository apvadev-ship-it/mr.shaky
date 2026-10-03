-- Mr. Shaky: esquema de pedidos migrado desde db/schema.ts (Drizzle/Supabase).
-- Tipos y nombres de columna se conservan exactamente para que el esquema sea
-- equivalente al de drizzle/0000_strange_dazzler.sql.
--
-- Estas tres tablas las escribe SOLO el servidor (route handlers y el webhook de
-- Wompi). Contienen datos personales del cliente (nombre, telefono) y estado de
-- pago, asi que ningun rol de runtime debe alcanzarlas: se revocan los permisos
-- por defecto Y se activa RLS sin politicas (denegacion total). El acceso va por
-- project_admin / API key de servidor.

-- ---- orders ----
CREATE TABLE public.orders (
  id text PRIMARY KEY NOT NULL,                     -- crypto.randomUUID()
  branch text NOT NULL,
  pickup_date text NOT NULL,
  pickup_time text NOT NULL,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  items jsonb NOT NULL,                             -- [{ id, name, qty }]
  subtotal integer NOT NULL,                        -- COP, antes de descuento
  coupon_code text,
  discount integer NOT NULL DEFAULT 0,              -- COP, subtotal - total
  total integer NOT NULL,                           -- COP, pesos enteros
  currency text NOT NULL DEFAULT 'COP',             -- COP: exponente ISO 4217 = 2
  payment_method text NOT NULL,                     -- 'cash' | 'online'
  status text NOT NULL DEFAULT 'pending_pickup',
  wompi_reference text,
  wompi_transaction_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Evita que los reintentos/carreras del webhook actualicen el pedido equivocado.
-- Postgres permite varios NULL en un indice unico, asi que los pedidos en
-- efectivo (sin referencia Wompi) no colisionan entre si.
CREATE UNIQUE INDEX orders_wompi_reference_unique
  ON public.orders USING btree (wompi_reference);

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION system.update_updated_at();

-- ---- payment_idempotency_keys ----
-- Las claves son crypto.randomUUID(), persistidas antes de llamar al proveedor.
CREATE TABLE public.payment_idempotency_keys (
  key text PRIMARY KEY NOT NULL,
  request_hash text NOT NULL,
  response jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

-- ---- webhook_events_processed ----
-- Proteccion anti-replay por dedup de event id (la ventana de timestamp se
-- valida en el propio route del webhook).
CREATE TABLE public.webhook_events_processed (
  event_id text PRIMARY KEY NOT NULL,
  provider text NOT NULL,
  event_type text NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

-- Barrido de claves/eventos vencidos.
CREATE INDEX payment_idempotency_keys_expires_at
  ON public.payment_idempotency_keys USING btree (expires_at);
CREATE INDEX webhook_events_processed_expires_at
  ON public.webhook_events_processed USING btree (expires_at);

-- ---- Cierre de acceso ----
-- InsForge concede INSERT/SELECT/UPDATE/DELETE a anon y authenticated por
-- defecto en public. Aqui no queremos nada de eso: se revoca primero.
REVOKE ALL ON public.orders                   FROM anon, authenticated;
REVOKE ALL ON public.payment_idempotency_keys FROM anon, authenticated;
REVOKE ALL ON public.webhook_events_processed FROM anon, authenticated;

-- Segunda capa: RLS activo y sin politicas = ninguna fila visible para ningun
-- rol sujeto a RLS, aunque alguien conceda un privilegio por error mas adelante.
ALTER TABLE public.orders                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_idempotency_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events_processed ENABLE ROW LEVEL SECURITY;
