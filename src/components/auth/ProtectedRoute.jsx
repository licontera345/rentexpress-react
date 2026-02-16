import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/core/useAuth';
import { ROUTES } from '../../constants';

/** Ruta protegida presentacional: recibe isAuthenticated y role por props. */
function ProtectedRoute({ isAuthenticated, role, children, allowedRoles = [], redirectTo = ROUTES.LOGIN }) {
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles.length > 0 && (!role || !allowedRoles.includes(role))) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}

/** Wrapper que usa useAuth y pasa props a ProtectedRoute. */
function ProtectedRouteWithAuth({ children, allowedRoles, redirectTo }) {
  const { isAuthenticated, role } = useAuth();
  return (
    <ProtectedRoute
      isAuthenticated={isAuthenticated}
      role={role}
      allowedRoles={allowedRoles}
      redirectTo={redirectTo}
    >
      {children}
    </ProtectedRoute>
  );
}

export { ProtectedRoute };
export default ProtectedRouteWithAuth;
