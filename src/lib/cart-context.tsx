"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartLine } from "@/lib/types";

const STORAGE_KEY = "feelings-cart-v1";

interface CartContextValue {
  lines: CartLine[];
  itemCount: number;
  addLine: (line: Omit<CartLine, "key"> & { key?: string }) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  subtotal: number | undefined;
}

const CartContext = createContext<CartContextValue | null>(null);

function makeKey(line: Omit<CartLine, "key">): string {
  return [
    line.productId,
    line.colourVariantId ?? "no-colour",
    line.cutOptionId ?? "no-cut",
  ].join("::");
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addLine = useCallback(
    (incoming: Omit<CartLine, "key"> & { key?: string }) => {
      const key = incoming.key ?? makeKey(incoming);
      setLines((prev) => {
        const existing = prev.find((l) => l.key === key);
        if (existing) {
          return prev.map((l) =>
            l.key === key
              ? { ...l, quantity: l.quantity + incoming.quantity }
              : l,
          );
        }
        return [...prev, { ...incoming, key }];
      });
    },
    [],
  );

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setLines((prev) =>
      prev
        .map((l) => (l.key === key ? { ...l, quantity } : l))
        .filter((l) => l.quantity > 0),
    );
  }, []);

  const removeLine = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  );

  const subtotal = useMemo(() => {
    if (lines.length === 0) return undefined;
    if (lines.some((l) => l.unitPrice === undefined)) return undefined;
    return lines.reduce(
      (sum, l) => sum + (l.unitPrice ?? 0) * l.quantity,
      0,
    );
  }, [lines]);

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      addLine,
      updateQuantity,
      removeLine,
      clearCart,
      subtotal,
    }),
    [
      lines,
      itemCount,
      addLine,
      updateQuantity,
      removeLine,
      clearCart,
      subtotal,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
