import { MESSAGES, PAGINATION, PAGINATION_ELLIPSIS } from '../../../constants';
import { generatePageNumbers } from '../../../utils/ui/uiUtils';

// Componente Pagination que define la interfaz y organiza la lógica de esta vista.

function Pagination({ 
  currentPage = PAGINATION.DEFAULT_PAGE, 
  totalPages = PAGINATION.DEFAULT_PAGE, 
  onPageChange,
  maxButtons = PAGINATION.MAX_BUTTONS 
}) {
  const pages = generatePageNumbers(currentPage, totalPages, maxButtons);

  return (
    <div className="pagination">
      <button
        className="pagination-btn pagination-prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title={MESSAGES.PAGINATION_PREV_TITLE}
        type="button"
      >
        {MESSAGES.PAGINATION_PREV}
      </button>

      <div className="pagination-pages">
        {pages[0] > 1 && (
          <>
            <button
              className="pagination-btn"
              onClick={() => onPageChange(1)}
              type="button"
            >
              1
            </button>
            {pages[0] > 2 && <span className="pagination-dots">{PAGINATION_ELLIPSIS}</span>}
          </>
        )}

        {pages.map(page => (
          <button
            key={page}
            className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
            type="button"
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
              className="pagination-btn"
              onClick={() => onPageChange(totalPages)}
              type="button"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        className="pagination-btn pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title={MESSAGES.PAGINATION_NEXT_TITLE}
        type="button"
      >
        {MESSAGES.PAGINATION_NEXT}
      </button>
    </div>
  );
}

export default Pagination;
