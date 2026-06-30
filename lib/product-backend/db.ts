import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

const globalDb = globalThis as typeof globalThis & {
  __productDbs?: Map<string, Database.Database>;
};

function dataDir(): string {
  const dir = path.join(process.cwd(), "data", "product-sites");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function standaloneDataDir(): string {
  const dir = path.join(process.cwd(), "data");
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function getDatabase(siteId: string, standalone = false): Database.Database {
  if (!globalDb.__productDbs) {
    globalDb.__productDbs = new Map();
  }

  const key = standalone ? "standalone" : siteId;
  const existing = globalDb.__productDbs.get(key);
  if (existing) return existing;

  const dbPath = standalone
    ? path.join(standaloneDataDir(), "store.db")
    : path.join(dataDir(), `${siteId}.db`);

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  initSchema(db);
  globalDb.__productDbs.set(key, db);
  return db;
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      session_key TEXT NOT NULL,
      product_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      PRIMARY KEY (session_key, product_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      email TEXT NOT NULL,
      items_json TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL,
      eta TEXT,
      location TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      comment TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      email TEXT PRIMARY KEY COLLATE NOCASE,
      created_at TEXT NOT NULL
    );
  `);
}
