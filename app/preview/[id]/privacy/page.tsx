import { notFound } from "next/navigation";
import { LegalPageView } from "@/components/product/LegalPageView";
import { ProductSiteShell } from "@/components/product/ProductSiteShell";
import { privacyPolicyBody } from "@/lib/product-legal";
import { getSite } from "@/lib/store";

export default async function PreviewPrivacyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const site = await getSite(id);
  if (!site) notFound();

  return (
    <ProductSiteShell config={site} basePath={`/preview/${id}`}>
      <LegalPageView title="Privacy Policy" body={privacyPolicyBody(site)} />
    </ProductSiteShell>
  );
}
