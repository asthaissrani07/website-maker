import { notFound } from "next/navigation";
import { ProductDetailsPage } from "@/components/product/ProductDetailsPage";
import { ProductSiteShell } from "@/components/product/ProductSiteShell";
import { getSite } from "@/lib/store";

export default async function PreviewProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const site = await getSite(id);
  if (!site) notFound();

  return (
    <ProductSiteShell config={site} basePath={`/preview/${id}`}>
      <ProductDetailsPage />
    </ProductSiteShell>
  );
}
