import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import AuthService from '../api/services/AuthService';
import { normalizeToken, setAuthToken } from '../api/axiosClient';
import { STORAGE_KEYS, USER_ROLES } from '../constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Lee la sesión guardada en localStorage o sessionStorage para rehidratar el estado inicial.
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
      return { user: null, token: null };
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      return { user: parsedUser, token: normalizedToken };
    } catch {
      return { user: null, token: null };
    }
  };

  const storedSession = loadStoredSession();
  const [user, setUser] = useState(storedSession.user);
  const [token, setToken] = useState(storedSession.token);
  // Normaliza el rol del usuario a un string en minúsculas si es posible.
  const resolveRole = (currentUser) => {
    if (!currentUser) {
      return null;
    }

    const candidate = (
      currentUser.role ||
      currentUser.roleName ||
      currentUser?.role?.roleName ||
      null
    );

    return typeof candidate === 'string' ? candidate.toLowerCase() : candidate;
  };

  // Persiste o limpia la sesión en el storage elegido según "recordarme".
  const persistSession = useCallback((nextUser, nextToken, rememberMe = false) => {
    if (!nextUser || !nextToken) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      sessionStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      sessionStorage.removeItem(STORAGE_KEYS.USER_DATA);
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
  }, []);

  // Actualiza el estado de sesión en memoria y en storage.
  const setSession = useCallback((nextUser, nextToken, rememberMe) => {
    const normalizedToken = normalizeToken(nextToken);
    setUser(nextUser);
    setToken(normalizedToken);
    persistSession(nextUser, normalizedToken, rememberMe);
  }, [persistSession]);

  // Ejecuta el login remoto y guarda la sesión si la respuesta es válida.
  const login = useCallback(async (username, password, role = USER_ROLES.CUSTOMER, rememberMe = false) => {
    const { sessionUser, token: sessionToken } = await AuthService.login(username, password, role);

    if (sessionUser && sessionToken) {
      setSession(sessionUser, sessionToken, rememberMe);
    }

    return sessionUser;
  }, [setSession]);

  // Cierra sesión limpiando user y token.
  const logout = useCallback(() => {
    setSession(null, null);
  }, [setSession]);

  // Actualiza datos del usuario localmente y sincroniza con storage.
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

  // Inyecta el token actual en el cliente HTTP cuando cambia.
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // Memoriza el valor del contexto para evitar renders innecesarios.
  const value = useMemo(() => ({
    user,
    token,
    role,
    isAuthenticated: Boolean(user && token),
    isEmployee: role === USER_ROLES.EMPLOYEE,
    isCustomer: role === USER_ROLES.CUSTOMER,
    login,
    logout,
    updateUser
  }), [login, logout, role, token, updateUser, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
