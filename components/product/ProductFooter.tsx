"use client";

import { useState } from "react";
import { useProductSite } from "./ProductSiteContext";

export function ProductFooter() {
  const { config, openModal, scrollTo, showToast } = useProductSite();
  const [email, setEmail] = useState("");

  const links: { label: string; action: () => void }[] = [
    { label: "Search", action: () => openModal("search") },
    { label: "Track Your Order", action: () => openModal("track") },
    { label: "Refund Policy", action: () => openModal("refund") },
    { label: "Contact Information", action: () => openModal("contact-info") },
    { label: "Terms of Service", action: () => openModal("terms") },
    { label: "Privacy Policy", action: () => openModal("privacy") },
  ];

  const linkClass =
    "ps-text-muted text-left transition hover:text-[var(--ps-accent)]";

  return (
    <footer className="ps-section ps-border border-t px-4 py-12 md:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
        <div>
          <h3 className="ps-text text-sm font-semibold uppercase tracking-widest">
            Quick links
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.label}>
                <button type="button" onClick={link.action} className={linkClass}>
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="ps-text text-sm font-semibold uppercase tracking-widest">
            Subscribe to our emails
          </h3>
          <p className="ps-text-muted mt-4 text-sm">
            Join our email list for exclusive offers and the latest news.
          </p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (email.includes("@")) {
                showToast("Thanks for subscribing!");
                setEmail("");
              }
            }}
          >
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="ps-input flex-1 rounded-md px-4 py-2 text-sm outline-none"
            />
            <button type="submit" className="ps-btn rounded-sm px-4 py-2 text-sm font-medium">
              Sign up
            </button>
          </form>
        </div>
        <div>
          <h3 className="ps-text text-sm font-semibold uppercase tracking-widest">
            Contact
          </h3>
          <button
            type="button"
            onClick={() => scrollTo("contact")}
            className={`mt-4 block text-sm ${linkClass}`}
          >
            {config.contactEmail}
          </button>
        </div>
      </div>
      <div className="ps-border ps-text-subtle mx-auto mt-10 max-w-6xl border-t pt-6 text-center text-sm">
        © {config.footerCopyright}
      </div>
    </footer>
  );
}
