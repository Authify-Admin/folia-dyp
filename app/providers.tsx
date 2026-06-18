"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { CartUIProvider } from "@/contexts/CartUIContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <CartUIProvider>{children}</CartUIProvider>
      </CartProvider>
    </AuthProvider>
  );
}
