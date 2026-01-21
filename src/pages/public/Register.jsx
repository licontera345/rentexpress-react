import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/layout/public/PublicLayout';
import FormField from '../../components/common/forms/FormField';
import Button from '../../components/common/actions/Button';
import Card from '../../components/common/layout/Card';
import { MESSAGES, ROUTES, BUTTON_VARIANTS, DEFAULT_FORM_DATA } from '../../constants';
import AuthService from '../../api/services/AuthService';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA.REGISTER);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: nextValue
    }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
    if (error) {
      setError('');
    }
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    const trimmedData = {
      firstName: formData.firstName.trim(),
      lastName1: formData.lastName1.trim(),
      lastName2: formData.lastName2.trim(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      birthDate: formData.birthDate
    };
    const nextErrors = {};

    if (!trimmedData.firstName) nextErrors.firstName = MESSAGES.FIELD_REQUIRED;
    if (!trimmedData.lastName1) nextErrors.lastName1 = MESSAGES.FIELD_REQUIRED;
    if (!trimmedData.username) nextErrors.username = MESSAGES.FIELD_REQUIRED;
    if (!trimmedData.email) nextErrors.email = MESSAGES.FIELD_REQUIRED;
    if (!trimmedData.phone) nextErrors.phone = MESSAGES.FIELD_REQUIRED;
    if (!trimmedData.birthDate) nextErrors.birthDate = MESSAGES.FIELD_REQUIRED;
    if (!formData.password) nextErrors.password = MESSAGES.FIELD_REQUIRED;
    if (!formData.confirmPassword) nextErrors.confirmPassword = MESSAGES.FIELD_REQUIRED;
    if (!formData.acceptTerms) nextErrors.acceptTerms = MESSAGES.ACCEPT_TERMS_REQUIRED;

    if (trimmedData.email && !/\S+@\S+\.\S+/.test(trimmedData.email)) {
      nextErrors.email = MESSAGES.INVALID_EMAIL;
    }

    if (trimmedData.phone && !/^[\d\s()+-]{7,}$/.test(trimmedData.phone)) {
      nextErrors.phone = MESSAGES.INVALID_PHONE;
    }

    if (formData.password && formData.password.length < 6) {
      nextErrors.password = MESSAGES.PASSWORD_MIN_LENGTH;
    }

    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = MESSAGES.PASSWORDS_DONT_MATCH;
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError(MESSAGES.REQUIRED_FIELDS);
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.register({
        username: trimmedData.username,
        email: trimmedData.email,
        password: formData.password,
        firstName: trimmedData.firstName,
        lastName1: trimmedData.lastName1,
        lastName2: trimmedData.lastName2,
        birthDate: trimmedData.birthDate,
        phone: trimmedData.phone,
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
                label={MESSAGES.FIRST_NAME}
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={isLoading}
                error={fieldErrors.firstName}
                placeholder={MESSAGES.FIRST_NAME_PLACEHOLDER}
              />

              <FormField
                label={MESSAGES.LAST_NAME_1}
                type="text"
                name="lastName1"
                value={formData.lastName1}
                onChange={handleChange}
                required
                disabled={isLoading}
                error={fieldErrors.lastName1}
                placeholder={MESSAGES.LAST_NAME_1_PLACEHOLDER}
              />

              <FormField
                label={MESSAGES.LAST_NAME_2}
                type="text"
                name="lastName2"
                value={formData.lastName2}
                onChange={handleChange}
                disabled={isLoading}
                error={fieldErrors.lastName2}
                placeholder={MESSAGES.LAST_NAME_2_PLACEHOLDER}
              />

              <FormField
                label={MESSAGES.BIRTH_DATE}
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                required
                disabled={isLoading}
                error={fieldErrors.birthDate}
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
                error={fieldErrors.username}
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
                error={fieldErrors.email}
              />

              <FormField
                label={MESSAGES.PHONE}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={MESSAGES.PHONE_PLACEHOLDER}
                required
                disabled={isLoading}
                error={fieldErrors.phone}
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
                error={fieldErrors.password}
                helper={MESSAGES.PASSWORD_HELPER}
              />

              <FormField
                label={MESSAGES.CONFIRM_PASSWORD}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
                error={fieldErrors.confirmPassword}
              />

              <div className="register-terms register-full">
                <label className="register-terms-label">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <span>
                    {MESSAGES.ACCEPT_TERMS_PREFIX}
                    <Link className="register-policy-link" to={ROUTES.PRIVACY_POLICY}>
                      {MESSAGES.PRIVACY_POLICY_LINK}
                    </Link>
                  </span>
                </label>
                {fieldErrors.acceptTerms && (
                  <p className="form-error" role="alert">
                    {fieldErrors.acceptTerms}
                  </p>
                )}
              </div>

              {error && (
                <p className="register-error register-full" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant={BUTTON_VARIANTS.PRIMARY}
                size="large"
                className="register-submit register-full"
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
