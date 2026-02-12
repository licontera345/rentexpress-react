import Alert from '../../common/feedback/Alert';
import EmptyState from '../../common/feedback/EmptyState';
import LoadingSpinner from '../../common/feedback/LoadingSpinner';
import Pagination from '../../common/navigation/Pagination';
import { ALERT_VARIANTS, MESSAGES, PAGINATION } from '../../../constants';
import ClientListItem from './ClientListItem';

function ClientResultsPanel({
  loading,
  error,
  pageAlert,
  onCloseAlert,
  clients,
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

      {pageAlert && <Alert type={pageAlert.type} message={pageAlert.message} onClose={onCloseAlert} />}
      {loading && <LoadingSpinner message={MESSAGES.LOADING} />}
      {!loading && error && <Alert type={ALERT_VARIANTS.ERROR} message={error} />}

      {!loading && !error && clients.length === 0 && (
        <EmptyState
          title={MESSAGES.EMPTY_RESULTS}
          description={MESSAGES.NO_USERS_REGISTERED}
        />
      )}

      {!loading && !error && clients.length > 0 && (
        <div className="reservations-list">
          {clients.map((client) => (
            <ClientListItem
              key={client.userId ?? client.id}
              client={client}
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

export default ClientResultsPanel;
