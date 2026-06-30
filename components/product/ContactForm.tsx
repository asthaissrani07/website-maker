"use client";

import { useState } from "react";
import { useProductSite } from "./ProductSiteContext";

export function ContactForm() {
  const { api, showToast } = useProductSite();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });

  if (submitted) {
    return (
      <div className="ps-highlight rounded-xl p-8 text-center">
        <p className="ps-text text-lg font-medium">
          Thank you! We&apos;ll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form
      className="mx-auto max-w-xl space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        void (async () => {
          setSubmitting(true);
          const res = await api.sendContact(form);
          if (res.ok) setSubmitted(true);
          else showToast(res.error ?? "Could not send message.");
          setSubmitting(false);
        })();
      }}
    >
      <div>
        <label className="ps-text-muted mb-1 block text-sm font-medium">Name</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="ps-input w-full rounded-md px-4 py-3 outline-none"
        />
      </div>
      <div>
        <label className="ps-text-muted mb-1 block text-sm font-medium">Email</label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          className="ps-input w-full rounded-md px-4 py-3 outline-none"
        />
      </div>
      <div>
        <label className="ps-text-muted mb-1 block text-sm font-medium">
          Phone number
        </label>
        <input
          required
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          className="ps-input w-full rounded-md px-4 py-3 outline-none"
        />
      </div>
      <div>
        <label className="ps-text-muted mb-1 block text-sm font-medium">Comment</label>
        <textarea
          required
          rows={4}
          value={form.comment}
          onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
          className="ps-input w-full rounded-md px-4 py-3 outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="ps-btn w-full rounded-sm py-4 text-sm font-semibold tracking-wide disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Send"}
      </button>
    </form>
  );
}
