import Config from '../../config/Config';
import { LOGIN_TYPES, STORAGE_KEYS } from '../../constants';

const AuthService = {
  loginUser: async (username, password) => {
    const response = await fetch(Config.getFullUrl(Config.AUTH.LOGIN_USER), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) throw await response.json();

    const data = await response.json();
    if (data.token) {
      AuthService.persistSession({ username, loginType: LOGIN_TYPES.USER }, data.token);
    }
    return data;
  },

  loginEmployee: async (username, password) => {
    const response = await fetch(Config.getFullUrl(Config.AUTH.LOGIN_EMPLOYEE), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) throw await response.json();

    const data = await response.json();
    if (data.token) {
      AuthService.persistSession({ username, loginType: LOGIN_TYPES.EMPLOYEE }, data.token);
    }
    return data;
  },

  persistSession: (user, token) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.LEGACY_USER_DATA, JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.LEGACY_USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_EMAIL);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_USERNAME);
  },

  register: async (userData) => {
    const response = await fetch(Config.getFullUrl('/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) throw await response.json();
    return await response.json();
  },

  getCurrentUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER_DATA) || localStorage.getItem(STORAGE_KEYS.LEGACY_USER_DATA);
    return user ? JSON.parse(user) : null;
  },

  getToken: () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),

  isAuthenticated: () => {
    return Boolean(
      localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
      && (localStorage.getItem(STORAGE_KEYS.USER_DATA) || localStorage.getItem(STORAGE_KEYS.LEGACY_USER_DATA))
    );
  },

  getAuthHeader: () => {
    const token = AuthService.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

export default AuthService;
