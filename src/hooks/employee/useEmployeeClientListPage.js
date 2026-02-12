import { useCallback, useEffect, useMemo, useState } from 'react';
import UserService from '../../api/services/UserService';
import RoleService from '../../api/services/RoleService';
import { ALERT_VARIANTS, MESSAGES, PAGINATION } from '../../constants';
import useFormState from '../core/useFormState';
import { validateEmail, validatePhone, validateRequired } from '../../forms/profileFormUtils';
import { createEmptyPaginationState, createPaginationState, updateFilterValue } from '../_internal/orchestratorUtils';

const DEFAULT_FILTERS = {
  userId: '',
  username: '',
  firstName: '',
  email: '',
  activeStatus: ''
};

const DEFAULT_FORM = {
  username: '',
  firstName: '',
  lastName1: '',
  lastName2: '',
  birthDate: '',
  email: '',
  password: '',
  phone: '',
  addressId: '',
  activeStatus: 'true'
};

const mapUserToForm = (user) => ({
  username: user?.username || '',
  firstName: user?.firstName || '',
  lastName1: user?.lastName1 || '',
  lastName2: user?.lastName2 || '',
  birthDate: user?.birthDate || '',
  email: user?.email || '',
  password: '',
  phone: user?.phone || '',
  addressId: String(user?.addressId ?? user?.address?.[0]?.addressId ?? ''),
  activeStatus: String(user?.activeStatus ?? true)
});

const resolveCustomerRoleId = (roles) => {
  const customerRole = roles.find((role) => {
    const roleName = String(role?.roleName ?? role?.name ?? '').toLowerCase();
    return ['user', 'usuario', 'cliente', 'customer', 'client'].includes(roleName);
  });

  return customerRole?.roleId ?? customerRole?.id ?? null;
};

const buildPayload = (formData, { includePassword, roleId }) => {
  const payload = {
    username: formData.username.trim(),
    firstName: formData.firstName.trim(),
    lastName1: formData.lastName1.trim(),
    lastName2: formData.lastName2.trim(),
    birthDate: formData.birthDate,
    email: formData.email.trim(),
    roleId,
    phone: formData.phone.trim(),
    addressId: Number(formData.addressId),
    activeStatus: formData.activeStatus === 'true'
  };

  if (includePassword || formData.password.trim()) {
    payload.password = formData.password;
  }

  return payload;
};

