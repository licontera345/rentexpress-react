import { Link } from 'react-router-dom';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import Card from '../../../components/common/layout/Card';
import ReservationListItem from '../../../components/reservations/list/ReservationListItem';
import useClientMyReservationsPage from '../../../hooks/useClientMyReservationsPage';
import { MESSAGES, ROUTES } from '../../../constants';

function MyReservations() {
  const { reservations, loading, error, hasReservations } = useClientMyReservationsPage();

  return (
    <PrivateLayout>
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <h1>{MESSAGES.MY_RESERVATIONS_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.MY_RESERVATIONS_SUBTITLE}</p>
          </div>
          {hasReservations && (
            <div className="personal-space-meta">
              <span className="personal-space-meta-label">{MESSAGES.RESERVATIONS_COUNT}</span>
              <span className="personal-space-meta-value">{reservations.length}</span>
            </div>
          )}
        </header>

        {loading && (
          <Card className="personal-space-card">
            <p>{MESSAGES.LOADING}</p>
          </Card>
        )}

        {!loading && error && (
          <Card className="personal-space-card">
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          </Card>
        )}

        {!loading && !error && !hasReservations && (
          <Card className="personal-space-card">
            <p>{MESSAGES.MY_RESERVATIONS_EMPTY}</p>
            <Link className="btn btn-primary btn-small personal-space-card-link" to={ROUTES.CATALOG}>
              {MESSAGES.NAV_CATALOG}
            </Link>
          </Card>
        )}

        {!loading && !error && hasReservations && (
          <div className="reservations-list">
            {reservations.map((reservation, index) => (
              <ReservationListItem
                key={reservation?.reservationId || reservation?.id || `reservation-${index}`}
                reservation={reservation}
              />
            ))}
          </div>
        )}
      </section>
    </PrivateLayout>
  );
}

export default MyReservations;
