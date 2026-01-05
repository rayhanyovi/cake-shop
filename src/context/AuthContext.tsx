"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
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
const AUTH_EVENT = "auth:changed";
let authCacheRaw: string | null = null;
let authCache: AuthPayload | null = null;

const isTokenValid = (expiresAt: string | null) => {
  if (!expiresAt) return false;
  const expiry = Date.parse(expiresAt);
  if (Number.isNaN(expiry)) return false;
  return Date.now() < expiry;
};

const readAuthSnapshot = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === authCacheRaw) return authCache;

  authCacheRaw = raw;
  if (!raw) {
    authCache = null;
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthPayload;
    if (
      parsed?.accessToken &&
      parsed?.expiresAt &&
      isTokenValid(parsed.expiresAt)
    ) {
      authCache = parsed;
      return authCache;
    }
  } catch {
    authCache = null;
    return null;
  }

  authCache = null;
  return null;
};

const subscribeAuth = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("storage", handler);
  window.addEventListener(AUTH_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(AUTH_EVENT, handler);
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useSyncExternalStore(subscribeAuth, readAuthSnapshot, () => null);

  const setAuth = useCallback((payload: AuthPayload) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new Event(AUTH_EVENT));
  }, []);

  const clearAuth = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(AUTH_EVENT));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken: auth?.accessToken ?? null,
      expiresAt: auth?.expiresAt ?? null,
      isAuth: isTokenValid(auth?.expiresAt ?? null),
      setAuth,
      clearAuth,
    }),
    [auth, setAuth, clearAuth],
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
