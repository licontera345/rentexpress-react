import { useEffect, useState } from 'react';
import PrivateLayout from '../../components/layout/private/PrivateLayout';
import Tabs from '../../components/common/Tabs';
import ReservationsList from '../../components/reservations/ReservationsList';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ReservationService from '../../api/services/ReservationService';
import AuthService from '../../api/services/AuthService';
import { ALERT_TYPES, MESSAGES, RESERVATION_STATUS } from '../../constants';
import './MyReservations.css';

const normalizeStatus = (status) => {
  if (!status) return RESERVATION_STATUS.PENDING;
  const normalized = status.toString().toLowerCase();

  if (normalized.includes('cancel')) return RESERVATION_STATUS.CANCELLED;
  if (normalized.includes('complet') || normalized.includes('final')) return RESERVATION_STATUS.COMPLETED;
  if (normalized.includes('activ') || normalized.includes('vigent')) return RESERVATION_STATUS.ACTIVE;
  if (normalized.includes('pend')) return RESERVATION_STATUS.PENDING;

  return normalized;
};

const calculateTotalDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return Number.isFinite(diff) && diff > 0 ? diff : 0;
};

const buildReservationCard = (reservation) => {
  const vehicle = Array.isArray(reservation.vehicle) ? reservation.vehicle[0] : reservation.vehicle;
  const pickupHeadquarters = Array.isArray(reservation.pickupHeadquarters)
    ? reservation.pickupHeadquarters[0]
    : reservation.pickupHeadquarters;
  const returnHeadquarters = Array.isArray(reservation.returnHeadquarters)
    ? reservation.returnHeadquarters[0]
    : reservation.returnHeadquarters;

  const startDate = reservation.startDate || reservation.pickupDate;
  const endDate = reservation.endDate || reservation.returnDate;
  const totalDays = reservation.totalDays ?? calculateTotalDays(startDate, endDate);
  const dailyPrice = reservation.dailyPrice ?? vehicle?.dailyPrice ?? 0;
  const totalPrice = reservation.totalCost ?? reservation.totalPrice ?? dailyPrice * (totalDays || 1);

  return {
    id: reservation.reservationId ?? reservation.id,
    vehicleBrand: reservation.vehicleBrand ?? vehicle?.brand ?? MESSAGES.NOT_AVAILABLE,
    vehicleModel: reservation.vehicleModel ?? vehicle?.model ?? MESSAGES.NOT_AVAILABLE,
    status: normalizeStatus(reservation.status ?? reservation.reservationStatus?.statusName ?? reservation.reservationStatusName),
    pickupDate: startDate,
    returnDate: endDate,
    pickupLocation: reservation.pickupLocation ?? pickupHeadquarters?.name ?? MESSAGES.NOT_AVAILABLE,
    returnLocation: reservation.returnLocation ?? returnHeadquarters?.name ?? MESSAGES.NOT_AVAILABLE,
    totalDays,
    totalPrice
  };
};

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const token = AuthService.getToken();
        const data = await ReservationService.search({}, token);
        const results = Array.isArray(data) ? data : data?.results ?? [];
        setReservations(results.map(buildReservationCard));
      } catch (error) {
        console.error('Error fetching reservations:', error);
        setAlert({
          type: ALERT_TYPES.ERROR,
          message: MESSAGES.ERROR_LOADING_DATA
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const filterReservations = (filter) => {
    if (filter === RESERVATION_STATUS.ALL) return reservations;
    return reservations.filter(r => r.status?.toLowerCase() === filter);
  };

  const handleCancel = async (reservationId) => {
    if (!window.confirm(MESSAGES.CONFIRM_CANCEL)) {
      return;
    }

    try {
      const token = AuthService.getToken();
      await ReservationService.delete(reservationId, token);
      setReservations(prev => prev.filter(r => r.id !== reservationId));
    } catch (error) {
      console.error('Error canceling reservation:', error);
      setAlert({
        type: ALERT_TYPES.ERROR,
        message: MESSAGES.ERROR_DELETING
      });
    }
  };

  const tabs = [
    { label: MESSAGES.TAB_ALL, content: <ReservationsList reservations={filterReservations(RESERVATION_STATUS.ALL)} onCancel={handleCancel} /> },
    { label: MESSAGES.TAB_ACTIVE, content: <ReservationsList reservations={filterReservations(RESERVATION_STATUS.ACTIVE)} onCancel={handleCancel} /> },
    { label: MESSAGES.TAB_COMPLETED, content: <ReservationsList reservations={filterReservations(RESERVATION_STATUS.COMPLETED)} onCancel={handleCancel} /> },
    { label: MESSAGES.TAB_CANCELLED, content: <ReservationsList reservations={filterReservations(RESERVATION_STATUS.CANCELLED)} onCancel={handleCancel} /> }
  ];

  if (loading) {
    return (
      <PrivateLayout>
        <LoadingSpinner />
      </PrivateLayout>
    );
  }

  if (!reservations.length) {
    return (
      <PrivateLayout>
        <div className="my-reservations">
          <div className="page-header">
            <h1>{MESSAGES.MY_RESERVATIONS_TITLE}</h1>
          </div>
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}
          <p>{MESSAGES.NO_RESERVATIONS}</p>
        </div>
      </PrivateLayout>
    );
  }

  return (
    <PrivateLayout>
      <div className="my-reservations">
        <div className="page-header">
          <h1>{MESSAGES.MY_RESERVATIONS_TITLE}</h1>
        </div>
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}
        <Tabs tabs={tabs} />
      </div>
    </PrivateLayout>
  );
}

export default MyReservations;
