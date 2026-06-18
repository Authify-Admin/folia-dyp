'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { userOperations } from '@/lib/firestore';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const loadUser = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const userData = await userOperations.getById(userId);
          if (userData) {
            setUser(userData);
            // Update last login
            await userOperations.updateLastLogin(userId);
          } else {
            // User not found, clear localStorage
            localStorage.removeItem('userId');
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('userId', userData.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userId');
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      await userOperations.update(user.id, updates);
      setUser({ ...user, ...updates });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
