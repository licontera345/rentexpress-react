import { MESSAGES, PAGINATION, PAGINATION_ELLIPSIS } from '../../../constants';
import { generatePageNumbers } from '../../../utils/ui/uiUtils';

// Componente Pagination que define la interfaz y organiza la lógica de esta vista.

function Pagination({ 
  currentPage = PAGINATION.DEFAULT_PAGE, 
  totalPages = PAGINATION.DEFAULT_PAGE, 
  onPageChange,
  maxButtons = PAGINATION.MAX_BUTTONS,
  variant
}) {
  const pages = generatePageNumbers(currentPage, totalPages, maxButtons);
  const isCatalog = variant === 'catalog';
  const wrapClass = isCatalog ? 'catalog-pagination' : 'pagination';
  const btnClass = isCatalog ? 'catalog-pag-btn' : 'pagination-btn';
  const dotsClass = isCatalog ? 'catalog-pag-dots' : 'pagination-dots';

  return (
    <div className={wrapClass}>
      <button
        className={`${btnClass} ${isCatalog ? '' : 'pagination-prev'}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title={MESSAGES.PAGINATION_PREV_TITLE}
        type="button"
      >
        {isCatalog ? '‹' : MESSAGES.PAGINATION_PREV}
      </button>

      <div className={isCatalog ? '' : 'pagination-pages'} style={isCatalog ? { display: 'flex', alignItems: 'center', gap: 6 } : undefined}>
        {pages[0] > 1 && (
          <>
            <button
              className={btnClass}
              onClick={() => onPageChange(1)}
              type="button"
            >
              1
            </button>
            {pages[0] > 2 && <span className={dotsClass}>{PAGINATION_ELLIPSIS}</span>}
          </>
        )}

        {pages.map(page => (
          <button
            key={page}
            className={`${btnClass} ${page === currentPage ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
            type="button"
          >
            {page}
          </button>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className={dotsClass}>{PAGINATION_ELLIPSIS}</span>
            )}
            <button
              className={btnClass}
              onClick={() => onPageChange(totalPages)}
              type="button"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        className={`${btnClass} ${isCatalog ? '' : 'pagination-next'}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        title={MESSAGES.PAGINATION_NEXT_TITLE}
        type="button"
      >
        {isCatalog ? '›' : MESSAGES.PAGINATION_NEXT}
      </button>
    </div>
  );
}

export default Pagination;
