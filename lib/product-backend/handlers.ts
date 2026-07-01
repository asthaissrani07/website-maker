import { getGuestId } from "./cookies";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "./auth";
import { addCartItem, getCart, removeCartItem, updateCartQuantity } from "./cart";
import { saveContactMessage, subscribeNewsletter } from "./contact";
import {
  getDashboardStats,
  isAdminAuthenticated,
  setAdminCookie,
  clearAdminCookie,
  verifyAdminPassword,
  updateOrderPaymentStatus,
  updateOrderShippingStatus,
} from "./dashboard";
import { placeOrder, trackOrder, getOrderDetails } from "./orders";

export const STANDALONE_SITE_ID = "main";

export async function handleAuthSession(siteId: string, standalone = false) {
  const user = await getCurrentUser(siteId, standalone);
  return { ok: true as const, user };
}

export async function handleAuthRegister(
  siteId: string,
  body: { name?: string; email?: string; password?: string },
  standalone = false,
) {
  const result = await registerUser(
    siteId,
    body.name ?? "",
    body.email ?? "",
    body.password ?? "",
    standalone,
  );
  if (!result.ok) return result;
  return { ok: true as const, user: result.user };
}

export async function handleAuthLogin(
  siteId: string,
  body: { email?: string; password?: string },
  standalone = false,
) {
  const guestId = await getGuestId(siteId);
  const result = await loginUser(
    siteId,
    body.email ?? "",
    body.password ?? "",
    guestId,
    standalone,
  );
  if (!result.ok) return result;
  return { ok: true as const, user: result.user };
}

export async function handleAuthLogout(siteId: string, standalone = false) {
  await logoutUser(siteId, standalone);
  return { ok: true as const };
}

export async function handleGetCart(siteId: string, standalone = false) {
  const cart = await getCart(siteId, standalone);
  return { ok: true as const, cart };
}

export async function handleAddCart(
  siteId: string,
  body: { id?: string; name?: string; price?: number },
  standalone = false,
) {
  if (!body.id || !body.name || body.price == null) {
    return { ok: false as const, error: "Invalid cart item." };
  }
  const cart = await addCartItem(
    siteId,
    { id: body.id, name: body.name, price: Number(body.price) },
    standalone,
  );
  return { ok: true as const, cart };
}

export async function handleUpdateCart(
  siteId: string,
  body: { productId?: string; quantity?: number },
  standalone = false,
) {
  if (!body.productId || body.quantity == null) {
    return { ok: false as const, error: "Invalid update." };
  }
  const cart = await updateCartQuantity(
    siteId,
    body.productId,
    Number(body.quantity),
    standalone,
  );
  return { ok: true as const, cart };
}

export async function handleRemoveCart(
  siteId: string,
  productId: string,
  standalone = false,
) {
  const cart = await removeCartItem(siteId, productId, standalone);
  return { ok: true as const, cart };
}

export async function handleCheckout(
  siteId: string,
  body: { email?: string },
  standalone = false,
) {
  const result = await placeOrder(siteId, body.email ?? "", standalone);
  if (!result.ok) return result;
  return { ok: true as const, orderId: result.orderId, total: result.total };
}

export async function handleTrackOrder(
  siteId: string,
  body: { orderId?: string; email?: string },
  standalone = false,
) {
  const order = trackOrder(
    siteId,
    body.orderId ?? "",
    body.email ?? "",
    standalone,
  );
  return { ok: true as const, order };
}

export async function handleGetOrder(
  siteId: string,
  orderId: string,
  email: string,
  standalone = false,
) {
  const order = getOrderDetails(siteId, orderId, email, standalone);
  if (!order) {
    return { ok: false as const, error: "Order not found." };
  }
  return { ok: true as const, order };
}

export async function handleContact(
  siteId: string,
  body: { name?: string; email?: string; phone?: string; comment?: string },
  standalone = false,
) {
  return saveContactMessage(
    siteId,
    {
      name: body.name ?? "",
      email: body.email ?? "",
      phone: body.phone,
      comment: body.comment ?? "",
    },
    standalone,
  );
}

export async function handleNewsletter(
  siteId: string,
  body: { email?: string },
  standalone = false,
) {
  return subscribeNewsletter(siteId, body.email ?? "", standalone);
}

export async function handleAdminLogin(
  siteId: string,
  body: { password?: string },
  standalone = false,
) {
  if (!verifyAdminPassword(body.password ?? "")) {
    return { ok: false as const, error: "Invalid admin password." };
  }
  await setAdminCookie(siteId);
  return { ok: true as const };
}

export async function handleAdminLogout(siteId: string, standalone = false) {
  await clearAdminCookie(siteId);
  void standalone;
  return { ok: true as const };
}

export async function handleAdminDashboard(siteId: string, standalone = false) {
  const authed = await isAdminAuthenticated(siteId);
  if (!authed) {
    return { ok: false as const, error: "Admin authentication required." };
  }
  return { ok: true as const, stats: getDashboardStats(siteId, standalone) };
}

export async function handleAdminUpdateOrder(
  siteId: string,
  orderId: string,
  body: { paymentStatus?: string; status?: string },
  standalone = false,
) {
  const authed = await isAdminAuthenticated(siteId);
  if (!authed) {
    return { ok: false as const, error: "Admin authentication required." };
  }

  let updated = false;
  if (body.paymentStatus) {
    updated = updateOrderPaymentStatus(
      siteId,
      orderId,
      body.paymentStatus,
      standalone,
    );
  }
  if (body.status) {
    updated =
      updateOrderShippingStatus(siteId, orderId, body.status, standalone) ||
      updated;
  }

  if (!updated) {
    return { ok: false as const, error: "Order not found or invalid update." };
  }

  return { ok: true as const, stats: getDashboardStats(siteId, standalone) };
}
