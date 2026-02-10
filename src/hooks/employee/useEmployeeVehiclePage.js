import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VehicleService from '../../api/services/VehicleService';
import { ALERT_VARIANTS, MESSAGES, PAGINATION, ROUTES } from '../../constants';
import { buildReservationState } from '../../constants/reservationNavigation';
import { buildVehicleSearchCriteria } from '../../utils/vehicleSearchCriteria';
import { getVehicleFilterDefaults } from '../../constants/vehicleFilterDefaults';
import { useAuth } from '../core/useAuth';
import useHeadquarters from '../location/useHeadquarters';
import useMaintenanceInbox from './useMaintenanceInbox';
import useVehicleForm, { buildVehiclePayload } from '../vehicle/useVehicleForm';
import useVehicleImage, { uploadVehicleImageFile, validateVehicleImageFile } from '../vehicle/useVehicleImage';
import useVehicleCategories from '../vehicle/useVehicleCategories';
import useVehicleStatuses from '../vehicle/useVehicleStatuses';
import { createEmptyPaginationState, createPaginationState, updateFilterValue } from '../_internal/orchestratorUtils';

const DEFAULT_FILTERS = getVehicleFilterDefaults({
  includeIdentifiers: true,
  includeStatus: true,
  includeActiveStatus: true
});

const buildCriteria = (filters, pageNumber) => buildVehicleSearchCriteria(filters, {
  includeIdentifiers: true,
  includeStatus: true,
  includeActiveStatus: true,
  pageNumber,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE
});

