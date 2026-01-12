import { createContext, useState, useEffect } from 'react';
import * as authService from './api/services/AuthService.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials, isEmployee = false) => {
    try {
      const data = isEmployee 
        ? await authService.loginEmployee(credentials)
        : await authService.loginUser(credentials);
      
      const userData = {
        username: credentials.username,
        loginType: isEmployee ? 'employee' : 'user'
      };
      
      localStorage.setItem('loggedInUser', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      setUser(userData);
      
      window.location.hash = 'home';
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Error en el login'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('token');
    setUser(null);
    window.location.hash = 'home';
  };

  const isEmployee = () => user?.loginType === 'employee';
  
  const isAuthenticated = () => !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      isEmployee,
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};