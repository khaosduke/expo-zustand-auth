import { createContext, useContext } from 'react';
/*
export type AuthData = {
  claims?: Record<string, any> | null
  hasSession: boolean
  isLoading: boolean
  isLoggedIn: boolean
}

export const AuthContext = createContext<AuthData>({
  claims: undefined,
  hasSession: false,
  isLoading: true,
  isLoggedIn: false,
})

export const useAuthContext = () => useContext(AuthContext)
*/

// src/context/AuthContext.tsx
export type AuthContextValue = {
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}