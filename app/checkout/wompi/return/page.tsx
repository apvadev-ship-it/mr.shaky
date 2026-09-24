import Link from "next/link";

// Landing page after the Wompi widget closes. searchParams (`status`, `order`) come from the
// browser redirect and are NOT trustworthy for granting anything — they only drive which
// message we show while the real status is confirmed server-side via the `transaction.updated`
// webhook. See app/api/orders/[id]/route.ts for the trusted status.
export default async function WompiReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; order?: string }>;
}) {
  const { status, order } = await searchParams;
  const message =
    status === "success"
      ? "¡Gracias! Estamos confirmando tu pago."
      : status === "pending"
        ? "Tu pago quedó pendiente. Si elegiste Efecty, Baloto o PSE, sigue las instrucciones que te dieron. Tienes hasta 72 horas."
        : "No pudimos confirmar tu pago. Si el dinero salió de tu cuenta, contáctanos.";

  return (
    <main className="wrap" style={{ padding: "80px 0", textAlign: "center" }}>
      <h1>Procesando tu pedido</h1>
      <p>{message}</p>
      {order && <p className="fineprint">Número de pedido: {order}</p>}
      <Link className="btn" href="/">
        Volver al inicio
      </Link>
    </main>
  );
}
