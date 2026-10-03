-- Endurecimiento de public.is_staff() tras el hallazgo dangerous-function.
--
-- Sigue siendo SECURITY DEFINER a proposito: la politica de orders consulta
-- public.staff, que tiene RLS, y sin DEFINER la comprobacion recurriria por las
-- politicas de staff. Convertirla a SECURITY INVOKER rompe ese diseno.
--
-- Lo que si se endurece: search_path pasa de 'pg_catalog, public, pg_temp' a ''.
-- Dejar pg_temp en la ruta de una funcion DEFINER es un vector de secuestro
-- conocido (un usuario puede crear objetos temporales que sombreen una
-- referencia sin cualificar). El cuerpo ya cualifica todo por esquema, asi que
-- vaciar la ruta no cambia la resolucion de nombres, solo elimina el vector.
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff s WHERE s.user_id = auth.uid()
  );
$$;

-- La funcion no acepta argumentos y solo informa sobre la identidad de QUIEN
-- llama, asi que no puede usarse para consultar a terceros. authenticated
-- necesita EXECUTE porque la expresion de la politica se evalua con los
-- privilegios del usuario que consulta.
REVOKE ALL ON FUNCTION public.is_staff() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated;
