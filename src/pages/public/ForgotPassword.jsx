import { PublicLayout } from '../../components/index.js';

export default function ForgotPassword() {
  return (
    <PublicLayout>
      <section className="page-forgot">
        <div className="card">
          <h1>Recuperar contraseña</h1>
          <p>Indica tu email y te enviaremos un enlace para restablecer la contraseña.</p>
          <p className="text-muted">(Pantalla en construcción)</p>
        </div>
      </section>
    </PublicLayout>
  );
}
