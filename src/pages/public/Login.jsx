import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../../components/layout/public/PublicLayout';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import {
  MESSAGES,
  ROUTES,
  BUTTON_VARIANTS,
  DEFAULT_FORM_DATA,
  LOGIN_TYPES
} from '../../constants';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

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
      loginType: name === 'loginType' ? nextValue : prev.loginType,
      rememberMe: name === 'rememberMe' ? nextValue : prev.rememberMe
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
        formData.loginType,
        formData.rememberMe
      );
      navigate(ROUTES.DASHBOARD);
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
            </div>

            <form onSubmit={handleSubmit} className="login-form">
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
                <span className="login-option-label">{MESSAGES.ACCESS_TYPE}</span>
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="loginType"
                    value={LOGIN_TYPES.USER}
                    checked={formData.loginType === LOGIN_TYPES.USER}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <span>{MESSAGES.ACCESS_USER}</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="radio"
                    name="loginType"
                    value={LOGIN_TYPES.EMPLOYEE}
                    checked={formData.loginType === LOGIN_TYPES.EMPLOYEE}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                  <span>{MESSAGES.ACCESS_EMPLOYEE}</span>
                </label>
              </div>

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
            </div>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}

export default Login;
