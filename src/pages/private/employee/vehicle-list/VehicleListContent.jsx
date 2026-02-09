import Alert from '../../../../components/common/feedback/Alert';
import EmptyState from '../../../../components/common/feedback/EmptyState';
import LoadingSpinner from '../../../../components/common/feedback/LoadingSpinner';
import Pagination from '../../../../components/common/navigation/Pagination';
import VehicleListItem from '../../../../components/vehicle/catalog/VehicleListItem';
import { ALERT_VARIANTS, MESSAGES, PAGINATION } from '../../../../constants';

function VehicleListContent({
  vehicles,
  loading,
  error,
  pagination,
  pageAlert,
  onDismissAlert,
  onViewDetails,
  onEditVehicle,
  onDeleteVehicle,
  onPageChange
}) {
  return (
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
          onClose={onDismissAlert}
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
              key={vehicle.vehicleId}
              vehicle={vehicle}
              onViewDetails={onViewDetails}
              onEdit={onEditVehicle}
              onDelete={onDeleteVehicle}
            />
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.pageNumber}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          maxButtons={PAGINATION.MAX_BUTTONS}
        />
      )}
    </div>
  );
}

export default VehicleListContent;
