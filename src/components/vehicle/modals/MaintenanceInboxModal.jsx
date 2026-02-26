import EmptyState from '../../common/feedback/EmptyState';
import Alert from '../../common/feedback/Alert';
import LoadingSpinner from '../../common/feedback/LoadingSpinner';
import { ALERT_VARIANTS, MESSAGES } from '../../../constants';
import { formatDateTime } from '../../../utils/form/formatters';

function MaintenanceInboxModal({
  isOpen,
  items = [],
  onClose,
  onApprove,
  onViewDetails,
  isLoading,
  error,
  approvingIds = new Set(),
  alert
}) {
  if (!isOpen) {
    return null;
  }

  const hasItems = items.length > 0;

  return (
    <div
      className={`modal-backdrop ${isOpen ? 'active' : ''}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="modal-dialog maintenance-inbox-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="maintenance-inbox-title"
        aria-describedby="maintenance-inbox-body"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 id="maintenance-inbox-title">{MESSAGES.MAINTENANCE_INBOX_TITLE}</h2>
            <p className="maintenance-inbox-subtitle">{MESSAGES.MAINTENANCE_INBOX_SUBTITLE}</p>
          </div>
          <button
            className="btn-close"
            onClick={onClose}
            aria-label={MESSAGES.CLOSE}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="modal-body" id="maintenance-inbox-body">
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={alert.onClose}
            />
          )}

          {isLoading && <LoadingSpinner message={MESSAGES.MAINTENANCE_INBOX_LOADING} />}

          {!isLoading && error && (
            <Alert
              type={ALERT_VARIANTS.ERROR}
              message={error}
            />
          )}

          {!isLoading && !error && !hasItems && (
            <EmptyState
              title={MESSAGES.MAINTENANCE_INBOX_EMPTY_TITLE}
              description={MESSAGES.MAINTENANCE_INBOX_EMPTY_DESCRIPTION}
            />
          )}

          {!isLoading && !error && hasItems && (
            <div className="maintenance-inbox-list">
              {items.map((item) => (
                <article className="maintenance-inbox-card" key={item.key}>
                  <header className="maintenance-inbox-card-header">
                    <div>
                      <h3 className="maintenance-inbox-card-title">
                        {item.title}
                      </h3>
                      <p className="maintenance-inbox-card-subtitle">
                        {MESSAGES.MAINTENANCE_INBOX_PLATE_LABEL}: {item.licensePlate || MESSAGES.NOT_AVAILABLE_SHORT}
                      </p>
                    </div>
                    {item.displayDate && (
                      <span className="maintenance-inbox-card-date">
                        {formatDateTime(item.displayDate, { fallback: String(item.displayDate) })}
                      </span>
                    )}
                  </header>

                  <div className="maintenance-inbox-card-body">
                    <p className="maintenance-inbox-card-label">
                      {MESSAGES.MAINTENANCE_INBOX_DESCRIPTION_LABEL}
                    </p>
                    <p className="maintenance-inbox-card-description">
                      {item.description || MESSAGES.NOT_AVAILABLE_SHORT}
                    </p>
                  </div>

                  <div className="maintenance-inbox-card-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => onViewDetails?.(item)}
                      disabled={!item.vehicleId}
                    >
                      {MESSAGES.MAINTENANCE_INBOX_VIEW_DETAILS}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => onApprove?.(item)}
                      disabled={approvingIds.has(item.key)}
                    >
                      {approvingIds.has(item.key)
                        ? MESSAGES.SAVING
                        : MESSAGES.MAINTENANCE_INBOX_APPROVE}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-close-footer" onClick={onClose}>
            {MESSAGES.CLOSE}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MaintenanceInboxModal;
