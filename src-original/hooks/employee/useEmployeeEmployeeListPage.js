import { useCallback, useEffect, useMemo, useState } from 'react';
import EmployeeService from '../../api/services/EmployeeService';
import { RoleService } from '../../api/services/CatalogService';
import { ALERT_VARIANTS, MESSAGES, PAGINATION } from '../../constants';
import { buildEmployeeFilterFields } from '../../utils/filter/filterFieldBuilders';
import {
  EMPLOYEE_LIST_DEFAULT_FILTERS,
  buildEmployeeSearchCriteria
} from '../../utils/employee/employeeListUtils';
import { getStaffRoles } from '../../utils/roleUtils';
import {
  EMPLOYEE_FORM_INITIAL_DATA,
  mapEmployeeToFormData,
  buildEmployeePayload,
  validateEmployeeForm
} from '../../utils/employee/employeeFormUtils';
import { useAuth } from '../core/useAuth';
import useFormState from '../core/useFormState';
import useHeadquarters from '../location/useHeadquarters';
import usePaginatedSearch from '../core/usePaginatedSearch';
import { handleFormChangeAndClearError, withSubmitting } from '../_internal/orchestratorUtils';

function useEmployeeEmployeeListPage() {
  const { token, isAdmin } = useAuth();
  const { headquarters, loading: headquartersLoading, error: headquartersError } = useHeadquarters();

  const fetchEmployees = useCallback(async (criteria) => {
    const response = await EmployeeService.search(criteria);
    return {
      results: response?.results || [],
      totalRecords: response?.totalRecords,
      totalPages: response?.totalPages,
      pageNumber: response?.pageNumber
    };
  }, []);

  const search = usePaginatedSearch({
    defaultFilters: EMPLOYEE_LIST_DEFAULT_FILTERS,
    buildCriteria: buildEmployeeSearchCriteria,
    fetch: fetchEmployees,
    defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    errorMessage: MESSAGES.ERROR_LOADING_DATA
  });

  const {
    items: employees,
    loading,
    error,
    filters,
    pagination,
    loadItems: loadEmployees,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handlePageChange
  } = search;

  const createForm = useFormState({
    initialData: EMPLOYEE_FORM_INITIAL_DATA,
    mapData: mapEmployeeToFormData
  });
  const editForm = useFormState({
    initialData: EMPLOYEE_FORM_INITIAL_DATA,
    mapData: mapEmployeeToFormData
  });

  const [pageAlert, setPageAlert] = useState(null);
  const [roles, setRoles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [createErrors, setCreateErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  useEffect(() => {
    RoleService.getAll()
      .then((list) => setRoles(Array.isArray(list) ? list : []))
      .catch(() => setRoles([]));
  }, []);

  const handleCreateChange = useCallback(
    (event) => handleFormChangeAndClearError(createForm, setCreateErrors, event),
    [createForm]
  );
  const handleEditChange = useCallback(
    (event) => handleFormChangeAndClearError(editForm, setEditErrors, event),
    [editForm]
  );

  const handleOpenCreateModal = useCallback(() => {
    setPageAlert(null);
    setIsCreateOpen(true);
    createForm.setFormAlert(null);
    setCreateErrors({});
  }, [createForm]);

  const closeCreateModal = useCallback(() => {
    setIsCreateOpen(false);
    createForm.resetForm();
    setCreateErrors({});
  }, [createForm]);

  const closeEditModal = useCallback(() => {
    setIsEditOpen(false);
    setEditEmployeeId(null);
    setIsViewMode(false);
    setIsEditLoading(false);
    editForm.resetForm();
    setEditErrors({});
  }, [editForm]);

  const handleCreateEmployee = useCallback(async (event) => {
    event.preventDefault();
    if (!token) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }
    const nextErrors = validateEmployeeForm(createForm.formData, { isCreate: true });
    setCreateErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.REQUIRED_FIELDS });
      return;
    }
    await withSubmitting(setIsSubmitting, () => createForm.setFormAlert(null), async () => {
      try {
        const payload = buildEmployeePayload(createForm.formData, { omitPasswordIfEmpty: false });
        await EmployeeService.create(payload);
        createForm.resetForm();
        setCreateErrors({});
        await loadEmployees({ nextFilters: filters, pageNumber: pagination.pageNumber });
        closeCreateModal();
        setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.EMPLOYEE_CREATED });
      } catch (err) {
        createForm.setFormAlert({
          type: ALERT_VARIANTS.ERROR,
          message: err?.message || MESSAGES.ERROR_SAVING
        });
      }
    });
  }, [createForm, closeCreateModal, filters, loadEmployees, pagination.pageNumber, token]);

  const handleEditEmployee = useCallback((employeeId) => {
    if (!employeeId) return;
    setIsViewMode(false);
    setIsEditOpen(true);
    setEditEmployeeId(employeeId);
    editForm.setFormAlert(null);
    const cached = employees.find((e) => e.id === employeeId);
    if (cached) {
      editForm.populateForm(cached);
      return;
    }
    setIsEditLoading(true);
    EmployeeService.findById(employeeId)
      .then((data) => editForm.populateForm(data))
      .catch(() => {
        editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.ERROR_LOADING_DATA });
      })
      .finally(() => setIsEditLoading(false));
  }, [editForm, employees]);

  const handleViewEmployee = useCallback((employeeId) => {
    if (!employeeId) return;
    setIsViewMode(true);
    setIsEditOpen(true);
    setEditEmployeeId(employeeId);
    editForm.setFormAlert(null);
    const cached = employees.find((e) => e.id === employeeId);
    if (cached) {
      editForm.populateForm(cached);
      return;
    }
    setIsEditLoading(true);
    EmployeeService.findById(employeeId)
      .then((data) => editForm.populateForm(data))
      .catch(() => {
        editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.ERROR_LOADING_DATA });
      })
      .finally(() => setIsEditLoading(false));
  }, [editForm, employees]);

  const handleUpdateEmployee = useCallback(async (event) => {
    event.preventDefault();
    if (!token) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }
    if (!editEmployeeId) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.ERROR_LOADING_DATA });
      return;
    }
    const nextErrors = validateEmployeeForm(editForm.formData, { isCreate: false });
    setEditErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.REQUIRED_FIELDS });
      return;
    }
    await withSubmitting(setIsSubmitting, () => editForm.setFormAlert(null), async () => {
      try {
        const payload = buildEmployeePayload(editForm.formData);
        await EmployeeService.update(editEmployeeId, payload);
        await loadEmployees({ nextFilters: filters, pageNumber: pagination.pageNumber });
        closeEditModal();
        setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.EMPLOYEE_UPDATED });
      } catch (err) {
        editForm.setFormAlert({
          type: ALERT_VARIANTS.ERROR,
          message: err?.message || MESSAGES.ERROR_UPDATING
        });
      }
    });
  }, [editForm, editEmployeeId, filters, loadEmployees, pagination.pageNumber, token, closeEditModal]);

  const handleDeleteEmployee = useCallback(async (employeeId) => {
    if (!employeeId) return;
    if (!token) {
      setPageAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }
    const confirmed = window.confirm(MESSAGES.CONFIRM_DELETE_EMPLOYEE);
    if (!confirmed) return;
    setPageAlert(null);
    try {
      await EmployeeService.delete(employeeId);
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.EMPLOYEE_DELETED });
      await loadEmployees({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      setPageAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err?.message || MESSAGES.ERROR_DELETING
      });
    }
  }, [filters, loadEmployees, pagination.pageNumber, token]);

  const handleActivateEmployee = useCallback(async (employeeId) => {
    if (!employeeId || !token) return;
    setPageAlert(null);
    try {
      await EmployeeService.activate(employeeId);
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.EMPLOYEE_ACTIVATED });
      await loadEmployees({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      setPageAlert({ type: ALERT_VARIANTS.ERROR, message: err?.message || MESSAGES.ERROR_UPDATING });
    }
  }, [filters, loadEmployees, pagination.pageNumber, token]);

  const filterFields = useMemo(
    () =>
      buildEmployeeFilterFields({
        roles: getStaffRoles(roles),
        headquarters: headquarters || []
      }),
    [roles, headquarters]
  );

  const staffRoles = useMemo(() => getStaffRoles(roles), [roles]);

  return {
    state: {
      employees,
      filters,
      createForm,
      editForm,
      createErrors,
      editErrors
    },
    ui: {
      isLoading: loading,
      error,
      pageAlert,
      headquartersLoading,
      headquartersError,
      isSubmitting,
      isCreateOpen,
      isEditOpen,
      isEditLoading,
      isViewMode
    },
    actions: {
      handleFilterChange,
      applyFilters,
      resetFilters,
      handlePageChange,
      setPageAlert,
      handleCreateChange,
      handleEditChange,
      handleOpenCreateModal,
      closeCreateModal,
      handleCreateEmployee,
      handleViewEmployee,
      handleEditEmployee,
      handleUpdateEmployee,
      closeEditModal,
      handleDeleteEmployee,
      handleActivateEmployee
    },
    options: {
      pagination,
      filterFields,
      roles: staffRoles,
      headquarters,
      canChangeRole: isAdmin === true
    }
  };
}

export default useEmployeeEmployeeListPage;
