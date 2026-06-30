import { randomUUID } from "crypto";
import { defaultSiteInput } from "./defaults";
import {
  deletePersistedSite,
  loadAllPersistedSites,
  loadPersistedSite,
  persistSite,
} from "./site-persistence";
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

export async function createSite(
  input: ProductSiteInput,
): Promise<ProductSiteConfig> {
  const site: ProductSiteConfig = {
    ...withAppearanceDefaults(input),
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  getStore().set(site.id, site);
  await persistSite(site);
  return site;
}

export async function getSite(
  id: string,
): Promise<ProductSiteConfig | undefined> {
  const cached = getStore().get(id);
  if (cached) return withAppearanceDefaults(cached);

  const loaded = await loadPersistedSite(id);
  if (!loaded) return undefined;

  const site = withAppearanceDefaults(loaded);
  getStore().set(id, site);
  return site;
}

export async function getAllSites(): Promise<ProductSiteConfig[]> {
  const persisted = (await loadAllPersistedSites()).map(withAppearanceDefaults);
  const store = getStore();

  for (const site of persisted) {
    store.set(site.id, site);
  }

  return persisted.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function deleteSite(id: string): Promise<boolean> {
  const cached = getStore().has(id);
  const persisted = await loadPersistedSite(id);
  if (!cached && !persisted) return false;

  getStore().delete(id);
  await deletePersistedSite(id);
  return true;
}
