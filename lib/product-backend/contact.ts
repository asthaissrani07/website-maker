import { randomUUID } from "crypto";
import { getDatabase } from "./db";

export function saveContactMessage(
  siteId: string,
  data: { name: string; email: string; phone?: string; comment: string },
  standalone?: boolean,
): { ok: true } | { ok: false; error: string } {
  const name = data.name.trim();
  const email = data.email.trim();
  const comment = data.comment.trim();

  if (!name) return { ok: false, error: "Name is required." };
  if (!email.includes("@")) return { ok: false, error: "Valid email is required." };
  if (!comment) return { ok: false, error: "Message is required." };

  const db = getDatabase(siteId, standalone);
  db.prepare(
    `INSERT INTO contact_messages (id, name, email, phone, comment, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
  ).run(
    randomUUID(),
    name,
    email,
    data.phone?.trim() || null,
    comment,
    new Date().toISOString(),
  );

  return { ok: true };
}

export function subscribeNewsletter(
  siteId: string,
  email: string,
  standalone?: boolean,
): { ok: true } | { ok: false; error: string } {
  const mail = email.trim().toLowerCase();
  if (!mail.includes("@")) return { ok: false, error: "Valid email is required." };

  const db = getDatabase(siteId, standalone);
  try {
    db.prepare(
      "INSERT INTO newsletter_subscribers (email, created_at) VALUES (?, ?)",
    ).run(mail, new Date().toISOString());
  } catch {
    return { ok: true };
  }

  return { ok: true };
}
