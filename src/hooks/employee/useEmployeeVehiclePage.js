import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VehicleService from '../../api/services/vehicleService';
import { ALERT_VARIANTS, MESSAGES, ROUTES, VEHICLE_STATUS } from '../../constants';
import { buildReservationState } from '../../utils/reservation/reservationUtils';
import { buildEmployeeVehicleSearchCriteria, buildVehicleStatusMap } from '../../utils/vehicle';
import { buildVehicleFilterFields, getVehicleFilterDefaults } from '../../utils/filter/filterFieldBuilders';
import { buildHeadquartersOptions } from '../../utils/location/headquartersUtils';
import { getApiErrorMessage } from '../../utils/ui/uiUtils';
import { useAuth } from '../core/useAuth';
import useHeadquarters from '../location/useHeadquarters';
import useMaintenanceInbox from './useMaintenanceInbox';
import usePaginatedSearch from '../core/usePaginatedSearch';
import useVehicleForm, { buildVehiclePayload, mapVehicleToFormData } from '../vehicle/useVehicleForm';
import useVehicleImage, { uploadVehicleImageFile } from '../vehicle/useVehicleImage';
import { useVehicleImageFormState } from '../vehicle/useVehicleImageFormState';
import useVehicleCategories from '../vehicle/useVehicleCategories';
import useVehicleStatuses from '../vehicle/useVehicleStatuses';
import useFilterRanges from '../config/useFilterRanges';
import { withSubmitting } from '../_internal/orchestratorUtils';

const DEFAULT_FILTERS = getVehicleFilterDefaults({
  includeIdentifiers: true,
  includeStatus: true,
  includeActiveStatus: true,
});

const fetchVehicles = async (criteria) => {
  const response = await VehicleService.search(criteria);
  return response;
};

