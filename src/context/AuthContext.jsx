import { createContext, useCallback, useMemo, useState } from 'react';
import AuthService from '../api/services/AuthService';
import { AUTH_HEADER, STORAGE_KEYS, USER_ROLES } from '../constants';

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

    if (!storedToken || !storedUser) {
      return { user: null, token: null };
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      return { user: parsedUser, token: storedToken };
    } catch {
      return { user: null, token: null };
    }
  };

  const storedSession = loadStoredSession();
  const [user, setUser] = useState(storedSession.user);
  const [token, setToken] = useState(storedSession.token);
  const resolveRole = (currentUser) => {
    if (!currentUser) {
      return null;
    }

    const candidate = (
      currentUser.role ||
      currentUser.roleName ||
      currentUser?.role?.roleName ||
      currentUser?.role?.name ||
      null
    );

    return typeof candidate === 'string' ? candidate.toLowerCase() : candidate;
  };

  const persistSession = useCallback((nextUser, nextToken, rememberMe = false) => {
    if (!nextUser || !nextToken) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
      return;
    }

    const storage = rememberMe ? localStorage : sessionStorage;
    const otherStorage = rememberMe ? sessionStorage : localStorage;

    storage.setItem(STORAGE_KEYS.AUTH_TOKEN, nextToken);
    storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(nextUser));

    otherStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    otherStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }, []);

  const setSession = useCallback((nextUser, nextToken, rememberMe) => {
    setUser(nextUser);
    setToken(nextToken);
    persistSession(nextUser, nextToken, rememberMe);
  }, [persistSession]);

  const login = useCallback(async (username, password, role = USER_ROLES.CUSTOMER, rememberMe = false) => {
    const { sessionUser, token: sessionToken } = await AuthService.login(username, password, role);

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
      nextUser = Object.assign({}, prev || {}, updates);
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

  const role = useMemo(() => resolveRole(user), [user]);

  const value = useMemo(() => ({
    user,
    token,
    role,
    isAuthenticated: Boolean(user && token),
    isEmployee: role === USER_ROLES.EMPLOYEE,
    isCustomer: role === USER_ROLES.CUSTOMER,
    login,
    logout,
    updateUser,
    getAuthHeader: () => (token ? { [AUTH_HEADER.KEY]: `${AUTH_HEADER.SCHEME} ${token}` } : {})
  }), [login, logout, role, token, updateUser, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
