import Config from '../../config/Config';

const USER_KEY = 'loggedInUser';
const TOKEN_KEY = 'token';

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
      AuthService.persistSession({ username, loginType: 'user' }, data.token);
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
      AuthService.persistSession({ username, loginType: 'employee' }, data.token);
    }
    return data;
  },

  persistSession: (user, token) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem('user', JSON.stringify(user));
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem('user');
    localStorage.removeItem('rememberEmail');
    localStorage.removeItem('rememberUsername');
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
    const user = localStorage.getItem(USER_KEY) || localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => localStorage.getItem(TOKEN_KEY),

  isAuthenticated: () => {
    return Boolean(localStorage.getItem(TOKEN_KEY) && (localStorage.getItem(USER_KEY) || localStorage.getItem('user')));
  },

  getAuthHeader: () => {
    const token = AuthService.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

export default AuthService;
