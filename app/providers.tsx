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
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/mock-data";

export type CartLine = { id: string; qty: number; price: number; name: string; image: string };
type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "info";
  action?: { label: string; onClick: () => void };
  duration?: number;
};

type DisplayUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

type Ctx = {
  cart: CartLine[];
  cartCount: number;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (id: string) => Promise<void>;
  toasts: Toast[];
  toast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
  user: DisplayUser | null;
  authUser: User | null;
  authLoading: boolean;
  logout: () => Promise<void>;
  cartTotals: { subtotal: number; discount: number; delivery: number; total: number };
};

const AppCtx = createContext<Ctx | null>(null);

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within Providers");
  return ctx;
}

export function Providers({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  // -------- Auth: load session + listen for changes
  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setAuthUser(data.user);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // -------- Load wishlist when user logs in
  useEffect(() => {
    if (!authUser) {
      setWishlist([]);
      return;
    }
    supabase
      .from("wishlists")
      .select("product_id")
      .eq("user_id", authUser.id)
      .then(({ data }) => {
        if (data) setWishlist(data.map((w) => w.product_id));
      });
  }, [authUser, supabase]);

  // -------- Toasts
  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { ...t, id }]);
      const dur = t.duration ?? 3800;
      setTimeout(() => dismissToast(id), dur);
    },
    [dismissToast]
  );

  // -------- Cart
  const addToCart = useCallback(
    (product: Product, qty = 1) => {
      setCart((prev) => {
        const existing = prev.find((l) => l.id === product.id);
        if (existing)
          return prev.map((l) =>
            l.id === product.id ? { ...l, qty: l.qty + qty } : l
          );
        return [
          ...prev,
          {
            id: product.id,
            qty,
            price: product.price,
            name: product.name,
            image: product.image,
          },
        ];
      });
      toast({
        title: "Added to cart",
        description: product.name,
        variant: "success",
      });
    },
    [toast]
  );

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      prev.map((l) => (l.id === id ? { ...l, qty: Math.max(1, qty) } : l))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // -------- Wishlist (persist to Supabase if logged in)
  const toggleWishlist = useCallback(
    async (productId: string) => {
      const has = wishlist.includes(productId);

      setWishlist((prev) =>
        has ? prev.filter((x) => x !== productId) : [...prev, productId]
      );

      toast({
        title: has ? "Removed from wishlist" : "Added to wishlist",
        variant: has ? "default" : "success",
      });

      if (!authUser) return;

      if (has) {
        await supabase
          .from("wishlists")
          .delete()
          .eq("user_id", authUser.id)
          .eq("product_id", productId);
      } else {
        await supabase
          .from("wishlists")
          .insert({ user_id: authUser.id, product_id: productId });
      }
    },
    [wishlist, authUser, supabase, toast]
  );

  // -------- Logout
  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setCart([]);
    setWishlist([]);
    toast({ title: "Signed out", variant: "default" });
  }, [supabase, toast]);

  // -------- Totals
  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  const cartTotals = useMemo(() => {
    const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0);
    const discount = Math.round(subtotal * 0.05);
    const delivery = subtotal > 5000 || subtotal === 0 ? 0 : 80;
    return { subtotal, discount, delivery, total: subtotal - discount + delivery };
  }, [cart]);

  // -------- Derived display user
  const user: DisplayUser | null = authUser
    ? {
        id: authUser.id,
        name:
          authUser.user_metadata?.name ??
          authUser.user_metadata?.full_name ??
          authUser.email?.split("@")[0] ??
          "User",
        email: authUser.email ?? "",
        avatar:
          authUser.user_metadata?.avatar_url ??
          authUser.user_metadata?.picture ??
          `https://picsum.photos/seed/${authUser.id}/80/80`,
      }
    : null;

  const value: Ctx = {
    cart,
    cartCount,
    cartOpen,
    setCartOpen,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    wishlist,
    toggleWishlist,
    toasts,
    toast,
    dismissToast,
    user,
    authUser,
    authLoading,
    logout,
    cartTotals,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}