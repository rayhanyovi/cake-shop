"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthPayload = {
  accessToken: string;
  expiresAt: string;
};

type AuthContextValue = {
  accessToken: string | null;
  expiresAt: string | null;
  isAuth: boolean;
  setAuth: (payload: AuthPayload) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "auth_state";

const isTokenValid = (expiresAt: string | null) => {
  if (!expiresAt) return false;
  const expiry = Date.parse(expiresAt);
  if (Number.isNaN(expiry)) return false;
  return Date.now() < expiry;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as AuthPayload;
      if (parsed?.accessToken && parsed?.expiresAt && isTokenValid(parsed.expiresAt)) {
        setAccessToken(parsed.accessToken);
        setExpiresAt(parsed.expiresAt);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const setAuth = useCallback((payload: AuthPayload) => {
    setAccessToken(payload.accessToken);
    setExpiresAt(payload.expiresAt);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, []);

  const clearAuth = useCallback(() => {
    setAccessToken(null);
    setExpiresAt(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      expiresAt,
      isAuth: isTokenValid(expiresAt),
      setAuth,
      clearAuth,
    }),
    [accessToken, expiresAt, setAuth, clearAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
