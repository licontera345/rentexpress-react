import Config from '../../config/Config';

const AuthService = {
  login: async (email, password) => {
    const response = await fetch(Config.getFullUrl('/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) throw await response.json();

    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('rememberEmail');
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
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken: () => localStorage.getItem('token'),

  isAuthenticated: () => !!localStorage.getItem('token'),

  getAuthHeader: () => {
    const token = AuthService.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  refreshToken: async () => {
    const response = await fetch(Config.getFullUrl('/auth/refresh'), {
      method: 'POST',
      headers: {
        ...AuthService.getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      AuthService.logout();
      throw await response.json();
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data;
  }
};

export default AuthService;