import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import Card from '../../../components/common/layout/Card';
import VehicleFilters from '../../../components/vehicle/filters/VehicleFilters';
import VehicleListItem from '../../../components/vehicle/catalog/VehicleListItem';
import VehicleDetailModal from '../../../components/vehicle/modals/VehicleDetailModal';
import MaintenanceInboxModal from '../../../components/vehicle/modals/MaintenanceInboxModal';
import Pagination from '../../../components/common/navigation/Pagination';
import LoadingSpinner from '../../../components/common/feedback/LoadingSpinner';
import EmptyState from '../../../components/common/feedback/EmptyState';
import Alert from '../../../components/common/feedback/Alert';
import VehicleFormModal from '../../../components/vehicle/forms/VehicleFormModal';
import useEmployeeVehicleList from '../../../hooks/useEmployeeVehicleList';
import useHeadquarters from '../../../hooks/useHeadquarters';
import { useAuth } from '../../../hooks/useAuth';
import useVehicleForm, { buildVehiclePayload, mapVehicleToFormData } from '../../../hooks/useVehicleForm';
import VehicleService from '../../../api/services/VehicleService';
import MaintenanceNotificationService from '../../../api/services/MaintenanceNotificationService';
import { ALERT_VARIANTS, MESSAGES, PAGINATION, ROUTES } from '../../../constants';
import { getHeadquartersOptionLabel } from '../../../config/headquartersLabels';

