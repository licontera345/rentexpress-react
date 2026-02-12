import { useCallback, useEffect, useMemo, useState } from 'react';
import AddressService from '../../api/services/AddressService';
import RoleService from '../../api/services/RoleService';
import UserService from '../../api/services/UserService';
import { ALERT_VARIANTS, MESSAGES, PAGINATION } from '../../constants';
import {
  buildAddressPayload,
  buildUserPayload,
  mapUserToFormData,
  validateUserForm
} from '../../forms/userFormUtils';
import useFormState from '../core/useFormState';
import useCities from '../location/useCities';
import useProvinces from '../location/useProvinces';
import { createEmptyPaginationState, createPaginationState, updateFilterValue } from '../_internal/orchestratorUtils';

const DEFAULT_FILTERS = {
  userId: '',
  username: '',
  firstName: '',
  lastName1: '',
  email: '',
  phone: '',
  birthDateFrom: '',
  birthDateTo: '',
  activeStatus: ''
};

const DEFAULT_USER_FORM_DATA = mapUserToFormData();

const resolveCustomerRoleId = (roles = []) => {
  const customerRole = roles.find((role) => {
    const roleName = (role.roleName || '').toLowerCase();
    return roleName.includes('user') || roleName.includes('client') || roleName.includes('customer');
  });

  return customerRole?.roleId || 1;
};

const clearFieldError = (setErrors, name) => {
  setErrors((prev) => {
    if (!prev[name]) return prev;
    return Object.assign({}, prev, { [name]: null });
  });
};

