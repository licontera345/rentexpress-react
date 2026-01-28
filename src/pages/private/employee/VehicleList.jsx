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
import Button from '../../../components/common/actions/Button';
import FormField from '../../../components/common/forms/FormField';
import useEmployeeVehicleList from '../../../hooks/useEmployeeVehicleList';
import useHeadquarters from '../../../hooks/useHeadquarters';
import { useAuth } from '../../../hooks/useAuth';
import VehicleService from '../../../api/services/VehicleService';
import { ALERT_VARIANTS, MESSAGES, PAGINATION, ROUTES } from '../../../constants';

const DEFAULT_FORM_DATA = {
  brand: '',
  model: '',
  licensePlate: '',
  dailyPrice: '',
  currentMileage: '',
  manufactureYear: '',
  vinNumber: '',
  categoryId: '',
  vehicleStatusId: '',
  currentHeadquartersId: ''
};

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
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [formAlert, setFormAlert] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const headquartersOptions = useMemo(() => (
    headquarters.map((hq) => ({
      value: hq.headquartersId ?? hq.id,
      label: hq.headquartersName ?? hq.name
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

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => Object.assign({}, prev, {
      [name]: value
    }));
  };

  const handleCreateVehicle = async (event) => {
    event.preventDefault();

    if (!token) {
      setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    setIsSubmitting(true);
    setFormAlert(null);

    try {
      const payload = {
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        licensePlate: formData.licensePlate.trim(),
        dailyPrice: Number(formData.dailyPrice),
        currentMileage: formData.currentMileage ? Number(formData.currentMileage) : 0,
        manufactureYear: Number(formData.manufactureYear),
        vinNumber: formData.vinNumber.trim(),
        categoryId: Number(formData.categoryId),
        vehicleStatusId: Number(formData.vehicleStatusId),
        currentHeadquartersId: Number(formData.currentHeadquartersId)
      };

      await VehicleService.create(payload, token);
      setFormAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.VEHICLE_CREATED });
      setFormData(DEFAULT_FORM_DATA);
      await loadVehicles({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_SAVING
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <div
        className={`modal-backdrop ${isCreateOpen ? 'active' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-create-title"
        onClick={() => setIsCreateOpen(false)}
      >
        <div className="modal-dialog vehicle-create-modal" onClick={(event) => event.stopPropagation()}>
          <div className="modal-header">
            <h2 id="vehicle-create-title">{MESSAGES.VEHICLE_CREATE_TITLE}</h2>
            <button className="btn-close" type="button" onClick={() => setIsCreateOpen(false)} aria-label={MESSAGES.CLOSE}>
              ×
            </button>
          </div>
          <div className="modal-body">
            <div className="vehicle-create-intro">
              <p className="vehicle-create-description">{MESSAGES.VEHICLE_CREATE_DESCRIPTION}</p>
              <p className="vehicle-create-required">
                {MESSAGES.REQUIRED_FIELDS_PREFIX} <span className="required">*</span> {MESSAGES.REQUIRED_FIELDS_SUFFIX}
              </p>
            </div>
            {formAlert && (
              <Alert
                type={formAlert.type}
                message={formAlert.message}
                onClose={() => setFormAlert(null)}
              />
            )}
            <form className="vehicle-create-form" onSubmit={handleCreateVehicle}>
              <section className="vehicle-create-section">
                <div className="vehicle-create-section-header">
                  <h3>{MESSAGES.VEHICLE_SECTION_IDENTIFICATION}</h3>
                </div>
                <div className="vehicle-create-grid">
                  <FormField
                    label={MESSAGES.BRAND}
                    name="brand"
                    value={formData.brand}
                    onChange={handleFormChange}
                    placeholder={MESSAGES.PLACEHOLDER_BRAND}
                    required
                  />
                  <FormField
                    label={MESSAGES.MODEL}
                    name="model"
                    value={formData.model}
                    onChange={handleFormChange}
                    placeholder={MESSAGES.MODEL_PLACEHOLDER}
                    required
                  />
                  <FormField
                    label={MESSAGES.YEAR}
                    name="manufactureYear"
                    type="number"
                    value={formData.manufactureYear}
                    onChange={handleFormChange}
                    placeholder={MESSAGES.YEAR_PLACEHOLDER}
                    min={1900}
                    step={1}
                    required
                  />
                  <FormField
                    label={MESSAGES.LICENSE_PLATE}
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleFormChange}
                    placeholder={MESSAGES.LICENSE_PLATE_PLACEHOLDER}
                    required
                  />
                  <FormField
                    label={MESSAGES.VIN}
                    name="vinNumber"
                    value={formData.vinNumber}
                    onChange={handleFormChange}
                    placeholder={MESSAGES.VIN_PLACEHOLDER}
                    helper={MESSAGES.VIN_HELPER}
                    required
                  />
                </div>
              </section>

              <section className="vehicle-create-section">
                <div className="vehicle-create-section-header">
                  <h3>{MESSAGES.VEHICLE_SECTION_OPERATION}</h3>
                </div>
                <div className="vehicle-create-grid">
                  <FormField
                    label={MESSAGES.CATEGORY}
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleFormChange}
                    as="select"
                    required
                  >
                    <option value="">{MESSAGES.SELECT_CATEGORY}</option>
                    {categories.map((category) => (
                      <option key={category.categoryId ?? category.id} value={category.categoryId ?? category.id}>
                        {category.categoryName ?? category.name}
                      </option>
                    ))}
                  </FormField>
                  <FormField
                    label={MESSAGES.STATUS}
                    name="vehicleStatusId"
                    value={formData.vehicleStatusId}
                    onChange={handleFormChange}
                    as="select"
                    required
                  >
                    <option value="">{MESSAGES.SELECT_STATUS}</option>
                    {statuses.map((status) => (
                      <option key={status.vehicleStatusId ?? status.id} value={status.vehicleStatusId ?? status.id}>
                        {status.statusName ?? status.name}
                      </option>
                    ))}
                  </FormField>
                  <FormField
                    label={MESSAGES.HEADQUARTERS_LABEL}
                    name="currentHeadquartersId"
                    value={formData.currentHeadquartersId}
                    onChange={handleFormChange}
                    as="select"
                    required
                    disabled={hqLoading}
                  >
                    <option value="">{MESSAGES.SELECT_LOCATION}</option>
                    {headquartersOptions.map((hq) => (
                      <option key={hq.value} value={hq.value}>
                        {hq.label}
                      </option>
                    ))}
                  </FormField>
                </div>
              </section>

              <section className="vehicle-create-section">
                <div className="vehicle-create-section-header">
                  <h3>{MESSAGES.VEHICLE_SECTION_COST}</h3>
                </div>
                <div className="vehicle-create-grid">
                  <FormField
                    label={MESSAGES.DAILY_PRICE}
                    name="dailyPrice"
                    type="number"
                    value={formData.dailyPrice}
                    onChange={handleFormChange}
                    placeholder={MESSAGES.DAILY_PRICE_PLACEHOLDER}
                    min={0}
                    step={0.01}
                    prefix="€"
                    required
                  />
                  <FormField
                    label={MESSAGES.MILEAGE}
                    name="currentMileage"
                    type="number"
                    value={formData.currentMileage}
                    onChange={handleFormChange}
                    placeholder={MESSAGES.MILEAGE_PLACEHOLDER}
                    min={0}
                    step={1}
                    suffix="km"
                  />
                </div>
              </section>

              <div className="vehicle-create-footer">
                <p className="form-helper">{MESSAGES.VEHICLE_CREATE_REVIEW}</p>
                <div className="vehicle-create-actions">
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    {MESSAGES.CANCEL}
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {MESSAGES.ADD_VEHICLE}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}

export default VehicleList;
