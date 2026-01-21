import { Link } from 'react-router-dom';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import Card from '../../../components/common/layout/Card';
import { MESSAGES, ROUTES } from '../../../constants';

function MyReservations() {
  return (
    <PrivateLayout>
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <h1>{MESSAGES.MY_RESERVATIONS_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.MY_RESERVATIONS_SUBTITLE}</p>
          </div>
        </header>

        <Card className="personal-space-card">
          <p>{MESSAGES.MY_RESERVATIONS_EMPTY}</p>
          <Link className="btn btn-primary btn-small personal-space-card-link" to={ROUTES.SEARCH_VEHICLES}>
            {MESSAGES.SEARCH_VEHICLES}
          </Link>
        </Card>
      </section>
    </PrivateLayout>
  );
}

export default MyReservations;