const useEmployeeClientListPage = () => {
  const { provinces, loading: provincesLoading } = useProvinces();

  const [clients, setClients] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState(createEmptyPaginationState);

  const createForm = useFormState({
    initialData: DEFAULT_USER_FORM_DATA,
    mapData: mapUserToFormData
  });
  const editForm = useFormState({
    initialData: DEFAULT_USER_FORM_DATA,
    mapData: mapUserToFormData
  });

  const { cities: createCities, loading: createCitiesLoading } = useCities(createForm.formData.provinceId);
  const { cities: editCities, loading: editCitiesLoading } = useCities(editForm.formData.provinceId);

  const customerRoleId = useMemo(() => resolveCustomerRoleId(roles), [roles]);

  const [pageAlert, setPageAlert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [createErrors, setCreateErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const loadClients = useCallback(async ({
    nextFilters = DEFAULT_FILTERS,
    pageNumber = PAGINATION.DEFAULT_PAGE
  } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await UserService.search({
        userId: nextFilters.userId || undefined,
        username: nextFilters.username || undefined,
        firstName: nextFilters.firstName || undefined,
        lastName1: nextFilters.lastName1 || undefined,
        email: nextFilters.email || undefined,
        phone: nextFilters.phone || undefined,
        birthDateFrom: nextFilters.birthDateFrom || undefined,
        birthDateTo: nextFilters.birthDateTo || undefined,
        activeStatus: nextFilters.activeStatus === '' ? undefined : nextFilters.activeStatus === '1',
        roleId: customerRoleId,
        pageNumber,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE
      });

      const results = response?.results ?? response ?? [];
      const totalRecords = response?.totalRecords ?? results.length;
      const totalPages = response?.totalPages ?? Math.max(1, Math.ceil(totalRecords / PAGINATION.DEFAULT_PAGE_SIZE));

      setClients(results);
      setPagination(createPaginationState({
        pageNumber: response?.pageNumber ?? pageNumber,
        totalPages,
        totalRecords
      }));
    } catch (err) {
      setError(err.message || MESSAGES.ERROR_LOADING_DATA);
      setClients([]);
      setPagination(createEmptyPaginationState());
    } finally {
      setLoading(false);
    }
  }, [customerRoleId]);

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

  useEffect(() => {
    loadClients({ nextFilters: DEFAULT_FILTERS, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [loadClients]);

  const handleFilterChange = useCallback((event) => {
    updateFilterValue(setFilters, event);
  }, []);

  const applyFilters = useCallback(() => {
    loadClients({ nextFilters: filters, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [filters, loadClients]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    loadClients({ nextFilters: DEFAULT_FILTERS, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [loadClients]);

  const handlePageChange = useCallback((nextPage) => {
    loadClients({ nextFilters: filters, pageNumber: nextPage }).catch(() => {});
  }, [filters, loadClients]);

  const handleCreateChange = useCallback((event) => {
    createForm.handleFormChange(event);
    if (event.target.name === 'provinceId') {
      createForm.handleFormChange({ target: { name: 'cityId', value: '' } });
    }
    clearFieldError(setCreateErrors, event.target.name);
  }, [createForm]);

  const handleEditChange = useCallback((event) => {
    editForm.handleFormChange(event);
    if (event.target.name === 'provinceId') {
      editForm.handleFormChange({ target: { name: 'cityId', value: '' } });
    }
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
    setEditUserId(null);
    setIsEditLoading(false);
    editForm.resetForm();
    setEditErrors({});
  }, [editForm]);

  const handleCreateClient = useCallback(async (event) => {
    event.preventDefault();

    const validationErrors = validateUserForm(createForm.formData);
    setCreateErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.FORM_VALIDATION_ERROR });
      return;
    }

    setIsSubmitting(true);
    createForm.setFormAlert(null);

    try {
      const address = await AddressService.create(buildAddressPayload(createForm.formData));
      const addressId = address?.id ?? address?.addressId;
      if (!addressId) throw new Error(MESSAGES.ERROR_SAVING);

      await UserService.create(Object.assign(
        buildUserPayload(createForm.formData, { roleId: customerRoleId }),
        { addressId }
      ));

      await loadClients({ nextFilters: filters, pageNumber: pagination.pageNumber });
      closeCreateModal();
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.USER_CREATED });
    } catch (err) {
      createForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_SAVING
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [closeCreateModal, createForm, customerRoleId, filters, loadClients, pagination.pageNumber]);

  const handleEditClient = useCallback(async (userId) => {
    if (!userId) return;

    setIsEditOpen(true);
    setEditUserId(userId);
    setEditErrors({});
    editForm.setFormAlert(null);

    const cachedUser = clients.find((item) => (item.userId ?? item.id) === userId);
    if (cachedUser) {
      editForm.populateForm(cachedUser);
      return;
    }

    setIsEditLoading(true);
    try {
      const user = await UserService.findById(userId);
      editForm.populateForm(user);
    } catch (err) {
      editForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_LOADING_DATA
      });
    } finally {
      setIsEditLoading(false);
    }
  }, [clients, editForm]);

  const handleUpdateClient = useCallback(async (event) => {
    event.preventDefault();

    if (!editUserId) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.USER_NOT_FOUND });
      return;
    }

    const validationErrors = validateUserForm(editForm.formData, { isEdit: true });
    setEditErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.FORM_VALIDATION_ERROR });
      return;
    }

    setIsSubmitting(true);
    editForm.setFormAlert(null);

    try {
      const existingAddressId = editForm.formData.addressId;
      const addressPayload = buildAddressPayload(editForm.formData);
      let addressId = existingAddressId;

      if (existingAddressId) {
        await AddressService.update(existingAddressId, addressPayload);
      } else {
        const createdAddress = await AddressService.create(addressPayload);
        addressId = createdAddress?.id ?? createdAddress?.addressId;
      }

      await UserService.update(
        editUserId,
        Object.assign(
          buildUserPayload(editForm.formData, {
            includePassword: Boolean(editForm.formData.password),
            roleId: customerRoleId
          }),
          { addressId }
        )
      );

      await loadClients({ nextFilters: filters, pageNumber: pagination.pageNumber });
      closeEditModal();
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.USER_UPDATED });
    } catch (err) {
      editForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_UPDATING
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [closeEditModal, customerRoleId, editForm, editUserId, filters, loadClients, pagination.pageNumber]);

  const handleDeleteClient = useCallback(async (userId) => {
    if (!userId) return;

    const confirmed = window.confirm(MESSAGES.CONFIRM_DELETE_USER);
    if (!confirmed) return;

    setPageAlert(null);
    try {
      await UserService.delete(userId);
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.USER_DELETED });
      await loadClients({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      setPageAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_DELETING
      });
    }
  }, [filters, loadClients, pagination.pageNumber]);

  return {
    state: {
      clients,
      filters,
      createForm,
      editForm,
      createErrors,
      editErrors,
      provinces,
      createCities,
      editCities
    },
    ui: {
      isLoading: loading,
      error,
      pageAlert,
      isSubmitting,
      isCreateOpen,
      isEditOpen,
      isEditLoading,
      provincesLoading,
      createCitiesLoading,
      editCitiesLoading
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
      handleCreateClient,
      handleEditClient,
      handleUpdateClient,
      handleDeleteClient
    },
    meta: {
      pagination
    }
  };
};

export default useEmployeeClientListPage;
