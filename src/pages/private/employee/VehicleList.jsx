import { useMemo } from 'react';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import Card from '../../../components/common/layout/Card';
import VehicleFilters from '../../../components/common/filters/VehicleFilters';
import VehicleListItem from '../../../components/common/catalog/VehicleListItem';
import VehicleDetailModal from '../../../components/common/modal/VehicleDetailModal';
import LoadingSpinner from '../../../components/common/feedback/LoadingSpinner';
import EmptyState from '../../../components/common/feedback/EmptyState';
import Button from '../../../components/common/actions/Button';
import VehicleForm from '../../../components/vehicles/VehicleForm';
import useVehicleManagement from '../../../hooks/useVehicleManagement';
import useHeadquarters from '../../../hooks/useHeadquarters';
import { BUTTON_SIZES, BUTTON_VARIANTS, MESSAGES } from '../../../constants';

function VehicleList() {
  const {
    vehicles,
    categories,
    statuses,
    filters,
    loading,
    formLoading,
    error,
    fieldErrors,
    statusMessage,
    errorMessage,
    formData,
    editingVehicleId,
    selectedVehicleId,
    setSelectedVehicleId,
    brandOptions,
    applyFilters,
    resetFilters,
    handleFilterChange,
    handleFormChange,
    handleSubmit,
    startCreate,
    startEdit,
    handleDelete
  } = useVehicleManagement();

  const { headquarters, loading: headquartersLoading } = useHeadquarters();

  const filterFields = useMemo(() => ([
    {
      name: 'brand',
      label: MESSAGES.BRAND,
      type: 'text',
      placeholder: MESSAGES.PLACEHOLDER_BRAND,
      datalist: brandOptions
    },
    {
      name: 'model',
      label: MESSAGES.MODEL,
      type: 'text',
      placeholder: MESSAGES.PLACEHOLDER_MODEL
    },
    {
      name: 'licensePlate',
      label: MESSAGES.LICENSE_PLATE,
      type: 'text',
      placeholder: MESSAGES.PLACEHOLDER_LICENSE_PLATE
    },
    {
      name: 'categoryId',
      label: MESSAGES.CATEGORY,
      type: 'select',
      placeholder: MESSAGES.SELECT_CATEGORY,
      options: categories.map((category) => ({
        value: category.categoryId ?? category.id,
        label: category.name
      }))
    },
    {
      name: 'vehicleStatusId',
      label: MESSAGES.STATUS,
      type: 'select',
      placeholder: MESSAGES.SELECT_STATUS,
      options: statuses.map((status) => ({
        value: status.vehicleStatusId ?? status.id,
        label: status.name
      }))
    },
    {
      name: 'minPrice',
      label: MESSAGES.MIN_PRICE,
      type: 'number',
      placeholder: MESSAGES.MIN_PRICE
    },
    {
      name: 'maxPrice',
      label: MESSAGES.MAX_PRICE,
      type: 'number',
      placeholder: MESSAGES.MAX_PRICE
    },
    {
      name: 'activeStatus',
      label: MESSAGES.ACTIVE_STATUS,
      type: 'select',
      placeholder: MESSAGES.SELECT_STATUS,
      options: [
        { value: 'true', label: MESSAGES.ACTIVE },
        { value: 'false', label: MESSAGES.INACTIVE }
      ]
    }
  ]), [brandOptions, categories, statuses]);

  return (
    <PrivateLayout>
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <h1>{MESSAGES.VEHICLE_LIST_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.VEHICLE_LIST_SUBTITLE}</p>
          </div>
          <Button
            variant={BUTTON_VARIANTS.PRIMARY}
            size={BUTTON_SIZES.SMALL}
            onClick={startCreate}
          >
            {MESSAGES.ADD}
          </Button>
        </header>

        <div className="vehicle-admin-layout">
          <Card className="personal-space-card vehicle-admin-card">
            <div className="vehicle-admin-card-header">
              <div>
                <h2>{MESSAGES.VEHICLE_ADMIN_LIST_TITLE}</h2>
                <p className="vehicle-admin-subtitle">{MESSAGES.VEHICLE_ADMIN_LIST_SUBTITLE}</p>
              </div>
              <span className="vehicle-admin-count">{vehicles.length}</span>
            </div>

            <VehicleFilters
              fields={filterFields}
              values={filters}
              onChange={handleFilterChange}
              onApply={applyFilters}
              onReset={resetFilters}
              className="vehicle-admin-filters"
              isLoading={loading}
            />

            {loading && (
              <LoadingSpinner message={MESSAGES.LOADING} />
            )}

            {!loading && error && (
              <p className="vehicle-admin-error" role="alert">{error}</p>
            )}

            {!loading && !error && vehicles.length === 0 && (
              <EmptyState
                title={MESSAGES.NO_VEHICLES_REGISTERED}
                description={MESSAGES.VEHICLE_ADMIN_EMPTY_SUBTITLE}
              />
            )}

            {!loading && !error && vehicles.length > 0 && (
              <div className="vehicle-admin-list">
                {vehicles.map((vehicle) => (
                  <VehicleListItem
                    key={vehicle.vehicleId ?? vehicle.id}
                    vehicle={vehicle}
                    onViewDetails={setSelectedVehicleId}
                    onEdit={startEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </Card>

          <Card className="personal-space-card vehicle-admin-card">
            <VehicleForm
              formData={formData}
              fieldErrors={fieldErrors}
              categories={categories}
              statuses={statuses}
              headquarters={headquarters}
              isLoading={formLoading || headquartersLoading}
              isEditing={Boolean(editingVehicleId)}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              onCancel={startCreate}
              statusMessage={statusMessage}
              errorMessage={errorMessage}
            />
          </Card>
        </div>

        <VehicleDetailModal
          vehicleId={selectedVehicleId}
          onClose={() => setSelectedVehicleId(null)}
          showReserve={false}
        />
      </section>
    </PrivateLayout>
  );
}

export default VehicleList;
