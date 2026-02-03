import { useCallback, useEffect, useMemo, useState } from 'react';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import Card from '../../../components/common/layout/Card';
import Alert from '../../../components/common/feedback/Alert';
import EmptyState from '../../../components/common/feedback/EmptyState';
import LoadingSpinner from '../../../components/common/feedback/LoadingSpinner';
import Pagination from '../../../components/common/navigation/Pagination';
import VehicleFilters from '../../../components/common/filters/VehicleFilters';
import ReservationListItem from '../../../components/reservations/ReservationListItem';
import ReservationFormModal from '../../../components/reservations/ReservationFormModal';
import ReservationService from '../../../api/services/ReservationService';
import ReservationStatusService from '../../../api/services/ReservationStatusService';
import VehicleService from '../../../api/services/VehicleService';
import { useAuth } from '../../../hooks/useAuth';
import useEmployeeReservationsList from '../../../hooks/useEmployeeReservationsList';
import useHeadquarters from '../../../hooks/useHeadquarters';
import useLocale from '../../../hooks/useLocale';
import useReservationForm from '../../../hooks/useReservationForm';
import { ALERT_VARIANTS, MESSAGES, PAGINATION } from '../../../constants';
import { buildReservationFilterFields } from '../../../config/reservationFilterFields';
import { filterReservationStatusesByLocale } from '../../../utils/reservationStatusUtils';
import {
  buildReservationPayload,
  validateReservationForm
} from '../../../utils/reservationFormUtils';

