import { useCallback, useEffect, useMemo, useState } from 'react';
import EmployeeService from '../../api/services/EmployeeService';
import RoleService from '../../api/services/RoleService';
import { ALERT_VARIANTS, DEFAULT_ACTIVE_STATUS, MESSAGES, PAGINATION } from '../../constants';
import useFormState from '../core/useFormState';
import { validateEmail, validatePhone, validateRequired } from '../../forms/profileFormUtils';
import useHeadquarters from '../location/useHeadquarters';
import { createEmptyPaginationState, createPaginationState, updateFilterValue } from '../_internal/orchestratorUtils';

const DEFAULT_FILTERS = {
  employeeId: '',
  employeeName: '',
  firstName: '',
  email: '',
  roleId: '',
  headquartersId: '',
  activeStatus: ''
};

const DEFAULT_FORM = {
  employeeName: '',
  password: '',
  roleId: '',
  headquartersId: '',
  firstName: '',
  lastName1: '',
  lastName2: '',
  email: '',
  phone: '',
  activeStatus: 'true'
};

const mapEmployeeToForm = (employee) => ({
  employeeName: employee?.employeeName || '',
  password: '',
  roleId: String(employee?.roleId ?? employee?.role?.id ?? employee?.role?.roleId ?? ''),
  headquartersId: String(employee?.headquartersId ?? employee?.headquarters?.id ?? ''),
  firstName: employee?.firstName || '',
  lastName1: employee?.lastName1 || '',
  lastName2: employee?.lastName2 || '',
  email: employee?.email || '',
  phone: employee?.phone || '',
  activeStatus: String(employee?.activeStatus ?? true)
});

const buildPayload = (formData, { includePassword }) => {
  const payload = {
    employeeName: formData.employeeName.trim(),
    roleId: Number(formData.roleId),
    headquartersId: Number(formData.headquartersId),
    firstName: formData.firstName.trim(),
    lastName1: formData.lastName1.trim(),
    lastName2: formData.lastName2.trim(),
    email: formData.email.trim(),
    phone: formData.phone.trim(),
    activeStatus: formData.activeStatus === 'true'
  };

  if (includePassword || formData.password.trim()) {
    payload.password = formData.password;
  }

  return payload;
};

