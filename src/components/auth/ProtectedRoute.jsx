import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';
import { ROUTES } from '../../constants';

// Componente ProtectedRoute que define la interfaz y organiza la lógica de esta vista.

function ProtectedRoute({ children, allowedRoles = [], redirectTo = ROUTES.LOGIN }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles.length > 0 && (!role || !allowedRoles.includes(role))) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}

export default ProtectedRoute;
