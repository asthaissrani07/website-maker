import { notFound } from "next/navigation";
import { ProductSite } from "@/components/product/ProductSite";
import { getSite } from "@/lib/store";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const site = getSite(id);

  if (!site) {
    notFound();
  }

  return <ProductSite config={site} />;
}
