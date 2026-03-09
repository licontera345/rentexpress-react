import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import authService from '../api/services/authService';
import { normalizeToken, setAuthToken } from '../api/axiosClient';
import { STORAGE_KEYS, USER_ROLES } from '../constants';

const AuthContext = createContext(null);

export function AuthProvider({ children, }) {
  const loadStoredSession = () => {
    const tokenKeys = [
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.LEGACY_AUTH_TOKEN,
    ];
    const userKeys = [
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.LEGACY_USER_DATA,
      STORAGE_KEYS.LEGACY_USER_DATA_ALT,
    ];

    let storedToken = null;
    let storedUser = null;
    for (const key of tokenKeys) {
      storedToken =
        localStorage.getItem(key) || sessionStorage.getItem(key);
      if (storedToken) break;
    }
    for (const key of userKeys) {
      storedUser =
        localStorage.getItem(key) || sessionStorage.getItem(key);
      if (storedUser) break;
    }

    const normalizedToken = normalizeToken(storedToken);

    if (!normalizedToken || !storedUser) {
      return { user: null, token: null, };
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      return { user: parsedUser, token: normalizedToken, };
    } catch {
      return { user: null, token: null, };
    }
  };

  const storedSession = loadStoredSession();
  const [user, setUser] = useState(storedSession.user);
  const [token, setToken] = useState(storedSession.token);
  const [sessionReady, setSessionReady] = useState(false);
  const [profileImageVersion, setProfileImageVersion] = useState(0);

  const refreshProfileImage = useCallback(() => {
    setProfileImageVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    setSessionReady(true);
  }, []);

  const resolveRole = (currentUser) => (
    typeof currentUser?.role === 'string' ? currentUser.role.toLowerCase() : null
  );

  const storageKeysToClear = [
    STORAGE_KEYS.AUTH_TOKEN,
    STORAGE_KEYS.USER_DATA,
    STORAGE_KEYS.LEGACY_AUTH_TOKEN,
    STORAGE_KEYS.LEGACY_USER_DATA,
    STORAGE_KEYS.LEGACY_USER_DATA_ALT,
  ];

  const persistSession = useCallback((nextUser, nextToken, rememberMe = false,) => {
    if (!nextUser || !nextToken) {
      storageKeysToClear.forEach((key) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      return;
    }

    const normalizedToken = normalizeToken(nextToken);
    if (!normalizedToken) {
      return;
    }

    const storage = rememberMe ? localStorage : sessionStorage;
    const otherStorage = rememberMe ? sessionStorage : localStorage;

    storage.setItem(STORAGE_KEYS.AUTH_TOKEN, normalizedToken);
    storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(nextUser));

    otherStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    otherStorage.removeItem(STORAGE_KEYS.USER_DATA);
    [STORAGE_KEYS.LEGACY_AUTH_TOKEN, STORAGE_KEYS.LEGACY_USER_DATA, STORAGE_KEYS.LEGACY_USER_DATA_ALT].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }, []);

  const setSession = useCallback((nextUser, nextToken, rememberMe) => {
    const normalizedToken = normalizeToken(nextToken);
    setUser(nextUser);
    setToken(normalizedToken);
    persistSession(nextUser, normalizedToken, rememberMe);
  }, [persistSession]);

  const login = useCallback(async (username, password, role = USER_ROLES.CUSTOMER, rememberMe = false) => {
    const result = await authService.login(username, password, role);
    if (result.requiresTwoFactor === true && result.tempToken) {
      return result;
    }
    const { sessionUser, token: sessionToken } = result;
    if (sessionUser && sessionToken) {
      setSession(sessionUser, sessionToken, rememberMe);
    }
    return sessionUser;
  }, [setSession]);

  // Establece la sesión con token y usuario tras login con Google).
  const loginWithToken = useCallback((sessionUser, sessionToken, rememberMe = false) => {
    if (sessionUser && sessionToken) {
      setSession(sessionUser, sessionToken, rememberMe);
    }
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
  const isAdmin = useMemo(() => role === USER_ROLES.ADMIN, [role]);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const value = useMemo(() => ({
    user,
    token,
    role,
    isAdmin,
    sessionReady,
    isAuthenticated: Boolean(user && token),
    isEmployee: role === USER_ROLES.EMPLOYEE,
    isCustomer: role === USER_ROLES.CUSTOMER,
    profileImageVersion,
    refreshProfileImage,
    login,
    loginWithToken,
    logout,
    updateUser,
  }), [login, loginWithToken, logout, role, isAdmin, sessionReady, token, updateUser, user, profileImageVersion, refreshProfileImage]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
