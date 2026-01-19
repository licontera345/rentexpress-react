import Config from '../../config/Config';
import { LOGIN_TYPES } from '../../constants';

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

const parseResponsePayload = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
};

const toLoginPayload = (username, password) => ({
  username,
  login: username,
  password
});

const buildAuthError = (payload, response, fallbackMessage) => {
  const message = typeof payload === 'string'
    ? payload
    : payload?.message || payload?.error || fallbackMessage;
  const error = new Error(message);
  error.status = response.status;
  error.payload = payload;
  return error;
};

const AuthService = {
  loginUser: async (username, password) => {
    const response = await fetch(Config.getFullUrl(Config.AUTH.LOGIN_USER), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toLoginPayload(username, password))
    });

    const data = await parseResponsePayload(response);

    if (!response.ok) {
      throw buildAuthError(data, response, 'Error al autenticar usuario');
    }

    const token = getTokenFromResponseOrHeaders(data, response);
    const sessionUser = token
      ? buildSessionUser(data, { username, loginType: LOGIN_TYPES.USER })
      : null;
    return { data, sessionUser, token };
  },

  loginEmployee: async (username, password) => {
    const response = await fetch(Config.getFullUrl(Config.AUTH.LOGIN_EMPLOYEE), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toLoginPayload(username, password))
    });

    const data = await parseResponsePayload(response);

    if (!response.ok) {
      throw buildAuthError(data, response, 'Error al autenticar empleado');
    }

    const token = getTokenFromResponseOrHeaders(data, response);
    const sessionUser = token
      ? buildSessionUser(data, { username, loginType: LOGIN_TYPES.EMPLOYEE })
      : null;
    return { data, sessionUser, token };
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

  getTokenFromResponseOrHeaders,
  normalizeToken
};

export default AuthService;