function ReservationsList() {
  const locale = useLocale();
  const { token, user } = useAuth();
  const { headquarters, loading: headquartersLoading, error: headquartersError } = useHeadquarters();
  const {
    reservations,
    loading,
    error,
    filters,
    pagination,
    loadReservations,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handlePageChange
  } = useEmployeeReservationsList();
  const createForm = useReservationForm();
  const editForm = useReservationForm();
  const [pageAlert, setPageAlert] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editReservationId, setEditReservationId] = useState(null);
  const [createErrors, setCreateErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const employeeId = useMemo(() => (
    user?.employeeId || user?.employee?.employeeId || user?.employee?.id || ''
  ), [user]);

  const filterFields = useMemo(() => (
    buildReservationFilterFields({
      statuses,
      headquarters
    })
  ), [headquarters, statuses]);

  const handleCreateChange = useCallback((event) => {
    createForm.handleFormChange(event);
    const { name } = event.target;
    setCreateErrors((prev) => {
      if (!prev[name]) return prev;
      return Object.assign({}, prev, { [name]: null });
    });
    createForm.setFormAlert(null);
  }, [createForm]);

  const handleEditChange = useCallback((event) => {
    editForm.handleFormChange(event);
    const { name } = event.target;
    setEditErrors((prev) => {
      if (!prev[name]) return prev;
      return Object.assign({}, prev, { [name]: null });
    });
    editForm.setFormAlert(null);
  }, [editForm]);

  const loadVehicles = useCallback(async () => {
    try {
      const response = await VehicleService.search({
        pageNumber: PAGINATION.DEFAULT_PAGE,
        pageSize: PAGINATION.MAX_PAGE_SIZE
      });
      const results = response?.results || response || [];
      setVehicles(results);
    } catch {
      setVehicles([]);
    }
  }, []);

  const loadStatuses = useCallback(async () => {
    try {
      const data = await ReservationStatusService.getAll(locale);
      setStatuses(filterReservationStatusesByLocale(data || [], locale));
    } catch {
      setStatuses([]);
    }
  }, [locale]);

  useEffect(() => {
    loadVehicles();
    loadStatuses();
  }, [loadStatuses, loadVehicles]);

  const handleCreateReservation = async (event) => {
    event.preventDefault();

    if (!token) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    const nextErrors = validateReservationForm(createForm.formData, {
      requireVehicleId: true,
      requireUserId: true,
      requireStatus: true
    });
    setCreateErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      createForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.REQUIRED_FIELDS });
      return;
    }

    setIsSubmitting(true);
    createForm.setFormAlert(null);

    try {
      const payload = buildReservationPayload(createForm.formData, { employeeId });
      await ReservationService.create(payload);
      createForm.setFormAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.RESERVATION_CREATED });
      createForm.resetForm();
      setCreateErrors({});
      await loadReservations({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      createForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_SAVING
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReservation = useCallback(async (reservationId) => {
    if (!reservationId) return;
    setIsEditOpen(true);
    setEditReservationId(reservationId);
    editForm.setFormAlert(null);

    const cachedReservation = reservations.find((item) => (item.reservationId ?? item.id) === reservationId);
    if (cachedReservation) {
      editForm.populateForm(cachedReservation);
      return;
    }

    setIsEditLoading(true);
    try {
      const reservation = await ReservationService.findById(reservationId);
      editForm.populateForm(reservation);
    } catch (err) {
      editForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_LOADING_DATA
      });
    } finally {
      setIsEditLoading(false);
    }
  }, [editForm, reservations]);

  const handleUpdateReservation = async (event) => {
    event.preventDefault();

    if (!token) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    if (!editReservationId) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.RESERVATION_NOT_FOUND });
      return;
    }

    const nextErrors = validateReservationForm(editForm.formData, {
      requireVehicleId: true,
      requireUserId: true,
      requireStatus: true
    });
    setEditErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      editForm.setFormAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.REQUIRED_FIELDS });
      return;
    }

    setIsSubmitting(true);
    editForm.setFormAlert(null);

    try {
      const payload = buildReservationPayload(editForm.formData, { employeeId });
      await ReservationService.update(editReservationId, payload);
      editForm.setFormAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.RESERVATION_UPDATED });
      await loadReservations({ nextFilters: filters, pageNumber: pagination.pageNumber });
      setIsEditOpen(false);
      setEditReservationId(null);
      setEditErrors({});
      editForm.resetForm();
    } catch (err) {
      editForm.setFormAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_UPDATING
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReservation = useCallback(async (reservationId) => {
    if (!reservationId) return;

    if (!token) {
      setPageAlert({ type: ALERT_VARIANTS.ERROR, message: MESSAGES.LOGIN_REQUIRED });
      return;
    }

    const confirmed = window.confirm(MESSAGES.CONFIRM_DELETE_RESERVATION);
    if (!confirmed) return;

    setPageAlert(null);
    try {
      await ReservationService.delete(reservationId);
      setPageAlert({ type: ALERT_VARIANTS.SUCCESS, message: MESSAGES.RESERVATION_DELETED });
      await loadReservations({ nextFilters: filters, pageNumber: pagination.pageNumber });
    } catch (err) {
      setPageAlert({
        type: ALERT_VARIANTS.ERROR,
        message: err.message || MESSAGES.ERROR_DELETING
      });
    }
  }, [loadReservations, pagination.pageNumber, token]);

  return (
    <PrivateLayout>
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <h1>{MESSAGES.RESERVATIONS_LIST_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.RESERVATIONS_LIST_SUBTITLE}</p>
          </div>
          <button
            type="button"
            className="vehicle-create-trigger"
            onClick={() => setIsCreateOpen(true)}
            aria-label={MESSAGES.ADD_RESERVATION}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M11 5a1 1 0 0 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5z" />
            </svg>
          </button>
        </header>

        <Card className="personal-space-card">
          <div className="vehicle-list-layout">
            <aside className="vehicle-filter-panel">
              <VehicleFilters
                fields={filterFields}
                values={filters}
                onChange={handleFilterChange}
                onApply={applyFilters}
                onReset={resetFilters}
                title={MESSAGES.FILTER_BY}
                isLoading={loading}
                className="vehicle-filters-panel"
              />
            </aside>

            <div className="vehicle-list-content">
              <div className="personal-space-card-header">
                <div>
                  <h2>{MESSAGES.RESULTS_TITLE}</h2>
                  <p className="personal-space-subtitle">
                    {MESSAGES.PAGE} {pagination.pageNumber} · {pagination.totalRecords} {MESSAGES.RESULTS}
                  </p>
                </div>
              </div>

              {pageAlert && (
                <Alert
                  type={pageAlert.type}
                  message={pageAlert.message}
                  onClose={() => setPageAlert(null)}
                />
              )}
              {loading && <LoadingSpinner message={MESSAGES.LOADING} />}
              {!loading && error && (
                <Alert
                  type={ALERT_VARIANTS.ERROR}
                  message={error}
                />
              )}

              {!loading && !error && reservations.length === 0 && (
                <EmptyState
                  title={MESSAGES.EMPTY_RESULTS}
                  description={MESSAGES.NO_RESERVATIONS_REGISTERED}
                />
              )}

              {!loading && !error && reservations.length > 0 && (
                <div className="reservations-list">
                  {reservations.map((reservation) => (
                    <ReservationListItem
                      key={reservation.reservationId ?? reservation.id}
                      reservation={reservation}
                      onEdit={handleEditReservation}
                      onDelete={handleDeleteReservation}
                    />
                  ))}
                </div>
              )}

              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.pageNumber}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  maxButtons={PAGINATION.MAX_BUTTONS}
                />
              )}
            </div>
          </div>
        </Card>
      </section>

      <ReservationFormModal
        isOpen={isCreateOpen}
        title={MESSAGES.RESERVATION_CREATE_TITLE}
        description={MESSAGES.RESERVATION_CREATE_SUBTITLE}
        titleId="reservation-create-title"
        formData={createForm.formData}
        fieldErrors={createErrors}
        onChange={handleCreateChange}
        onSubmit={handleCreateReservation}
        onClose={() => {
          setIsCreateOpen(false);
          createForm.resetForm();
          setCreateErrors({});
        }}
        vehicles={vehicles}
        statuses={statuses}
        headquarters={headquarters}
        headquartersError={headquartersError}
        headquartersLoading={headquartersLoading}
        alert={createForm.formAlert && {
          ...createForm.formAlert,
          onClose: () => createForm.setFormAlert(null)
        }}
        isSubmitting={isSubmitting}
        submitLabel={MESSAGES.ADD_RESERVATION}
      />
      <ReservationFormModal
        isOpen={isEditOpen}
        title={MESSAGES.RESERVATION_EDIT_TITLE}
        description={MESSAGES.RESERVATION_EDIT_DESCRIPTION}
        titleId="reservation-edit-title"
        formData={editForm.formData}
        fieldErrors={editErrors}
        onChange={handleEditChange}
        onSubmit={handleUpdateReservation}
        onClose={() => {
          setIsEditOpen(false);
          setEditReservationId(null);
          setIsEditLoading(false);
          editForm.resetForm();
          setEditErrors({});
        }}
        vehicles={vehicles}
        statuses={statuses}
        headquarters={headquarters}
        headquartersError={headquartersError}
        headquartersLoading={headquartersLoading}
        alert={editForm.formAlert && {
          ...editForm.formAlert,
          onClose: () => editForm.setFormAlert(null)
        }}
        isSubmitting={isSubmitting}
        isLoading={isEditLoading}
        submitLabel={MESSAGES.UPDATE_RESERVATION}
      />
    </PrivateLayout>
  );
}

export default ReservationsList;
