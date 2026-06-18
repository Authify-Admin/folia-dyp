// Simple localStorage-based database utilities
// In production, this should be replaced with a real database like PostgreSQL, MongoDB, etc.

import type { Product, Order } from './types';

export const db = {
  // Product operations
  products: {
    getAll: (): Product[] => {
      if (typeof window === 'undefined') return [];
      const data = localStorage.getItem('products');
      return data ? JSON.parse(data) : [];
    },

    getById: (id: string): Product | null => {
      const products = db.products.getAll();
      return products.find(p => p.id === id) || null;
    },

    create: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const products = db.products.getAll();
      products.push(newProduct);
      localStorage.setItem('products', JSON.stringify(products));
      return newProduct;
    },

    update: (id: string, updates: Partial<Product>): Product | null => {
      const products = db.products.getAll();
      const index = products.findIndex(p => p.id === id);
      if (index === -1) return null;

      products[index] = {
        ...products[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('products', JSON.stringify(products));
      return products[index];
    },

    delete: (id: string): boolean => {
      const products = db.products.getAll();
      const filtered = products.filter(p => p.id !== id);
      if (filtered.length === products.length) return false;
      localStorage.setItem('products', JSON.stringify(filtered));
      return true;
    },

    updateQuantity: (id: string, quantity: number): Product | null => {
      return db.products.update(id, { quantity });
    },
  },

  // Order operations
  orders: {
    getAll: (): Order[] => {
      if (typeof window === 'undefined') return [];
      const data = localStorage.getItem('orders');
      return data ? JSON.parse(data) : [];
    },

    getById: (id: string): Order | null => {
      const orders = db.orders.getAll();
      return orders.find(o => o.id === id) || null;
    },

    create: (order: Omit<Order, 'id' | 'createdAt'>): Order => {
      const newOrder: Order = {
        ...order,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const orders = db.orders.getAll();
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));

      // Update product quantities
      newOrder.items.forEach(item => {
        const product = db.products.getById(item.productId);
        if (product) {
          db.products.updateQuantity(
            item.productId,
            Math.max(0, product.quantity - item.quantity)
          );
        }
      });

      return newOrder;
    },

    updateStatus: (id: string, status: Order['status']): Order | null => {
      const orders = db.orders.getAll();
      const index = orders.findIndex(o => o.id === id);
      if (index === -1) return null;

      orders[index] = {
        ...orders[index],
        status,
      };
      localStorage.setItem('orders', JSON.stringify(orders));
      return orders[index];
    },

    delete: (id: string): boolean => {
      const orders = db.orders.getAll();
      const filtered = orders.filter(o => o.id !== id);
      if (filtered.length === orders.length) return false;
      localStorage.setItem('orders', JSON.stringify(filtered));
      return true;
    },
  },
};
