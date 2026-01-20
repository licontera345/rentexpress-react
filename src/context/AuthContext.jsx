import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import AuthService from '../api/services/AuthService';
import { normalizeToken } from '../api/axiosClient';
import { LOGIN_TYPES, STORAGE_KEYS } from '../constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const loadStoredSession = () => {
    const storedToken =
      localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) ||
      sessionStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const storedUser =
      localStorage.getItem(STORAGE_KEYS.USER_DATA) ||
      sessionStorage.getItem(STORAGE_KEYS.USER_DATA) ||
      localStorage.getItem(STORAGE_KEYS.LEGACY_USER_DATA) ||
      sessionStorage.getItem(STORAGE_KEYS.LEGACY_USER_DATA);

    const normalizedToken = normalizeToken(storedToken);
    if (!normalizedToken || !storedUser) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
      return { user: null, token: null };
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      return { user: parsedUser, token: normalizedToken };
    } catch (error) {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
      return { user: null, token: null };
    }
  };

  const storedSession = loadStoredSession();
  const [user, setUser] = useState(storedSession.user);
  const [token, setToken] = useState(storedSession.token);

  const persistSession = useCallback((nextUser, nextToken, rememberMe = false) => {
    const normalizedToken = normalizeToken(nextToken);
    if (!nextUser || !normalizedToken) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
      return;
    }

    const storage = rememberMe ? localStorage : sessionStorage;
    const otherStorage = rememberMe ? sessionStorage : localStorage;

    storage.setItem(STORAGE_KEYS.AUTH_TOKEN, normalizedToken);
    storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(nextUser));

    otherStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    otherStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }, []);

  const setSession = useCallback((nextUser, nextToken, rememberMe) => {
    setUser(nextUser);
    setToken(nextToken);
    persistSession(nextUser, nextToken, rememberMe);
  }, [persistSession]);

  const login = useCallback(async (username, password, loginType, rememberMe = false) => {
    const loginAction = loginType === LOGIN_TYPES.EMPLOYEE
      ? AuthService.loginEmployee
      : AuthService.loginUser;

    const { sessionUser, token: sessionToken } = await loginAction(username, password);

    if (sessionUser && sessionToken) {
      setSession(sessionUser, sessionToken, rememberMe);
    }

    return sessionUser;
  }, [setSession]);

  const logout = useCallback(() => {
    setSession(null, null);
  }, [setSession]);

  const updateUser = useCallback((updates) => {
    if (!updates) return null;
    let nextUser;
    setUser(prev => {
      nextUser = { ...(prev || {}), ...updates };
      return nextUser;
    });
    if (nextUser && token) {
      const storage =
        localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) === token
          ? localStorage
          : sessionStorage;
      storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(nextUser));
    }
    return nextUser;
  }, [token]);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(user && token),
    login,
    logout,
    updateUser,
    getAuthHeader: () => (token ? { Authorization: `Bearer ${token}` } : {})
  }), [login, logout, token, updateUser, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
