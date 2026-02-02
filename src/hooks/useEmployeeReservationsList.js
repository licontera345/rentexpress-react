import { useCallback, useEffect, useState } from 'react';
import ReservationService from '../api/services/ReservationService';
import { MESSAGES, PAGINATION } from '../constants';
import useLocale from './useLocale';
import {
  enrichReservations,
  normalizeReservationResults,
  resolveReservationErrorMessage
} from '../utils/reservationData';

const useEmployeeReservationsList = () => {
  const locale = useLocale();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pageNumber: PAGINATION.DEFAULT_PAGE,
    totalPages: PAGINATION.DEFAULT_PAGE,
    totalRecords: 0
  });

  const loadReservations = useCallback(async ({ pageNumber = PAGINATION.DEFAULT_PAGE } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ReservationService.search({
        pageNumber,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE
      });
      const results = normalizeReservationResults(response);
      const totalRecords = response?.totalRecords ?? results.length;
      const totalPages = response?.totalPages
        ?? Math.max(1, Math.ceil(totalRecords / PAGINATION.DEFAULT_PAGE_SIZE));
      const hydratedReservations = await enrichReservations(results, {
        canFetchStatuses: true,
        isoCode: locale
      });

      setReservations(hydratedReservations);
      setPagination({
        pageNumber: response?.pageNumber ?? pageNumber,
        totalPages,
        totalRecords
      });
    } catch (err) {
      setError(resolveReservationErrorMessage(err) || MESSAGES.ERROR_LOADING_DATA);
      setReservations([]);
      setPagination({
        pageNumber: PAGINATION.DEFAULT_PAGE,
        totalPages: PAGINATION.DEFAULT_PAGE,
        totalRecords: 0
      });
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    loadReservations({ pageNumber: PAGINATION.DEFAULT_PAGE });
  }, [loadReservations]);

  const handlePageChange = useCallback((nextPage) => {
    loadReservations({ pageNumber: nextPage }).catch(() => {});
  }, [loadReservations]);

  return {
    reservations,
    loading,
    error,
    pagination,
    loadReservations,
    handlePageChange
  };
};

export default useEmployeeReservationsList;
