import { cookies } from "next/headers";

export function authCookieName(siteId: string): string {
  return `ps_auth_${siteId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12)}`;
}

export function guestCookieName(siteId: string): string {
  return `ps_guest_${siteId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12)}`;
}

export async function getAuthToken(siteId: string): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(authCookieName(siteId))?.value;
}

export async function getGuestId(siteId: string): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(guestCookieName(siteId))?.value;
}

export async function setAuthCookie(
  siteId: string,
  token: string,
  maxAgeSeconds: number,
): Promise<void> {
  const jar = await cookies();
  jar.set(authCookieName(siteId), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  });
}

export async function clearAuthCookie(siteId: string): Promise<void> {
  const jar = await cookies();
  jar.delete(authCookieName(siteId));
}

export async function ensureGuestId(siteId: string): Promise<string> {
  const existing = await getGuestId(siteId);
  if (existing) return existing;

  const id = crypto.randomUUID();
  const jar = await cookies();
  jar.set(guestCookieName(siteId), id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return id;
}
