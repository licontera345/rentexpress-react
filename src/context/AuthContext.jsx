import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authService, setAuthToken, setOnUnauthorized } from '../api/index.js';
import { STORAGE_KEYS, USER_ROLES } from '../constants/index.js';

const AuthContext = createContext(null);

function getStoredSession() {
  if (typeof window === 'undefined') return { user: null, token: null };
  const tokenKeys = [STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.LEGACY_AUTH_TOKEN];
  const userKeys = [STORAGE_KEYS.USER_DATA, STORAGE_KEYS.LEGACY_USER_DATA, STORAGE_KEYS.LEGACY_USER_DATA_ALT];
  let token = null;
  let user = null;
  for (const key of tokenKeys) {
    token = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (token) break;
  }
  for (const key of userKeys) {
    const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
    if (raw) {
      try {
        user = JSON.parse(raw);
        break;
      } catch {
        /**/
      }
    }
  }
  return { user: user ?? null, token: token?.trim() || null };
}

function sessionUserFromResponse(data, role) {
  const raw = data?.user ?? data?.employee ?? data ?? {};
  const roleName = (raw.roleName ?? raw.role?.roleName ?? '').toString().toUpperCase();
  let appRole = role ?? USER_ROLES.CUSTOMER;
  if (roleName === 'ADMIN') appRole = USER_ROLES.ADMIN;
  else if (roleName === 'EMPLOYEE') appRole = USER_ROLES.EMPLOYEE;
  else if (roleName === 'CLIENT') appRole = USER_ROLES.CUSTOMER;
  return {
    ...raw,
    role: appRole,
    username: raw.username ?? raw.employeeName ?? '',
  };
}

const keysToClear = [
  STORAGE_KEYS.AUTH_TOKEN,
  STORAGE_KEYS.USER_DATA,
  STORAGE_KEYS.LEGACY_AUTH_TOKEN,
  STORAGE_KEYS.LEGACY_USER_DATA,
  STORAGE_KEYS.LEGACY_USER_DATA_ALT,
];

export function AuthProvider({ children }) {
  const stored = getStoredSession();
  const [user, setUser] = useState(stored.user);
  const [token, setToken] = useState(stored.token);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    setSessionReady(true);
  }, []);

  const persistSession = useCallback((nextUser, nextToken, rememberMe = false) => {
    keysToClear.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    if (!nextUser || !nextToken) return;
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEYS.AUTH_TOKEN, nextToken);
    storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(nextUser));
  }, []);

  const setSession = useCallback((nextUser, nextToken, rememberMe) => {
    setUser(nextUser ?? null);
    setToken(nextToken ?? null);
    persistSession(nextUser, nextToken, rememberMe);
  }, [persistSession]);

  const login = useCallback(async (username, password, role = USER_ROLES.CUSTOMER, rememberMe = false) => {
    const isEmployee = role === USER_ROLES.EMPLOYEE;
    const result = isEmployee
      ? await authService.loginEmployee(username, password)
      : await authService.loginUser(username, password);
    const { data, token: sessionToken } = result;
    if (!sessionToken) return null;
    const sessionUser = sessionUserFromResponse(data, role);
    setSession(sessionUser, sessionToken, rememberMe);
    return sessionUser;
  }, [setSession]);

  const logout = useCallback(() => {
    setSession(null, null);
  }, [setSession]);

  const updateUser = useCallback((updates) => {
    if (!updates) return null;
    let nextUser;
    setUser((prev) => {
      nextUser = { ...(prev || {}), ...updates };
      return nextUser;
    });
    if (nextUser && token) {
      const storage = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) === token ? localStorage : sessionStorage;
      storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(nextUser));
    }
    return nextUser;
  }, [token]);

  const role = useMemo(() => {
    const r = user?.role;
    return typeof r === 'string' ? r.toLowerCase() : null;
  }, [user]);

  const isAdmin = useMemo(() => {
    const r = role;
    const roleName = (user?.roleName ?? '').toString().toLowerCase();
    return r === USER_ROLES.ADMIN || roleName === 'admin';
  }, [user, role]);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    setOnUnauthorized(logout);
    return () => setOnUnauthorized(null);
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      role,
      isAdmin,
      sessionReady,
      isAuthenticated: Boolean(user && token),
      isEmployee: role === USER_ROLES.EMPLOYEE,
      isCustomer: role === USER_ROLES.CUSTOMER,
      login,
      logout,
      updateUser,
    }),
    [login, logout, role, isAdmin, sessionReady, token, updateUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
