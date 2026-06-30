"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useProductSite } from "./ProductSiteContext";
import type { OrderDetails } from "@/lib/product-backend/types";
import { ProductReveal } from "./ProductReveal";

export function OrderDetailsPage({
  orderId,
  email,
}: {
  orderId: string;
  email?: string;
}) {
  const { config, user, paths, api, showToast } = useProductSite();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailInput, setEmailInput] = useState(email ?? user?.email ?? "");

  useEffect(() => {
    const mail = email ?? user?.email;
    if (!mail) {
      setLoading(false);
      return;
    }
    void (async () => {
      const res = await api.getOrder(orderId, mail);
      if (res.ok && res.data?.order) setOrder(res.data.order);
      else showToast(res.error ?? "Order not found.");
      setLoading(false);
    })();
  }, [api, email, orderId, showToast, user?.email]);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await api.getOrder(orderId, emailInput);
    if (res.ok && res.data?.order) setOrder(res.data.order);
    else showToast(res.error ?? "Order not found.");
    setLoading(false);
  }

  return (
    <section className="ps-section px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-2xl">
        <Link href={paths.home} className="ps-accent mb-8 inline-block text-sm font-medium">
          ← Back to home
        </Link>
        <ProductReveal>
          <h1 className="ps-text ps-font-display text-3xl font-bold">Order details</h1>
          <p className="ps-text-muted mt-2 text-sm">Order {orderId}</p>
        </ProductReveal>

        {!order && !loading && !email && !user?.email && (
          <form onSubmit={lookup} className="mt-8 space-y-4">
            <p className="ps-text-muted text-sm">
              Enter the email used at checkout to view this order.
            </p>
            <input
              required
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="ps-input w-full rounded-md px-4 py-3 outline-none"
            />
            <button type="submit" className="ps-btn rounded-sm px-6 py-3 text-sm font-semibold">
              View order
            </button>
          </form>
        )}

        {loading && (
          <p className="ps-text-muted mt-8 text-center">Loading order…</p>
        )}

        {order && (
          <ProductReveal delay={100} className="mt-8 space-y-6">
            <div className="ps-card rounded-xl border p-6">
              <p className="ps-text font-semibold">{order.status}</p>
              <p className="ps-text-muted mt-2 text-sm">ETA: {order.eta}</p>
              <p className="ps-text-muted text-sm">Location: {order.location}</p>
              <p className="ps-text-muted mt-4 text-xs">
                Placed {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="ps-card rounded-xl border p-6">
              <h2 className="ps-text mb-4 font-semibold">Items</h2>
              <ul className="space-y-3">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="ps-border flex justify-between border-b pb-3 text-sm last:border-0"
                  >
                    <span className="ps-text">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="ps-text-muted">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="ps-text mt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </p>
            </div>
            <p className="ps-text-muted text-center text-sm">
              Questions? Contact {config.contactEmail}
            </p>
          </ProductReveal>
        )}
      </div>
    </section>
  );
}