function useEmployeeClientListPage() {
  const [users, setUsers] = useState([]);
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
  const [editUserId, setEditUserId] = useState(null);
  const [createErrors, setCreateErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const createForm = useFormState({ initialData: DEFAULT_FORM });
  const editForm = useFormState({ initialData: DEFAULT_FORM, mapData: mapUserToForm });

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

  const customerRoleId = useMemo(() => resolveCustomerRoleId(roles), [roles]);

  const loadUsers = useCallback(async ({ nextFilters = DEFAULT_FILTERS, pageNumber = PAGINATION.DEFAULT_PAGE } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await UserService.search({
        userId: nextFilters.userId || undefined,
        username: nextFilters.username || undefined,
        firstName: nextFilters.firstName || undefined,
        email: nextFilters.email || undefined,
        roleId: customerRoleId || undefined,
        activeStatus: nextFilters.activeStatus || undefined,
        pageNumber,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE
      });

      const results = response?.results ?? [];
      const totalRecords = response?.totalRecords ?? results.length;
      const totalPages = response?.totalPages ?? Math.max(1, Math.ceil(totalRecords / PAGINATION.DEFAULT_PAGE_SIZE));
      setUsers(results);
      setPagination(createPaginationState({
        pageNumber: response?.pageNumber ?? pageNumber,
        totalPages,
        totalRecords
      }));
    } catch (err) {
      setError(err.message || MESSAGES.ERROR_LOADING_DATA);
      setUsers([]);
      setPagination(createEmptyPaginationState());
    } finally {
      setLoading(false);
    }
  }, [customerRoleId]);

  useEffect(() => {
    loadUsers({ nextFilters: DEFAULT_FILTERS, pageNumber: PAGINATION.DEFAULT_PAGE });
  }, [loadUsers]);

  const validateForm = useCallback((formData, { requirePassword }) => {
    const errors = {};
    validateRequired(formData.username.trim(), 'username', errors);
    validateRequired(formData.firstName.trim(), 'firstName', errors);
    validateRequired(formData.lastName1.trim(), 'lastName1', errors);
    validateRequired(formData.birthDate, 'birthDate', errors);
    validateRequired(formData.email.trim(), 'email', errors);
    validateRequired(formData.phone.trim(), 'phone', errors);
    validateRequired(formData.addressId, 'addressId', errors);

    if (requirePassword) {
      validateRequired(formData.password, 'password', errors);
    }

    validateEmail(formData.email.trim(), errors);
    validatePhone(formData.phone.trim(), errors);

    return errors;
  }, []);

  const handleFilterChange = useCallback((event) => updateFilterValue(setFilters, event), []);

  const applyFilters = useCallback(() => {
    loadUsers({ nextFilters: filters, pageNumber: PAGINATION.DEFAULT_PAGE });
  }, [filters, loadUsers]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    loadUsers({ nextFilters: DEFAULT_FILTERS, pageNumber: PAGINATION.DEFAULT_PAGE });
  }, [loadUsers]);

  const handlePageChange = useCallback((nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages || nextPage === pagination.pageNumber) return;
    loadUsers({ nextFilters: filters, pageNumber: nextPage });
  }, [filters, loadUsers, pagination.pageNumber, pagination.totalPages]);

  const resolvePayloadRoleId = useCallback(() => {
    if (customerRoleId) {
      return customerRoleId;
    }

    const fallback = Number(roles[0]?.roleId ?? roles[0]?.id);
    return Number.isFinite(fallback) ? fallback : null;
  }, [customerRoleId, roles]);

  const handleCreateUser = useCallback(async (event) => {
    event.preventDefault();

    const roleId = resolvePayloadRoleId();
    if (!roleId) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.ERROR_LOADING_DATA });
      return;
    }

    const nextErrors = validateForm(createForm.formData, { requirePassword: true });
    setCreateErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.REQUIRED_FIELDS });
      return;
    }

    setIsSubmitting(true);
    createForm.setFormAlert(null);

    try {
      await UserService.create(buildPayload(createForm.formData, { includePassword: true, roleId }));
      createForm.setFormAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.USER_CREATED });
      createForm.resetForm();
      setCreateErrors({});
      setIsCreateOpen(false);
      await loadUsers({ nextFilters: filters, pageNumber: pagination.pageNumber });
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.USER_CREATED });
    } catch (err) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: err.message || MESSAGES.ERROR_SAVING });
    } finally {
      setIsSubmitting(false);
    }
  }, [createForm, filters, loadUsers, pagination.pageNumber, resolvePayloadRoleId, validateForm]);

  const handleEditUser = useCallback(async (userId) => {
    if (!userId) return;
    setIsEditOpen(true);
    setEditUserId(userId);
    setEditErrors({});
    editForm.setFormAlert(null);

    const cachedUser = users.find((item) => (item.userId ?? item.id) === userId);
    if (cachedUser) {
      editForm.populateForm(cachedUser);
      return;
    }

    setIsEditLoading(true);
    try {
      const user = await UserService.findById(userId);
      editForm.populateForm(user);
    } catch (err) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: err.message || MESSAGES.ERROR_LOADING_DATA });
    } finally {
      setIsEditLoading(false);
    }
  }, [editForm, users]);

  const handleUpdateUser = useCallback(async (event) => {
    event.preventDefault();
    if (!editUserId) return;

    const roleId = resolvePayloadRoleId();
    if (!roleId) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.ERROR_LOADING_DATA });
      return;
    }

    const nextErrors = validateForm(editForm.formData, { requirePassword: false });
    setEditErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.REQUIRED_FIELDS });
      return;
    }

    setIsSubmitting(true);
    editForm.setFormAlert(null);

    try {
      await UserService.update(editUserId, buildPayload(editForm.formData, { includePassword: false, roleId }));
      editForm.setFormAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.USER_UPDATED });
      setIsEditOpen(false);
      setEditUserId(null);
      editForm.resetForm();
      setEditErrors({});
      await loadUsers({ nextFilters: filters, pageNumber: pagination.pageNumber });
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.USER_UPDATED });
    } catch (err) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: err.message || MESSAGES.ERROR_UPDATING });
    } finally {
      setIsSubmitting(false);
    }
  }, [editForm, editUserId, filters, loadUsers, pagination.pageNumber, resolvePayloadRoleId, validateForm]);

  const handleDeleteUser = useCallback(async (userId) => {
    if (!userId) return;
    const confirmed = window.confirm(MESSAGES.CONFIRM_DELETE_USER);
    if (!confirmed) return;

    setPageAlert(null);

    try {
      await UserService.delete(userId);
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.USER_DELETED });
      await loadUsers({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      setPageAlert({ type: ALERT_VARIANTS.ERROR, message: err.message || MESSAGES.ERROR_DELETING });
    }
  }, [filters, loadUsers, pagination.pageNumber]);

  return {
    state: {
      users,
      filters,
      createForm,
      editForm,
      createErrors,
      editErrors
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
      handleCreateUser,
      handleEditUser,
      handleUpdateUser,
      handleDeleteUser
    },
    meta: {
      pagination
    }
  };
}

export default useEmployeeClientListPage;
