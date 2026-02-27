import { PublicLayout } from '../../components/index.js';

export default function ResetPassword() {
  return (
    <PublicLayout>
      <section className="page-reset">
        <div className="card">
          <h1>Nueva contraseña</h1>
          <p>Introduce el token y la nueva contraseña.</p>
          <p className="text-muted">(Pantalla en construcción)</p>
        </div>
      </section>
    </PublicLayout>
  );
}
