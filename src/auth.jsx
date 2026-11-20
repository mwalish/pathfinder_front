import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api';
import { TOKEN_KEY } from './config';

const KEY = 'user'; // same localStorage key the old app used
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const load = () => {
  try { return localStorage.getItem(TOKEN_KEY) ? JSON.parse(localStorage.getItem(KEY)) : null; } catch { return null; }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(load);

  const login = useCallback((u, token) => {
    api.clearCache(); // never show the previous person's cached data
    localStorage.setItem(KEY, JSON.stringify(u));
    localStorage.setItem(TOKEN_KEY, token);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    api.clearCache();
    localStorage.removeItem(KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  // the API said our token is invalid or expired
  useEffect(() => {
    window.addEventListener('auth:expired', logout);
    return () => window.removeEventListener('auth:expired', logout);
  }, [logout]);

  const value = useMemo(() => ({ user, login, logout, isAdmin: user?.role === 'admin' }), [user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
