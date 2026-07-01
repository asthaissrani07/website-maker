import fs from "fs";
import path from "path";
import { exec, isPostgresEnabled, querySites } from "./neon";
import type { ProductSiteConfig } from "./types";

function parseSiteConfig(value: unknown): ProductSiteConfig | null {
  if (!value) return null;

  if (typeof value === "string") {
    try {
      return JSON.parse(value) as ProductSiteConfig;
    } catch {
      return null;
    }
  }

  return value as ProductSiteConfig;
}

function localPath(id: string): string {
  return path.join(process.cwd(), "data", "sites", `${id}.json`);
}

export async function persistSite(site: ProductSiteConfig): Promise<void> {
  if (isPostgresEnabled()) {
    await exec`
      INSERT INTO sites (id, created_at, config)
      VALUES (${site.id}, ${site.createdAt}, ${site})
      ON CONFLICT (id) DO UPDATE
      SET config = EXCLUDED.config,
          created_at = EXCLUDED.created_at
    `;
    return;
  }

  const file = localPath(site.id);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(site), "utf-8");
}

export async function loadPersistedSite(
  id: string,
): Promise<ProductSiteConfig | null> {
  if (isPostgresEnabled()) {
    const rows = await querySites<{ config: unknown }>`
      SELECT config FROM sites WHERE id = ${id}
    `;
    return parseSiteConfig(rows[0]?.config);
  }

  try {
    const raw = fs.readFileSync(localPath(id), "utf-8");
    return JSON.parse(raw) as ProductSiteConfig;
  } catch {
    return null;
  }
}

export async function loadAllPersistedSites(): Promise<ProductSiteConfig[]> {
  if (isPostgresEnabled()) {
    const rows = await querySites<{ config: unknown }>`
      SELECT config FROM sites ORDER BY created_at DESC
    `;
    return rows
      .map((row) => parseSiteConfig(row.config))
      .filter((site): site is ProductSiteConfig => site !== null);
  }

  const dir = path.join(process.cwd(), "data", "sites");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      try {
        return JSON.parse(
          fs.readFileSync(path.join(dir, name), "utf-8"),
        ) as ProductSiteConfig;
      } catch {
        return null;
      }
    })
    .filter((site): site is ProductSiteConfig => site !== null);
}

export async function deletePersistedSite(id: string): Promise<void> {
  if (isPostgresEnabled()) {
    await exec`DELETE FROM sites WHERE id = ${id}`;
    return;
  }

  try {
    fs.unlinkSync(localPath(id));
  } catch {
    /* ignore */
  }
}
