import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import type Database from "better-sqlite3";
import {
  clearAuthCookie,
  getAuthToken,
  getGuestId,
  setAuthCookie,
} from "./cookies";
import { getDatabase } from "./db";
import type { UserSession } from "./types";

const SESSION_DAYS = 30;

function getDb(siteId: string, standalone?: boolean) {
  return getDatabase(siteId, standalone);
}

export async function registerUser(
  siteId: string,
  name: string,
  email: string,
  password: string,
  standalone?: boolean,
): Promise<{ ok: true; user: UserSession } | { ok: false; error: string }> {
  const trimmedName = name.trim();
  const mail = email.trim().toLowerCase();

  if (!trimmedName) return { ok: false, error: "Please enter your name." };
  if (!mail.includes("@")) return { ok: false, error: "Please enter a valid email." };
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const db = getDb(siteId, standalone);
  const existing = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(mail) as { id: string } | undefined;

  if (existing) {
    return {
      ok: false,
      error: "An account with this email already exists. Sign in instead.",
    };
  }

  const userId = randomUUID();
  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();

  db.prepare(
    "INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
  ).run(userId, trimmedName, mail, passwordHash, now);

  const guestId = await getGuestId(siteId);
  if (guestId) mergeCartSession(db, guestId, userId);

  const session = await createSession(db, siteId, userId, mail, trimmedName, standalone);
  return { ok: true, user: session };
}

export async function loginUser(
  siteId: string,
  email: string,
  password: string,
  guestSessionKey: string | undefined,
  standalone?: boolean,
): Promise<{ ok: true; user: UserSession } | { ok: false; error: string }> {
  const mail = email.trim().toLowerCase();

  if (!mail.includes("@")) return { ok: false, error: "Please enter a valid email." };
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const db = getDb(siteId, standalone);
  const row = db
    .prepare("SELECT id, name, email, password_hash FROM users WHERE email = ?")
    .get(mail) as
    | { id: string; name: string; email: string; password_hash: string }
    | undefined;

  if (!row) {
    return {
      ok: false,
      error: "No account found with that email. Create an account first.",
    };
  }

  const valid = await bcrypt.compare(password, row.password_hash);
  if (!valid) {
    return { ok: false, error: "Incorrect password. Please try again." };
  }

  if (guestSessionKey) {
    mergeCartSession(db, guestSessionKey, row.id);
  }

  const session = await createSession(
    db,
    siteId,
    row.id,
    row.email,
    row.name,
    standalone,
  );
  return { ok: true, user: session };
}

export async function logoutUser(
  siteId: string,
  standalone?: boolean,
): Promise<void> {
  const token = await getAuthToken(siteId);
  if (token) {
    const db = getDb(siteId, standalone);
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
  }
  await clearAuthCookie(siteId);
}

export async function getCurrentUser(
  siteId: string,
  standalone?: boolean,
): Promise<UserSession | null> {
  const token = await getAuthToken(siteId);
  if (!token) return null;

  const db = getDb(siteId, standalone);
  const row = db
    .prepare(
      `SELECT u.name, u.email, s.expires_at
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = ?`,
    )
    .get(token) as { name: string; email: string; expires_at: string } | undefined;

  if (!row) return null;
  if (new Date(row.expires_at) < new Date()) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    await clearAuthCookie(siteId);
    return null;
  }

  return { name: row.name, email: row.email };
}

async function createSession(
  db: Database.Database,
  siteId: string,
  userId: string,
  email: string,
  name: string,
  standalone?: boolean,
): Promise<UserSession> {
  const token = randomUUID();
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_DAYS);

  db.prepare(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
  ).run(token, userId, expires.toISOString());

  await setAuthCookie(siteId, token, SESSION_DAYS * 24 * 60 * 60);
  void standalone;
  return { email, name };
}

function mergeCartSession(
  db: Database.Database,
  fromKey: string,
  toUserId: string,
): void {
  const guestItems = db
    .prepare(
      "SELECT product_id, product_name, price, quantity FROM cart_items WHERE session_key = ?",
    )
    .all(fromKey) as {
    product_id: string;
    product_name: string;
    price: number;
    quantity: number;
  }[];

  for (const item of guestItems) {
    const existing = db
      .prepare(
        "SELECT quantity FROM cart_items WHERE session_key = ? AND product_id = ?",
      )
      .get(toUserId, item.product_id) as { quantity: number } | undefined;

    if (existing) {
      db.prepare(
        "UPDATE cart_items SET quantity = ? WHERE session_key = ? AND product_id = ?",
      ).run(existing.quantity + item.quantity, toUserId, item.product_id);
    } else {
      db.prepare(
        `INSERT INTO cart_items (session_key, product_id, product_name, price, quantity)
         VALUES (?, ?, ?, ?, ?)`,
      ).run(
        toUserId,
        item.product_id,
        item.product_name,
        item.price,
        item.quantity,
      );
    }
  }

  db.prepare("DELETE FROM cart_items WHERE session_key = ?").run(fromKey);
}

export async function resolveCartSessionKey(
  siteId: string,
  standalone?: boolean,
): Promise<{ key: string; userId: string | null }> {
  const token = await getAuthToken(siteId);
  const db = getDb(siteId, standalone);

  if (token) {
    const row = db
      .prepare("SELECT user_id FROM sessions WHERE token = ?")
      .get(token) as { user_id: string } | undefined;
    if (row) return { key: row.user_id, userId: row.user_id };
  }

  const { ensureGuestId } = await import("./cookies");
  const guestId = await ensureGuestId(siteId);
  return { key: guestId, userId: null };
}
