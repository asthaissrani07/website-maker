"use client";

import { useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

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
        setSubmitted(true);
      }}
    >
      {["Name", "Email", "Phone number"].map((label) => (
        <div key={label}>
          <label className="ps-text-muted mb-1 block text-sm font-medium">
            {label}
          </label>
          <input
            required
            type={
              label === "Email" ? "email" : label === "Phone number" ? "tel" : "text"
            }
            className="ps-input w-full rounded-md px-4 py-3 outline-none"
          />
        </div>
      ))}
      <div>
        <label className="ps-text-muted mb-1 block text-sm font-medium">Comment</label>
        <textarea required rows={4} className="ps-input w-full rounded-md px-4 py-3 outline-none" />
      </div>
      <button
        type="submit"
        className="ps-btn w-full rounded-sm py-4 text-sm font-semibold tracking-wide transition"
      >
        Send
      </button>
    </form>
  );
}
