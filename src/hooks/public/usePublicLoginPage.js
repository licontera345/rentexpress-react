import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../core/useAuth';
import authService from '../../api/services/authService';
import { ROUTES, DEFAULT_FORM_DATA, MESSAGES } from '../../constants';

const usePublicLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithToken, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA.LOGIN);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const redirectTarget = useMemo(() => ({
    pathname: location.state?.redirectTo || ROUTES.DASHBOARD,
    state: location.state?.redirectState,
  }), [location.state]);

  useEffect(() => {
    if (location.state?.from === 'session_expired') {
      setErrorMessage(MESSAGES.SESSION_EXPIRED);
    }
  }, [location.state?.from]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    navigate(redirectTarget.pathname, { replace: true, state: redirectTarget.state, });
  }, [isAuthenticated, navigate, redirectTarget]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    if (errorMessage) {
      setErrorMessage('');
    }
  }, [errorMessage]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      await login(
        formData.username,
        formData.password,
        formData.role,
        formData.rememberMe,
      );
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.message || MESSAGES.UNEXPECTED_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [formData, login]);

  const handleGoogleSuccess = useCallback(async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) return;
    setIsGoogleLoading(true);
    setErrorMessage('');
    try {
      const { sessionUser, token } = await authService.loginWithGoogle(idToken);
      loginWithToken(sessionUser, token, formData.rememberMe);
    } catch (err) {
      setErrorMessage(err?.message || MESSAGES.UNEXPECTED_ERROR);
    } finally {
      setIsGoogleLoading(false);
    }
  }, [formData.rememberMe, loginWithToken]);

  const handleGoogleError = useCallback(() => {
    setErrorMessage('No se pudo iniciar sesión con Google.');
  }, []);

  return {
    state: {
      formData,
    },
    ui: {
      isLoading,
      isGoogleLoading,
      errorMessage,
    },
    actions: {
      handleChange,
      handleSubmit,
      handleGoogleSuccess,
      handleGoogleError,
    },
    options: {
      redirectTarget,
    },
  };
};

export default usePublicLoginPage;
