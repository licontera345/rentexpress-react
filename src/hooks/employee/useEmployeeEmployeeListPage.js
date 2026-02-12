import { useCallback, useEffect, useState } from 'react';
import EmployeeService from '../../api/services/EmployeeService';
import RoleService from '../../api/services/RoleService';
import { ALERT_VARIANTS, MESSAGES, PAGINATION } from '../../constants';
import useFormState from '../core/useFormState';
import useHeadquarters from '../location/useHeadquarters';
import { createEmptyPaginationState, createPaginationState, updateFilterValue } from '../_internal/orchestratorUtils';
import {
  buildEmployeePayload,
  mapEmployeeToFormData,
  validateEmployeeForm
} from '../../forms/employeeFormUtils';

const DEFAULT_FILTERS = {
  employeeId: '',
  employeeName: '',
  roleId: '',
  headquartersId: '',
  firstName: '',
  lastName1: '',
  lastName2: '',
  email: '',
  phone: '',
  activeStatus: ''
};

const DEFAULT_EMPLOYEE_FORM_DATA = mapEmployeeToFormData();

const clearFieldError = (setErrors, name) => {
  setErrors((prev) => {
    if (!prev[name]) return prev;
    return Object.assign({}, prev, { [name]: null });
  });
};

function useEmployeeEmployeeListPage() {
  const { headquarters, loading: headquartersLoading, error: headquartersError } = useHeadquarters();

  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState(createEmptyPaginationState);

  const createForm = useFormState({
    initialData: DEFAULT_EMPLOYEE_FORM_DATA,
    mapData: mapEmployeeToFormData
  });
  const editForm = useFormState({
    initialData: DEFAULT_EMPLOYEE_FORM_DATA,
    mapData: mapEmployeeToFormData
  });

  const [pageAlert, setPageAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [createErrors, setCreateErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const loadEmployees = useCallback(async ({
    nextFilters = DEFAULT_FILTERS,
    pageNumber = PAGINATION.DEFAULT_PAGE
  } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await EmployeeService.search({
        employeeId: nextFilters.employeeId || undefined,
        employeeName: nextFilters.employeeName || undefined,
        roleId: nextFilters.roleId || undefined,
        headquartersId: nextFilters.headquartersId || undefined,
        firstName: nextFilters.firstName || undefined,
        lastName1: nextFilters.lastName1 || undefined,
        lastName2: nextFilters.lastName2 || undefined,
        email: nextFilters.email || undefined,
        phone: nextFilters.phone || undefined,
        activeStatus: nextFilters.activeStatus === ''
          ? undefined
          : nextFilters.activeStatus === '1',
        pageNumber,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE
      });

      const results = response?.results ?? response ?? [];
      const totalRecords = response?.totalRecords ?? results.length;
      const totalPages = response?.totalPages
        ?? Math.max(1, Math.ceil(totalRecords / PAGINATION.DEFAULT_PAGE_SIZE));

      setEmployees(results);
      setPagination(createPaginationState({
        pageNumber: response?.pageNumber ?? pageNumber,
        totalPages,
        totalRecords
      }));
    } catch (err) {
      setError(err.message || MESSAGES.ERROR_LOADING_DATA);
      setEmployees([]);
      setPagination(createEmptyPaginationState());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees({ nextFilters: DEFAULT_FILTERS, pageNumber: PAGINATION.DEFAULT_PAGE });
  }, [loadEmployees]);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const roleList = await RoleService.getAll();
        setRoles(roleList || []);
      } catch {
        setRoles([]);
      }
    };

    loadRoles().catch(() => {});
  }, []);

  const handleFilterChange = useCallback((event) => {
    updateFilterValue(setFilters, event);
  }, []);

  const applyFilters = useCallback(() => {
    loadEmployees({ nextFilters: filters, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [filters, loadEmployees]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    loadEmployees({ nextFilters: DEFAULT_FILTERS, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [loadEmployees]);

  const handlePageChange = useCallback((nextPage) => {
    loadEmployees({ nextFilters: filters, pageNumber: nextPage }).catch(() => {});
  }, [filters, loadEmployees]);

  const handleCreateChange = useCallback((event) => {
    createForm.handleFormChange(event);
    clearFieldError(setCreateErrors, event.target.name);
  }, [createForm]);

  const handleEditChange = useCallback((event) => {
    editForm.handleFormChange(event);
    clearFieldError(setEditErrors, event.target.name);
  }, [editForm]);

  const handleOpenCreateModal = useCallback(() => {
    createForm.resetForm();
    setCreateErrors({});
    setIsCreateOpen(true);
  }, [createForm]);

  const closeCreateModal = useCallback(() => {
    setIsCreateOpen(false);
    createForm.resetForm();
    setCreateErrors({});
  }, [createForm]);

  const closeEditModal = useCallback(() => {
    setIsEditOpen(false);
    setEditEmployeeId(null);
    setIsEditLoading(false);
    editForm.resetForm();
    setEditErrors({});
  }, [editForm]);

  const handleCreateEmployee = useCallback(async (event) => {
    event.preventDefault();

    const validationErrors = validateEmployeeForm(createForm.formData);
    setCreateErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.FORM_VALIDATION_ERROR });
      return;
    }

    setIsSubmitting(true);
    createForm.setFormAlert(null);

    try {
      await EmployeeService.create(buildEmployeePayload(createForm.formData));
      createForm.setFormAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.EMPLOYEE_CREATED });
      await loadEmployees({ nextFilters: filters, pageNumber: pagination.pageNumber });
      closeCreateModal();
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.EMPLOYEE_CREATED });
    } catch (err) {
      createForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_SAVING
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [closeCreateModal, createForm, filters, loadEmployees, pagination.pageNumber]);

  const handleEditEmployee = useCallback(async (employeeId) => {
    if (!employeeId) return;

    setIsEditOpen(true);
    setEditEmployeeId(employeeId);
    setEditErrors({});
    editForm.setFormAlert(null);

    const cachedEmployee = employees.find((item) => (item.employeeId ?? item.id) === employeeId);
    if (cachedEmployee) {
      editForm.populateForm(cachedEmployee);
      return;
    }

    setIsEditLoading(true);
    try {
      const employee = await EmployeeService.findById(employeeId);
      editForm.populateForm(employee);
    } catch (err) {
      editForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_LOADING_DATA
      });
    } finally {
      setIsEditLoading(false);
    }
  }, [editForm, employees]);

  const handleUpdateEmployee = useCallback(async (event) => {
    event.preventDefault();

    if (!editEmployeeId) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.EMPLOYEE_NOT_FOUND });
      return;
    }

    const validationErrors = validateEmployeeForm(editForm.formData, { isEdit: true });
    setEditErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.FORM_VALIDATION_ERROR });
      return;
    }

    setIsSubmitting(true);
    editForm.setFormAlert(null);

    try {
      await EmployeeService.update(
        editEmployeeId,
        buildEmployeePayload(editForm.formData, { includePassword: Boolean(editForm.formData.password) })
      );
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.EMPLOYEE_UPDATED });
      await loadEmployees({ nextFilters: filters, pageNumber: pagination.pageNumber });
      closeEditModal();
    } catch (err) {
      editForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_UPDATING
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [closeEditModal, editEmployeeId, editForm, filters, loadEmployees, pagination.pageNumber]);

  const handleDeleteEmployee = useCallback(async (employeeId) => {
    if (!employeeId) return;

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
        message: err.message || MESSAGES.ERROR_DELETING
      });
    }
  }, [filters, loadEmployees, pagination.pageNumber]);

  return {
    state: {
      employees,
      roles,
      headquarters,
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
      isSubmitting,
      isCreateOpen,
      isEditOpen,
      isEditLoading,
      headquartersLoading,
      headquartersError
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
      closeEditModal,
      handleCreateEmployee,
      handleEditEmployee,
      handleUpdateEmployee,
      handleDeleteEmployee
    },
    meta: {
      pagination
    }
  };
}

export default useEmployeeEmployeeListPage;
