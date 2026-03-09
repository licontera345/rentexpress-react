import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/core/useAuth';
import AuthAxiosSetup from './AuthAxiosSetup';
import ErrorBoundary from '../common/ErrorBoundary';
import ScrollToTop from '../common/ScrollToTop';
import AppRoutes from '../../routes/Routes';

function AppContent() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <>
      <ScrollToTop />
      <AuthAxiosSetup logout={logout} navigate={navigate} />
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </>
  );
}

export default AppContent;