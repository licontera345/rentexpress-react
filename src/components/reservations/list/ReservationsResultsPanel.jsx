import PropTypes from 'prop-types';
import Alert from '../../common/feedback/Alert';
import EmptyState from '../../common/feedback/EmptyState';
import LoadingSpinner from '../../common/feedback/LoadingSpinner';
import Pagination from '../../common/navigation/Pagination';
import ReservationListItem from './ReservationListItem';
import { ALERT_VARIANTS, MESSAGES, PAGINATION } from '../../../constants';

function ReservationsResultsPanel({
  pageAlert,
  onCloseAlert,
  loading,
  error,
  reservations,
  pagination,
  onEdit,
  onDelete,
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
          onClose={onCloseAlert}
        />
      )}
      {loading && <LoadingSpinner message={MESSAGES.LOADING} />}
      {!loading && error && (
        <Alert
          type={ALERT_VARIANTS.ERROR}
          message={error}
        />
      )}

      {!loading && !error && reservations.length === 0 && (
        <EmptyState
          title={MESSAGES.EMPTY_RESULTS}
          description={MESSAGES.NO_RESERVATIONS_REGISTERED}
        />
      )}

      {!loading && !error && reservations.length > 0 && (
        <div className="reservations-list">
          {reservations.map((reservation) => (
            <ReservationListItem
              key={reservation.reservationId ?? reservation.id}
              reservation={reservation}
              onEdit={onEdit}
              onDelete={onDelete}
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

ReservationsResultsPanel.propTypes = {
  pageAlert: PropTypes.shape({
    type: PropTypes.string,
    message: PropTypes.string
  }),
  onCloseAlert: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  reservations: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  pagination: PropTypes.shape({
    pageNumber: PropTypes.number,
    totalRecords: PropTypes.number,
    totalPages: PropTypes.number
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired
};

ReservationsResultsPanel.defaultProps = {
  pageAlert: null,
  error: null
};

export default ReservationsResultsPanel;
