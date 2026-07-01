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
import {
  createProductApiClient,
  type ProductApiClient,
} from "@/lib/product-api-client";
import { productPaths, type ProductPaths } from "@/lib/product-paths";
import type { CartItem, TrackResult, UserSession } from "@/lib/product-backend/types";

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
  layoutId: string;
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

export type { CartItem, TrackResult, UserSession };

interface ProductSiteContextValue {
  config: SiteContent;
  api: ProductApiClient;
  activeModal: ModalType;
  openModal: (modal: Exclude<ModalType, null>) => void;
  closeModal: () => void;
  scrollTo: (id: string) => void;
  cart: CartItem[];
  cartCount: number;
  addToCart: () => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  checkout: (email: string) => Promise<{ ok: boolean; orderId?: string; error?: string }>;
  user: UserSession | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  trackOrder: (orderId: string, email: string) => Promise<TrackResult | null>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toast: string | null;
  showToast: (message: string) => void;
  loading: boolean;
  basePath: string;
  paths: ProductPaths;
}

const ProductSiteContext = createContext<ProductSiteContextValue | null>(null);

export function ProductSiteProvider({
  config,
  apiBase = "/api",
  basePath = "",
  children,
}: {
  config: SiteContent;
  apiBase?: string;
  basePath?: string;
  children: ReactNode;
}) {
  const api = useMemo(() => createProductApiClient(apiBase), [apiBase]);
  const paths = useMemo(() => productPaths(basePath), [basePath]);

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserSession | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const res = await api.getSession();
    if (res.ok && res.data) {
      setUser(res.data.user ?? null);
    }
  }, [api]);

  const refreshCart = useCallback(async () => {
    const res = await api.getCart();
    if (res.ok && res.data) {
      setCart(res.data.cart ?? []);
    }
  }, [api]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await Promise.all([refreshSession(), refreshCart()]);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshSession, refreshCart]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }, []);

  const openModal = useCallback((modal: Exclude<ModalType, null>) => {
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => setActiveModal(null), []);

  const scrollTo = useCallback(
    (id: string) => {
      closeModal();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [closeModal],
  );

  const addToCart = useCallback(async () => {
    const price = parseFloat(config.price) || 0;
    const res = await api.addToCart({
      id: "main-product",
      name: config.productName,
      price,
    });
    if (res.ok && res.data) {
      setCart(res.data.cart);
      showToast(`${config.productName} added to cart`);
      openModal("cart");
    } else {
      showToast(res.error ?? "Could not add to cart.");
    }
  }, [api, config.price, config.productName, openModal, showToast]);

  const removeFromCart = useCallback(
    async (id: string) => {
      const res = await api.removeCartItem(id);
      if (res.ok && res.data) setCart(res.data.cart);
    },
    [api],
  );

  const updateQuantity = useCallback(
    async (id: string, quantity: number) => {
      if (quantity < 1) return;
      const res = await api.updateCartItem(id, quantity);
      if (res.ok && res.data) setCart(res.data.cart);
    },
    [api],
  );

  const checkout = useCallback(
    async (email: string) => {
      const res = await api.checkout(email);
      if (res.ok && res.data) {
        setCart([]);
        closeModal();
        showToast(`Order ${res.data.orderId} placed! Thank you.`);
        return { ok: true, orderId: res.data.orderId };
      }
      return { ok: false, error: res.error ?? "Checkout failed." };
    },
    [api, closeModal, showToast],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await api.login(email, password);
      if (res.ok && res.data?.user) {
        setUser(res.data.user);
        await refreshCart();
        showToast(`Welcome back, ${res.data.user.name}!`);
        closeModal();
        return { ok: true };
      }
      return { ok: false, error: res.error ?? "Sign in failed." };
    },
    [api, closeModal, refreshCart, showToast],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await api.register(name, email, password);
      if (res.ok && res.data?.user) {
        setUser(res.data.user);
        await refreshCart();
        showToast(`Account created. Welcome, ${res.data.user.name}!`);
        closeModal();
        return { ok: true };
      }
      return { ok: false, error: res.error ?? "Sign up failed." };
    },
    [api, closeModal, refreshCart, showToast],
  );

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
    await refreshCart();
    showToast("You have been logged out.");
  }, [api, refreshCart, showToast]);

  const trackOrder = useCallback(
    async (orderId: string, email: string) => {
      const res = await api.trackOrder(orderId, email);
      if (res.ok && res.data) return res.data.order ?? null;
      return null;
    },
    [api],
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, i) => sum + i.quantity, 0),
    [cart],
  );

  const value = useMemo(
    () => ({
      config,
      api,
      activeModal,
      openModal,
      closeModal,
      scrollTo,
      cart,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      checkout,
      user,
      login,
      register,
      logout,
      trackOrder,
      searchQuery,
      setSearchQuery,
      toast,
      showToast,
      loading,
      basePath,
      paths,
    }),
    [
      config,
      api,
      activeModal,
      openModal,
      closeModal,
      scrollTo,
      cart,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      checkout,
      user,
      login,
      register,
      logout,
      trackOrder,
      searchQuery,
      toast,
      showToast,
      loading,
      basePath,
      paths,
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
