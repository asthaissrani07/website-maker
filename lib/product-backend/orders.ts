import { randomUUID } from "crypto";
import { getDatabase } from "./db";
import { resolveCartSessionKey } from "./auth";
import { clearCart, getCart } from "./cart";
import type { CartItem, OrderDetails, TrackResult } from "./types";

export async function placeOrder(
  siteId: string,
  email: string,
  standalone?: boolean,
): Promise<
  | { ok: true; orderId: string; total: number }
  | { ok: false; error: string }
> {
  const mail = email.trim().toLowerCase();
  if (!mail.includes("@")) {
    return { ok: false, error: "A valid email is required to checkout." };
  }

  const cart = await getCart(siteId, standalone);
  if (cart.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const orderId = `ORD-${randomUUID().slice(0, 8).toUpperCase()}`;
  const now = new Date().toISOString();

  const { userId } = await resolveCartSessionKey(siteId, standalone);
  const db = getDatabase(siteId, standalone);

  db.prepare(
    `INSERT INTO orders (id, user_id, email, items_json, total, status, payment_status, eta, location, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    orderId,
    userId,
    mail,
    JSON.stringify(cart),
    total,
    "Order confirmed",
    "paid",
    "2–5 business days",
    "Warehouse — preparing shipment",
    now,
  );

  await clearCart(siteId, standalone);
  return { ok: true, orderId, total };
}

export function trackOrder(
  siteId: string,
  orderId: string,
  email: string,
  standalone?: boolean,
): TrackResult | null {
  const id = orderId.trim().toUpperCase();
  const mail = email.trim().toLowerCase();
  if (id.length < 4 || !mail.includes("@")) return null;

  const db = getDatabase(siteId, standalone);
  const row = db
    .prepare(
      "SELECT id, status, eta, location FROM orders WHERE id = ? AND email = ? COLLATE NOCASE",
    )
    .get(id, mail) as
    | { id: string; status: string; eta: string | null; location: string | null }
    | undefined;

  if (!row) return null;

  return {
    orderId: row.id,
    status: row.status,
    eta: row.eta ?? "Processing",
    location: row.location ?? "Warehouse",
  };
}

export function getOrderDetails(
  siteId: string,
  orderId: string,
  email: string,
  standalone?: boolean,
): OrderDetails | null {
  const id = orderId.trim().toUpperCase();
  const mail = email.trim().toLowerCase();
  if (id.length < 4 || !mail.includes("@")) return null;

  const db = getDatabase(siteId, standalone);
  const row = db
    .prepare(
      `SELECT id, email, items_json, total, status, eta, location, created_at
       FROM orders WHERE id = ? AND email = ? COLLATE NOCASE`,
    )
    .get(id, mail) as
    | {
        id: string;
        email: string;
        items_json: string;
        total: number;
        status: string;
        eta: string | null;
        location: string | null;
        created_at: string;
      }
    | undefined;

  if (!row) return null;

  let items: CartItem[] = [];
  try {
    items = JSON.parse(row.items_json) as CartItem[];
  } catch {
    items = [];
  }

  return {
    orderId: row.id,
    email: row.email,
    status: row.status,
    eta: row.eta ?? "Processing",
    location: row.location ?? "Warehouse",
    total: row.total,
    items,
    createdAt: row.created_at,
  };
}

export function advanceOrderStatus(
  siteId: string,
  orderId: string,
  standalone?: boolean,
): void {
  const db = getDatabase(siteId, standalone);
  const row = db
    .prepare("SELECT status FROM orders WHERE id = ?")
    .get(orderId) as { status: string } | undefined;

  if (!row) return;

  const pipeline = [
    { status: "Shipped", eta: "Arriving in 2–3 days", location: "In transit" },
    { status: "Out for delivery", eta: "Today by 8 PM", location: "Local carrier" },
    { status: "Delivered", eta: "Delivered", location: "Your address" },
  ];

  const idx = pipeline.findIndex((p) => p.status === row.status);
  const next = idx >= 0 && idx < pipeline.length - 1 ? pipeline[idx + 1] : pipeline[0];

  if (row.status === "Order confirmed") {
    db.prepare(
      "UPDATE orders SET status = ?, eta = ?, location = ? WHERE id = ?",
    ).run(next.status, next.eta, next.location, orderId);
  }
}
