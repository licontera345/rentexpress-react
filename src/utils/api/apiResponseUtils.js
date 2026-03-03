
export function getResultsList(response) {
  if (response == null) return [];
  if (Array.isArray(response)) return response;
  const list = response.results;
  return Array.isArray(list) ? list : [];
}

export function getPaginatedMeta(response, fallbacks = {}, resultsLength = 0) {
  const pageSize = response?.pageSize ?? fallbacks.pageSize ?? 10;
  const totalRecords = response?.totalRecords ?? (resultsLength > 0 ? resultsLength : 0);
  const totalPages = response?.totalPages ?? Math.max(1, Math.ceil(totalRecords / pageSize));
  const pageNumber = response?.pageNumber ?? fallbacks.pageNumber ?? 1;
  return { totalRecords, totalPages, pageNumber };
}
