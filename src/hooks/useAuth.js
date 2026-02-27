import { useContext } from 'react';
import AuthContext from '../context/AuthContext.jsx';

const DEFAULT_AUTH = {
  user: null,
  token: null,
  role: null,
  sessionReady: false,
  isAuthenticated: false,
  isEmployee: false,
  isCustomer: false,
  login: async () => {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  },
  logout: () => {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  },
  updateUser: () => {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  },
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx ?? DEFAULT_AUTH;
}

export default useAuth;
