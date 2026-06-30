import type { CartItem, TrackResult, UserSession } from "./product-backend/types";

export function createProductApiClient(apiBase: string) {
  async function request<T>(
    path: string,
    options?: RequestInit,
  ): Promise<{ ok: boolean; data?: T; error?: string }> {
    try {
      const res = await fetch(`${apiBase}${path}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(options?.headers ?? {}),
        },
      });
      const body = await res.json();
      if (!res.ok || body.ok === false) {
        return { ok: false, error: (body.error as string) || "Request failed." };
      }
      return { ok: true, data: body as T };
    } catch {
      return { ok: false, error: "Network error. Please try again." };
    }
  }

  return {
    getSession: () =>
      request<{ user: UserSession | null }>("/auth/session"),

    register: (name: string, email: string, password: string) =>
      request<{ user: UserSession }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }),

    login: (email: string, password: string) =>
      request<{ user: UserSession }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    logout: () =>
      request<void>("/auth/logout", { method: "POST" }),

    getCart: () => request<{ cart: CartItem[] }>("/cart"),

    addToCart: (item: Omit<CartItem, "quantity">) =>
      request<{ cart: CartItem[] }>("/cart", {
        method: "POST",
        body: JSON.stringify(item),
      }),

    updateCartItem: (productId: string, quantity: number) =>
      request<{ cart: CartItem[] }>("/cart", {
        method: "PATCH",
        body: JSON.stringify({ productId, quantity }),
      }),

    removeCartItem: (productId: string) =>
      request<{ cart: CartItem[] }>(`/cart?productId=${encodeURIComponent(productId)}`, {
        method: "DELETE",
      }),

    checkout: (email: string) =>
      request<{ orderId: string; total: number }>("/orders", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),

    trackOrder: (orderId: string, email: string) =>
      request<{ order: TrackResult | null }>("/orders/track", {
        method: "POST",
        body: JSON.stringify({ orderId, email }),
      }),

    getOrder: (orderId: string, email: string) =>
      request<{ order: import("./product-backend/types").OrderDetails }>(
        `/orders/${encodeURIComponent(orderId)}?email=${encodeURIComponent(email)}`,
      ),

    sendContact: (data: {
      name: string;
      email: string;
      phone?: string;
      comment: string;
    }) =>
      request<void>("/contact", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    subscribeNewsletter: (email: string) =>
      request<void>("/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
  };
}

export type ProductApiClient = ReturnType<typeof createProductApiClient>;
