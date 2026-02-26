import { useCallback, useState } from 'react';
import ReservationService from '../../api/services/ReservationService';
import RentalService from '../../api/services/RentalService';
import { ALERT_VARIANTS, MESSAGES } from '../../constants';

function usePickupVerificationPage() {
  const [pickupCode, setPickupCode] = useState('');
  const [reservation, setReservation] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [alert, setAlert] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleCodeChange = useCallback((e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setPickupCode(value);
    if (alert) setAlert(null);
    if (reservation) {
      setReservation(null);
      setConfirmed(false);
    }
  }, [alert, reservation]);

  const handleVerifyCode = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (!pickupCode || pickupCode.trim().length < 4) {
      setAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.PICKUP_CODE_REQUIRED });
      return;
    }
    setIsVerifying(true);
    setAlert(null);
    setReservation(null);
    setConfirmed(false);
    try {
      const result = await ReservationService.verifyPickupCode(pickupCode.trim());
      if (!result) {
        setAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.PICKUP_CODE_INVALID });
        return;
      }
      setReservation(result);
    } catch {
      setAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.PICKUP_CODE_INVALID });
    } finally {
      setIsVerifying(false);
    }
  }, [pickupCode]);

  const handleConfirmPickup = useCallback(async () => {
    if (!reservation) return;
    setIsConfirming(true);
    setAlert(null);
    try {
      // Km inicial = km al verificar código de recogida. Km final = mismo valor al crear; se actualiza al confirmar devolución.
      const kmAtPickup = reservation.vehicle?.[0]?.currentMileage ?? 0;
      const payload = { ...reservation, initialKm: kmAtPickup, finalKm: kmAtPickup };
      await RentalService.createFromReservation(payload);
      setConfirmed(true);
      setAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.PICKUP_CONFIRMED });
    } catch {
      setAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.PICKUP_CONFIRM_ERROR });
    } finally {
      setIsConfirming(false);
    }
  }, [reservation]);

  const handleReset = useCallback(() => {
    setPickupCode('');
    setReservation(null);
    setAlert(null);
    setConfirmed(false);
  }, []);

  return {
    state: { pickupCode, reservation, confirmed },
    ui: { isVerifying, isConfirming, alert },
    actions: {
      handleCodeChange,
      handleVerifyCode,
      handleConfirmPickup,
      handleReset,
      setAlert
    }
  };
}

export default usePickupVerificationPage;
