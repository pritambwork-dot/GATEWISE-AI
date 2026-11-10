import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AssignedGate } from '../types';
import { AuthService } from '../services/auth.service';
import { apiClient } from '../services/api-client';
import { DEFAULT_ASSIGNED_GATE } from '../services/fixtures';

interface AuthContextType {
  user: UserProfile | null;
  assignedGate: AssignedGate;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOffline: boolean;
  demoMode: boolean;
  login: (employeeId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [assignedGate, setAssignedGate] = useState<AssignedGate>(DEFAULT_ASSIGNED_GATE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);

  useEffect(() => {
    async function restoreSession() {
      try {
        const session = await AuthService.getStoredSession();
        if (session) {
          setUser(session.user);
          setAssignedGate(session.assignedGate || DEFAULT_ASSIGNED_GATE);
        }
      } catch {
        setIsOffline(true);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = async (employeeId: string, password: string) => {
    setIsLoading(true);
    try {
      const session = await AuthService.login(employeeId, password);
      setUser(session.user);
      setAssignedGate(session.assignedGate || DEFAULT_ASSIGNED_GATE);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDemoMode = () => {
    const nextState = !demoMode;
    setDemoMode(nextState);
    apiClient.setDemoMode(nextState);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        assignedGate,
        isLoading,
        isAuthenticated: !!user,
        isOffline,
        demoMode,
        login,
        logout,
        toggleDemoMode,
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
