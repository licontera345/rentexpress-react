import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

/**
 * Hook de acceso rápido al contexto de autenticación.
 * Centraliza la lectura de usuario, token y helpers definidos en AuthContext.
 */
const useAuth = () => useContext(AuthContext);

export default useAuth;
export { useAuth };
