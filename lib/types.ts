export interface ProductVariant {
  size: string; // e.g., "1kg", "500g", "100g"
  price: number;
  quantity: number;
}

export interface ProductAnalytics {
  clicks: number; // Number of times product was clicked/viewed
  addedToCart: number; // Number of times product was added to cart
  conversions: number; // Number of times product was purchased (completed payment)
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string; // Primary image (for backward compatibility)
  images: string[]; // Array of image URLs with ordering
  price: number;
  weight: string;
  quantity: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  variants?: ProductVariant[]; // Optional: for products with multiple size options
  hasVariants?: boolean; // Flag to indicate if product uses variants
  analytics?: ProductAnalytics; // Analytics data for A/B testing
}

export interface Order {
  id: string;
  orderId: string;
  userId?: string; // Optional: links order to user account
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
  paymentMethod?: 'razorpay' | 'cod'; // How the customer paid
  paymentId?: string; // Razorpay payment id, for paid orders
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size?: string; // For products with variants (e.g., "1kg", "2kg")
}

export interface User {
  id: string;
  email: string;
  password: string; // Hashed password
  name: string;
  phone?: string;
  createdAt: string;
  lastLogin: string;
}

export interface OTPSession {
  id: string;
  email: string;
  otp: string;
  expiresAt: number;
  verified: boolean;
  createdAt: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  reason: string;
  description: string;
  images?: string[]; // Array of image URLs uploaded by customer
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  resolvedAt?: string;
  adminNotes?: string;
}

export interface Coupon {
  id: string;
  code: string; // Coupon code (e.g., "SUMMER20", "FIRST50")
  discountType: 'percentage' | 'fixed'; // Percentage off or fixed amount off
  discountValue: number; // Percentage (e.g., 20 for 20%) or fixed amount (e.g., 100 for ₹100)
  minOrderValue?: number; // Minimum order value required to use coupon (optional)
  maxDiscount?: number; // Maximum discount amount for percentage coupons (optional)
  usageLimit: number | null; // null = unlimited, number = limited uses
  usedCount: number; // How many times the coupon has been used
  isActive: boolean; // Whether the coupon is currently active
  firstTimeUsersOnly?: boolean; // If true, coupon is valid only for first-time customers (no prior orders)
  expiresAt?: string; // Optional expiration date
  createdAt: string;
  updatedAt: string;
}
