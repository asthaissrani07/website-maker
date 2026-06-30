"use client";

import { useEffect, useState } from "react";
import type { TrackResult } from "./ProductSiteContext";
import { Modal } from "./Modal";
import { useProductSite } from "./ProductSiteContext";

export function SiteModals() {
  const {
    activeModal,
    closeModal,
    config,
    cart,
    cartCount,
    removeFromCart,
    updateQuantity,
    checkout,
    login,
    register,
    trackOrder,
    searchQuery,
    setSearchQuery,
    showToast,
    user,
    logout,
    paths,
  } = useProductSite();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authError, setAuthError] = useState("");
  const [trackId, setTrackId] = useState("");
  const [trackEmail, setTrackEmail] = useState("");
  const [trackResult, setTrackResult] = useState<TrackResult | null>(null);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  useEffect(() => {
    if (activeModal !== "login") return;
    setAuthError("");
    if (!user) {
      setAuthMode("signin");
    }
  }, [activeModal, user]);

  useEffect(() => {
    if (activeModal === "cart" && user?.email) {
      setCheckoutEmail(user.email);
    }
  }, [activeModal, user?.email]);

  const policyContent: Record<string, { title: string; body: string }> = {
    refund: {
      title: "Refund Policy",
      body: `We offer a 30-day satisfaction guarantee on ${config.productName}. If you're not happy, contact ${config.contactEmail} with your order number for a full refund on unopened items.`,
    },
    terms: {
      title: "Terms of Service",
      body: `By using ${config.brandName}'s website you agree to our standard terms of sale. Products are subject to availability. Prices are in USD unless stated otherwise.`,
    },
    privacy: {
      title: "Privacy Policy",
      body: `We respect your privacy. Information collected through this site is used only to process orders and improve your experience. Contact ${config.contactEmail} for data requests.`,
    },
    "contact-info": {
      title: "Contact Information",
      body: `Email: ${config.contactEmail}\nBrand: ${config.brandName}\nProduct: ${config.productName}\n\nWe typically respond within 1–2 business days.`,
    },
  };

  return (
    <>
      <Modal
        open={activeModal === "login"}
        onClose={closeModal}
        title={user ? "My account" : authMode === "signup" ? "Create account" : "Sign in"}
      >
        {user ? (
          <div className="space-y-4">
            <div className="ps-highlight rounded-lg p-4 text-center">
              <p className="ps-text text-lg font-semibold">{user.name}</p>
              <p className="ps-text-muted mt-1 text-sm">{user.email}</p>
            </div>
            <p className="ps-text-muted text-center text-sm">
              Your cart and session are saved for this store.
            </p>
            <button
              type="button"
              onClick={() => {
                void logout();
                closeModal();
              }}
              className="ps-btn w-full rounded-sm py-3 text-sm font-semibold"
            >
              Log out
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex rounded-lg border ps-border p-1">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signin");
                  setAuthError("");
                }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                  authMode === "signin"
                    ? "ps-btn"
                    : "ps-text-muted hover:opacity-80"
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode("signup");
                  setAuthError("");
                }}
                className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
                  authMode === "signup"
                    ? "ps-btn"
                    : "ps-text-muted hover:opacity-80"
                }`}
              >
                Sign up
              </button>
            </div>

            {authMode === "signin" ? (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  void (async () => {
                    setSubmitting(true);
                    const result = await login(loginEmail, loginPassword);
                    if (!result.ok) setAuthError(result.error ?? "Sign in failed");
                    else {
                      setAuthError("");
                      setLoginEmail("");
                      setLoginPassword("");
                    }
                    setSubmitting(false);
                  })();
                }}
              >
                {authError && (
                  <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    {authError}
                  </p>
                )}
                <div>
                  <label className="ps-text-muted mb-1 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="ps-input w-full rounded-md px-4 py-3 outline-none"
                  />
                </div>
                <div>
                  <label className="ps-text-muted mb-1 block text-sm font-medium">
                    Password
                  </label>
                  <input
                    required
                    type="password"
                    minLength={6}
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="ps-input w-full rounded-md px-4 py-3 outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="ps-btn w-full rounded-sm py-3 text-sm font-semibold disabled:opacity-60"
                >
                  {submitting ? "Signing in..." : "Sign in"}
                </button>
              </form>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  void (async () => {
                    setSubmitting(true);
                    const result = await register(
                      signupName,
                      signupEmail,
                      signupPassword,
                    );
                    if (!result.ok) setAuthError(result.error ?? "Sign up failed");
                    else {
                      setAuthError("");
                      setSignupName("");
                      setSignupEmail("");
                      setSignupPassword("");
                    }
                    setSubmitting(false);
                  })();
                }}
              >
                {authError && (
                  <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    {authError}
                  </p>
                )}
                <div>
                  <label className="ps-text-muted mb-1 block text-sm font-medium">
                    Full name
                  </label>
                  <input
                    required
                    type="text"
                    autoComplete="name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="ps-input w-full rounded-md px-4 py-3 outline-none"
                  />
                </div>
                <div>
                  <label className="ps-text-muted mb-1 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="ps-input w-full rounded-md px-4 py-3 outline-none"
                  />
                </div>
                <div>
                  <label className="ps-text-muted mb-1 block text-sm font-medium">
                    Password
                  </label>
                  <input
                    required
                    type="password"
                    minLength={6}
                    autoComplete="new-password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="ps-input w-full rounded-md px-4 py-3 outline-none"
                  />
                  <p className="ps-text-subtle mt-1 text-xs">At least 6 characters</p>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="ps-btn w-full rounded-sm py-3 text-sm font-semibold disabled:opacity-60"
                >
                  {submitting ? "Creating account..." : "Create account"}
                </button>
              </form>
            )}
          </>
        )}
      </Modal>

      <Modal open={activeModal === "track"} onClose={closeModal} title="Track Your Order">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void (async () => {
              const result = await trackOrder(trackId, trackEmail);
              setTrackResult(result);
              if (!result) showToast("Order not found. Check your details.");
            })();
          }}
        >
          <div>
            <label className="ps-text-muted mb-1 block text-sm font-medium">
              Order number
            </label>
            <input
              required
              placeholder="e.g. ORD-12345"
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              className="ps-input w-full rounded-md px-4 py-3 outline-none"
            />
          </div>
          <div>
            <label className="ps-text-muted mb-1 block text-sm font-medium">Email</label>
            <input
              required
              type="email"
              value={trackEmail}
              onChange={(e) => setTrackEmail(e.target.value)}
              className="ps-input w-full rounded-md px-4 py-3 outline-none"
            />
          </div>
          <button type="submit" className="ps-btn w-full rounded-sm py-3 text-sm font-semibold">
            Track order
          </button>
        </form>
        {trackResult && (
          <div className="ps-highlight mt-4 rounded-lg p-4 text-sm">
            <p className="ps-text font-semibold">{trackResult.status}</p>
            <p className="ps-text-muted mt-1">ETA: {trackResult.eta}</p>
            <p className="ps-text-muted">Location: {trackResult.location}</p>
          </div>
        )}
      </Modal>

      <Modal open={activeModal === "cart"} onClose={closeModal} title={`Cart (${cartCount})`}>
        {cart.length === 0 ? (
          <p className="ps-text-muted text-center">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="ps-border flex items-center justify-between gap-3 border-b pb-3"
              >
                <div>
                  <p className="ps-text font-medium">{item.name}</p>
                  <p className="ps-text-subtle text-sm">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (item.quantity <= 1) void removeFromCart(item.id);
                      else void updateQuantity(item.id, item.quantity - 1);
                    }}
                    className="ps-border h-8 w-8 rounded border"
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => void updateQuantity(item.id, item.quantity + 1)}
                    className="ps-border h-8 w-8 rounded border"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => void removeFromCart(item.id)}
                    className="ml-2 text-sm text-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="ps-text flex justify-between font-semibold">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div>
              <label className="ps-text-muted mb-1 block text-sm font-medium">
                Email for order confirmation
              </label>
              <input
                required
                type="email"
                value={checkoutEmail}
                onChange={(e) => setCheckoutEmail(e.target.value)}
                className="ps-input w-full rounded-md px-4 py-3 outline-none"
              />
            </div>
            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                void (async () => {
                  setSubmitting(true);
                  const result = await checkout(checkoutEmail);
                  if (result.ok && result.orderId) {
                    window.location.href = paths.order(result.orderId, checkoutEmail);
                  } else if (!result.ok) {
                    showToast(result.error ?? "Checkout failed.");
                  }
                  setSubmitting(false);
                })();
              }}
              className="ps-btn w-full rounded-sm py-3 text-sm font-semibold disabled:opacity-60"
            >
              {submitting ? "Placing order..." : "Check out"}
            </button>
          </div>
        )}
      </Modal>

      <Modal open={activeModal === "search"} onClose={closeModal} title="Search">
        <input
          autoFocus
          type="search"
          placeholder={`Search ${config.brandName}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ps-input mb-4 w-full rounded-md px-4 py-3 outline-none"
        />
        <div className="space-y-2">
          {[config.productName, config.tagline, config.productDescription]
            .filter(
              (t) =>
                !searchQuery ||
                t.toLowerCase().includes(searchQuery.toLowerCase()),
            )
            .map((text, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  closeModal();
                  document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="ps-card block w-full rounded-lg p-3 text-left text-sm transition hover:opacity-90"
              >
                {text}
              </button>
            ))}
          {searchQuery &&
            ![config.productName, config.tagline, config.productDescription].some(
              (t) => t.toLowerCase().includes(searchQuery.toLowerCase()),
            ) && (
              <p className="ps-text-subtle text-sm">
                No results for &quot;{searchQuery}&quot;
              </p>
            )}
        </div>
      </Modal>

      {(["refund", "terms", "privacy", "contact-info"] as const).map((key) => (
        <Modal
          key={key}
          open={activeModal === key}
          onClose={closeModal}
          title={policyContent[key].title}
        >
          <p className="ps-text-muted whitespace-pre-line text-sm leading-relaxed">
            {policyContent[key].body}
          </p>
        </Modal>
      ))}
    </>
  );
}

export function Toast() {
  const { toast } = useProductSite();
  if (!toast) return null;
  return (
    <div className="ps-btn ps-toast fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full px-6 py-3 text-sm font-medium shadow-lg">
      {toast}
    </div>
  );
}
