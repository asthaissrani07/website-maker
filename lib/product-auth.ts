export interface UserAccount {
  email: string;
  password: string;
  name: string;
}

export interface UserSession {
  email: string;
  name: string;
}

export function siteStorageKey(brandName: string, suffix: string): string {
  const slug = brandName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  return `ps-${slug || "site"}-${suffix}`;
}

export function readAccounts(key: string): UserAccount[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeAccounts(key: string, accounts: UserAccount[]): void {
  localStorage.setItem(key, JSON.stringify(accounts));
}

export function readSession(key: string): UserSession | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as UserSession;
  } catch {
    return null;
  }
}

export function writeSession(key: string, session: UserSession | null): void {
  if (session) {
    localStorage.setItem(key, JSON.stringify(session));
  } else {
    localStorage.removeItem(key);
  }
}
