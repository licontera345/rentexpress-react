import { Link } from 'react-router-dom';
import { PublicLayout } from '../../components/index.js';
import { ROUTES } from '../../constants/index.js';

export default function Home() {
  return (
    <PublicLayout>
      <section className="page-home">
        <div className="hero">
          <h1>RentExpress</h1>
          <p className="hero-tagline">Alquiler de vehículos</p>
          <Link to={ROUTES.CATALOG} className="btn btn-primary">
            Ver catálogo
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
