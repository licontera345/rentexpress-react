import { useCallback, useMemo, useState } from 'react';
import MaintenanceNotificationService from '../api/services/MaintenanceNotificationService';
import VehicleService from '../api/services/VehicleService';
import { ALERT_VARIANTS, MESSAGES } from '../constants';
import { buildVehiclePayload, mapVehicleToFormData } from './useVehicleForm';

function useMaintenanceInbox({ vehicles, statuses, token, filters, pagination, loadVehicles }) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [alert, setAlert] = useState(null);
  const [approvingItems, setApprovingItems] = useState(new Set());

  const availableStatusId = useMemo(() => {
    const normalized = statuses.map((status) => ({
      id: status.vehicleStatusId ?? status.id,
      name: (status.statusName ?? status.name ?? '').toString().trim().toLowerCase()
    }));
    const availableStatus = normalized.find((status) => (
      status.name === 'disponible' || status.name === 'available'
    ));
    return availableStatus?.id;
  }, [statuses]);

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

    const updatedAt = notification?.updated_at;
    const createdAt = notification?.createdAt ?? notification?.fecha;

    return {
      key: notification?.id
        ?? notification?.notificationId
        ?? `${licensePlate ?? 'maintenance'}-${createdAt ?? Math.random()}`,
      vehicleId: resolvedVehicleId,
      licensePlate,
      title: title || MESSAGES.VEHICLE_NOT_FOUND,
      description: notification?.description ?? notification?.descripcion ?? notification?.detail ?? '',
      createdAt,
      updatedAt,
      displayDate: updatedAt ?? createdAt,
      raw: notification
    };
  }, [vehicles]);

  const loadMaintenanceInbox = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await MaintenanceNotificationService.getInbox();
      const allVehiclesInMaintenance = response?.results || response || [];

      const pendingNotifications = allVehiclesInMaintenance.filter(
        (vehicle) => vehicle?.description && vehicle.description.trim() !== ''
      );

      setItems(pendingNotifications.map(buildInboxItem));
    } catch (err) {
      setError(MESSAGES.MAINTENANCE_INBOX_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [buildInboxItem]);

  const openInbox = useCallback(() => {
    setIsOpen(true);
    loadMaintenanceInbox().catch(() => {});
  }, [loadMaintenanceInbox]);

  const closeInbox = useCallback(() => {
    setIsOpen(false);
    setAlert(null);
  }, []);

  const resolveVehicleId = useCallback(async (item) => {
    if (item.vehicleId) {
      return item.vehicleId;
    }

    if (!item.licensePlate) {
      return null;
    }

    const response = await VehicleService.search({ licensePlate: item.licensePlate });
    const results = response?.results || response || [];
    const vehicle = results[0];
    return vehicle?.vehicleId ?? vehicle?.id ?? null;
  }, []);

  const approveMaintenance = useCallback(async (item) => {
    if (!token) {
      setAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    if (!availableStatusId) {
      setAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.MAINTENANCE_INBOX_MISSING_AVAILABLE_STATUS });
      return;
    }

    setApprovingItems((prev) => {
      const next = new Set(prev);
      next.add(item.key);
      return next;
    });
    setAlert(null);

    try {
      const vehicleId = await resolveVehicleId(item);
      if (!vehicleId) {
        throw new Error(MESSAGES.VEHICLE_NOT_FOUND);
      }

      const vehicle = await VehicleService.findById(vehicleId);
      const formData = mapVehicleToFormData(vehicle);
      formData.vehicleStatusId = String(availableStatusId);
      const payload = buildVehiclePayload(formData);

      await VehicleService.update(vehicleId, payload);

      setItems((prev) => prev.filter((entry) => entry.key !== item.key));
      setAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.MAINTENANCE_INBOX_APPROVED });
      await loadVehicles({ nextFilters: filters, pageNumber: pagination.pageNumber });
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
  }, [availableStatusId, filters, loadVehicles, pagination.pageNumber, resolveVehicleId, token]);

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
