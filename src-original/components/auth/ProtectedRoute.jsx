import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/core/useAuth';
import { ROUTES } from '../../constants';

function ProtectedRoute({
  isAuthenticated,
  sessionReady,
  role,
  children,
  allowedRoles = [],
  redirectTo = ROUTES.LOGIN
}) {
  if (!sessionReady) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles.length > 0 && (!role || !allowedRoles.includes(role))) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}

function ProtectedRouteWithAuth({ children, allowedRoles, redirectTo }) {
  const { isAuthenticated, sessionReady, role } = useAuth();
  return (
    <ProtectedRoute
      isAuthenticated={isAuthenticated}
      sessionReady={sessionReady}
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
