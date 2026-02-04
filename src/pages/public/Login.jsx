import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/layout/public/PublicLayout';
import LoginForm from '../../components/auth/forms/LoginForm';
import { MESSAGES, ROUTES, DEFAULT_FORM_DATA } from '../../constants';
import { useAuth } from '../../hooks/useAuth';

// Componente Login que encapsula la interfaz y la lógica principal de esta sección.

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA.LOGIN);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const redirectTarget = useMemo(() => ({
    pathname: location.state?.redirectTo || ROUTES.DASHBOARD,
    state: location.state?.redirectState
  }), [location.state]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    navigate(redirectTarget.pathname, { replace: true, state: redirectTarget.state });
  }, [isAuthenticated, navigate, redirectTarget]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      username: name === 'username' ? nextValue : prev.username,
      password: name === 'password' ? nextValue : prev.password,
      rememberMe: name === 'rememberMe' ? nextValue : prev.rememberMe,
      role: name === 'role' ? nextValue : prev.role
    }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      await login(
        formData.username,
        formData.password,
        formData.role,
        formData.rememberMe
      );
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.message || MESSAGES.UNEXPECTED_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [formData, login]);

  return (
    <PublicLayout>
      <LoginForm
        formData={formData}
        isLoading={isLoading}
        errorMessage={errorMessage}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </PublicLayout>
  );
}

export default Login;
