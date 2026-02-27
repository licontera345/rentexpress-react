import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/index.js';
import { ROUTES } from '../../constants/index.js';

export default function NotFound() {
  return (
    <PublicLayout>
      <section className="page-not-found">
        <div className="card">
          <h1>404</h1>
          <p>Página no encontrada.</p>
          <Link to={ROUTES.HOME} className="btn btn-primary">Ir al inicio</Link>
        </div>
      </section>
    </PublicLayout>
  );
}
