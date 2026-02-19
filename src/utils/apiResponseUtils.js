/**
 * Utilidades para normalizar respuestas de la API.
 * Acepta tanto formato con "results" como con "content" (p. ej. Spring Page)
 * para evitar listas vacías cuando el backend devuelve otro shape.
 */

/**
 * Extrae el array de ítems de una respuesta (paginated o lista).
 * @param {*} response - Objeto de respuesta (p. ej. { results: [] } o { content: [] })
 * @returns {Array}
 */
export function getResultsList(response) {
  if (response == null) return [];
  if (Array.isArray(response)) return response;
  const list = response.results ?? response.content ?? response.data;
  return Array.isArray(list) ? list : [];
}

/**
 * Extrae metadatos de paginación de una respuesta.
 * Compatible con { totalRecords, totalPages, pageNumber } y
 * { totalElements, totalPages, number } (Spring 0-based).
 * @param {*} response
 * @param {{ pageNumber?: number, pageSize?: number }} fallbacks
 * @param {number} [resultsLength] - longitud del array de ítems para inferir totalRecords si la API no lo envía
 * @returns {{ totalRecords: number, totalPages: number, pageNumber: number }}
 */
export function getPaginatedMeta(response, fallbacks = {}, resultsLength = 0) {
  const pageSize = response?.pageSize ?? response?.size ?? fallbacks.pageSize ?? 10;
  const totalRecords =
    response?.totalRecords ??
    response?.totalElements ??
    response?.totalItems ??
    (resultsLength > 0 ? resultsLength : 0);
  const totalPages =
    response?.totalPages ?? Math.max(1, Math.ceil(totalRecords / pageSize));
  const pageNumber =
    response?.pageNumber ??
    (response?.number != null ? response.number + 1 : fallbacks.pageNumber ?? 1);
  return { totalRecords, totalPages, pageNumber };
}
