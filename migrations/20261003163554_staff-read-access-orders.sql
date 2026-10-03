-- Acceso de lectura para un panel de staff sobre public.orders.
--
-- Hasta ahora las tres tablas eran solo-servidor: sin privilegios para anon ni
-- authenticated, y RLS activo sin politicas. Esta migracion abre UNICAMENTE
-- orders, y solo en lectura, para usuarios marcados como staff.
--
-- Se deja intencionadamente fuera:
--   - payment_idempotency_keys y webhook_events_processed siguen cerradas. Son
--     fontaneria de pagos (claves de idempotencia y dedup anti-replay); un panel
--     de staff no tiene nada que hacer ahi y abrirlas solo ampliaria la
--     superficie de ataque sin aportar nada.
--   - La ESCRITURA sobre orders. Marcar un pedido como entregado implica definir
--     nuevos estados del ciclo de vida, y los estados paid/failed/refunded solo
--     los debe fijar el webhook de Wompi. Eso se decide aparte.

-- ---- Identidad de staff ----
-- Una fila por empleado. El alta se hace con la clave admin (CLI o servidor),
-- nunca desde el navegador: la tabla no concede privilegios a ningun rol de
-- runtime, asi que authenticated no puede nombrarse staff a si mismo.
CREATE TABLE public.staff (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

REVOKE ALL ON public.staff FROM anon, authenticated;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

-- SECURITY DEFINER: la politica de orders consulta public.staff, que tiene RLS.
-- Sin DEFINER la comprobacion se evaluaria con los permisos del llamante y
-- recurriria por las politicas de staff. search_path fijado para que no se pueda
-- secuestrar la resolucion de nombres.
CREATE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff s WHERE s.user_id = auth.uid()
  );
$$;

REVOKE ALL ON FUNCTION public.is_staff() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated;

-- ---- Lectura de orders para staff ----
-- Las politicas deciden QUE FILAS; los privilegios deciden QUE OPERACION. Hacen
-- falta los dos. Aqui se concede exactamente SELECT y nada mas: sin INSERT,
-- UPDATE ni DELETE, authenticated no puede alterar un pedido ni su estado de pago.
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.orders TO authenticated;

CREATE POLICY staff_can_read_orders ON public.orders
  FOR SELECT
  TO authenticated
  USING (public.is_staff());
