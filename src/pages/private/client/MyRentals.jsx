import { Link } from 'react-router-dom';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import Card from '../../../components/common/layout/Card';
import { MESSAGES, ROUTES } from '../../../constants';

// Página del cliente con el historial de alquileres.
function MyRentals() {
  return (
    <PrivateLayout>
      {/* Encabezado del espacio personal del cliente */}
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <h1>{MESSAGES.MY_RENTALS_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.MY_RENTALS_SUBTITLE}</p>
          </div>
        </header>

        {/* Tarjeta con estado vacío y CTA al catálogo */}
        <Card className="personal-space-card">
          <p>{MESSAGES.MY_RENTALS_EMPTY}</p>
          <Link className="btn btn-primary btn-small personal-space-card-link" to={ROUTES.CATALOG}>
            {MESSAGES.NAV_CATALOG}
          </Link>
        </Card>
      </section>
    </PrivateLayout>
  );
}

export default MyRentals;
