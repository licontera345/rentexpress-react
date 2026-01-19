import EmptyState from '../common/EmptyState';
import Button from '../common/Button';
import ReservationCard from './ReservationCard';
import './ReservationsList.css';

function ReservationsList({ reservations, onCancel }) {
  if (!reservations || reservations.length === 0) {
    return (
      <EmptyState
        title="No hay reservas"
        description="No tienes reservas en este filtro"
        actionButton={
          <Button 
            variant="primary"
            onClick={() => window.location.href = '/catalog'}
          >
            Hacer una Reserva
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
