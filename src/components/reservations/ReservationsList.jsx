import { useNavigate } from 'react-router-dom';
import EmptyState from '../common/EmptyState';
import Button from '../common/Button';
import ReservationCard from './ReservationCard';
import { MESSAGES, ROUTES, BUTTON_VARIANTS } from '../../constants';
import './ReservationsList.css';

function ReservationsList({ reservations, onCancel }) {
  const navigate = useNavigate();

  if (!reservations || reservations.length === 0) {
    return (
      <EmptyState
        title={MESSAGES.EMPTY_RESERVATIONS}
        description={MESSAGES.NO_RESERVATIONS}
        actionButton={
          <Button 
            variant={BUTTON_VARIANTS.PRIMARY}
            onClick={() => navigate(ROUTES.CATALOG)}
          >
            {MESSAGES.RESERVE}
          </Button>
        }
      />
    );
  }

  return (
    <div className="reservations-list">
      {reservations.map(reservation => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
}

export default ReservationsList;
