import { Navigate } from 'react-router-dom';
import AuthService from '../api/services/AuthService';
import { ROUTES } from '../constants';

function ProtectedRoute({ children }) {
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}

export default ProtectedRoute;
