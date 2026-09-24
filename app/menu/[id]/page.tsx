import { notFound } from 'next/navigation';
import { products } from '@/lib/demo-data';
import { ProductPage } from '@/components/shaky-product-page';

export default async function ProductRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = products.find(x => x.id === id);
  if (!p) notFound();
  return <ProductPage p={p} />;
}
