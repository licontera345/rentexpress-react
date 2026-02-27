import { useCallback, useState } from 'react';
import MaintenanceNotificationService from '../../api/services/MaintenanceNotificationService';
import { getResultsList } from '../../utils/api/apiResponseUtils';
import { ALERT_VARIANTS, MESSAGES } from '../../constants';

function useMaintenanceInbox({ vehicles, token }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [approvingItems, setApprovingItems] = useState(new Set());

  // Construye un item de la bandeja de mantenimiento.
  const buildInboxItem = useCallback((notification) => {
    const vehicleId = notification?.vehicleId
      ?? notification?.vehiculoId
      ?? notification?.idVehiculo
      ?? notification?.vehicle?.vehicleId;

    const licensePlate = notification?.licensePlate
      ?? notification?.matricula
      ?? notification?.vehicle?.licensePlate;

    const matchedVehicle = vehicles.find((vehicle) => (
      licensePlate && vehicle?.licensePlate === licensePlate
    ));

    const resolvedVehicleId = vehicleId ?? matchedVehicle?.vehicleId ?? matchedVehicle?.id;

    const title = [
      notification?.vehicle?.brand ?? matchedVehicle?.brand,
      notification?.vehicle?.model ?? matchedVehicle?.model
    ].filter(Boolean).join(' ');

    const updatedAt = notification?.updateddAt ?? notification?.updatedAt ?? notification?.fecha;
    const createdAtForKey = notification?.createdAt ?? Date.now();

    return {
      key: notification?.id
        ?? notification?.notificationId
        ?? `${licensePlate ?? 'maintenance'}-${createdAtForKey}-${Math.random()}`,
      vehicleId: resolvedVehicleId,
      licensePlate,
      title: title || MESSAGES.VEHICLE_NOT_FOUND,
      description: notification?.description ?? notification?.descripcion ?? notification?.detail ?? '',
      updatedAt: updatedAt,
      displayDate: updatedAt,
      raw: notification
    };
  }, [vehicles]);

  // Carga la bandeja de mantenimiento.
  const loadMaintenanceInbox = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await MaintenanceNotificationService.getInbox();
      const allVehiclesInMaintenance = getResultsList(response);

      const pendingNotifications = allVehiclesInMaintenance.filter(
        (vehicle) => vehicle?.description && vehicle.description.trim() !== ''
      );

      setItems(pendingNotifications.map(buildInboxItem));
    } catch {
      setError(MESSAGES.MAINTENANCE_INBOX_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [buildInboxItem]);

  // Abre la bandeja de mantenimiento.
  const openInbox = useCallback(() => {
    setIsOpen(true);
    loadMaintenanceInbox().catch(() => {});
  }, [loadMaintenanceInbox]);

  // Cierra la bandeja de mantenimiento.
  const closeInbox = useCallback(() => {
    setIsOpen(false);
    setAlert(null);
  }, []);

  // Aprueba el mantenimiento.
  const approveMaintenance = useCallback(async (item) => {
    if (!token) {
      setAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    if (!item?.licensePlate) {
      setAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.VEHICLE_NOT_FOUND });
      return;
    }

    setApprovingItems((prev) => {
      const next = new Set(prev);
      next.add(item.key);
      return next;
    });
    setAlert(null);

    try {
      await MaintenanceNotificationService.notifyFinishMaintenance({
        licensePlate: item.licensePlate,
        description: item.description
      });

      setItems((prev) => prev.filter((entry) => entry.key !== item.key));
      setAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.MAINTENANCE_INBOX_APPROVED });
    } catch (err) {
      setAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.MAINTENANCE_INBOX_APPROVE_ERROR
      });
    } finally {
      setApprovingItems((prev) => {
        const next = new Set(prev);
        next.delete(item.key);
        return next;
      });
    }
  }, [token]);

  // Estado y callbacks para el hook.
  return {
    isOpen,
    items,
    isLoading,
    error,
    alert,
    approvingItems,
    openInbox,
    closeInbox,
    approveMaintenance,
    setAlert
  };
}

export default useMaintenanceInbox;
