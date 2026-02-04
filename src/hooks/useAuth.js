import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

// Hook para exponer el contexto de autenticación en componentes.
const useAuth = () => useContext(AuthContext);

export default useAuth;
export { useAuth };
