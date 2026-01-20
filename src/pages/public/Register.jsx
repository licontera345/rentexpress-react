import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/layout/public/PublicLayout';
import FormField from '../../components/common/forms/FormField';
import Button from '../../components/common/actions/Button';
import Card from '../../components/common/layout/Card';
import { MESSAGES, ROUTES, BUTTON_VARIANTS, DEFAULT_FORM_DATA } from '../../constants';
import AuthService from '../../api/services/AuthService';
import './Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA.REGISTER);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      name: name === 'name' ? nextValue : prev.name,
      username: name === 'username' ? nextValue : prev.username,
      email: name === 'email' ? nextValue : prev.email,
      password: name === 'password' ? nextValue : prev.password,
      confirmPassword: name === 'confirmPassword' ? nextValue : prev.confirmPassword,
      acceptTerms: name === 'acceptTerms' ? nextValue : prev.acceptTerms
    }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(MESSAGES.PASSWORDS_DONT_MATCH);
      return;
    }

    setIsLoading(true);
    try {
      const trimmedName = formData.name.trim();
      const nameParts = trimmedName ? trimmedName.split(/\s+/) : [];
      const firstName = nameParts.shift() || formData.username.trim();
      const lastName1 = nameParts.shift() || '';
      const lastName2 = nameParts.join(' ');

      await AuthService.register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        firstName,
        lastName1,
        lastName2,
        activeStatus: true
      });
      navigate(ROUTES.LOGIN);
    } catch (err) {
      console.error(err);
      setError(err?.message || MESSAGES.UNEXPECTED_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [formData, navigate]);

  return (
    <PublicLayout>
      <div className="register-container">
        <div className="register-wrapper">
          <Card className="register-card">
            <div className="register-header">
              <h1>{MESSAGES.REGISTER_TITLE}</h1>
            </div>

            <form onSubmit={handleSubmit} className="register-form">
              <FormField
                label={MESSAGES.FULL_NAME}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />

              <FormField
                label={MESSAGES.USERNAME}
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder={MESSAGES.USERNAME_PLACEHOLDER}
                required
                disabled={isLoading}
              />

              <FormField
                label={MESSAGES.EMAIL}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={MESSAGES.EMAIL_PLACEHOLDER}
                required
                disabled={isLoading}
              />

              <FormField
                label={MESSAGES.PASSWORD}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={MESSAGES.PASSWORD_PLACEHOLDER}
                required
                disabled={isLoading}
              />

              <FormField
                label={MESSAGES.CONFIRM_PASSWORD}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
              />

              {error && <p className="register-error">{error}</p>}

              <Button
                type="submit"
                variant={BUTTON_VARIANTS.PRIMARY}
                size="large"
                className="register-submit"
                disabled={isLoading}
              >
                {isLoading ? MESSAGES.STARTING : MESSAGES.CREATE_ACCOUNT}
              </Button>
            </form>

            <div className="register-footer">
              <p>{MESSAGES.HAVE_ACCOUNT} <button type="button" onClick={() => navigate(ROUTES.LOGIN)} className="register-link">{MESSAGES.SIGN_IN_HERE}</button></p>
            </div>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}

export default Register;
