import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/common/layout/Card';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import VehicleFilters from '../../../components/vehicle/filters/VehicleFilters';
import useEmployeeVehicleList from '../../../hooks/useEmployeeVehicleList';
import useHeadquarters from '../../../hooks/useHeadquarters';
import useMaintenanceInbox from '../../../hooks/useMaintenanceInbox';
import { useAuth } from '../../../hooks/useAuth';
import useVehicleForm, { buildVehiclePayload } from '../../../hooks/useVehicleForm';
import VehicleService from '../../../api/services/VehicleService';
import { ALERT_VARIANTS, MESSAGES, ROUTES } from '../../../constants';
import { getHeadquartersOptionLabel } from '../../../config/headquartersLabels';
import VehicleListContent from './vehicle-list/VehicleListContent';
import VehicleListHeader from './vehicle-list/VehicleListHeader';
import VehicleListModals from './vehicle-list/VehicleListModals';

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
  const {
    isOpen: isInboxOpen,
    items: inboxItems,
    isLoading: inboxLoading,
    error: inboxError,
    alert: inboxAlert,
    approvingItems,
    openInbox: handleOpenInbox,
    closeInbox: handleCloseInbox,
    approveMaintenance: handleApproveMaintenance,
    setAlert: setInboxAlert
  } = useMaintenanceInbox({
    vehicles,
    statuses,
    token,
    filters,
    pagination,
    loadVehicles
  });

  const handleInboxViewDetails = useCallback((item) => {
    if (!item?.vehicleId) {
      return;
    }
    setSelectedVehicleId(item.vehicleId);
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

  const handleCloseEditModal = () => {
    setIsEditOpen(false);
    setEditVehicleId(null);
    setIsEditLoading(false);
    editForm.resetForm();
  };

  return (
    <PrivateLayout>
      <section className="personal-space">
        <VehicleListHeader
          onOpenInbox={handleOpenInbox}
          onCreateVehicle={() => setIsCreateOpen(true)}
        />

        <Card className="personal-space-card">
          <div className="vehicle-list-layout">
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

            <VehicleListContent
              vehicles={vehicles}
              loading={loading}
              error={error}
              pagination={pagination}
              pageAlert={pageAlert}
              onDismissAlert={() => setPageAlert(null)}
              onViewDetails={setSelectedVehicleId}
              onEditVehicle={handleEditVehicle}
              onDeleteVehicle={handleDeleteVehicle}
              onPageChange={handlePageChange}
            />
          </div>
        </Card>
      </section>

      <VehicleListModals
        selectedVehicleId={selectedVehicleId}
        onCloseVehicleDetails={() => setSelectedVehicleId(null)}
        onReserve={handleReserve}
        inbox={{
          isOpen: isInboxOpen,
          items: inboxItems,
          onClose: handleCloseInbox,
          onApprove: handleApproveMaintenance,
          onViewDetails: handleInboxViewDetails,
          isLoading: inboxLoading,
          error: inboxError,
          approvingIds: approvingItems,
          alert: inboxAlert,
          onDismissAlert: () => setInboxAlert(null)
        }}
        createForm={createForm}
        editForm={editForm}
        categories={categories}
        statuses={statuses}
        headquartersOptions={headquartersOptions}
        hqLoading={hqLoading}
        isCreateOpen={isCreateOpen}
        onCloseCreate={() => setIsCreateOpen(false)}
        onSubmitCreate={handleCreateVehicle}
        isEditOpen={isEditOpen}
        onCloseEdit={handleCloseEditModal}
        onSubmitEdit={handleUpdateVehicle}
        isSubmitting={isSubmitting}
        isEditLoading={isEditLoading}
      />
    </PrivateLayout>
  );
}

export default VehicleList;
