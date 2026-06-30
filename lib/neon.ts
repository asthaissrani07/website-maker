import { neon } from "@neondatabase/serverless";

type Sql = ReturnType<typeof neon>;

let sql: Sql | null = null;
let schemaReady: Promise<void> | null = null;

export function isPostgresEnabled(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function getSql(): Sql {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set.");
  }
  if (!sql) {
    sql = neon(url);
  }
  return sql;
}

export async function ensureSchema(): Promise<void> {
  if (!isPostgresEnabled()) return;

  if (!schemaReady) {
    schemaReady = (async () => {
      const db = getSql();
      await db`
        CREATE TABLE IF NOT EXISTS sites (
          id TEXT PRIMARY KEY,
          created_at TIMESTAMPTZ NOT NULL,
          config JSONB NOT NULL
        )
      `;
      await db`
        CREATE INDEX IF NOT EXISTS sites_created_at_idx ON sites (created_at DESC)
      `;
    })();
  }

  await schemaReady;
}

export async function querySites<T>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T[]> {
  await ensureSchema();
  const db = getSql();
  return (await db(strings, ...values)) as T[];
}

export async function exec(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<void> {
  await ensureSchema();
  const db = getSql();
  await db(strings, ...values);
}
