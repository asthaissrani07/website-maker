"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface SiteContent {
  brandName: string;
  productName: string;
  tagline: string;
  heroHeadline: string;
  heroSubtext: string;
  ctaText: string;
  price: string;
  shippingMessage: string;
  rating: string;
  reviewCount: string;
  productDescription: string;
  statsTitle: string;
  statsSubtitle: string;
  stats: { percentage: number; description: string }[];
  contactEmail: string;
  footerCopyright: string;
  imageBase64?: string;
  imageMimeType?: string;
  themeId: string;
  fontPairId: string;
  customAccentColor: string;
  customButtonColor: string;
  customBackgroundColor: string;
  customTextColor: string;
}

export type ModalType =
  | "track"
  | "login"
  | "cart"
  | "search"
  | "refund"
  | "terms"
  | "privacy"
  | "contact-info"
  | null;

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface TrackResult {
  orderId: string;
  status: string;
  eta: string;
  location: string;
}

interface ProductSiteContextValue {
  config: SiteContent;
  activeModal: ModalType;
  openModal: (modal: Exclude<ModalType, null>) => void;
  closeModal: () => void;
  scrollTo: (id: string) => void;
  cart: CartItem[];
  cartCount: number;
  addToCart: () => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  user: { email: string } | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  trackOrder: (orderId: string, email: string) => TrackResult | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toast: string | null;
  showToast: (message: string) => void;
}

const ProductSiteContext = createContext<ProductSiteContextValue | null>(null);

const USER_KEY = "product-site-user";
const CART_KEY = "product-site-cart";

export function ProductSiteProvider({
  config,
  children,
}: {
  config: SiteContent;
  children: ReactNode;
}) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) setUser(JSON.parse(savedUser));
      const savedCart = localStorage.getItem(CART_KEY);
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const openModal = useCallback((modal: Exclude<ModalType, null>) => {
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => setActiveModal(null), []);

  const scrollTo = useCallback((id: string) => {
    closeModal();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [closeModal]);

  const addToCart = useCallback(() => {
    const price = parseFloat(config.price) || 0;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === "main-product");
      if (existing) {
        return prev.map((i) =>
          i.id === "main-product"
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [
        ...prev,
        {
          id: "main-product",
          name: config.productName,
          price,
          quantity: 1,
        },
      ];
    });
    showToast(`${config.productName} added to cart`);
    openModal("cart");
  }, [config.price, config.productName, openModal, showToast]);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const login = useCallback(
    (email: string, password: string) => {
      if (!email.includes("@")) {
        return { ok: false, error: "Please enter a valid email." };
      }
      if (password.length < 6) {
        return { ok: false, error: "Password must be at least 6 characters." };
      }
      const session = { email };
      setUser(session);
      localStorage.setItem(USER_KEY, JSON.stringify(session));
      showToast(`Welcome back!`);
      closeModal();
      return { ok: true };
    },
    [closeModal, showToast],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    showToast("You have been logged out.");
  }, [showToast]);

  const trackOrder = useCallback((orderId: string, email: string) => {
    const id = orderId.trim();
    const mail = email.trim();
    if (id.length < 4 || !mail.includes("@")) return null;

    const statuses = [
      { status: "Order confirmed", eta: "2–3 business days", location: "Warehouse" },
      { status: "Shipped", eta: "Arriving Friday", location: "In transit" },
      { status: "Out for delivery", eta: "Today by 8 PM", location: "Local carrier" },
    ];
    const pick = statuses[id.charCodeAt(0) % statuses.length];
    return { orderId: id, ...pick };
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart],
  );

  const value = useMemo(
    () => ({
      config,
      activeModal,
      openModal,
      closeModal,
      scrollTo,
      cart,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      user,
      login,
      logout,
      trackOrder,
      searchQuery,
      setSearchQuery,
      toast,
      showToast,
    }),
    [
      config,
      activeModal,
      openModal,
      closeModal,
      scrollTo,
      cart,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      user,
      login,
      logout,
      trackOrder,
      searchQuery,
      toast,
      showToast,
    ],
  );

  return (
    <ProductSiteContext.Provider value={value}>
      {children}
    </ProductSiteContext.Provider>
  );
}

export function useProductSite() {
  const ctx = useContext(ProductSiteContext);
  if (!ctx) {
    throw new Error("useProductSite must be used within ProductSiteProvider");
  }
  return ctx;
}
