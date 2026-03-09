
import { MESSAGES } from '../../constants';

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

/**
 * Devuelve mensaje amigable para errores de red o 5xx (graceful degradation).
 * defaultMessageKey: clave i18n para el mensaje por defecto (ej. ERROR_LOAD_DEFAULT).
 */
export function getFriendlyErrorMessage(err, defaultMessageKey = 'ERROR_LOAD_DEFAULT') {
  if (!err) return MESSAGES[defaultMessageKey];
  const msg = (err.response?.data?.message || err.message || '').toString();
  const status = err.response?.status;
  const is5xx = status >= 500 && status < 600;
  const isNetwork = /network|failed to fetch|load failed|err_connection/i.test(msg) || (err.message && /failed to fetch|network/i.test(err.message));
  if (is5xx || isNetwork) return MESSAGES.ERROR_SERVICE_UNAVAILABLE;
  return msg || MESSAGES[defaultMessageKey];
}
