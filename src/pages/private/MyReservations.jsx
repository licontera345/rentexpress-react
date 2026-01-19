import { useState } from 'react';
import PrivateLayout from '../../components/layout/private/PrivateLayout';
import Tabs from '../../components/common/Tabs';
import ReservationsList from '../../components/reservations/ReservationsList';
import { MESSAGES, RESERVATION_STATUS } from '../../constants';
import './MyReservations.css';

function MyReservations() {
  const [reservations, setReservations] = useState([]);

  const filterReservations = (filter) => {
    if (filter === RESERVATION_STATUS.ALL) return reservations;
    return reservations.filter(r => r.status?.toLowerCase() === filter);
  };

  const handleCancel = (reservationId) => {
    if (window.confirm(MESSAGES.CONFIRM_CANCEL)) {
      setReservations(prev => prev.filter(r => r.id !== reservationId));
    }
  };

  const tabs = [
    { label: MESSAGES.TAB_ALL, content: <ReservationsList reservations={filterReservations(RESERVATION_STATUS.ALL)} onCancel={handleCancel} /> },
    { label: MESSAGES.TAB_ACTIVE, content: <ReservationsList reservations={filterReservations(RESERVATION_STATUS.ACTIVE)} onCancel={handleCancel} /> },
    { label: MESSAGES.TAB_COMPLETED, content: <ReservationsList reservations={filterReservations(RESERVATION_STATUS.COMPLETED)} onCancel={handleCancel} /> },
    { label: MESSAGES.TAB_CANCELLED, content: <ReservationsList reservations={filterReservations(RESERVATION_STATUS.CANCELLED)} onCancel={handleCancel} /> }
  ];

  if (!reservations.length) return (
    <PrivateLayout>
      <div className="my-reservations">
        <div className="page-header">
          <h1>{MESSAGES.MY_RESERVATIONS_TITLE}</h1>
        </div>
        <p>{MESSAGES.NO_RESERVATIONS}</p>
      </div>
    </PrivateLayout>
  );

  return (
    <PrivateLayout>
      <div className="my-reservations">
        <div className="page-header">
          <h1>{MESSAGES.MY_RESERVATIONS_TITLE}</h1>
        </div>
        <Tabs tabs={tabs} />
      </div>
    </PrivateLayout>
  );
}

export default MyReservations;