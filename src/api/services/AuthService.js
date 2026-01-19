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

const normalizeToken = (token) => {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const trimmedToken = token.trim();
  return trimmedToken.toLowerCase().startsWith('bearer ')
    ? trimmedToken.slice(7)
    : trimmedToken;
};

const getTokenFromResponseOrHeaders = (data, response) => {
  const tokenFromBody = getTokenFromResponse(data);
  if (tokenFromBody) {
    return normalizeToken(tokenFromBody);
  }

  const headerToken = response.headers.get('Authorization') || response.headers.get('authorization');
  return normalizeToken(headerToken);
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
    const token = getTokenFromResponseOrHeaders(data, response);
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
    const token = getTokenFromResponseOrHeaders(data, response);
    if (token) {
      const sessionUser = buildSessionUser(data, { username, loginType: LOGIN_TYPES.EMPLOYEE });
      AuthService.persistSession(sessionUser, token);
    }
    return data;
  },

  persistSession: (user, token) => {
    const normalizedToken = normalizeToken(token);
    if (normalizedToken) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, normalizedToken);
    }
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

  getToken: () => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const normalizedToken = normalizeToken(storedToken);

    if (storedToken && normalizedToken && storedToken !== normalizedToken) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, normalizedToken);
    }

    return normalizedToken;
  },

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
