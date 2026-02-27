import Alert from '../feedback/Alert';
import EmptyState from '../feedback/EmptyState';
import LoadingSpinner from '../feedback/LoadingSpinner';
import Pagination from '../navigation/Pagination';
import { ALERT_VARIANTS, MESSAGES, PAGINATION } from '../../../constants';

function ListResultsPanel({
  title = MESSAGES.RESULTS_TITLE,
  subtitle: subtitleProp,
  pageAlert,
  onCloseAlert,
  loading,
  loadingMessage = MESSAGES.LOADING,
  error,
  emptyTitle = MESSAGES.EMPTY_RESULTS,
  emptyDescription,
  hasItems,
  children,
  pagination,
  onPageChange,
  maxButtons = PAGINATION.MAX_BUTTONS
}) {
  const subtitle = subtitleProp ?? (pagination
    ? `${MESSAGES.PAGE} ${pagination.pageNumber} · ${pagination.totalRecords} ${MESSAGES.RESULTS}`
    : null);

  return (
    <div className="vehicle-list-content">
      <div className="personal-space-card-header">
        <div>
          <h2>{title}</h2>
          {subtitle != null && <p className="personal-space-subtitle">{subtitle}</p>}
        </div>
      </div>

      {pageAlert && (
        <Alert
          type={pageAlert.type}
          message={pageAlert.message}
          onClose={onCloseAlert}
        />
      )}
      {loading && <LoadingSpinner message={loadingMessage} />}
      {!loading && error && (
        <Alert type={ALERT_VARIANTS.ERROR} message={error} />
      )}
      {!loading && !error && !hasItems && emptyDescription && (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
      {!loading && !error && hasItems && (
        <div className="reservations-list">{children}</div>
      )}
      {pagination?.totalPages > 1 && (
        <Pagination
          currentPage={pagination.pageNumber}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          maxButtons={maxButtons}
        />
      )}
    </div>
  );
}

export default ListResultsPanel;
