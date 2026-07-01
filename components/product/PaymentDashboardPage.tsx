"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { formatDisplayDateTime } from "@/lib/format-date";
import type { DashboardStats } from "@/lib/product-backend/dashboard";
import { useProductSite } from "./ProductSiteContext";

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}

function paymentBadgeClass(status: string) {
  if (status === "paid") return "bg-emerald-100 text-emerald-800";
  if (status === "refunded") return "bg-red-100 text-red-800";
  return "bg-amber-100 text-amber-800";
}

export function PaymentDashboardPage() {
  const { config, api, paths } = useProductSite();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await api.getPaymentDashboard();
    if (res.ok && res.data?.stats) {
      setStats(res.data.stats);
    } else {
      setStats(null);
      if (res.error && !res.error.includes("authentication")) {
        setError(res.error);
      }
    }
    setLoading(false);
  }, [api]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const res = await api.adminLogin(password);
    if (!res.ok) {
      setError(res.error ?? "Login failed.");
      setSubmitting(false);
      return;
    }
    setPassword("");
    await loadDashboard();
    setSubmitting(false);
  }

  async function handleLogout() {
    await api.adminLogout();
    setStats(null);
  }

  async function updatePayment(orderId: string, paymentStatus: string) {
    const res = await api.updateOrderAdmin(orderId, { paymentStatus });
    if (res.ok && res.data?.stats) {
      setStats(res.data.stats);
    } else {
      setError(res.error ?? "Update failed.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading payment dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Payment Dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            Store owner access for {config.brandName}. Enter your admin password to
            view orders and payments.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Admin password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                placeholder="Default: store-admin"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-[#5a2d82] py-3 text-sm font-semibold text-white transition hover:bg-[#4a2469] disabled:opacity-60"
            >
              {submitting ? "Signing in..." : "Access dashboard"}
            </button>
          </form>
          <p className="mt-4 text-xs text-slate-500">
            Set <code className="rounded bg-slate-100 px-1">STORE_ADMIN_PASSWORD</code> in
            your environment for production.
          </p>
          <Link
            href={paths.home}
            className="mt-6 inline-block text-sm font-medium text-purple-700 hover:text-purple-900"
          >
            ← Back to store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7f9] px-4 py-8 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-700">
              {config.brandName}
            </p>
            <h1 className="text-2xl font-bold text-slate-900">Payment Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">
              Orders, revenue, and payment status for your store.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={paths.home}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-purple-200"
            >
              View store
            </Link>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-red-200 hover:text-red-700"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            accent="#5a2d82"
          />
          <StatCard
            label="Orders"
            value={String(stats.orderCount)}
            accent="#0f766e"
          />
          <StatCard
            label="Avg. order"
            value={`$${stats.averageOrder.toFixed(2)}`}
            accent="#b45309"
          />
          <StatCard
            label="Paid orders"
            value={String(stats.paidCount)}
            accent="#059669"
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-800">Recent orders</h2>
            <p className="text-xs text-slate-500">
              {stats.pendingCount} pending · {stats.refundedCount} refunded
            </p>
          </div>

          {stats.orders.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-slate-500">
              No orders yet. Sales will appear here after customers checkout.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3">Customer</th>
                    <th className="px-5 py-3">Total</th>
                    <th className="px-5 py-3">Payment</th>
                    <th className="px-5 py-3">Shipping</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.orders.map((order) => (
                    <tr key={order.orderId} className="hover:bg-slate-50/80">
                      <td className="px-5 py-4 font-medium text-slate-900">
                        {order.orderId}
                      </td>
                      <td className="px-5 py-4 text-slate-600">{order.email}</td>
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${paymentBadgeClass(order.paymentStatus)}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{order.status}</td>
                      <td className="px-5 py-4 text-slate-500">
                        <time dateTime={order.createdAt}>
                          {formatDisplayDateTime(order.createdAt)}
                        </time>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={order.paymentStatus}
                          onChange={(e) =>
                            void updatePayment(order.orderId, e.target.value)
                          }
                          className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-purple-400"
                        >
                          <option value="paid">Paid</option>
                          <option value="pending">Pending</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
