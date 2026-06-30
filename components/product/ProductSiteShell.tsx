"use client";

import type { ReactNode } from "react";
import type { ProductSiteConfig } from "@/lib/types";
import { resolveSiteStyle } from "@/lib/site-appearance";
import { ProductFontLoader } from "./ProductFontLoader";
import { ProductHeader } from "./ProductHeader";
import { ProductFooter } from "./ProductFooter";
import { ProductSiteProvider } from "./ProductSiteContext";
import { SiteModals, Toast } from "./SiteModals";
import "./product-theme.css";

export function ProductSiteShell({
  config,
  apiBase,
  basePath = "",
  children,
}: {
  config: ProductSiteConfig;
  apiBase?: string;
  basePath?: string;
  children: ReactNode;
}) {
  const resolvedApiBase =
    apiBase ?? (config.id ? `/api/product/${config.id}` : "/api");

  return (
    <ProductSiteProvider
      config={config}
      apiBase={resolvedApiBase}
      basePath={basePath}
    >
      <ProductFontLoader fontPairId={config.fontPairId} />
      <div
        className="product-site min-h-screen"
        style={resolveSiteStyle(config)}
      >
        <ProductHeader />
        {children}
        <ProductFooter />
        <SiteModals />
        <Toast />
      </div>
    </ProductSiteProvider>
  );
}