// Página del empleado para gestionar el inventario de vehículos. Encapsula la entrada al módulo de flota.
function VehicleList() {
  const { headquarters, loading: hqLoading } = useHeadquarters();
  const {
    vehicles,
    loading,
    error,
    filters,
    categories,
    statuses,
    pagination,
    filterFields,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handlePageChange,
    loadVehicles
  } = useEmployeeVehicleList({ headquarters });
  const { token } = useAuth();
  const navigate = useNavigate();
  const createForm = useVehicleForm();
  const editForm = useVehicleForm();
  const [pageAlert, setPageAlert] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editVehicleId, setEditVehicleId] = useState(null);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [inboxItems, setInboxItems] = useState([]);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [inboxError, setInboxError] = useState(null);
  const [inboxAlert, setInboxAlert] = useState(null);
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

    return {
      key: notification?.id
        ?? notification?.notificationId
        ?? `${licensePlate ?? 'maintenance'}-${notification?.createdAt ?? notification?.fecha ?? Math.random()}`,
      vehicleId: resolvedVehicleId,
      licensePlate,
      title: title || MESSAGES.VEHICLE_NOT_FOUND,
      description: notification?.description ?? notification?.descripcion ?? notification?.detail ?? '',
      createdAt: notification?.createdAt ?? notification?.fecha,
      raw: notification
    };
  }, [vehicles]);

  const loadMaintenanceInbox = useCallback(async () => {
    setInboxLoading(true);
    setInboxError(null);
    setInboxAlert(null);

    try {
      const response = await MaintenanceNotificationService.getInbox();
      const results = response?.results || response || [];
      setInboxItems(results.map(buildInboxItem));
    } catch (err) {
      setInboxError(err.message || MESSAGES.MAINTENANCE_INBOX_ERROR);
      setInboxItems([]);
    } finally {
      setInboxLoading(false);
    }
  }, [buildInboxItem]);

  const handleOpenInbox = useCallback(() => {
    setIsInboxOpen(true);
    loadMaintenanceInbox().catch(() => {});
  }, [loadMaintenanceInbox]);

  const handleCloseInbox = useCallback(() => {
    setIsInboxOpen(false);
    setInboxAlert(null);
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

  const handleApproveMaintenance = useCallback(async (item) => {
    if (!token) {
      setInboxAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    if (!availableStatusId) {
      setInboxAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.MAINTENANCE_INBOX_MISSING_AVAILABLE_STATUS });
      return;
    }

    setApprovingItems((prev) => {
      const next = new Set(prev);
      next.add(item.key);
      return next;
    });
    setInboxAlert(null);

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

      setInboxItems((prev) => prev.filter((entry) => entry.key !== item.key));
      setInboxAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.MAINTENANCE_INBOX_APPROVED });
      await loadVehicles({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      setInboxAlert({
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

  const handleInboxViewDetails = useCallback((item) => {
    if (!item?.vehicleId) {
      return;
    }
    setSelectedVehicleId(item.vehicleId);
    setIsInboxOpen(false);
  }, []);

  // Opciones de sede para los selectores del formulario.
  const headquartersOptions = useMemo(() => (
    headquarters.map((hq) => ({
      value: hq.headquartersId ?? hq.id,
      label: getHeadquartersOptionLabel(hq)
    }))
  ), [headquarters]);

  // Crea un vehículo nuevo desde el modal de creación.
  const handleCreateVehicle = async (event) => {
    event.preventDefault();

    if (!token) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    setIsSubmitting(true);
    createForm.setFormAlert(null);

    try {
      // Construye el payload y refresca la lista.
      const payload = buildVehiclePayload(createForm.formData);
      await VehicleService.create(payload);
      createForm.setFormAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.VEHICLE_CREATED });
      createForm.resetForm();
      await loadVehicles({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      createForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_SAVING
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Abre el modal de edición y carga el vehículo seleccionado.
  const handleEditVehicle = useCallback(async (vehicleId) => {
    if (!vehicleId) return;
    setIsEditOpen(true);
    setEditVehicleId(vehicleId);
    editForm.setFormAlert(null);

    const cachedVehicle = vehicles.find((item) => (item.vehicleId ?? item.id) === vehicleId);
    if (cachedVehicle) {
      editForm.populateForm(cachedVehicle);
      return;
    }

    setIsEditLoading(true);
    try {
      const vehicle = await VehicleService.findById(vehicleId);
      editForm.populateForm(vehicle);
    } catch (err) {
      editForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_LOADING_DATA
      });
    } finally {
      setIsEditLoading(false);
    }
  }, [editForm, vehicles]);

  // Envía la actualización de un vehículo editado.
  const handleUpdateVehicle = async (event) => {
    event.preventDefault();

    if (!token) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    if (!editVehicleId) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.VEHICLE_NOT_FOUND });
      return;
    }

    setIsSubmitting(true);
    editForm.setFormAlert(null);

    try {
      // Actualiza el vehículo y refresca la lista.
      const payload = buildVehiclePayload(editForm.formData);
      await VehicleService.update(editVehicleId, payload);
      editForm.setFormAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.VEHICLE_UPDATED });
      await loadVehicles({ nextFilters: filters, pageNumber: pagination.pageNumber });
      setIsEditOpen(false);
      setEditVehicleId(null);
      editForm.resetForm();
    } catch (err) {
      editForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_UPDATING
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Elimina un vehículo después de confirmar con el usuario.
  const handleDeleteVehicle = useCallback(async (vehicleId) => {
    if (!vehicleId) return;

    if (!token) {
      setPageAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    const confirmed = window.confirm(MESSAGES.CONFIRM_DELETE_VEHICLE);
    if (!confirmed) return;

    setPageAlert(null);
    try {
      await VehicleService.delete(vehicleId);
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.VEHICLE_DELETED });
      await loadVehicles({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      setPageAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_DELETING
      });
    }
  }, [filters, loadVehicles, pagination.pageNumber, token]);

  // Navega a la creación de reserva desde un vehículo seleccionado.
  const handleReserve = useCallback((vehicle) => {
    if (!vehicle) return;
    const reservationState = {
      vehicleId: vehicle.vehicleId ?? vehicle.id,
      dailyPrice: vehicle.dailyPrice,
      vehicleSummary: {
        brand: vehicle.brand,
        model: vehicle.model,
        licensePlate: vehicle.licensePlate,
        manufactureYear: vehicle.manufactureYear,
        currentMileage: vehicle.currentMileage
      },
      currentHeadquartersId: vehicle.currentHeadquartersId ?? vehicle.headquartersId
    };

    setSelectedVehicleId(null);
    navigate(ROUTES.RESERVATION_CREATE, { state: reservationState });
  }, [navigate]);

  return (
    <PrivateLayout>
      {/* Encabezado y acción para registrar vehículos */}
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <h1>{MESSAGES.VEHICLE_LIST_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.VEHICLE_LIST_SUBTITLE}</p>
          </div>
          <div className="vehicle-list-actions">
            <button
              type="button"
              className="vehicle-inbox-trigger"
              onClick={handleOpenInbox}
              aria-label={MESSAGES.MAINTENANCE_INBOX_OPEN}
            >
              <span>{MESSAGES.MAINTENANCE_INBOX_OPEN}</span>
            </button>
            <button
              type="button"
              className="vehicle-create-trigger"
              onClick={() => setIsCreateOpen(true)}
              aria-label={MESSAGES.ADD_VEHICLE}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M11 5a1 1 0 0 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5z" />
              </svg>
            </button>
          </div>
        </header>

        <Card className="personal-space-card">
          <div className="vehicle-list-layout">
            {/* Panel lateral de filtros */}
            <aside className="vehicle-filter-panel">
              <VehicleFilters
                fields={filterFields}
                values={filters}
                onChange={handleFilterChange}
                onApply={applyFilters}
                onReset={resetFilters}
                title={MESSAGES.FILTER_BY}
                isLoading={loading}
                className="vehicle-filters-panel"
              />
            </aside>

            <div className="vehicle-list-content">
              {/* Encabezado de resultados */}
              <div className="personal-space-card-header">
                <div>
                  <h2>{MESSAGES.RESULTS_TITLE}</h2>
                  <p className="personal-space-subtitle">
                    {MESSAGES.PAGE} {pagination.pageNumber} · {pagination.totalRecords} {MESSAGES.RESULTS}
                  </p>
                </div>
              </div>

              {pageAlert && (
                <Alert
                  type={pageAlert.type}
                  message={pageAlert.message}
                  onClose={() => setPageAlert(null)}
                />
              )}
              {/* Estados de carga, error y vacío */}
              {loading && <LoadingSpinner message="Cargando..." />}
              {!loading && error && (
                <Alert
                  type={ALERT_VARIANTS.ERROR}
                  message={error}
                />
              )}

              {!loading && !error && vehicles.length === 0 && (
                <EmptyState
                  title={MESSAGES.EMPTY_RESULTS}
                  description={MESSAGES.NO_VEHICLES_REGISTERED}
                />
              )}

              {!loading && !error && vehicles.length > 0 && (
                <div className="reservations-list">
                  {vehicles.map((vehicle) => (
                    <VehicleListItem
                      key={vehicle.vehicleId ?? vehicle.id}
                      vehicle={vehicle}
                      onViewDetails={setSelectedVehicleId}
                      onEdit={handleEditVehicle}
                      onDelete={handleDeleteVehicle}
                    />
                  ))}
                </div>
              )}

              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.pageNumber}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  maxButtons={PAGINATION.MAX_BUTTONS}
                />
              )}
            </div>
          </div>
        </Card>
      </section>

      {/* Modal de detalles del vehículo */}
      <VehicleDetailModal
        vehicleId={selectedVehicleId}
        onClose={() => setSelectedVehicleId(null)}
        onReserve={handleReserve}
        showReserveButton={false}
      />

      <MaintenanceInboxModal
        isOpen={isInboxOpen}
        items={inboxItems}
        onClose={handleCloseInbox}
        onApprove={handleApproveMaintenance}
        onViewDetails={handleInboxViewDetails}
        isLoading={inboxLoading}
        error={inboxError}
        approvingIds={approvingItems}
        alert={inboxAlert && {
          ...inboxAlert,
          onClose: () => setInboxAlert(null)
        }}
      />

      {/* Modal para crear vehículo */}
      <VehicleFormModal
        isOpen={isCreateOpen}
        title={MESSAGES.VEHICLE_CREATE_TITLE}
        description={MESSAGES.VEHICLE_CREATE_DESCRIPTION}
        titleId="vehicle-create-title"
        formData={createForm.formData}
        onChange={createForm.handleFormChange}
        onSubmit={handleCreateVehicle}
        onClose={() => setIsCreateOpen(false)}
        categories={categories}
        statuses={statuses}
        headquartersOptions={headquartersOptions}
        hqLoading={hqLoading}
        alert={createForm.formAlert && {
          ...createForm.formAlert,
          onClose: () => createForm.setFormAlert(null)
        }}
        isSubmitting={isSubmitting}
        submitLabel={MESSAGES.ADD_VEHICLE}
      />
      {/* Modal para editar vehículo */}
      <VehicleFormModal
        isOpen={isEditOpen}
        title={MESSAGES.VEHICLE_EDIT_TITLE}
        description={MESSAGES.VEHICLE_EDIT_DESCRIPTION}
        titleId="vehicle-edit-title"
        formData={editForm.formData}
        onChange={editForm.handleFormChange}
        onSubmit={handleUpdateVehicle}
        onClose={() => {
          setIsEditOpen(false);
          setEditVehicleId(null);
          setIsEditLoading(false);
          editForm.resetForm();
        }}
        categories={categories}
        statuses={statuses}
        headquartersOptions={headquartersOptions}
        hqLoading={hqLoading}
        alert={editForm.formAlert && {
          ...editForm.formAlert,
          onClose: () => editForm.setFormAlert(null)
        }}
        isSubmitting={isSubmitting}
        isLoading={isEditLoading}
        submitLabel={MESSAGES.UPDATE_VEHICLE}
      />
    </PrivateLayout>
  );
}

export default VehicleList;
