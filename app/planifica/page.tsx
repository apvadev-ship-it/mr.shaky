import { OrderStatusSection } from '@/components/shaky-order-status';
import { PageHero } from '@/components/shaky-page-hero';

export default function PlanificaPage() {
  return (
    <>
      <PageHero
        title="TU"
        accent="PEDIDO"
        subtitle="Sigue el estado de lo que ya pediste."
        image="/assets/order-hero.webp"
      />
      <OrderStatusSection />
    </>
  );
}
