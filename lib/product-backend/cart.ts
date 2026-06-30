import { randomUUID } from "crypto";
import { getDatabase } from "./db";
import { resolveCartSessionKey } from "./auth";
import type { CartItem } from "./types";

export async function getCart(
  siteId: string,
  standalone?: boolean,
): Promise<CartItem[]> {
  const { key } = await resolveCartSessionKey(siteId, standalone);
  const db = getDatabase(siteId, standalone);

  const rows = db
    .prepare(
      `SELECT product_id AS id, product_name AS name, price, quantity
       FROM cart_items WHERE session_key = ?`,
    )
    .all(key) as CartItem[];

  return rows;
}

export async function addCartItem(
  siteId: string,
  item: Omit<CartItem, "quantity"> & { quantity?: number },
  standalone?: boolean,
): Promise<CartItem[]> {
  const { key } = await resolveCartSessionKey(siteId, standalone);
  const db = getDatabase(siteId, standalone);
  const qty = item.quantity ?? 1;

  const existing = db
    .prepare(
      "SELECT quantity FROM cart_items WHERE session_key = ? AND product_id = ?",
    )
    .get(key, item.id) as { quantity: number } | undefined;

  if (existing) {
    db.prepare(
      "UPDATE cart_items SET quantity = ?, product_name = ?, price = ? WHERE session_key = ? AND product_id = ?",
    ).run(existing.quantity + qty, item.name, item.price, key, item.id);
  } else {
    db.prepare(
      `INSERT INTO cart_items (session_key, product_id, product_name, price, quantity)
       VALUES (?, ?, ?, ?, ?)`,
    ).run(key, item.id, item.name, item.price, qty);
  }

  return getCart(siteId, standalone);
}

export async function updateCartQuantity(
  siteId: string,
  productId: string,
  quantity: number,
  standalone?: boolean,
): Promise<CartItem[]> {
  if (quantity < 1) return getCart(siteId, standalone);

  const { key } = await resolveCartSessionKey(siteId, standalone);
  const db = getDatabase(siteId, standalone);

  db.prepare(
    "UPDATE cart_items SET quantity = ? WHERE session_key = ? AND product_id = ?",
  ).run(quantity, key, productId);

  return getCart(siteId, standalone);
}

export async function removeCartItem(
  siteId: string,
  productId: string,
  standalone?: boolean,
): Promise<CartItem[]> {
  const { key } = await resolveCartSessionKey(siteId, standalone);
  const db = getDatabase(siteId, standalone);

  db.prepare(
    "DELETE FROM cart_items WHERE session_key = ? AND product_id = ?",
  ).run(key, productId);

  return getCart(siteId, standalone);
}

export async function clearCart(
  siteId: string,
  standalone?: boolean,
): Promise<void> {
  const { key } = await resolveCartSessionKey(siteId, standalone);
  const db = getDatabase(siteId, standalone);
  db.prepare("DELETE FROM cart_items WHERE session_key = ?").run(key);
}
