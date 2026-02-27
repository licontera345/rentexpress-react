import { useCallback, useEffect, useMemo, useState } from 'react';
import UserService from '../../api/services/UserService';
import { RoleService } from '../../api/services/CatalogService';
import { ALERT_VARIANTS, MESSAGES, PAGINATION } from '../../constants';
import { buildUserFilterFields } from '../../utils/filter/filterFieldBuilders';
import {
  CLIENT_LIST_DEFAULT_FILTERS,
  buildUserSearchCriteria
} from '../../utils/client/clientListUtils';
import {
  USER_FORM_INITIAL_DATA,
  mapUserToFormData,
  buildUserPayload,
  validateUserForm
} from '../../utils/employee/userFormUtils';
import { useAuth } from '../core/useAuth';
import useFormState from '../core/useFormState';
import usePaginatedSearch from '../core/usePaginatedSearch';
import { handleFormChangeAndClearError, withSubmitting } from '../_internal/orchestratorUtils';

function useEmployeeClientListPage() {
  const { token } = useAuth();

  const fetchUsers = useCallback(async (criteria) => {
    const response = await UserService.search(criteria);
    return {
      results: response?.results || [],
      totalRecords: response?.totalRecords,
      totalPages: response?.totalPages,
      pageNumber: response?.pageNumber
    };
  }, []);

  const search = usePaginatedSearch({
    defaultFilters: CLIENT_LIST_DEFAULT_FILTERS,
    buildCriteria: buildUserSearchCriteria,
    fetch: fetchUsers,
    defaultPageSize: PAGINATION.DEFAULT_PAGE_SIZE,
    errorMessage: MESSAGES.ERROR_LOADING_DATA
  });

  const {
    items: users,
    loading,
    error,
    filters,
    pagination,
    loadItems: loadUsers,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handlePageChange
  } = search;

  const createForm = useFormState({
    initialData: USER_FORM_INITIAL_DATA,
    mapData: mapUserToFormData
  });
  const editForm = useFormState({
    initialData: USER_FORM_INITIAL_DATA,
    mapData: mapUserToFormData
  });

  const [pageAlert, setPageAlert] = useState(null);
  const [roles, setRoles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
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
    setEditUserId(null);
    setIsViewMode(false);
    setIsEditLoading(false);
    editForm.resetForm();
    setEditErrors({});
  }, [editForm]);

  const handleCreateUser = useCallback(async (event) => {
    event.preventDefault();
    if (!token) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }
    const nextErrors = validateUserForm(createForm.formData, { isCreate: true });
    setCreateErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.REQUIRED_FIELDS });
      return;
    }
    await withSubmitting(setIsSubmitting, () => createForm.setFormAlert(null), async () => {
      try {
        const payload = buildUserPayload(createForm.formData, { includePassword: true });
        await UserService.create(payload);
        createForm.resetForm();
        setCreateErrors({});
        await loadUsers({ nextFilters: filters, pageNumber: pagination.pageNumber });
        closeCreateModal();
        setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.USER_CREATED });
      } catch (err) {
        createForm.setFormAlert({
          type: ALERT_VARIANTS.ERROR,
          message: err?.message || MESSAGES.ERROR_SAVING
        });
      }
    });
  }, [createForm, closeCreateModal, filters, loadUsers, pagination.pageNumber, token]);

  const handleEditUser = useCallback((userId) => {
    if (!userId) return;
    setIsViewMode(false);
    setIsEditOpen(true);
    setEditUserId(userId);
    editForm.setFormAlert(null);
    const cached = users.find((u) => u.userId === userId);
    if (cached) {
      editForm.populateForm(cached);
      return;
    }
    setIsEditLoading(true);
    UserService.findById(userId)
      .then((data) => editForm.populateForm(data))
      .catch(() => {
        editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.ERROR_LOADING_DATA });
      })
      .finally(() => setIsEditLoading(false));
  }, [editForm, users]);

  const handleViewUser = useCallback((userId) => {
    if (!userId) return;
    setIsViewMode(true);
    setIsEditOpen(true);
    setEditUserId(userId);
    editForm.setFormAlert(null);
    const cached = users.find((u) => u.userId === userId);
    if (cached) {
      editForm.populateForm(cached);
      return;
    }
    setIsEditLoading(true);
    UserService.findById(userId)
      .then((data) => editForm.populateForm(data))
      .catch(() => {
        editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.ERROR_LOADING_DATA });
      })
      .finally(() => setIsEditLoading(false));
  }, [editForm, users]);

  const handleUpdateUser = useCallback(async (event) => {
    event.preventDefault();
    if (!token) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }
    if (!editUserId) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.ERROR_LOADING_DATA });
      return;
    }
    const nextErrors = validateUserForm(editForm.formData, { isCreate: false });
    setEditErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.REQUIRED_FIELDS });
      return;
    }
    await withSubmitting(setIsSubmitting, () => editForm.setFormAlert(null), async () => {
      try {
        const payload = buildUserPayload(editForm.formData);
        await UserService.update(editUserId, payload);
        await loadUsers({ nextFilters: filters, pageNumber: pagination.pageNumber });
        closeEditModal();
        setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.USER_UPDATED });
      } catch (err) {
        editForm.setFormAlert({
          type: ALERT_VARIANTS.ERROR,
          message: err?.message || MESSAGES.ERROR_UPDATING
        });
      }
    });
  }, [editForm, editUserId, filters, loadUsers, pagination.pageNumber, token, closeEditModal]);

  const handleDeleteUser = useCallback(async (userId) => {
    if (!userId) return;
    if (!token) {
      setPageAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }
    const confirmed = window.confirm(MESSAGES.CONFIRM_DELETE_USER);
    if (!confirmed) return;
    setPageAlert(null);
    try {
      await UserService.delete(userId);
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.USER_DELETED });
      await loadUsers({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      setPageAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err?.message || MESSAGES.ERROR_DELETING
      });
    }
  }, [filters, loadUsers, pagination.pageNumber, token]);

  const handleActivateUser = useCallback(async (userId) => {
    if (!userId || !token) return;
    setPageAlert(null);
    try {
      await UserService.activate(userId);
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.USER_ACTIVATED });
      await loadUsers({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      setPageAlert({ type: ALERT_VARIANTS.ERROR, message: err?.message || MESSAGES.ERROR_UPDATING });
    }
  }, [filters, loadUsers, pagination.pageNumber, token]);

  const filterFields = useMemo(
    () => buildUserFilterFields({ roles, includeRole: false }),
    [roles]
  );

  return {
    state: { users, filters, createForm, editForm, createErrors, editErrors },
    ui: { isLoading: loading, error, pageAlert, isSubmitting, isCreateOpen, isEditOpen, isEditLoading, isViewMode },
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
      handleCreateUser,
      handleViewUser,
      handleEditUser,
      handleUpdateUser,
      closeEditModal,
      handleDeleteUser,
      handleActivateUser
    },
    options: { pagination, filterFields, roles }
  };
}

export default useEmployeeClientListPage;
