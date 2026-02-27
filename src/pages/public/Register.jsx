import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicLayout } from '../../components/index.js';
import { FormField, Button } from '../../components/index.js';
import { useForm, useAsync } from '../../hooks/index.js';
import { authService } from '../../api/index.js';
import { ROUTES, DEFAULT_FORM_DATA } from '../../constants/index.js';

export default function Register() {
  const navigate = useNavigate();
  const form = useForm(DEFAULT_FORM_DATA.REGISTER);
  const { run, loading } = useAsync();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (form.values.password !== form.values.confirmPassword) {
        form.setAlert({ type: 'error', message: 'Las contraseñas no coinciden' });
        return;
      }
      try {
        await run(() => authService.register(form.values));
        form.setAlert(null);
        navigate(ROUTES.LOGIN);
      } catch (err) {
        form.setAlert({ type: 'error', message: err?.message ?? 'Error al registrar' });
      }
    },
    [form, navigate, run]
  );

  return (
    <PublicLayout>
      <section className="page-register">
        <div className="register-card card">
          <h1>Crear cuenta</h1>
          {form.alert && (
            <div className={`alert alert-${form.alert.type}`}>{form.alert.message}</div>
          )}
          <form onSubmit={handleSubmit} noValidate>
            <FormField label="Usuario" name="username" value={form.values.username} onChange={form.setFromEvent} required />
            <FormField label="Email" name="email" type="email" value={form.values.email} onChange={form.setFromEvent} required />
            <FormField label="Contraseña" name="password" type="password" value={form.values.password} onChange={form.setFromEvent} required />
            <FormField label="Confirmar contraseña" name="confirmPassword" type="password" value={form.values.confirmPassword} onChange={form.setFromEvent} required />
            <FormField label="Nombre" name="firstName" value={form.values.firstName} onChange={form.setFromEvent} />
            <FormField label="Apellido 1" name="lastName1" value={form.values.lastName1} onChange={form.setFromEvent} />
            <FormField label="Apellido 2" name="lastName2" value={form.values.lastName2} onChange={form.setFromEvent} />
            <FormField label="Teléfono" name="phone" value={form.values.phone} onChange={form.setFromEvent} />
            <div className="form-actions">
              <Button type="submit" loading={loading}>Registrarse</Button>
              <Button type="button" variant="secondary" onClick={() => navigate(ROUTES.LOGIN)}>Volver a entrar</Button>
            </div>
          </form>
        </div>
      </section>
    </PublicLayout>
  );
}
