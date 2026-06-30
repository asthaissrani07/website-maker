"use client";

import Link from "next/link";
import { useState } from "react";
import { useProductSite } from "./ProductSiteContext";

export function ProductFooter() {
  const { config, openModal, showToast, api, paths } = useProductSite();
  const [email, setEmail] = useState("");

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
            <li>
              <Link href={paths.product} className={linkClass}>
                Product details
              </Link>
            </li>
            <li>
              <button type="button" onClick={() => openModal("search")} className={linkClass}>
                Search
              </button>
            </li>
            <li>
              <button type="button" onClick={() => openModal("track")} className={linkClass}>
                Track Your Order
              </button>
            </li>
            <li>
              <button type="button" onClick={() => openModal("refund")} className={linkClass}>
                Refund Policy
              </button>
            </li>
            <li>
              <button type="button" onClick={() => openModal("contact-info")} className={linkClass}>
                Contact Information
              </button>
            </li>
            <li>
              <Link href={paths.terms} className={linkClass}>
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href={paths.privacy} className={linkClass}>
                Privacy Policy
              </Link>
            </li>
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
              void (async () => {
                const res = await api.subscribeNewsletter(email);
                if (res.ok) {
                  showToast("Thanks for subscribing!");
                  setEmail("");
                } else {
                  showToast(res.error ?? "Subscription failed.");
                }
              })();
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
          <Link href={`${paths.home}#contact`} className={`mt-4 block text-sm ${linkClass}`}>
            {config.contactEmail}
          </Link>
        </div>
      </div>
      <div className="ps-border ps-text-subtle mx-auto mt-10 max-w-6xl border-t pt-6 text-center text-sm">
        © {config.footerCopyright}
      </div>
    </footer>
  );
}
