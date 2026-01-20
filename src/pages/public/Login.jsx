import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/layout/public/PublicLayout';
import FormField from '../../components/common/forms/FormField';
import Button from '../../components/common/actions/Button';
import Card from '../../components/common/layout/Card';
import {MESSAGES, ROUTES,  BUTTON_VARIANTS,  DEFAULT_FORM_DATA} from '../../constants';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA.LOGIN);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
        formData.rememberMe
      );
      navigate(ROUTES.HOME);
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.message || MESSAGES.UNEXPECTED_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [formData, login, navigate]);

  return (
    <PublicLayout>
      <div className="login-container">
        <div className="login-wrapper">
          <Card className="login-card">
            <div className="login-header">
              <h1>{MESSAGES.LOGIN_TITLE}</h1>
              <p className="login-subtitle">{MESSAGES.LOGIN_SUBTITLE}</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-role">
                <span className="login-role-label">{MESSAGES.ACCOUNT_TYPE}</span>
                <p className="login-role-help">{MESSAGES.LOGIN_HELP_TEXT}</p>
                <div className="login-role-options" role="radiogroup" aria-label={MESSAGES.ACCOUNT_TYPE}>
                  <label className={`login-role-option ${formData.role === 'user' ? 'is-active' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={formData.role === 'user'}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <span>{MESSAGES.CUSTOMER_ROLE}</span>
                  </label>
                  <label className={`login-role-option ${formData.role === 'employee' ? 'is-active' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value="employee"
                      checked={formData.role === 'employee'}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <span>{MESSAGES.EMPLOYEE_ROLE}</span>
                  </label>
                </div>
              </div>

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
                label={MESSAGES.PASSWORD}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={MESSAGES.PASSWORD_PLACEHOLDER}
                required
                disabled={isLoading}
              />

              <div className="login-options">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    name="rememberMe" 
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <span>{MESSAGES.REMEMBER_ME}</span>
                </label>
              </div>

              {errorMessage && (
                <p className="login-error">{errorMessage}</p>
              )}

              <Button 
                type="submit" 
                variant={BUTTON_VARIANTS.PRIMARY} 
                size="large"
                className="login-submit"
                disabled={isLoading}
              >
                {isLoading ? MESSAGES.STARTING : MESSAGES.SIGN_IN}
              </Button>
            </form>

            <div className="login-footer">
              <p>{MESSAGES.NO_ACCOUNT} <a href={ROUTES.REGISTER}>{MESSAGES.SIGN_UP_HERE}</a></p>
              <p className="login-support">{MESSAGES.SUPPORT_HINT}</p>
            </div>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}

export default Login;
