import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import Card from '../../../components/common/layout/Card';
import VehicleFilters from '../../../components/common/filters/VehicleFilters';
import VehicleListItem from '../../../components/common/catalog/VehicleListItem';
import VehicleDetailModal from '../../../components/common/modal/VehicleDetailModal';
import Pagination from '../../../components/common/navigation/Pagination';
import LoadingSpinner from '../../../components/common/feedback/LoadingSpinner';
import EmptyState from '../../../components/common/feedback/EmptyState';
import Alert from '../../../components/common/feedback/Alert';
import VehicleFormModal from '../../../components/common/forms/VehicleFormModal';
import useEmployeeVehicleList from '../../../hooks/useEmployeeVehicleList';
import useHeadquarters from '../../../hooks/useHeadquarters';
import { useAuth } from '../../../hooks/useAuth';
import useVehicleForm, { buildVehiclePayload } from '../../../hooks/useVehicleForm';
import VehicleService from '../../../api/services/VehicleService';
import { ALERT_VARIANTS, MESSAGES, PAGINATION, ROUTES } from '../../../constants';
import { getHeadquartersOptionLabel } from '../../../config/headquartersLabels';

function VehicleList() {
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
  } = useEmployeeVehicleList();
  const { headquarters, loading: hqLoading } = useHeadquarters();
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

  const headquartersOptions = useMemo(() => (
    headquarters.map((hq) => ({
      value: hq.headquartersId ?? hq.id,
      label: getHeadquartersOptionLabel(hq)
    }))
  ), [headquarters]);

  const resolvedFilterFields = useMemo(() => (
    filterFields.map((field) => {
      if (field.name !== 'currentHeadquartersId') {
        return field;
      }

      return Object.assign({}, field, {
        options: headquartersOptions
      });
    })
  ), [filterFields, headquartersOptions]);

  const handleCreateVehicle = async (event) => {
    event.preventDefault();

    if (!token) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    setIsSubmitting(true);
    createForm.setFormAlert(null);

    try {
      const payload = buildVehiclePayload(createForm.formData);
      await VehicleService.create(payload, token);
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
      const payload = buildVehiclePayload(editForm.formData);
      await VehicleService.update(editVehicleId, payload, token);
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
      await VehicleService.delete(vehicleId, token);
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.VEHICLE_DELETED });
      await loadVehicles({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      setPageAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_DELETING
      });
    }
  }, [filters, loadVehicles, pagination.pageNumber, token]);

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
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <h1>{MESSAGES.VEHICLE_LIST_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.VEHICLE_LIST_SUBTITLE}</p>
          </div>
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
        </header>

        <Card className="personal-space-card">
          <div className="vehicle-list-layout">
            <aside className="vehicle-filter-panel">
              <VehicleFilters
                fields={resolvedFilterFields}
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

      <VehicleDetailModal
        vehicleId={selectedVehicleId}
        onClose={() => setSelectedVehicleId(null)}
        onReserve={handleReserve}
        showReserveButton={false}
      />

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
