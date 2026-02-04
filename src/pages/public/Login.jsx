import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/layout/public/PublicLayout';
import LoginForm from '../../components/auth/forms/LoginForm';
import { MESSAGES, ROUTES, DEFAULT_FORM_DATA } from '../../constants';
import { useAuth } from '../../hooks/useAuth';

// Página de inicio de sesión con lógica de autenticación y redirección. Controla estado del formulario y errores.
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA.LOGIN);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Determina el destino al que se redirige después del login.
  const redirectTarget = useMemo(() => ({
    pathname: location.state?.redirectTo || ROUTES.DASHBOARD,
    state: location.state?.redirectState
  }), [location.state]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // Si ya está autenticado, navega al destino deseado.
    navigate(redirectTarget.pathname, { replace: true, state: redirectTarget.state });
  }, [isAuthenticated, navigate, redirectTarget]);

  // Actualiza el estado del formulario en cada cambio de input.
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
      // Invoca el login con las credenciales del formulario.
      await login(
        formData.username,
        formData.password,
        formData.role,
        formData.rememberMe
      );
    } catch (err) {
      // Muestra un mensaje de error amigable si falla la autenticación.
      console.error(err);
      setErrorMessage(err?.message || MESSAGES.UNEXPECTED_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [formData, login]);

  return (
    <PublicLayout>
      {/* Formulario de login con sus estados controlados */}
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
