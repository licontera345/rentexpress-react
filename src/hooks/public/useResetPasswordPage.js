import { useCallback, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthService from '../../api/services/AuthService';
import { MESSAGES, ROUTES } from '../../constants';
import { validatePasswordPair } from '../../utils/form/formValidation';

export default function useResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  const hasValidToken = !!token?.trim();

  useEffect(() => {
    if (!hasValidToken) {
      setErrorMessage(MESSAGES.RESET_PASSWORD_INVALID_TOKEN);
    }
  }, [hasValidToken]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
    setErrorMessage(null);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!hasValidToken) return;

      const errors = {};
      validatePasswordPair(password, confirmPassword, errors);
      if (Object.keys(errors).length > 0) {
        setErrorMessage(errors.confirmPassword || errors.password || MESSAGES.FIELD_REQUIRED);
        return;
      }

      setErrorMessage(null);
      setIsLoading(true);
      try {
        await AuthService.resetPassword(token, password);
        setSuccess(true);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 404) {
          setErrorMessage(MESSAGES.RESET_PASSWORD_INVALID_TOKEN);
        } else {
          setErrorMessage(err?.message || MESSAGES.UNEXPECTED_ERROR);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [token, password, confirmPassword, hasValidToken]
  );

  const goToLogin = useCallback(() => {
    navigate(ROUTES.LOGIN, { replace: true });
  }, [navigate]);

  const goToForgotPassword = useCallback(() => {
    navigate(ROUTES.FORGOT_PASSWORD, { replace: true });
  }, [navigate]);

  return {
    state: { token, password, confirmPassword, hasValidToken },
    ui: { isLoading, errorMessage, success },
    actions: { handleChange, handleSubmit, goToLogin, goToForgotPassword }
  };
}
