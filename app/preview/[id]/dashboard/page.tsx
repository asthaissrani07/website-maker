import { notFound } from "next/navigation";
import { PaymentDashboardPage } from "@/components/product/PaymentDashboardPage";
import { ProductSiteShell } from "@/components/product/ProductSiteShell";
import { getSite } from "@/lib/store";

export default async function PreviewDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const site = await getSite(id);
  if (!site) notFound();

  return (
    <ProductSiteShell config={site} basePath={`/preview/${id}`}>
      <PaymentDashboardPage />
    </ProductSiteShell>
  );
}
