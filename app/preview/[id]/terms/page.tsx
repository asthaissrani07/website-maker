import { notFound } from "next/navigation";
import { LegalPageView } from "@/components/product/LegalPageView";
import { ProductSiteShell } from "@/components/product/ProductSiteShell";
import { termsOfServiceBody } from "@/lib/product-legal";
import { getSite } from "@/lib/store";

export default async function PreviewTermsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const site = await getSite(id);
  if (!site) notFound();

  return (
    <ProductSiteShell config={site} basePath={`/preview/${id}`}>
      <LegalPageView title="Terms of Service" body={termsOfServiceBody(site)} />
    </ProductSiteShell>
  );
}
