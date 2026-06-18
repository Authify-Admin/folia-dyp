'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '@/lib/types';

export interface CartItem extends Product {
  cartQuantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string, weight?: string) => void;
  updateQuantity: (productId: string, quantity: number, weight?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error restoring cart:', error);
    }
    setHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes — but never before the
  // initial load has run, or the empty initial state clobbers the saved cart.
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart, hydrated]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      // For products with variants, check both id AND weight (size)
      // For products without variants, check only id
      const existingItem = prevCart.find((item) =>
        item.id === product.id && item.weight === product.weight
      );

      if (existingItem) {
        // Update quantity if item already exists (same product and same size)
        return prevCart.map((item) =>
          item.id === product.id && item.weight === product.weight
            ? { ...item, cartQuantity: Math.min(item.cartQuantity + quantity, product.quantity) }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevCart, { ...product, cartQuantity: quantity }];
      }
    });
  };

  const removeFromCart = (productId: string, weight?: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) =>
        weight ? !(item.id === productId && item.weight === weight) : item.id !== productId
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, weight?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, weight);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        weight
          ? item.id === productId && item.weight === weight
            ? { ...item, cartQuantity: Math.min(quantity, item.quantity) }
            : item
          : item.id === productId
          ? { ...item, cartQuantity: Math.min(quantity, item.quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.cartQuantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.cartQuantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
