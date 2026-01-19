import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PrivateLayout from '../../components/layout/private/PrivateLayout';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ReservationService from '../../api/services/ReservationService';
import AuthService from '../../api/services/AuthService';
import { MESSAGES, ROUTES, BUTTON_VARIANTS, ALERT_TYPES, RESERVATION_STATUS } from '../../constants';
import './ReservationDetails.css';

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

const formatTime = (dateStr) => {
  if (!dateStr) return MESSAGES.NOT_AVAILABLE;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return MESSAGES.NOT_AVAILABLE;
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

const buildReservationDetails = (data, reservationId) => {
  const vehicle = Array.isArray(data.vehicle) ? data.vehicle[0] : data.vehicle;
  const pickupHeadquarters = Array.isArray(data.pickupHeadquarters)
    ? data.pickupHeadquarters[0]
    : data.pickupHeadquarters;
  const returnHeadquarters = Array.isArray(data.returnHeadquarters)
    ? data.returnHeadquarters[0]
    : data.returnHeadquarters;

  const startDate = data.startDate || data.pickupDate;
  const endDate = data.endDate || data.returnDate;
  const totalDays = data.totalDays ?? calculateTotalDays(startDate, endDate);
  const dailyPrice = data.dailyPrice ?? vehicle?.dailyPrice ?? 0;
  const totalPrice = data.totalCost ?? data.totalPrice ?? dailyPrice * (totalDays || 1);

  return {
    id: data.reservationId ?? data.id ?? reservationId,
    vehicleId: data.vehicleId ?? vehicle?.vehicleId,
    vehicleBrand: data.vehicleBrand ?? vehicle?.brand ?? MESSAGES.NOT_AVAILABLE,
    vehicleModel: data.vehicleModel ?? vehicle?.model ?? MESSAGES.NOT_AVAILABLE,
    vehicleYear: data.vehicleYear ?? vehicle?.manufactureYear ?? MESSAGES.NOT_AVAILABLE,
    status: normalizeStatus(data.status ?? data.reservationStatus?.statusName ?? data.reservationStatusName),
    pickupDate: startDate,
    pickupTime: data.pickupTime ?? formatTime(startDate),
    returnDate: endDate,
    returnTime: data.returnTime ?? formatTime(endDate),
    pickupLocation: data.pickupLocation ?? pickupHeadquarters?.name ?? MESSAGES.NOT_AVAILABLE,
    returnLocation: data.returnLocation ?? returnHeadquarters?.name ?? MESSAGES.NOT_AVAILABLE,
    dailyPrice,
    totalDays,
    totalPrice,
    driver: data.driver ?? MESSAGES.NOT_AVAILABLE,
    insurance: data.insurance ?? MESSAGES.NOT_AVAILABLE,
    notes: data.notes
  };
};

function ReservationDetails() {
  const navigate = useNavigate();
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [canceling, setCanceling] = useState(false);

  const fetchReservation = useCallback(async () => {
    try {
      const token = AuthService.getToken();
      if (!token) {
        setAlert({
          type: ALERT_TYPES.ERROR,
          message: MESSAGES.LOGIN_REQUIRED
        });
        setLoading(false);
        navigate(ROUTES.LOGIN);
        return;
      }
      const data = await ReservationService.findById(reservationId, token);
      setReservation(buildReservationDetails(data, reservationId));
    } catch (error) {
      console.error('Error fetching reservation:', error);
      if (error?.status === 401) {
        AuthService.logout();
        setAlert({
          type: ALERT_TYPES.ERROR,
          message: MESSAGES.SESSION_EXPIRED
        });
        navigate(ROUTES.LOGIN);
        return;
      }
      setAlert({
        type: ALERT_TYPES.ERROR,
        message: MESSAGES.ERROR_LOADING_DATA
      });
    } finally {
      setLoading(false);
    }
  }, [navigate, reservationId]);

  useEffect(() => {
    fetchReservation();
  }, [fetchReservation]);

  const handleCancel = async () => {
    if (!window.confirm(MESSAGES.CONFIRM_CANCEL_RESERVATION)) {
      return;
    }

    setCanceling(true);
    try {
      const token = AuthService.getToken();
      if (!token) {
        setAlert({
          type: ALERT_TYPES.ERROR,
          message: MESSAGES.LOGIN_REQUIRED
        });
        navigate(ROUTES.LOGIN);
        return;
      }
      await ReservationService.delete(reservationId, token);

      setAlert({
        type: ALERT_TYPES.SUCCESS,
        message: MESSAGES.RESERVATION_CANCELLED
      });

      setTimeout(() => {
        navigate(ROUTES.MY_RESERVATIONS);
      }, 1500);
    } catch (error) {
      console.error('Error canceling reservation:', error);
      if (error?.status === 401) {
        AuthService.logout();
        setAlert({
          type: ALERT_TYPES.ERROR,
          message: MESSAGES.SESSION_EXPIRED
        });
        navigate(ROUTES.LOGIN);
        return;
      }
      setAlert({
        type: ALERT_TYPES.ERROR,
        message: MESSAGES.ERROR_DELETING
      });
    } finally {
      setCanceling(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return MESSAGES.NOT_AVAILABLE;
    return new Date(dateStr).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'COP'
    }).format(price || 0);
  };

  if (loading) {
    return (
      <PrivateLayout>
        <LoadingSpinner />
      </PrivateLayout>
    );
  }

  if (!reservation) {
    return (
      <PrivateLayout>
        <Alert type={ALERT_TYPES.ERROR} message={MESSAGES.NOT_FOUND} onClose={() => {}} />
      </PrivateLayout>
    );
  }

  return (
    <PrivateLayout>
      <div className="reservation-details-container">
        <div className="details-header">
          <button className="back-button" onClick={() => navigate(ROUTES.MY_RESERVATIONS)}>
            ← {MESSAGES.BACK}
          </button>
          <h1>{MESSAGES.RESERVATION_DETAILS}</h1>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="details-content">
          {/* Información del Vehículo */}
          <div className="details-card">
            <h2>🚗 Vehículo</h2>
            <div className="detail-row">
              <span className="label">Modelo:</span>
              <span className="value">{reservation.vehicleBrand} {reservation.vehicleModel} {reservation.vehicleYear}</span>
            </div>
          </div>

          {/* Fechas y Horarios */}
          <div className="details-card">
            <h2>📅 Fechas y Horarios</h2>
            <div className="detail-row">
              <span className="label">Recogida:</span>
              <span className="value">
                {formatDate(reservation.pickupDate)} a las {reservation.pickupTime}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Devolución:</span>
              <span className="value">
                {formatDate(reservation.returnDate)} a las {reservation.returnTime}
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Duración:</span>
              <span className="value">{reservation.totalDays} días</span>
            </div>
          </div>

          {/* Ubicaciones */}
          <div className="details-card">
            <h2>📍 Ubicaciones</h2>
            <div className="detail-row">
              <span className="label">Recogida:</span>
              <span className="value">{reservation.pickupLocation}</span>
            </div>
            <div className="detail-row">
              <span className="label">Devolución:</span>
              <span className="value">{reservation.returnLocation}</span>
            </div>
          </div>

          {/* Información del Conductor */}
          <div className="details-card">
            <h2>👤 Información del Conductor</h2>
            <div className="detail-row">
              <span className="label">Conductor:</span>
              <span className="value">{reservation.driver}</span>
            </div>
            <div className="detail-row">
              <span className="label">Seguro:</span>
              <span className="value">{reservation.insurance}</span>
            </div>
          </div>

          {/* Resumen de Costos */}
          <div className="details-card cost-summary">
            <h2>💰 Resumen de Costos</h2>
            <div className="detail-row">
              <span className="label">Precio por día:</span>
              <span className="value">{formatPrice(reservation.dailyPrice)}</span>
            </div>
            <div className="detail-row">
              <span className="label">Días de alquiler:</span>
              <span className="value">{reservation.totalDays}</span>
            </div>
            <div className="detail-row total">
              <span className="label">Total:</span>
              <span className="value">{formatPrice(reservation.totalPrice)}</span>
            </div>
          </div>

          {/* Notas */}
          {reservation.notes && (
            <div className="details-card">
              <h2>📝 Notas</h2>
              <p className="notes-text">{reservation.notes}</p>
            </div>
          )}

          {/* Estado de la Reserva */}
          <div className="details-card status-card">
            <h2>📋 Estado de la Reserva</h2>
            <div className={`status-badge status-${reservation.status}`}>
              {reservation.status === RESERVATION_STATUS.ACTIVE && MESSAGES.RESERVATION_STATUS_ACTIVE}
              {reservation.status === RESERVATION_STATUS.COMPLETED && MESSAGES.RESERVATION_STATUS_COMPLETED}
              {reservation.status === RESERVATION_STATUS.CANCELLED && MESSAGES.RESERVATION_STATUS_CANCELLED}
              {reservation.status === RESERVATION_STATUS.PENDING && MESSAGES.RESERVATION_STATUS_PENDING}
            </div>
          </div>

          {/* Acciones */}
          {reservation.status === RESERVATION_STATUS.ACTIVE && (
            <div className="details-actions">
              <Button
                variant={BUTTON_VARIANTS.OUTLINE}
                onClick={handleCancel}
                disabled={canceling}
              >
                {canceling ? MESSAGES.CANCELING : MESSAGES.CANCEL_RESERVATION}
              </Button>
            </div>
          )}
        </div>
      </div>
    </PrivateLayout>
  );
}

export default ReservationDetails;
