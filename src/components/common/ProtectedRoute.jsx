import { Navigate } from 'react-router-dom';
import AuthService from '../../api/services/AuthService';
import { ROUTES } from '../../constants';

function ProtectedRoute({ children, requiredRole, redirectTo = ROUTES.LOGIN }) {
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole) {
    const user = AuthService.getCurrentUser();
    if (user?.loginType !== requiredRole) {
      return <Navigate to={ROUTES.HOME} replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
