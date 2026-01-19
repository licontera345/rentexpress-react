import { useState, useCallback } from 'react';
import PublicLayout from '../../components/layout/public/PublicLayout';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
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
      window.location.href = '/dashboard';
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
              <h1>Iniciar Sesión</h1>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <FormField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                disabled={isLoading}
              />

              <FormField
                label="Contraseña"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Tu contraseña"
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
                  <span>Recuérdame</span>
                </label>
              </div>

              <Button 
                type="submit" 
                variant="primary" 
                size="large"
                className="login-submit"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <div className="login-footer">
              <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
            </div>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}

export default Login;
