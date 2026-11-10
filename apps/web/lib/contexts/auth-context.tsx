'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '../../types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (employeeId: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function initAuth() {
      if (typeof window === 'undefined') return;
      const storedToken = localStorage.getItem('gatewise_admin_token');
      const storedUser = localStorage.getItem('gatewise_admin_user');

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setToken(storedToken);
          api.setToken(storedToken);

          // Verify session freshness with backend
          api.getMe().then((freshUser) => {
            setUser(freshUser);
            localStorage.setItem('gatewise_admin_user', JSON.stringify(freshUser));
          }).catch(() => {
            // If token expired, clear session
            localStorage.removeItem('gatewise_admin_token');
            localStorage.removeItem('gatewise_admin_user');
            setUser(null);
            setToken(null);
            api.setToken(null);
          });
        } catch {
          localStorage.removeItem('gatewise_admin_token');
          localStorage.removeItem('gatewise_admin_user');
        }
      } else {
        // Seed default Admin session for immediate review if none stored
        const defaultAdmin: UserProfile = {
          id: 'user-admin-001',
          employee_id: 'ADM-001',
          email: 'admin.security@iimsambalpur.ac.in',
          full_name: 'Dr. Rajesh Iyer',
          role: 'ADMIN',
          account_status: 'ACTIVE',
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          mfa_enabled: true
        };
        setUser(defaultAdmin);
      }
      setIsLoading(false);
    }

    initAuth();
  }, []);

  const login = async (employeeId: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(employeeId, pass);
      setUser(res.user);
      setToken(res.access_token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logout();
      setUser(null);
      setToken(null);
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin,
        isSuperAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
