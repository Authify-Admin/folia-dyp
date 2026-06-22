import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  Timestamp,
  writeBatch,
  deleteField,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Product, Order, User, OTPSession, ReturnRequest, Coupon } from './types';

// Collections
export const productsCollection = collection(db, 'products');
export const ordersCollection = collection(db, 'orders');
export const usersCollection = collection(db, 'users');
export const otpSessionsCollection = collection(db, 'otpSessions');
export const returnRequestsCollection = collection(db, 'returnRequests');
export const couponsCollection = collection(db, 'coupons');

// Product Operations
export const productOperations = {
  // Get all products
  async getAll(): Promise<Product[]> {
    try {
      const q = query(productsCollection, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  // Get single product
  async getById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Create product
  async create(product: Omit<Product, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(productsCollection, {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  async update(id: string, updates: Partial<Product>): Promise<void> {
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Update quantity (for order processing)
  async updateQuantity(id: string, newQuantity: number): Promise<void> {
    try {
      const docRef = doc(db, 'products', id);
      await updateDoc(docRef, {
        quantity: newQuantity,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  },
};

// Order Operations
export const orderOperations = {
  // Get all orders
  async getAll(): Promise<Order[]> {
    try {
      const q = query(ordersCollection, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  },

  // Get single order
  async getById(id: string): Promise<Order | null> {
    try {
      const docRef = doc(db, 'orders', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Order;
      }
      return null;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  },

  // Create order with product quantity reduction
  async create(order: Omit<Order, 'id'>): Promise<string> {
    try {
      console.log('🔄 Starting order creation in Firestore...');
      console.log('📦 Order items:', order.items.length);

      // Use batch write to ensure atomic operations
      const batch = writeBatch(db);

      // Add the order
      const orderRef = doc(ordersCollection);
      console.log('📝 Order document ID will be:', orderRef.id);

      batch.set(orderRef, {
        ...order,
        createdAt: new Date().toISOString(),
      });

      console.log('✅ Order added to batch');

      // Update product quantities
      for (const item of order.items) {
        console.log(`🔍 Checking product ${item.productId} (${item.productName})`);
        const productRef = doc(db, 'products', item.productId);

        try {
          const productSnap = await getDoc(productRef);

          if (productSnap.exists()) {
            const productData = productSnap.data();

            // Check if this product has variants and an item size is specified
            if (productData.hasVariants && productData.variants && item.size) {
              console.log(`📦 Product has variants. Looking for size: ${item.size}`);

              // Update the specific variant's quantity
              const updatedVariants = productData.variants.map((variant: any) => {
                if (variant.size === item.size) {
                  const newQuantity = Math.max(0, variant.quantity - item.quantity);
                  console.log(`📊 Variant ${variant.size}: ${variant.quantity} → ${newQuantity}`);
                  return { ...variant, quantity: newQuantity };
                }
                return variant;
              });

              // Calculate total quantity from all variants
              const totalQuantity = updatedVariants.reduce((sum: number, v: any) => sum + v.quantity, 0);
              console.log(`📊 Total product quantity: ${productData.quantity} → ${totalQuantity}`);

              batch.update(productRef, {
                variants: updatedVariants,
                quantity: totalQuantity, // Update the main quantity field
                updatedAt: new Date().toISOString(),
              });
            } else {
              // Product without variants - update main quantity
              const currentQuantity = productData.quantity;
              const newQuantity = Math.max(0, currentQuantity - item.quantity);
              console.log(`📊 Product ${item.productName}: ${currentQuantity} → ${newQuantity}`);

              batch.update(productRef, {
                quantity: newQuantity,
                updatedAt: new Date().toISOString(),
              });
            }
          } else {
            console.warn(`⚠️ Product ${item.productId} not found, skipping quantity update`);
          }
        } catch (productError) {
          console.error(`❌ Error fetching product ${item.productId}:`, productError);
          // Continue with other products even if one fails
        }
      }

      console.log('💾 Committing batch write...');
      await batch.commit();
      console.log('✅ Batch committed successfully!');

      return orderRef.id;
    } catch (error) {
      console.error('❌ Error creating order in Firestore:', error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw error;
    }
  },

  // Update order status
  async updateStatus(id: string, status: Order['status']): Promise<void> {
    try {
      const docRef = doc(db, 'orders', id);
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Delete order
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'orders', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },

  // Get orders by user ID
  async getByUserId(userId: string): Promise<Order[]> {
    try {
      const q = query(
        ordersCollection,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return [];
    }
  },

  // Link orders by email to user account
  async linkOrdersByEmail(email: string, userId: string): Promise<number> {
    try {
      console.log('🔗 Linking orders for email:', email, 'to user:', userId);

      // Find all orders with this email that don't have a userId
      const allOrders = await this.getAll();
      const unlinkedOrders = allOrders.filter(
        (order) =>
          order.customerEmail === email &&
          (!order.userId || order.userId === undefined)
      );

      console.log('📦 Found', unlinkedOrders.length, 'unlinked orders to link');

      if (unlinkedOrders.length === 0) {
        return 0;
      }

      // Use batch to update all orders
      const batch = writeBatch(db);

      for (const order of unlinkedOrders) {
        const orderRef = doc(db, 'orders', order.id);
        batch.update(orderRef, { userId });
      }

      await batch.commit();
      console.log('✅ Successfully linked', unlinkedOrders.length, 'orders to user account');

      return unlinkedOrders.length;
    } catch (error) {
      console.error('❌ Error linking orders by email:', error);
      return 0;
    }
  },
};

// User Operations
export const userOperations = {
  // Get user by email
  async getByEmail(email: string): Promise<User | null> {
    try {
      const q = query(usersCollection, where('email', '==', email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      const userDoc = snapshot.docs[0];
      return {
        id: userDoc.id,
        ...userDoc.data(),
      } as User;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  },

  // Get user by phone number (E.164, e.g. +919008627070) — used by SMS OTP login
  async getByPhone(phone: string): Promise<User | null> {
    try {
      const q = query(usersCollection, where('phone', '==', phone));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      const userDoc = snapshot.docs[0];
      return {
        id: userDoc.id,
        ...userDoc.data(),
      } as User;
    } catch (error) {
      console.error('Error fetching user by phone:', error);
      return null;
    }
  },

  // Get user by ID
  async getById(id: string): Promise<User | null> {
    try {
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  // Create user
  async create(user: Omit<User, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(usersCollection, {
        ...user,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  async update(id: string, updates: Partial<User>): Promise<void> {
    try {
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Update last login
  async updateLastLogin(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'users', id);
      await updateDoc(docRef, {
        lastLogin: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  },
};

// OTP Session Operations
export const otpOperations = {
  // Create OTP session
  async create(session: Omit<OTPSession, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(otpSessionsCollection, {
        ...session,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating OTP session:', error);
      throw error;
    }
  },

  // Get OTP session by email
  async getByEmail(email: string): Promise<OTPSession | null> {
    try {
      const q = query(
        otpSessionsCollection,
        where('email', '==', email),
        where('verified', '==', false),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return null;
      }

      const otpDoc = snapshot.docs[0];
      return {
        id: otpDoc.id,
        ...otpDoc.data(),
      } as OTPSession;
    } catch (error) {
      console.error('Error fetching OTP session:', error);
      return null;
    }
  },

  // Mark OTP as verified
  async markVerified(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'otpSessions', id);
      await updateDoc(docRef, { verified: true });
    } catch (error) {
      console.error('Error marking OTP verified:', error);
      throw error;
    }
  },

  // Delete expired OTP sessions
  async deleteExpired(): Promise<void> {
    try {
      const now = Date.now();
      const q = query(otpSessionsCollection, where('expiresAt', '<', now));
      const snapshot = await getDocs(q);

      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
    } catch (error) {
      console.error('Error deleting expired OTP sessions:', error);
    }
  },
};

// Return Request Operations
export const returnRequestOperations = {
  // Get all return requests
  async getAll(): Promise<ReturnRequest[]> {
    try {
      const q = query(returnRequestsCollection, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ReturnRequest[];
    } catch (error) {
      console.error('Error fetching return requests:', error);
      return [];
    }
  },

  // Get return request by ID
  async getById(id: string): Promise<ReturnRequest | null> {
    try {
      const docRef = doc(db, 'returnRequests', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as ReturnRequest;
      }
      return null;
    } catch (error) {
      console.error('Error fetching return request:', error);
      return null;
    }
  },

  // Get return requests by order ID
  async getByOrderId(orderId: string): Promise<ReturnRequest[]> {
    try {
      const q = query(
        returnRequestsCollection,
        where('orderId', '==', orderId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ReturnRequest[];
    } catch (error) {
      console.error('Error fetching return requests by order:', error);
      return [];
    }
  },

  // Get return requests by status
  async getByStatus(status: ReturnRequest['status']): Promise<ReturnRequest[]> {
    try {
      const q = query(
        returnRequestsCollection,
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ReturnRequest[];
    } catch (error) {
      console.error('Error fetching return requests by status:', error);
      return [];
    }
  },

  // Create return request
  async create(request: Omit<ReturnRequest, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(returnRequestsCollection, {
        ...request,
        createdAt: new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating return request:', error);
      throw error;
    }
  },

  // Update return request status
  async updateStatus(
    id: string,
    status: ReturnRequest['status'],
    adminNotes?: string
  ): Promise<void> {
    try {
      const docRef = doc(db, 'returnRequests', id);
      const updates: any = {
        status,
      };

      if (status !== 'pending') {
        updates.resolvedAt = new Date().toISOString();
      }

      if (adminNotes) {
        updates.adminNotes = adminNotes;
      }

      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating return request status:', error);
      throw error;
    }
  },

  // Delete return request
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'returnRequests', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting return request:', error);
      throw error;
    }
  },
};

// Coupon Operations
export const couponOperations = {
  // Get all coupons
  async getAll(): Promise<Coupon[]> {
    try {
      const q = query(couponsCollection, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Coupon[];
    } catch (error) {
      console.error('Error fetching coupons:', error);
      return [];
    }
  },

  // Get single coupon by ID
  async getById(id: string): Promise<Coupon | null> {
    try {
      const docRef = doc(db, 'coupons', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Coupon;
      }
      return null;
    } catch (error) {
      console.error('Error fetching coupon:', error);
      return null;
    }
  },

  // Get coupon by code
  async getByCode(code: string): Promise<Coupon | null> {
    try {
      const q = query(couponsCollection, where('code', '==', code.toUpperCase()));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
        } as Coupon;
      }
      return null;
    } catch (error) {
      console.error('Error fetching coupon by code:', error);
      return null;
    }
  },

  // Create new coupon
  async create(coupon: Omit<Coupon, 'id'>): Promise<string> {
    try {
      // Remove undefined values from the coupon object
      const cleanCoupon: any = {
        code: coupon.code.toUpperCase(),
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        usageLimit: coupon.usageLimit,
        usedCount: coupon.usedCount,
        isActive: coupon.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Only add optional fields if they have values
      if (coupon.minOrderValue !== undefined && coupon.minOrderValue !== null) {
        cleanCoupon.minOrderValue = coupon.minOrderValue;
      }
      if (coupon.maxDiscount !== undefined && coupon.maxDiscount !== null) {
        cleanCoupon.maxDiscount = coupon.maxDiscount;
      }
      if (coupon.expiresAt !== undefined && coupon.expiresAt !== null && coupon.expiresAt !== '') {
        cleanCoupon.expiresAt = coupon.expiresAt;
      }
      // Persist the first-time-users restriction (was silently dropped before).
      if (coupon.firstTimeUsersOnly !== undefined) {
        cleanCoupon.firstTimeUsersOnly = coupon.firstTimeUsersOnly;
      }

      const docRef = await addDoc(couponsCollection, cleanCoupon);
      return docRef.id;
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
  },

  // Update coupon
  async update(id: string, updates: Partial<Coupon>): Promise<void> {
    try {
      const docRef = doc(db, 'coupons', id);

      // Remove undefined values from updates
      const cleanUpdates: any = {
        updatedAt: new Date().toISOString(),
      };

      // Only add fields that have values
      if (updates.code !== undefined) cleanUpdates.code = updates.code.toUpperCase();
      if (updates.discountType !== undefined) cleanUpdates.discountType = updates.discountType;
      if (updates.discountValue !== undefined) cleanUpdates.discountValue = updates.discountValue;
      if (updates.usageLimit !== undefined) cleanUpdates.usageLimit = updates.usageLimit;
      if (updates.usedCount !== undefined) cleanUpdates.usedCount = updates.usedCount;
      if (updates.isActive !== undefined) cleanUpdates.isActive = updates.isActive;
      if (updates.firstTimeUsersOnly !== undefined) {
        cleanUpdates.firstTimeUsersOnly = updates.firstTimeUsersOnly;
      }

      // For optional numeric/date fields, a present-but-empty value means
      // "clear it" — use deleteField() so the old value doesn't linger.
      const clearable: (keyof Coupon)[] = ['minOrderValue', 'maxDiscount', 'expiresAt'];
      for (const key of clearable) {
        if (!(key in updates)) continue; // untouched
        const value = updates[key];
        if (value === undefined || value === null || value === '') {
          cleanUpdates[key] = deleteField();
        } else {
          cleanUpdates[key] = value;
        }
      }

      await updateDoc(docRef, cleanUpdates);
    } catch (error) {
      console.error('Error updating coupon:', error);
      throw error;
    }
  },

  // Delete coupon
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'coupons', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting coupon:', error);
      throw error;
    }
  },

  // Increment usage count
  async incrementUsage(id: string): Promise<void> {
    try {
      const coupon = await this.getById(id);
      if (coupon) {
        const docRef = doc(db, 'coupons', id);
        await updateDoc(docRef, {
          usedCount: coupon.usedCount + 1,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error incrementing coupon usage:', error);
      throw error;
    }
  },

  // Validate coupon. Pass customerEmail to enforce first-time-only coupons.
  async validate(
    code: string,
    orderTotal: number,
    customerEmail?: string
  ): Promise<{ valid: boolean; message?: string; coupon?: Coupon }> {
    try {
      const coupon = await this.getByCode(code);

      if (!coupon) {
        return { valid: false, message: 'Invalid coupon code' };
      }

      if (!coupon.isActive) {
        return { valid: false, message: 'This coupon is no longer active' };
      }

      // Check expiration
      if (coupon.expiresAt) {
        const expiryDate = new Date(coupon.expiresAt);
        if (expiryDate < new Date()) {
          return { valid: false, message: 'This coupon has expired' };
        }
      }

      // Check usage limit
      if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        return { valid: false, message: 'This coupon has reached its usage limit' };
      }

      // Check minimum order value
      if (coupon.minOrderValue && orderTotal < coupon.minOrderValue) {
        return {
          valid: false,
          message: `Minimum order value of ₹${coupon.minOrderValue} required`
        };
      }

      // Enforce first-time-users-only when we know who the customer is.
      // (Best-effort by email; the authoritative check runs server-side at
      // pay time where the email is always present.)
      if (coupon.firstTimeUsersOnly && customerEmail) {
        const email = customerEmail.trim().toLowerCase();
        const prior = await getDocs(
          query(ordersCollection, where('customerEmail', '==', email), limit(1))
        );
        // Also try the email exactly as entered, since older orders may not be
        // normalized to lowercase.
        const priorRaw = prior.empty
          ? await getDocs(
              query(ordersCollection, where('customerEmail', '==', customerEmail.trim()), limit(1))
            )
          : prior;
        if (!priorRaw.empty) {
          return {
            valid: false,
            message: 'This code is valid for first-time customers only',
          };
        }
      }

      return { valid: true, coupon };
    } catch (error) {
      console.error('Error validating coupon:', error);
      return { valid: false, message: 'Error validating coupon' };
    }
  },
};
