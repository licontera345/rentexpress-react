import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PrivateLayout from '../../components/layout/private/PrivateLayout';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { MESSAGES, ROUTES, BUTTON_VARIANTS, ALERT_TYPES, RESERVATION_STATUS } from '../../constants';
import './ReservationDetails.css';

function ReservationDetails() {
  const navigate = useNavigate();
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    fetchReservation();
  }, [fetchReservation]);

  const fetchReservation = useCallback(async () => {
    try {
      // TODO: Implementar API call para obtener reserva
      // const data = await ReservationService.getById(reservationId);
      // setReservation(data);
      
      // Mock data
      setReservation({
        id: reservationId,
        vehicleId: 1,
        vehicleBrand: 'Toyota',
        vehicleModel: 'Corolla',
        vehicleYear: 2024,
        status: RESERVATION_STATUS.ACTIVE,
        pickupDate: '2024-03-15',
        pickupTime: '10:00',
        returnDate: '2024-03-18',
        returnTime: '14:00',
        pickupLocation: 'Sede Centro',
        returnLocation: 'Sede Centro',
        dailyPrice: 50,
        totalDays: 3,
        totalPrice: 150,
        driver: 'Juan Pérez',
        insurance: 'Cobertura Total',
        notes: 'Vehículo en excelente estado'
      });
    } catch (error) {
      console.error('Error fetching reservation:', error);
      setAlert({
        type: ALERT_TYPES.ERROR,
        message: MESSAGES.ERROR_LOADING_DATA
      });
    } finally {
      setLoading(false);
    }
  }, [reservationId]);

  const handleCancel = async () => {
    if (!window.confirm(MESSAGES.CONFIRM_CANCEL_RESERVATION)) {
      return;
    }

    setCanceling(true);
    try {
      // TODO: Implementar API call para cancelar reserva
      // await ReservationService.cancel(reservationId);
      
      setAlert({
        type: ALERT_TYPES.SUCCESS,
        message: MESSAGES.RESERVATION_CANCELLED
      });

      setTimeout(() => {
        navigate(ROUTES.MY_RESERVATIONS);
      }, 1500);
    } catch (error) {
      console.error('Error canceling reservation:', error);
      setAlert({
        type: ALERT_TYPES.ERROR,
        message: MESSAGES.ERROR_DELETING
      });
    } finally {
      setCanceling(false);
    }
  };

  const formatDate = (dateStr) => {
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
    }).format(price);
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
              <span className="label">Número de días:</span>
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

          {/* Estado */}
          <div className="status-section">
            <div className={`status-badge status-${reservation.status}`}>
              {reservation.status === RESERVATION_STATUS.ACTIVE && MESSAGES.RESERVATION_STATUS_ACTIVE}
              {reservation.status === RESERVATION_STATUS.COMPLETED && MESSAGES.RESERVATION_STATUS_COMPLETED}
              {reservation.status === RESERVATION_STATUS.CANCELLED && MESSAGES.RESERVATION_STATUS_CANCELLED}
            </div>
          </div>

          {/* Actions */}
          <div className="details-actions">
            {reservation.status === RESERVATION_STATUS.ACTIVE && (
              <Button
                variant={BUTTON_VARIANTS.DANGER}
                size="large"
                onClick={handleCancel}
                loading={canceling}
              >
                ❌ {MESSAGES.CANCEL}
              </Button>
            )}
            <Button
              variant={BUTTON_VARIANTS.SECONDARY}
              size="large"
              onClick={() => navigate(ROUTES.MY_RESERVATIONS)}
            >
              ← {MESSAGES.BACK}
            </Button>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}

export default ReservationDetails;
