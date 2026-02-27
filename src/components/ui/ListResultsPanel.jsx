import Alert from '../feedback/Alert.jsx';
import Loading from '../feedback/Loading.jsx';
import Empty from '../feedback/Empty.jsx';
import Pagination from './Pagination.jsx';
import { ALERT_VARIANTS } from '../../constants/index.js';

/**
 * Panel que unifica: alerta de página, loading, error, empty y contenido (tabla/lista) + paginación.
 * Un solo componente para no repetir la misma estructura en cada lista.
 */
export function ListResultsPanel({
  title,
  subtitle,
  pageAlert,
  onCloseAlert,
  loading,
  loadingMessage,
  error,
  emptyTitle,
  emptyDescription,
  hasItems,
  children,
  pagination,
  onPageChange,
  maxButtons,
}) {
  const showEmpty = !loading && !error && !hasItems;
  const showContent = !loading && !error && hasItems;

  return (
    <div className="list-results-panel">
      {(title || subtitle) && (
        <div className="list-results-panel-header">
          {title && <h2>{title}</h2>}
          {subtitle != null && <p className="list-results-subtitle">{subtitle}</p>}
        </div>
      )}
      {pageAlert && (
        <Alert
          type={pageAlert.type}
          message={pageAlert.message}
          onClose={onCloseAlert}
        />
      )}
      {loading && <Loading message={loadingMessage} />}
      {!loading && error && (
        <Alert type={ALERT_VARIANTS.ERROR} message={error} />
      )}
      {showEmpty && (emptyTitle || emptyDescription) && (
        <Empty title={emptyTitle} description={emptyDescription} />
      )}
      {showContent && <div className="list-results-content">{children}</div>}
      {showContent && pagination?.totalPages > 1 && (
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