function useEmployeeVehiclePage() {
  const { headquarters, loading: hqLoading } = useHeadquarters();
  const { categories } = useVehicleCategories();
  const { statuses } = useVehicleStatuses();
  const { filterRanges } = useFilterRanges();

  const search = usePaginatedSearch({
    defaultFilters: DEFAULT_FILTERS,
    buildCriteria: buildEmployeeVehicleSearchCriteria,
    fetch: fetchVehicles,
    errorMessage: 'ERROR_LOADING_DATA',
  });

  const {
    items: vehicles,
    loading,
    error,
    filters,
    pagination,
    loadItems: loadVehicles,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handlePageChange,
  } = search;

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

  const createImage = useVehicleImageFormState();
  const editImage = useVehicleImageFormState();

  const {
    imageSrc: editImageSrc,
    hasImage: editHasImage,
    uploadImage,
    removeImage,
  } = useVehicleImage(editVehicleId, isEditOpen ? 1 : 0);

  const handlePutVehicleAvailable = useCallback(async (vehicleId) => {
    const vehicle = await VehicleService.findById(vehicleId);
    const formData = mapVehicleToFormData(vehicle);
    const payload = { ...buildVehiclePayload(formData), vehicleStatusId: VEHICLE_STATUS.AVAILABLE_ID };
    await VehicleService.update(vehicleId, payload);
    await loadVehicles({ nextFilters: filters, pageNumber: pagination.pageNumber });
  }, [filters, loadVehicles, pagination.pageNumber]);

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
    setAlert: setInboxAlert,
  } = useMaintenanceInbox({ vehicles, token, onVehicleApproved: handlePutVehicleAvailable });

  const handleInboxViewDetails = useCallback((item) => {
    if (!item?.vehicleId) return;
    setSelectedVehicleId(item.vehicleId);
  }, []);

  const handleCreateVehicle = useCallback(async (event) => {
    event.preventDefault();

    if (!token) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    await withSubmitting(
      setIsSubmitting,
      [() => createForm.setFormAlert(null), () => createImage.setFileError(null)],
      async () => {
        try {
          const payload = buildVehiclePayload(createForm.formData);
          const created = await VehicleService.create(payload);
          const createdVehicleId = created?.vehicleId;

          if (createImage.imageFile && createdVehicleId) {
            await uploadVehicleImageFile(createdVehicleId, createImage.imageFile);
          }

          createForm.setFormAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.VEHICLE_CREATED });
          createForm.resetForm();
          createImage.reset();
          await loadVehicles({ nextFilters: filters, pageNumber: pagination.pageNumber });
          setIsCreateOpen(false);
        } catch (err) {
          createForm.setFormAlert({
            type: ALERT_VARIANTS.ERROR,
            message: getApiErrorMessage(err, 'ERROR_SAVING'),
          });
          createImage.setFileError(getApiErrorMessage(err, 'ERROR_SAVING'));
        }
      }
    );
  }, [createForm, createImage, filters, loadVehicles, pagination.pageNumber, token]);

  const handleEditVehicle = useCallback(async (vehicleId) => {
    if (!vehicleId) return;
    setIsEditOpen(true);
    setEditVehicleId(vehicleId);
    editImage.reset();
    editForm.setFormAlert(null);

    const cachedVehicle = vehicles.find((item) => item.vehicleId === vehicleId);
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
        message: getApiErrorMessage(err, 'ERROR_LOADING_DATA'),
      });
    } finally {
      setIsEditLoading(false);
    }
  }, [editForm, editImage, vehicles]);

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

    await withSubmitting(
      setIsSubmitting,
      [() => editForm.setFormAlert(null), () => editImage.setFileError(null)],
      async () => {
        try {
          const payload = buildVehiclePayload(editForm.formData);
          await VehicleService.update(editVehicleId, payload);

          if (editImage.imageFile) {
            if (editHasImage) await removeImage();
            await uploadImage(editImage.imageFile);
          }

          editForm.setFormAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.VEHICLE_UPDATED });
          await loadVehicles({ nextFilters: filters, pageNumber: pagination.pageNumber });
          setIsEditOpen(false);
          setEditVehicleId(null);
          editForm.resetForm();
          editImage.reset();
        } catch (err) {
          editForm.setFormAlert({
            type: ALERT_VARIANTS.ERROR,
            message: getApiErrorMessage(err, 'ERROR_UPDATING'),
          });
          editImage.setFileError(getApiErrorMessage(err, 'ERROR_UPDATING'));
        }
      }
    );
  }, [editForm, editHasImage, editImage, editVehicleId, filters, loadVehicles, pagination.pageNumber, removeImage, token, uploadImage]);

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
        message: getApiErrorMessage(err, 'ERROR_DELETING'),
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
    editImage.reset();
  }, [editForm, editImage]);

  const handleOpenCreate = useCallback(() => setIsCreateOpen(true), []);

  const handleCloseCreate = useCallback(() => {
    setIsCreateOpen(false);
    createImage.reset();
  }, [createImage]);

  const createImageState = useMemo(() => ({
    imageSrc: '',
    hasImage: false,
    fileError: createImage.fileError,
    onFileChange: createImage.onFileChange,
    onRemoveSelectedFile: createImage.reset,
    selectedFileName: createImage.selectedFileName,
    previewSrc: createImage.previewSrc,
  }), [createImage]);

  const editImageState = useMemo(() => ({
    imageSrc: editImageSrc,
    hasImage: editHasImage,
    fileError: editImage.fileError,
    onFileChange: editImage.onFileChange,
    onRemoveSelectedFile: editImage.reset,
    selectedFileName: editImage.selectedFileName,
    previewSrc: editImage.previewSrc,
  }), [editHasImage, editImage, editImageSrc]);

  const filterFields = useMemo(() => buildVehicleFilterFields({
    categories,
    statuses,
    headquarters,
    includeIdentifiers: true,
    includeStatus: true,
    includeActiveStatus: true,
    includeHeadquarters: true,
    filterRangesFromApi: filterRanges,
  }), [categories, statuses, headquarters, filterRanges]);

  const statusMap = useMemo(() => buildVehicleStatusMap(statuses), [statuses]);
  const headquartersOptions = useMemo(() => buildHeadquartersOptions(headquarters), [headquarters]);

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
      editImageState,
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
      isInboxOpen,
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
      handleCloseCreate,
    },
    options: {
      pagination,
      filterFields,
      statusMap,
      headquartersOptions,
    },
  };
}

export default useEmployeeVehiclePage;
