import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../core/useAuth';
import authService from '../../api/services/authService';
import { ROUTES, DEFAULT_FORM_DATA, MESSAGES } from '../../constants';
import { getApiErrorMessage } from '../../utils/ui/uiUtils';

const usePublicLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithToken, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA.LOGIN);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pending2FA, setPending2FA] = useState(null);
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);

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
      const result = await login(
        formData.username,
        formData.password,
        formData.role,
        formData.rememberMe,
      );
      if (result?.requiresTwoFactor === true && result?.tempToken) {
        setPending2FA({ tempToken: result.tempToken, rememberMe: formData.rememberMe });
        return;
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(getApiErrorMessage(err, 'UNEXPECTED_ERROR'));
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
      const result = await authService.loginWithGoogle(idToken);
      if (result.needsRegistration && result.googlePayload) {
        navigate(ROUTES.REGISTER, {
          replace: true,
          state: {
            fromGoogle: true,
            email: result.googlePayload.email,
            name: result.googlePayload.name ?? result.googlePayload.email,
            googleId: result.googlePayload.googleId,
          },
        });
        return;
      }
      const { sessionUser, token } = result;
      loginWithToken(sessionUser, token, formData.rememberMe);
    } catch (err) {
      setErrorMessage(getApiErrorMessage(err, 'UNEXPECTED_ERROR'));
    } finally {
      setIsGoogleLoading(false);
    }
  }, [formData.rememberMe, loginWithToken, navigate]);

  const handleGoogleError = useCallback(() => {
    setErrorMessage(MESSAGES.AUTH_ERROR_GOOGLE_LOGIN);
  }, []);

  const handleVerify2FA = useCallback(async (code) => {
    if (!pending2FA?.tempToken) return;
    setIsVerifying2FA(true);
    setErrorMessage('');
    try {
      const { sessionUser, token } = await authService.verify2FA(pending2FA.tempToken, code);
      loginWithToken(sessionUser, token, pending2FA.rememberMe);
      setPending2FA(null);
    } catch (err) {
      setErrorMessage(getApiErrorMessage(err, 'AUTH_ERROR_2FA_VERIFY'));
    } finally {
      setIsVerifying2FA(false);
    }
  }, [pending2FA, loginWithToken]);

  const handleBackFrom2FA = useCallback(() => {
    setPending2FA(null);
    setErrorMessage('');
  }, []);

  return {
    state: {
      formData,
      pending2FA,
    },
    ui: {
      isLoading,
      isGoogleLoading,
      isVerifying2FA,
      errorMessage,
    },
    actions: {
      handleChange,
      handleSubmit,
      handleGoogleSuccess,
      handleGoogleError,
      handleVerify2FA,
      handleBackFrom2FA,
    },
    options: {
      redirectTarget,
    },
  };
};

export default usePublicLoginPage;