function useEmployeeEmployeeListPage() {
  const { headquarters } = useHeadquarters();
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState(createEmptyPaginationState());
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pageAlert, setPageAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [createErrors, setCreateErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const createForm = useFormState({ initialData: DEFAULT_FORM });
  const editForm = useFormState({ initialData: DEFAULT_FORM, mapData: mapEmployeeToForm });

  const loadEmployees = useCallback(async ({ nextFilters = DEFAULT_FILTERS, pageNumber = PAGINATION.DEFAULT_PAGE } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await EmployeeService.search({
        employeeId: nextFilters.employeeId || undefined,
        employeeName: nextFilters.employeeName || undefined,
        firstName: nextFilters.firstName || undefined,
        email: nextFilters.email || undefined,
        roleId: nextFilters.roleId || undefined,
        headquartersId: nextFilters.headquartersId || undefined,
        activeStatus: nextFilters.activeStatus || undefined,
        pageNumber,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE
      });

      const results = response?.results ?? [];
      const totalRecords = response?.totalRecords ?? results.length;
      const totalPages = response?.totalPages ?? Math.max(1, Math.ceil(totalRecords / PAGINATION.DEFAULT_PAGE_SIZE));
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
        const response = await RoleService.getAll();
        setRoles(response || []);
      } catch {
        setRoles([]);
      }
    };

    loadRoles();
  }, []);

  const validateForm = useCallback((formData, { requirePassword }) => {
    const errors = {};
    validateRequired(formData.employeeName.trim(), 'employeeName', errors);
    validateRequired(formData.roleId, 'roleId', errors);
    validateRequired(formData.headquartersId, 'headquartersId', errors);
    validateRequired(formData.firstName.trim(), 'firstName', errors);
    validateRequired(formData.lastName1.trim(), 'lastName1', errors);
    validateRequired(formData.email.trim(), 'email', errors);
    validateRequired(formData.phone.trim(), 'phone', errors);

    if (requirePassword) {
      validateRequired(formData.password, 'password', errors);
    }

    validateEmail(formData.email.trim(), errors);
    validatePhone(formData.phone.trim(), errors);

    return errors;
  }, []);

  const handleFilterChange = useCallback((event) => updateFilterValue(setFilters, event), []);

  const applyFilters = useCallback(() => {
    loadEmployees({ nextFilters: filters, pageNumber: PAGINATION.DEFAULT_PAGE });
  }, [filters, loadEmployees]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    loadEmployees({ nextFilters: DEFAULT_FILTERS, pageNumber: PAGINATION.DEFAULT_PAGE });
  }, [loadEmployees]);

  const handlePageChange = useCallback((nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages || nextPage === pagination.pageNumber) return;
    loadEmployees({ nextFilters: filters, pageNumber: nextPage });
  }, [filters, loadEmployees, pagination.pageNumber, pagination.totalPages]);

  const handleCreateEmployee = useCallback(async (event) => {
    event.preventDefault();
    const nextErrors = validateForm(createForm.formData, { requirePassword: true });
    setCreateErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.REQUIRED_FIELDS });
      return;
    }

    setIsSubmitting(true);
    createForm.setFormAlert(null);

    try {
      await EmployeeService.create(buildPayload(createForm.formData, { includePassword: true }));
      createForm.setFormAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.EMPLOYEE_CREATED });
      createForm.resetForm();
      setCreateErrors({});
      setIsCreateOpen(false);
      await loadEmployees({ nextFilters: filters, pageNumber: pagination.pageNumber });
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.EMPLOYEE_CREATED });
    } catch (err) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: err.message || MESSAGES.ERROR_SAVING });
    } finally {
      setIsSubmitting(false);
    }
  }, [createForm, filters, loadEmployees, pagination.pageNumber, validateForm]);

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
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: err.message || MESSAGES.ERROR_LOADING_DATA });
    } finally {
      setIsEditLoading(false);
    }
  }, [editForm, employees]);

  const handleUpdateEmployee = useCallback(async (event) => {
    event.preventDefault();
    if (!editEmployeeId) return;

    const nextErrors = validateForm(editForm.formData, { requirePassword: false });
    setEditErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.REQUIRED_FIELDS });
      return;
    }

    setIsSubmitting(true);
    editForm.setFormAlert(null);

    try {
      await EmployeeService.update(editEmployeeId, buildPayload(editForm.formData, { includePassword: false }));
      editForm.setFormAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.EMPLOYEE_UPDATED });
      setIsEditOpen(false);
      setEditEmployeeId(null);
      editForm.resetForm();
      setEditErrors({});
      await loadEmployees({ nextFilters: filters, pageNumber: pagination.pageNumber });
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.EMPLOYEE_UPDATED });
    } catch (err) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: err.message || MESSAGES.ERROR_UPDATING });
    } finally {
      setIsSubmitting(false);
    }
  }, [editEmployeeId, editForm, filters, loadEmployees, pagination.pageNumber, validateForm]);

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
      setPageAlert({ type: ALERT_VARIANTS.ERROR, message: err.message || MESSAGES.ERROR_DELETING });
    }
  }, [filters, loadEmployees, pagination.pageNumber]);

  const roleOptions = useMemo(() => [
    { value: '', label: MESSAGES.SELECT_ROLE },
    ...roles.map((role) => ({ value: String(role.roleId ?? role.id), label: role.roleName || role.name || String(role.id) }))
  ], [roles]);

  const headquartersOptions = useMemo(() => [
    { value: '', label: MESSAGES.SELECT_HEADQUARTERS },
    ...headquarters.map((hq) => ({ value: String(hq.headquartersId ?? hq.id), label: hq.name || `${MESSAGES.HEADQUARTERS_LABEL} ${hq.id}` }))
  ], [headquarters]);

  return {
    state: {
      employees,
      filters,
      createForm,
      editForm,
      createErrors,
      editErrors,
      roleOptions,
      headquartersOptions
    },
    ui: {
      isLoading,
      error,
      pageAlert,
      isSubmitting,
      isCreateOpen,
      isEditOpen,
      isEditLoading
    },
    actions: {
      setPageAlert,
      handleFilterChange,
      applyFilters,
      resetFilters,
      handlePageChange,
      setIsCreateOpen,
      setIsEditOpen,
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
