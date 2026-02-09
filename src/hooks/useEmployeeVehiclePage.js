import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VehicleService from '../api/services/VehicleService';
import { ALERT_VARIANTS, MESSAGES, ROUTES } from '../constants';
import { getHeadquartersOptionLabel } from '../config/headquartersLabels';
import { buildReservationState } from '../config/reservationNavigation';
import { useAuth } from './useAuth';
import useEmployeeVehicleList from './useEmployeeVehicleList';
import useHeadquarters from './useHeadquarters';
import useMaintenanceInbox from './useMaintenanceInbox';
import useVehicleForm, { buildVehiclePayload } from './useVehicleForm';

function useEmployeeVehiclePage() {
  const { headquarters, loading: hqLoading } = useHeadquarters();
  const {
    vehicles,
    loading,
    error,
    filters,
    categories,
    statuses,
    pagination,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handlePageChange,
    loadVehicles
  } = useEmployeeVehicleList();
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

  const headquartersOptions = useMemo(() => (
    headquarters.map((hq) => ({
      value: hq.headquartersId ?? hq.id,
      label: getHeadquartersOptionLabel(hq)
    }))
  ), [headquarters]);

  const handleInboxViewDetails = useCallback((item) => {
    if (!item?.vehicleId) {
      return;
    }
    setSelectedVehicleId(item.vehicleId);
  }, []);

  const handleCreateVehicle = useCallback(async (event) => {
    event.preventDefault();

    if (!token) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    setIsSubmitting(true);
    createForm.setFormAlert(null);

    try {
      const payload = buildVehiclePayload(createForm.formData);
      await VehicleService.create(payload);
      createForm.setFormAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.VEHICLE_CREATED });
      createForm.resetForm();
      await loadVehicles({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      createForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_SAVING
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [createForm, filters, loadVehicles, pagination.pageNumber, token]);

  const handleEditVehicle = useCallback(async (vehicleId) => {
    if (!vehicleId) return;
    setIsEditOpen(true);
    setEditVehicleId(vehicleId);
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
  }, [editForm, vehicles]);

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

    try {
      const payload = buildVehiclePayload(editForm.formData);
      await VehicleService.update(editVehicleId, payload);
      editForm.setFormAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.VEHICLE_UPDATED });
      await loadVehicles({ nextFilters: filters, pageNumber: pagination.pageNumber });
      setIsEditOpen(false);
      setEditVehicleId(null);
      editForm.resetForm();
    } catch (err) {
      editForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_UPDATING
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [editForm, editVehicleId, filters, loadVehicles, pagination.pageNumber, token]);

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
  }, [editForm]);

  const handleOpenCreate = useCallback(() => {
    setIsCreateOpen(true);
  }, []);

  const handleCloseCreate = useCallback(() => {
    setIsCreateOpen(false);
  }, []);

  return {
    headquarters,
    hqLoading,
    vehicles,
    loading,
    error,
    filters,
    categories,
    statuses,
    pagination,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handlePageChange,
    createForm,
    editForm,
    pageAlert,
    setPageAlert,
    selectedVehicleId,
    setSelectedVehicleId,
    isSubmitting,
    isCreateOpen,
    isEditOpen,
    isEditLoading,
    headquartersOptions,
    handleOpenInbox,
    handleCloseInbox,
    handleApproveMaintenance,
    handleInboxViewDetails,
    inboxItems,
    inboxLoading,
    inboxError,
    inboxAlert,
    approvingItems,
    isInboxOpen,
    setInboxAlert,
    handleCreateVehicle,
    handleEditVehicle,
    handleUpdateVehicle,
    handleDeleteVehicle,
    handleReserve,
    handleCloseEditModal,
    handleOpenCreate,
    handleCloseCreate
  };
}

export default useEmployeeVehiclePage;
