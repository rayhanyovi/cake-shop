"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

type CartAnchorContextValue = {
  anchorEl: HTMLElement | null;
  registerAnchor: (element: HTMLElement | null) => void;
};

const CartAnchorContext = createContext<CartAnchorContextValue | null>(null);

export function CartAnchorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const registerAnchor = useCallback((element: HTMLElement | null) => {
    setAnchorEl(element);
  }, []);
  const value = useMemo(
    () => ({ anchorEl, registerAnchor }),
    [anchorEl, registerAnchor]
  );

  return (
    <CartAnchorContext.Provider value={value}>
      {children}
    </CartAnchorContext.Provider>
  );
}

export function useCartAnchor() {
  const context = useContext(CartAnchorContext);
  if (!context) {
    throw new Error("CartAnchorContext is missing in the component tree.");
  }
  return context;
}
