import Config from '../../config/Config';
import { LOGIN_TYPES, STORAGE_KEYS } from '../../constants';

const buildSessionUser = (data, fallbackUser) => {
  if (!data || typeof data !== 'object') {
    return fallbackUser;
  }

  const {
    token,
    accessToken,
    user,
    employee,
    userDTO,
    employeeDTO,
    ...rest
  } = data;

  const candidate = user || employee || userDTO || employeeDTO || rest;

  if (!candidate || Object.keys(candidate).length === 0) {
    return fallbackUser;
  }

  return {
    ...candidate,
    loginType: fallbackUser.loginType
  };
};

const getTokenFromResponse = (data) => {
  if (!data || typeof data !== 'object') {
    return null;
  }

  return data.token || data.accessToken || data.access_token || data.jwt || null;
};

const AuthService = {
  loginUser: async (username, password) => {
    const response = await fetch(Config.getFullUrl(Config.AUTH.LOGIN_USER), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) throw await response.json();

    const data = await response.json();
    const token = getTokenFromResponse(data);
    if (token) {
      const sessionUser = buildSessionUser(data, { username, loginType: LOGIN_TYPES.USER });
      AuthService.persistSession(sessionUser, token);
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
    const token = getTokenFromResponse(data);
    if (token) {
      const sessionUser = buildSessionUser(data, { username, loginType: LOGIN_TYPES.EMPLOYEE });
      AuthService.persistSession(sessionUser, token);
    }
    return data;
  },

  persistSession: (user, token) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.LEGACY_USER_DATA, JSON.stringify(user));
  },

  updateStoredUser: (user) => {
    if (!user) return null;
    const currentUser = AuthService.getCurrentUser() || {};
    const nextUser = { ...currentUser, ...user };
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(nextUser));
    localStorage.setItem(STORAGE_KEYS.LEGACY_USER_DATA, JSON.stringify(nextUser));
    return nextUser;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.LEGACY_USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_EMAIL);
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_USERNAME);
  },

  register: async (userData) => {
    const response = await fetch(Config.getFullUrl(Config.USERS.CREATE_OPEN), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al registrar usuario');
    }

    return response.json();
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
