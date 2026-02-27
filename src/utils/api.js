/**
 * Helpers para respuestas de la API (listas y paginación).
 * Nombres según package-rentexpress.json; no normalizar atributos.
 */
export function getResultsList(response) {
  if (response == null) return [];
  if (Array.isArray(response)) return response;
  const list =
    response.results ??
    response.content ??
    response.data ??
    response.provinces ??
    response.cities;
  return Array.isArray(list) ? list : [];
}

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
