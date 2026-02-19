import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

// Valor por defecto del contexto de autenticación.
const DEFAULT_AUTH_VALUE = {
  user: null,
  token: null,
  role: null,
  sessionReady: false,
  isAuthenticated: false,
  isEmployee: false,
  isCustomer: false,
  login: async () => { throw new Error('useAuth debe usarse dentro de AuthProvider'); },
  logout: () => { throw new Error('useAuth debe usarse dentro de AuthProvider'); },
  updateUser: () => { throw new Error('useAuth debe usarse dentro de AuthProvider'); }
};

/**
 * Hook de acceso rápido al contexto de autenticación.
 * Centraliza la lectura de usuario, token y helpers definidos en AuthContext.
 * Devuelve valor por defecto si se usa fuera de AuthProvider.
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  return context ?? DEFAULT_AUTH_VALUE;
};

export default useAuth;
export { useAuth };
