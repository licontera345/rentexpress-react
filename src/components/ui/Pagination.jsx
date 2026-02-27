import { PAGINATION, PAGINATION_ELLIPSIS } from '../../constants/index.js';
import { generatePageNumbers } from '../../utils/ui.js';

/**
 * Paginación. Etiquetas por props (prevLabel, nextLabel).
 */
export function Pagination({
  currentPage = PAGINATION.DEFAULT_PAGE,
  totalPages = 1,
  onPageChange,
  maxButtons = PAGINATION.MAX_BUTTONS,
  prevLabel = 'Anterior',
  nextLabel = 'Siguiente',
}) {
  const pages = generatePageNumbers(currentPage, totalPages, maxButtons);

  return (
    <nav className="pagination" aria-label="Paginación">
      <button
        type="button"
        className="pagination-btn pagination-prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        title={prevLabel}
      >
        {prevLabel}
      </button>
      <div className="pagination-pages">
        {pages[0] > 1 && (
          <>
            <button
              type="button"
              className="pagination-btn"
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {pages[0] > 2 && <span className="pagination-dots">{PAGINATION_ELLIPSIS}</span>}
          </>
        )}
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="pagination-dots">{PAGINATION_ELLIPSIS}</span>
            )}
            <button
              type="button"
              className="pagination-btn"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
      <button
        type="button"
        className="pagination-btn pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        title={nextLabel}
      >
        {nextLabel}
      </button>
    </nav>
  );
}

export default Pagination;
