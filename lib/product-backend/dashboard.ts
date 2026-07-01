import { createHash } from "crypto";
import { cookies } from "next/headers";
import { getDatabase } from "./db";
import type { CartItem } from "./types";

export function adminCookieName(siteId: string): string {
  return `ps_admin_${siteId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12)}`;
}

export function getAdminPassword(): string {
  return process.env.STORE_ADMIN_PASSWORD || "store-admin";
}

function adminToken(siteId: string): string {
  return createHash("sha256")
    .update(`${siteId}:${getAdminPassword()}`)
    .digest("hex");
}

export function verifyAdminPassword(password: string): boolean {
  return password === getAdminPassword();
}

export async function setAdminCookie(siteId: string): Promise<void> {
  const jar = await cookies();
  jar.set(adminCookieName(siteId), adminToken(siteId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminCookie(siteId: string): Promise<void> {
  const jar = await cookies();
  jar.delete(adminCookieName(siteId));
}

export async function isAdminAuthenticated(siteId: string): Promise<boolean> {
  const jar = await cookies();
  const value = jar.get(adminCookieName(siteId))?.value;
  return value === adminToken(siteId);
}

export interface DashboardOrderRow {
  orderId: string;
  email: string;
  total: number;
  paymentStatus: string;
  status: string;
  itemCount: number;
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  orderCount: number;
  averageOrder: number;
  paidCount: number;
  pendingCount: number;
  refundedCount: number;
  orders: DashboardOrderRow[];
}

function parseItemCount(itemsJson: string): number {
  try {
    const items = JSON.parse(itemsJson) as CartItem[];
    return items.reduce((sum, item) => sum + item.quantity, 0);
  } catch {
    return 0;
  }
}

export function getDashboardStats(
  siteId: string,
  standalone = false,
): DashboardStats {
  const db = getDatabase(siteId, standalone);

  const rows = db
    .prepare(
      `SELECT id, email, items_json, total, status, payment_status, created_at
       FROM orders ORDER BY created_at DESC`,
    )
    .all() as {
    id: string;
    email: string;
    items_json: string;
    total: number;
    status: string;
    payment_status: string | null;
    created_at: string;
  }[];

  const orders: DashboardOrderRow[] = rows.map((row) => ({
    orderId: row.id,
    email: row.email,
    total: row.total,
    paymentStatus: row.payment_status ?? "paid",
    status: row.status,
    itemCount: parseItemCount(row.items_json),
    createdAt: row.created_at,
  }));

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  return {
    totalRevenue,
    orderCount: orders.length,
    averageOrder: paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0,
    paidCount: orders.filter((o) => o.paymentStatus === "paid").length,
    pendingCount: orders.filter((o) => o.paymentStatus === "pending").length,
    refundedCount: orders.filter((o) => o.paymentStatus === "refunded").length,
    orders,
  };
}

export function updateOrderPaymentStatus(
  siteId: string,
  orderId: string,
  paymentStatus: string,
  standalone = false,
): boolean {
  const allowed = ["paid", "pending", "refunded"];
  if (!allowed.includes(paymentStatus)) return false;

  const db = getDatabase(siteId, standalone);
  const result = db
    .prepare("UPDATE orders SET payment_status = ? WHERE id = ?")
    .run(paymentStatus, orderId.trim().toUpperCase());
  return result.changes > 0;
}

export function updateOrderShippingStatus(
  siteId: string,
  orderId: string,
  status: string,
  standalone = false,
): boolean {
  const db = getDatabase(siteId, standalone);
  const result = db
    .prepare("UPDATE orders SET status = ? WHERE id = ?")
    .run(status, orderId.trim().toUpperCase());
  return result.changes > 0;
}
