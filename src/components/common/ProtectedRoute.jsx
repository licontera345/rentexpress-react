import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children, requiredRole, redirectTo = ROUTES.LOGIN }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole) {
    if (user?.loginType !== requiredRole) {
      return <Navigate to={ROUTES.HOME} replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
