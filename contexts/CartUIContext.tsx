"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

interface CartUIContextType {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartUIContext = createContext<CartUIContextType | undefined>(undefined);

/** Global open/close state for the slide-over cart drawer. */
export function CartUIProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  return (
    <CartUIContext.Provider value={{ cartOpen, openCart, closeCart }}>
      {children}
    </CartUIContext.Provider>
  );
}

export function useCartUI() {
  const context = useContext(CartUIContext);
  if (context === undefined) {
    throw new Error("useCartUI must be used within a CartUIProvider");
  }
  return context;
}
