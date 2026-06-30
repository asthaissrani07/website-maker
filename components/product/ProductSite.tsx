"use client";

import type { ProductSiteConfig } from "@/lib/types";
import { resolveSiteStyle } from "@/lib/site-appearance";
import { ContactForm } from "./ContactForm";
import { ProductFontLoader } from "./ProductFontLoader";
import { ProductFooter } from "./ProductFooter";
import { ProductHeader } from "./ProductHeader";
import { ProductHero } from "./ProductHero";
import { ProductReveal } from "./ProductReveal";
import { ProductSiteProvider } from "./ProductSiteContext";
import { SiteModals, Toast } from "./SiteModals";
import { StatsSection } from "./StatsSection";
import "./product-theme.css";

export function ProductSite({
  config,
  apiBase,
}: {
  config: ProductSiteConfig;
  apiBase?: string;
}) {
  return (
    <ProductSiteProvider
      config={config}
      apiBase={apiBase ?? `/api/product/${config.id}`}
    >
      <ProductFontLoader fontPairId={config.fontPairId} />
      <div
        className="product-site min-h-screen"
        style={resolveSiteStyle(config)}
      >
        <ProductHeader />
        <ProductHero />
        <StatsSection />
        <section
          id="contact"
          className="ps-section scroll-mt-24 px-4 py-16 md:px-6 md:py-24"
        >
          <div className="mx-auto max-w-6xl">
            <ProductReveal>
              <h2 className="ps-text ps-font-display mb-10 text-center text-3xl font-bold">
                Contact form
              </h2>
            </ProductReveal>
            <ProductReveal delay={100}>
              <ContactForm />
            </ProductReveal>
          </div>
        </section>
        <ProductReveal>
          <ProductFooter />
        </ProductReveal>
        <SiteModals />
        <Toast />
      </div>
    </ProductSiteProvider>
  );
}
