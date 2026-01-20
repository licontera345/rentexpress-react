import './Navigation.css';

function Pagination({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange,
  maxButtons = 5 
}) {
  const generatePages = () => {
    const pages = [];
    const halfMax = Math.floor(maxButtons / 2);
    let startPage = Math.max(1, currentPage - halfMax);
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pages = generatePages();

  return (
    <div className="pagination">
      <button
        className="pagination-btn pagination-prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        title="Página anterior"
        type="button"
      >
        ← Anterior
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
            {pages[0] > 2 && <span className="pagination-dots">...</span>}
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
            {pages[pages.length - 1] < totalPages - 1 && <span className="pagination-dots">...</span>}
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
        title="Página siguiente"
        type="button"
      >
        Siguiente →
      </button>
    </div>
  );
}

export default Pagination;
