// Utilidades para componentes de UI.

// Genera un array de números de página para paginación.
export const generatePageNumbers = (currentPage, totalPages, maxButtons) => {
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

// Limita un índice de tab dentro del rango válido.
export const clampTabIndex = (index, tabsLength) => {
  if (tabsLength === 0) {
    return 0;
  }
  return Math.min(Math.max(index, 0), tabsLength - 1);
};

// Construye clases CSS a partir de un array de valores.
export const buildClassName = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Construye el atributo aria-describedby a partir de IDs.
export const buildAriaDescribedBy = (...ids) => {
  const validIds = ids.filter(Boolean);
  return validIds.length > 0 ? validIds.join(' ') : undefined;
};

// Hace scroll suave hacia arriba de la página.
export const scrollToTop = (behavior = 'smooth') => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior });
  }
};
