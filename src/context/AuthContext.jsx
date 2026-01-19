import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import AuthService from '../api/services/AuthService';
import { LOGIN_TYPES } from '../constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const setSession = useCallback((nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
  }, []);

  const login = useCallback(async (username, password, loginType) => {
    const loginAction = loginType === LOGIN_TYPES.EMPLOYEE
      ? AuthService.loginEmployee
      : AuthService.loginUser;

    const { sessionUser, token: sessionToken } = await loginAction(username, password);

    if (sessionUser && sessionToken) {
      setSession(sessionUser, sessionToken);
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
    return nextUser;
  }, []);

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
