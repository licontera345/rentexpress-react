import { useNavigate } from 'react-router-dom'; 
import useAuth from '../../hooks/core/useAuth';
import AuthAxiosSetup from './AuthAxiosSetup';
import ErrorBoundary from '../common/ErrorBoundary';
import AppRoutes from '../../routes/Routes';

function AppContent() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <AuthAxiosSetup logout={logout} navigate={navigate} />
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </>
  );
}

export default AppContent;