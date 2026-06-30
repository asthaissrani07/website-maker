import type { ProductSiteConfig } from "@/lib/types";
import { ProductHome } from "./ProductHome";
import { ProductSiteShell } from "./ProductSiteShell";

export function ProductSite({
  config,
  apiBase,
  basePath,
}: {
  config: ProductSiteConfig;
  apiBase?: string;
  basePath?: string;
}) {
  const resolvedBasePath =
    basePath ?? (config.id ? `/preview/${config.id}` : "");

  return (
    <ProductSiteShell
      config={config}
      apiBase={apiBase}
      basePath={resolvedBasePath}
    >
      <ProductHome />
    </ProductSiteShell>
  );
}
