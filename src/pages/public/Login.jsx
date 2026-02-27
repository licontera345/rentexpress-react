import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicLayout } from '../../components/index.js';
import { FormField, Button } from '../../components/index.js';
import { useForm, useAsync } from '../../hooks/index.js';
import { useAuth } from '../../hooks/index.js';
import { ROUTES, USER_ROLES, DEFAULT_FORM_DATA } from '../../constants/index.js';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const form = useForm(DEFAULT_FORM_DATA.LOGIN);
  const { run, loading } = useAsync();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { username, password, role, rememberMe } = form.values;
      if (!username?.trim() || !password) {
        form.setAlert({ type: 'error', message: 'Usuario y contraseña obligatorios' });
        return;
      }
      try {
        await run(() => login(username.trim(), password, role, rememberMe));
        form.setAlert(null);
        navigate(ROUTES.DASHBOARD);
      } catch (err) {
        form.setAlert({ type: 'error', message: err?.message ?? 'Error al iniciar sesión' });
      }
    },
    [form, login, navigate, run]
  );

  return (
    <PublicLayout>
      <section className="page-login">
        <div className="login-card card">
          <h1>Iniciar sesión</h1>
          {form.alert && (
            <div className={`alert alert-${form.alert.type}`}>{form.alert.message}</div>
          )}
          <form onSubmit={handleSubmit} noValidate>
            <FormField
              label="Usuario o email"
              name="username"
              value={form.values.username}
              onChange={form.setFromEvent}
              autoComplete="username"
            />
            <FormField
              label="Contraseña"
              name="password"
              type="password"
              value={form.values.password}
              onChange={form.setFromEvent}
              autoComplete="current-password"
            />
            <FormField
              label="Tipo de cuenta"
              name="role"
              as="select"
              value={form.values.role}
              onChange={form.setFromEvent}
              options={[
                { value: USER_ROLES.CUSTOMER, label: 'Cliente' },
                { value: USER_ROLES.EMPLOYEE, label: 'Empleado' },
              ]}
            />
            <FormField
              label="Recordarme"
              name="rememberMe"
              type="checkbox"
              value={form.values.rememberMe}
              onChange={form.setFromEvent}
            />
            <div className="form-actions">
              <Button type="submit" loading={loading}>
                Entrar
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate(ROUTES.REGISTER)}>
                Crear cuenta
              </Button>
            </div>
          </form>
        </div>
      </section>
    </PublicLayout>
  );
}
