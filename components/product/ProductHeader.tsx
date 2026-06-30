"use client";

import Link from "next/link";
import { useState } from "react";
import { useProductSite } from "./ProductSiteContext";

export function ProductHeader() {
  const { config, openModal, scrollTo, cartCount, user, paths } = useProductSite();
  const [menuOpen, setMenuOpen] = useState(false);

  const navAction = (action: () => void) => {
    action();
    setMenuOpen(false);
  };

  const navBtn =
    "transition hover:opacity-80 ps-accent font-medium";

  return (
    <>
      <div className="ps-banner py-2 text-center text-xs font-medium tracking-wide">
        {config.shippingMessage}
      </div>
      <header className="ps-header sticky top-0 z-40 border-b backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <Link
            href={paths.home}
            className="ps-text ps-font-display text-2xl font-semibold tracking-tight md:text-3xl"
          >
            {config.brandName}
          </Link>
          <nav className="hidden items-center gap-8 text-sm md:flex">
            <Link href={paths.product} className={navBtn}>
              Shop {config.brandName}
            </Link>
            <Link href={`${paths.home}#contact`} className={navBtn}>
              Contact
            </Link>
            <button type="button" onClick={() => openModal("track")} className={navBtn}>
              Track Your Order
            </button>
          </nav>
          <div className="flex items-center gap-3 text-sm font-medium">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="ps-border rounded-md border px-3 py-1.5 md:hidden"
            >
              Menu
            </button>
            <button
              type="button"
              onClick={() => openModal("search")}
              className={`hidden sm:inline ${navBtn}`}
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => openModal("login")}
              className={`hidden sm:inline ${navBtn}`}
            >
              {user ? user.name.split(" ")[0] : "Sign in"}
            </button>
            <button
              type="button"
              onClick={() => openModal("cart")}
              className="ps-btn relative rounded-full px-4 py-2 transition"
            >
              Cart
              {cartCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: "var(--ps-badge-bg)" }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="ps-border border-t px-4 py-3 md:hidden">
            <div className="flex flex-col gap-2 text-sm font-medium">
              <Link href={paths.product} onClick={() => setMenuOpen(false)} className={`py-2 ${navBtn}`}>Shop</Link>
              <Link href={`${paths.home}#contact`} onClick={() => setMenuOpen(false)} className={`py-2 ${navBtn}`}>Contact</Link>
              <button type="button" onClick={() => navAction(() => openModal("track"))} className={`py-2 text-left ${navBtn}`}>Track Your Order</button>
              <button type="button" onClick={() => navAction(() => openModal("search"))} className={`py-2 text-left ${navBtn}`}>Search</button>
              <button type="button" onClick={() => navAction(() => openModal("login"))} className={`py-2 text-left ${navBtn}`}>
                {user ? `Hi, ${user.name.split(" ")[0]}` : "Sign in"}
              </button>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
