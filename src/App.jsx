import { BrowserRouter, useNavigate } from 'react-router-dom';
import AppRoutes from './routes/Routes';
import useLocale from './hooks/core/useLocale';
import useAuth from './hooks/core/useAuth';
import AuthAxiosSetup from './components/auth/AuthAxiosSetup';
import ErrorBoundary from './components/common/ErrorBoundary';

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

function App() {
  useLocale();

  return (
    <BrowserRouter basename="/">
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
