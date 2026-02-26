import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../api/services/AuthService';
import { MESSAGES, ROUTES } from '../../constants';
import { validateEmail } from '../../utils/form/formValidation';

export default function useForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [success, setSuccess] = useState(false);

  // Manejador de cambios en el campo email.
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
      setErrorMessage(null);
    }
  }, []);

  // Envía el email al servicio de autenticación.
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const trimmed = email?.trim() || '';
      const errors = {};
      if (!trimmed) errors.email = MESSAGES.FIELD_REQUIRED;
      validateEmail(trimmed, errors);
      if (Object.keys(errors).length > 0) {
        setErrorMessage(errors.email || MESSAGES.FIELD_REQUIRED);
        return;
      }
      setErrorMessage(null);
      setIsLoading(true);
      try {
        await AuthService.forgotPassword(trimmed);
        setSuccess(true);
      } catch (err) {
        setErrorMessage(err?.message || MESSAGES.UNEXPECTED_ERROR);
      } finally {
        setIsLoading(false);
      }
    },
    [email]
  );

  // Redirecciona a la página de login.
  const goToLogin = useCallback(() => {
    navigate(ROUTES.LOGIN, { replace: true });
  }, [navigate]);

  // Estado y callbacks para la página.
  return {
    state: { email },
    ui: { isLoading, errorMessage, success },
    actions: { handleChange, handleSubmit, goToLogin }
  };
}
