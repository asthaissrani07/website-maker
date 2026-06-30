import { notFound } from "next/navigation";
import { OrderDetailsPage } from "@/components/product/OrderDetailsPage";
import { ProductSiteShell } from "@/components/product/ProductSiteShell";
import { getSite } from "@/lib/store";

export default async function PreviewOrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; orderId: string }>;
  searchParams: Promise<{ email?: string }>;
}) {
  const { id, orderId } = await params;
  const { email } = await searchParams;
  const site = await getSite(id);
  if (!site) notFound();

  return (
    <ProductSiteShell config={site} basePath={`/preview/${id}`}>
      <OrderDetailsPage orderId={orderId} email={email} />
    </ProductSiteShell>
  );
}
