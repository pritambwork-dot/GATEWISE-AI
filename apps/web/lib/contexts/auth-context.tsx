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

      // Check for Guard Session: Guards MUST NEVER be given Admin clearance
      if (sessionStorage.getItem('gatewise_guard_auth') === 'true' && !localStorage.getItem('gatewise_admin_token')) {
        const guardRaw = sessionStorage.getItem('gatewise_guard_session');
        let guardData: any = null;
        try { guardData = guardRaw ? JSON.parse(guardRaw) : null; } catch {}
        setUser({
          id: guardData?.guardId || 'GRD-101',
          employee_id: guardData?.badgeNumber || 'GRD-101',
          email: guardData?.email || 'grd101@iimsambalpur.ac.in',
          full_name: guardData?.guardName || 'Officer Vikram Singh',
          role: 'SECURITY_GUARD',
          account_status: 'ACTIVE',
          mfa_enabled: false
        });
        setIsLoading(false);
        return;
      }

      const storedToken = localStorage.getItem('gatewise_admin_token');
      const storedUser = localStorage.getItem('gatewise_admin_user');

      if (storedToken) {
        api.setToken(storedToken);
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {}
        }
        try {
          const freshUser = await api.getMe();
          if ((freshUser.role as string) === 'GUARD' || freshUser.role === 'SECURITY_GUARD') {
            localStorage.removeItem('gatewise_admin_token');
            localStorage.removeItem('gatewise_admin_user');
            setUser(freshUser);
            setToken(null);
          } else {
            setUser(freshUser);
            localStorage.setItem('gatewise_admin_user', JSON.stringify(freshUser));
          }
        } catch {
          localStorage.removeItem('gatewise_admin_token');
          localStorage.removeItem('gatewise_admin_user');
          api.setToken(null);
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
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
