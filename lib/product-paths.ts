export function productPaths(basePath: string) {
  const base = basePath.replace(/\/$/, "");
  return {
    home: base || "/",
    product: `${base}/product`,
    privacy: `${base}/privacy`,
    terms: `${base}/terms`,
    order: (orderId: string, email?: string) => {
      const path = `${base}/orders/${encodeURIComponent(orderId)}`;
      return email ? `${path}?email=${encodeURIComponent(email)}` : path;
    },
    dashboard: `${base}/dashboard`,
  };
}

export type ProductPaths = ReturnType<typeof productPaths>;
