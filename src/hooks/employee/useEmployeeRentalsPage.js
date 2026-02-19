import { useCallback, useEffect, useMemo, useState } from 'react';
import RentalService from '../../api/services/RentalService';
import { RentalStatusService } from '../../api/services/CatalogService';
import { ALERT_VARIANTS, MESSAGES, PAGINATION } from '../../constants';
import { buildRentalFilterFields } from '../../utils/filterFieldBuilders';
import { getResultsList } from '../../utils/apiResponseUtils';
import {
  EMPLOYEE_RENTAL_DEFAULT_FILTERS,
  buildRentalSearchCriteria
} from '../../utils/rentalEmployeeUtils';
import {
  RENTAL_FORM_INITIAL_DATA,
  mapRentalToFormData,
  buildRentalPayload,
  validateRentalForm
} from '../../utils/rentalFormUtils';
import { useAuth } from '../core/useAuth';
import useFormState from '../core/useFormState';
import useHeadquarters from '../location/useHeadquarters';
import useLocale from '../core/useLocale';
import usePaginatedSearch from '../core/usePaginatedSearch';
import { handleFormChangeAndClearError } from '../_internal/orchestratorUtils';

function useEmployeeRentalsPage() {
  const locale = useLocale();
  const { token } = useAuth();
  const { headquarters, loading: headquartersLoading, error: headquartersError } = useHeadquarters();

  const fetchRentals = useCallback(async (criteria) => {
    const response = await RentalService.search(criteria);
    return {
      results: getResultsList(response),
      totalRecords: response?.totalRecords ?? response?.totalElements,
      totalPages: response?.totalPages,
      pageNumber: response?.pageNumber ?? (response?.number != null ? response.number + 1 : undefined)
    };
  }, []);

  const search = usePaginatedSearch({
    defaultFilters: EMPLOYEE_RENTAL_DEFAULT_FILTERS,
    buildCriteria: buildRentalSearchCriteria,
    fetch: fetchRentals,
    defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    errorMessage: MESSAGES.ERROR_LOADING_DATA
  });

  const {
    items: rentals,
    loading,
    error,
    filters,
    pagination,
    loadItems: loadRentals,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handlePageChange
  } = search;

  const editForm = useFormState({
    initialData: RENTAL_FORM_INITIAL_DATA,
    mapData: mapRentalToFormData
  });

  const [pageAlert, setPageAlert] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editRentalId, setEditRentalId] = useState(null);
  const [editErrors, setEditErrors] = useState({});

  useEffect(() => {
    const loadStatuses = async () => {
      try {
        const list = await RentalStatusService.getAll(locale);
        setStatuses(Array.isArray(list) ? list : []);
      } catch {
        setStatuses([]);
      }
    };
    loadStatuses();
  }, [locale]);

  const handleEditChange = useCallback(
    (event) => handleFormChangeAndClearError(editForm, setEditErrors, event),
    [editForm]
  );

  const closeEditModal = useCallback(() => {
    setIsEditOpen(false);
    setEditRentalId(null);
    setIsEditLoading(false);
    editForm.resetForm();
    setEditErrors({});
  }, [editForm]);

  const handleEditRental = useCallback((rentalId) => {
    if (!rentalId) return;
    setIsEditOpen(true);
    setEditRentalId(rentalId);
    editForm.setFormAlert(null);
    const cached = rentals.find((r) => (r.rentalId ?? r.id) === rentalId);
    if (cached) {
      editForm.populateForm(cached);
      return;
    }
    setIsEditLoading(true);
    RentalService.findById(rentalId)
      .then((data) => editForm.populateForm(data))
      .catch(() => {
        editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.ERROR_LOADING_DATA });
      })
      .finally(() => setIsEditLoading(false));
  }, [editForm, rentals]);

  const handleUpdateRental = useCallback(async (event) => {
    event.preventDefault();
    if (!token) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }
    if (!editRentalId) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.ERROR_LOADING_DATA });
      return;
    }
    const nextErrors = validateRentalForm(editForm.formData);
    setEditErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.REQUIRED_FIELDS });
      return;
    }
    setIsSubmitting(true);
    editForm.setFormAlert(null);
    try {
      const payload = buildRentalPayload(editForm.formData);
      await RentalService.update(editRentalId, payload);
      await loadRentals({ nextFilters: filters, pageNumber: pagination.pageNumber });
      closeEditModal();
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.RENTAL_UPDATED });
    } catch (err) {
      editForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err?.message || MESSAGES.ERROR_UPDATING
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [editForm, editRentalId, filters, loadRentals, pagination.pageNumber, token, closeEditModal]);

  const handleDeleteRental = useCallback(async (rentalId) => {
    if (!rentalId) return;
    if (!token) {
      setPageAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }
    const confirmed = window.confirm(MESSAGES.CONFIRM_DELETE_RENTAL);
    if (!confirmed) return;
    setPageAlert(null);
    try {
      await RentalService.delete(rentalId);
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.RENTAL_DELETED });
      await loadRentals({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      setPageAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err?.message || MESSAGES.ERROR_DELETING
      });
    }
  }, [filters, loadRentals, pagination.pageNumber, token]);

  const filterFields = useMemo(
    () => buildRentalFilterFields({ statuses, headquarters }),
    [statuses, headquarters]
  );
  const headquartersById = useMemo(
    () => new Map((headquarters || []).map((hq) => [Number(hq.id), hq])),
    [headquarters]
  );
  const statusById = useMemo(
    () => new Map((statuses || []).map((s) => [Number(s.rentalStatusId), s])),
    [statuses]
  );

  return {
    state: {
      headquarters,
      rentals,
      filters,
      editForm,
      editErrors
    },
    ui: {
      headquartersLoading,
      headquartersError,
      isLoading: loading,
      error,
      pageAlert,
      isSubmitting,
      isEditOpen,
      isEditLoading
    },
    actions: {
      handleFilterChange,
      applyFilters,
      resetFilters,
      handlePageChange,
      setPageAlert,
      handleEditChange,
      handleEditRental,
      handleUpdateRental,
      closeEditModal,
      handleDeleteRental
    },
    options: {
      pagination,
      filterFields,
      headquartersById,
      statusById,
      statuses,
      headquarters
    }
  };
}

export default useEmployeeRentalsPage;
