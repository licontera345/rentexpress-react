import { Link } from 'react-router-dom';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import Card from '../../../components/common/layout/Card';
import ReservationListItem from '../../../components/reservations/list/ReservationListItem';
import useClientMyReservationsPage from '../../../hooks/useClientMyReservationsPage';
import { MESSAGES, ROUTES } from '../../../constants';

function MyReservations() {
  const { state, ui, meta } = useClientMyReservationsPage();

  return (
    <PrivateLayout>
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <h1>{MESSAGES.MY_RESERVATIONS_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.MY_RESERVATIONS_SUBTITLE}</p>
          </div>
          {meta.hasReservations && (
            <div className="personal-space-meta">
              <span className="personal-space-meta-label">{MESSAGES.RESERVATIONS_COUNT}</span>
              <span className="personal-space-meta-value">{state.reservations.length}</span>
            </div>
          )}
        </header>

        {ui.isLoading && (
          <Card className="personal-space-card">
            <p>{MESSAGES.LOADING}</p>
          </Card>
        )}

        {!ui.isLoading && ui.error && (
          <Card className="personal-space-card">
            <div className="alert alert-error">
              <span>{ui.error}</span>
            </div>
          </Card>
        )}

        {!ui.isLoading && !ui.error && !meta.hasReservations && (
          <Card className="personal-space-card">
            <p>{MESSAGES.MY_RESERVATIONS_EMPTY}</p>
            <Link className="btn btn-primary btn-small personal-space-card-link" to={ROUTES.CATALOG}>
              {MESSAGES.NAV_CATALOG}
            </Link>
          </Card>
        )}

        {!ui.isLoading && !ui.error && meta.hasReservations && (
          <div className="reservations-list">
            {state.reservations.map((reservation, index) => (
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
