import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/index.js';
import { ROUTES } from '../../constants/index.js';

/**
 * Protege rutas: requiere autenticación y opcionalmente roles. Redirige a login o home.
 */
export function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectTo = ROUTES.LOGIN,
}) {
  const { isAuthenticated, sessionReady, role } = useAuth();

  if (!sessionReady) return null;
  if (!isAuthenticated) return <Navigate to={redirectTo} replace />;
  if (allowedRoles.length > 0 && (!role || !allowedRoles.includes(role))) {
    return <Navigate to={ROUTES.HOME} replace />;
  }
  return children;
}

export default ProtectedRoute;