function useEmployeeVehiclePage() {
  const { headquarters, loading: hqLoading } = useHeadquarters();
  const { categories } = useVehicleCategories();
  const { statuses } = useVehicleStatuses();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState(createEmptyPaginationState);

  const { token } = useAuth();
  const navigate = useNavigate();
  const createForm = useVehicleForm();
  const editForm = useVehicleForm();
  const [pageAlert, setPageAlert] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editVehicleId, setEditVehicleId] = useState(null);
  const [createImageFile, setCreateImageFile] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [createImageError, setCreateImageError] = useState(null);
  const [editImageError, setEditImageError] = useState(null);
  const [createPreviewSrc, setCreatePreviewSrc] = useState('');
  const [editPreviewSrc, setEditPreviewSrc] = useState('');

  const loadVehicles = useCallback(async ({
    nextFilters = DEFAULT_FILTERS,
    pageNumber = PAGINATION.DEFAULT_PAGE
  } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const criteria = buildCriteria(nextFilters, pageNumber);
      const response = await VehicleService.search(criteria);
      const results = response?.results || response || [];
      const totalRecords = response?.totalRecords ?? results.length;
      const totalPages = response?.totalPages
        ?? Math.max(1, Math.ceil(totalRecords / criteria.pageSize));

      setVehicles(results);
      setPagination(createPaginationState({
        pageNumber: response?.pageNumber ?? pageNumber,
        totalPages,
        totalRecords
      }));
    } catch (err) {
      setError(err.message || MESSAGES.ERROR_LOADING_DATA);
      setVehicles([]);
      setPagination(createEmptyPaginationState());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVehicles({ nextFilters: DEFAULT_FILTERS, pageNumber: PAGINATION.DEFAULT_PAGE });
  }, [loadVehicles]);

  const handleFilterChange = useCallback((event) => {
    updateFilterValue(setFilters, event);
  }, []);

  const applyFilters = useCallback(() => {
    loadVehicles({ nextFilters: filters, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [filters, loadVehicles]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    loadVehicles({ nextFilters: DEFAULT_FILTERS, pageNumber: PAGINATION.DEFAULT_PAGE }).catch(() => {});
  }, [loadVehicles]);

  const handlePageChange = useCallback((nextPage) => {
    loadVehicles({ nextFilters: filters, pageNumber: nextPage }).catch(() => {});
  }, [filters, loadVehicles]);

  const updateCreatePreview = useCallback((nextSrc) => {
    setCreatePreviewSrc((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return nextSrc;
    });
  }, []);

  const updateEditPreview = useCallback((nextSrc) => {
    setEditPreviewSrc((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return nextSrc;
    });
  }, []);

  const {
    imageSrc: editImageSrc,
    hasImage: editHasImage,
    uploadImage,
    removeImage
  } = useVehicleImage(editVehicleId, isEditOpen ? 1 : 0);

  const {
    isOpen: isInboxOpen,
    items: inboxItems,
    isLoading: inboxLoading,
    error: inboxError,
    alert: inboxAlert,
    approvingItems,
    openInbox: handleOpenInbox,
    closeInbox: handleCloseInbox,
    approveMaintenance: handleApproveMaintenance,
    setAlert: setInboxAlert
  } = useMaintenanceInbox({
    vehicles,
    statuses,
    token,
    filters,
    pagination,
    loadVehicles
  });

  const handleInboxViewDetails = useCallback((item) => {
    if (!item?.vehicleId) {
      return;
    }
    setSelectedVehicleId(item.vehicleId);
  }, []);

  const resetCreateImage = useCallback(() => {
    setCreateImageFile(null);
    setCreateImageError(null);
    updateCreatePreview('');
  }, [updateCreatePreview]);

  const resetEditImage = useCallback(() => {
    setEditImageFile(null);
    setEditImageError(null);
    updateEditPreview('');
  }, [updateEditPreview]);

  const handleCreateImageChange = useCallback((event) => {
    const file = event.target.files?.[0] ?? null;
    setCreateImageError(null);
    const validationError = file ? validateVehicleImageFile(file) : null;
    if (validationError) {
      setCreateImageError(validationError);
      setCreateImageFile(null);
      updateCreatePreview('');
      return;
    }
    setCreateImageFile(file);
    updateCreatePreview(file ? URL.createObjectURL(file) : '');
  }, [updateCreatePreview]);

  const handleEditImageChange = useCallback((event) => {
    const file = event.target.files?.[0] ?? null;
    setEditImageError(null);
    const validationError = file ? validateVehicleImageFile(file) : null;
    if (validationError) {
      setEditImageError(validationError);
      setEditImageFile(null);
      updateEditPreview('');
      return;
    }
    setEditImageFile(file);
    updateEditPreview(file ? URL.createObjectURL(file) : '');
  }, [updateEditPreview]);

  const handleCreateVehicle = useCallback(async (event) => {
    event.preventDefault();

    if (!token) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    setIsSubmitting(true);
    createForm.setFormAlert(null);
    setCreateImageError(null);

    try {
      const payload = buildVehiclePayload(createForm.formData);
      const created = await VehicleService.create(payload);
      const createdVehicleId = created?.vehicleId;

      if (createImageFile && createdVehicleId) {
        await uploadVehicleImageFile(createdVehicleId, createImageFile);
      }

      createForm.setFormAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.VEHICLE_CREATED });
      createForm.resetForm();
      resetCreateImage();
      await loadVehicles({ nextFilters: filters, pageNumber: pagination.pageNumber });
      setIsCreateOpen(false);
    } catch (err) {
      createForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_SAVING
      });
      setCreateImageError(err.message || null);
    } finally {
      setIsSubmitting(false);
    }
  }, [createForm, createImageFile, filters, loadVehicles, pagination.pageNumber, resetCreateImage, token]);

  const handleEditVehicle = useCallback(async (vehicleId) => {
    if (!vehicleId) return;
    setIsEditOpen(true);
    setEditVehicleId(vehicleId);
    resetEditImage();
    editForm.setFormAlert(null);

    const cachedVehicle = vehicles.find((item) => (item.vehicleId ?? item.id) === vehicleId);
    if (cachedVehicle) {
      editForm.populateForm(cachedVehicle);
      return;
    }

    setIsEditLoading(true);
    try {
      const vehicle = await VehicleService.findById(vehicleId);
      editForm.populateForm(vehicle);
    } catch (err) {
      editForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_LOADING_DATA
      });
    } finally {
      setIsEditLoading(false);
    }
  }, [editForm, resetEditImage, vehicles]);

  const handleUpdateVehicle = useCallback(async (event) => {
    event.preventDefault();

    if (!token) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    if (!editVehicleId) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.VEHICLE_NOT_FOUND });
      return;
    }

    setIsSubmitting(true);
    editForm.setFormAlert(null);
    setEditImageError(null);

    try {
      const payload = buildVehiclePayload(editForm.formData);
      await VehicleService.update(editVehicleId, payload);

      if (editImageFile) {
        if (editHasImage) {
          await removeImage();
        }
        await uploadImage(editImageFile);
      }

      editForm.setFormAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.VEHICLE_UPDATED });
      await loadVehicles({ nextFilters: filters, pageNumber: pagination.pageNumber });
      setIsEditOpen(false);
      setEditVehicleId(null);
      editForm.resetForm();
      resetEditImage();
    } catch (err) {
      editForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_UPDATING
      });
      setEditImageError(err.message || null);
    } finally {
      setIsSubmitting(false);
    }
  }, [editForm, editHasImage, editImageFile, editVehicleId, filters, loadVehicles, pagination.pageNumber, removeImage, resetEditImage, token, uploadImage]);

  const handleDeleteVehicle = useCallback(async (vehicleId) => {
    if (!vehicleId) return;

    if (!token) {
      setPageAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    const confirmed = window.confirm(MESSAGES.CONFIRM_DELETE_VEHICLE);
    if (!confirmed) return;

    setPageAlert(null);
    try {
      await VehicleService.delete(vehicleId);
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.VEHICLE_DELETED });
      await loadVehicles({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      setPageAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_DELETING
      });
    }
  }, [filters, loadVehicles, pagination.pageNumber, token]);

  const handleReserve = useCallback((vehicle) => {
    if (!vehicle) return;
    const reservationState = buildReservationState({ vehicle });

    setSelectedVehicleId(null);
    navigate(ROUTES.RESERVATION_CREATE, { state: reservationState });
  }, [navigate]);

  const handleCloseEditModal = useCallback(() => {
    setIsEditOpen(false);
    setEditVehicleId(null);
    setIsEditLoading(false);
    editForm.resetForm();
    resetEditImage();
  }, [editForm, resetEditImage]);

  const handleOpenCreate = useCallback(() => {
    setIsCreateOpen(true);
  }, []);

  const handleCloseCreate = useCallback(() => {
    setIsCreateOpen(false);
    resetCreateImage();
  }, [resetCreateImage]);

  const createImageState = useMemo(() => ({
    imageSrc: '',
    hasImage: false,
    fileError: createImageError,
    onFileChange: handleCreateImageChange,
    onRemoveSelectedFile: resetCreateImage,
    selectedFileName: createImageFile?.name || '',
    previewSrc: createPreviewSrc
  }), [createImageError, createImageFile?.name, createPreviewSrc, handleCreateImageChange, resetCreateImage]);

  const editImageState = useMemo(() => ({
    imageSrc: editImageSrc,
    hasImage: editHasImage,
    fileError: editImageError,
    onFileChange: handleEditImageChange,
    onRemoveSelectedFile: resetEditImage,
    selectedFileName: editImageFile?.name || '',
    previewSrc: editPreviewSrc
  }), [editHasImage, editImageError, editImageFile?.name, editImageSrc, editPreviewSrc, handleEditImageChange, resetEditImage]);

  return {
    state: {
      headquarters,
      vehicles,
      filters,
      categories,
      statuses,
      selectedVehicleId,
      createForm,
      editForm,
      inboxItems,
      createImageState,
      editImageState
    },
    ui: {
      isLoading: loading,
      error,
      hqLoading,
      pageAlert,
      isSubmitting,
      isCreateOpen,
      isEditOpen,
      isEditLoading,
      inboxLoading,
      inboxError,
      inboxAlert,
      approvingItems,
      isInboxOpen
    },
    actions: {
      handleFilterChange,
      applyFilters,
      resetFilters,
      handlePageChange,
      setPageAlert,
      setSelectedVehicleId,
      handleOpenInbox,
      handleCloseInbox,
      handleApproveMaintenance,
      handleInboxViewDetails,
      setInboxAlert,
      handleCreateVehicle,
      handleEditVehicle,
      handleUpdateVehicle,
      handleDeleteVehicle,
      handleReserve,
      handleCloseEditModal,
      handleOpenCreate,
      handleCloseCreate
    },
    meta: {
      pagination
    }
  };
}

export default useEmployeeVehiclePage;
