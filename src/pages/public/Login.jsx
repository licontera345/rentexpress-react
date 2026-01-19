import { useState, useCallback } from 'react';
import PublicLayout from '../../components/layout/public/PublicLayout';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { MESSAGES, ROUTES, BUTTON_VARIANTS, DEFAULT_FORM_DATA } from '../../constants';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA.LOGIN);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (formData.rememberMe) {
        localStorage.setItem('rememberEmail', formData.email);
      }
      window.location.href = ROUTES.DASHBOARD;
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

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
