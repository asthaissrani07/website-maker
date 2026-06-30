import { randomUUID } from "crypto";
import { defaultSiteInput } from "./defaults";
import type { ProductSiteConfig, ProductSiteInput } from "./types";

const globalStore = globalThis as typeof globalThis & {
  __siteStore?: Map<string, ProductSiteConfig>;
};

function getStore(): Map<string, ProductSiteConfig> {
  if (!globalStore.__siteStore) {
    globalStore.__siteStore = new Map();
  }
  return globalStore.__siteStore;
}

/** Backfill appearance fields for sites created before custom colors/fonts existed. */
export function withAppearanceDefaults<T extends ProductSiteInput>(
  site: T,
): T {
  return {
    ...site,
    themeId: site.themeId || defaultSiteInput.themeId,
    fontPairId: site.fontPairId || defaultSiteInput.fontPairId,
    customAccentColor: site.customAccentColor ?? "",
    customButtonColor: site.customButtonColor ?? "",
    customBackgroundColor: site.customBackgroundColor ?? "",
    customTextColor: site.customTextColor ?? "",
  };
}

export function createSite(input: ProductSiteInput): ProductSiteConfig {
  const site: ProductSiteConfig = {
    ...withAppearanceDefaults(input),
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  getStore().set(site.id, site);
  return site;
}

export function getSite(id: string): ProductSiteConfig | undefined {
  const site = getStore().get(id);
  return site ? withAppearanceDefaults(site) : undefined;
}

export function getAllSites(): ProductSiteConfig[] {
  return Array.from(getStore().values())
    .map(withAppearanceDefaults)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function deleteSite(id: string): boolean {
  return getStore().delete(id);
}
