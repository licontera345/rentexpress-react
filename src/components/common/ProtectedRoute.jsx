import { Navigate } from 'react-router-dom';
import AuthService from '../../api/services/AuthService';

function ProtectedRoute({ children, requiredRole, redirectTo = '/login' }) {
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole) {
    const user = AuthService.getCurrentUser();
    if (user?.loginType !== requiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
