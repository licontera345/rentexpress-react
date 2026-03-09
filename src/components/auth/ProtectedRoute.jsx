import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/core/useAuth';
import { ROUTES } from '../../constants';
import LoadingSpinner from '../common/feedback/LoadingSpinner';

function ProtectedRoute({
  isAuthenticated,
  sessionReady,
  role,
  children,
  allowedRoles = [],
  redirectTo = ROUTES.LOGIN,
  fromPath,
  fromState
}) {
  if (!sessionReady) {
    return (
      <div className="protected-route-loader" aria-busy="true" aria-live="polite">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ redirectTo: fromPath, redirectState: fromState }}
      />
    );
  }

  if (allowedRoles.length > 0 && (!role || !allowedRoles.includes(role))) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}

function ProtectedRouteWithAuth({ children, allowedRoles, redirectTo }) {
  const { isAuthenticated, sessionReady, role } = useAuth();
  const location = useLocation();
  return (
    <ProtectedRoute
      isAuthenticated={isAuthenticated}
      sessionReady={sessionReady}
      role={role}
      allowedRoles={allowedRoles}
      redirectTo={redirectTo}
      fromPath={location.pathname}
      fromState={location.state}
    >
      {children}
    </ProtectedRoute>
  );
}

export { ProtectedRoute };
export default ProtectedRouteWithAuth;
