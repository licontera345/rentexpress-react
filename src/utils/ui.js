/**
 * Utilidades de UI: paginación, accesibilidad.
 */
import { PAGINATION } from '../constants/index.js';

export function generatePageNumbers(currentPage, totalPages, maxButtons = PAGINATION.MAX_BUTTONS) {
  const pages = [];
  const halfMax = Math.floor(maxButtons / 2);
  let startPage = Math.max(1, currentPage - halfMax);
  const endPage = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
}

export function buildAriaDescribedBy(...ids) {
  const valid = ids.filter(Boolean);
  return valid.length > 0 ? valid.join(' ') : undefined;
}
