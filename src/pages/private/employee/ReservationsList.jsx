import { useCallback, useMemo, useState } from 'react';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import Card from '../../../components/common/layout/Card';
import ReservationFormModal from '../../../components/reservations/form/ReservationFormModal';
import ReservationsFiltersPanel from '../../../components/reservations/list/ReservationsFiltersPanel';
import ReservationsListHeader from '../../../components/reservations/list/ReservationsListHeader';
import ReservationsResultsPanel from '../../../components/reservations/list/ReservationsResultsPanel';
import ReservationService from '../../../api/services/ReservationService';
import { useAuth } from '../../../hooks/useAuth';
import useEmployeeReservationsList from '../../../hooks/useEmployeeReservationsList';
import useHeadquarters from '../../../hooks/useHeadquarters';
import useReservationMetadata from '../../../hooks/useReservationMetadata';
import useReservationForm from '../../../hooks/useReservationForm';
import { ALERT_VARIANTS, MESSAGES } from '../../../constants';
import { buildReservationFilterFields } from '../../../config/reservationFilterFields';
import {
  buildReservationPayload,
  validateReservationForm
} from '../../../config/reservationFormUtils';

// Página del empleado para listar, filtrar y gestionar reservas.
function ReservationsList() {
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
  const { vehicles, statuses } = useReservationMetadata();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editReservationId, setEditReservationId] = useState(null);
  const [createErrors, setCreateErrors] = useState({});
  const [editErrors, setEditErrors] = useState({});

  // Obtiene el ID de empleado desde distintas estructuras de usuario.
  const employeeId = useMemo(() => (
    user?.employeeId || user?.employee?.employeeId || user?.employee?.id || ''
  ), [user]);

  // Construye campos de filtros para la lista de reservas.
  const filterFields = useMemo(() => (
    buildReservationFilterFields({
      statuses,
      headquarters
    })
  ), [headquarters, statuses]);

  // Actualiza formulario de creación y limpia errores del campo.
  const handleCreateChange = useCallback((event) => {
    createForm.handleFormChange(event);
    const { name } = event.target;
    setCreateErrors((prev) => {
      if (!prev[name]) return prev;
      return Object.assign({}, prev, { [name]: null });
    });
    createForm.setFormAlert(null);
  }, [createForm]);

  // Actualiza formulario de edición y limpia errores del campo.
  const handleEditChange = useCallback((event) => {
    editForm.handleFormChange(event);
    const { name } = event.target;
    setEditErrors((prev) => {
      if (!prev[name]) return prev;
      return Object.assign({}, prev, { [name]: null });
    });
    editForm.setFormAlert(null);
  }, [editForm]);

  // Envía una nueva reserva desde el modal de creación.
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
      // Construye el payload y recarga la lista al finalizar.
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

  // Carga datos de una reserva para editarla en el modal.
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

  // Envía la actualización de la reserva editada.
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
      // Actualiza la reserva y refresca los resultados.
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

  // Elimina una reserva con confirmación previa.
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
      {/* Cabecera con acción para crear nuevas reservas */}
      <section className="personal-space">
        <ReservationsListHeader onCreate={() => setIsCreateOpen(true)} />

        <Card className="personal-space-card">
          <div className="vehicle-list-layout">
            {/* Panel de filtros para la búsqueda */}
            <ReservationsFiltersPanel
              fields={filterFields}
              values={filters}
              onChange={handleFilterChange}
              onApply={applyFilters}
              onReset={resetFilters}
              isLoading={loading}
            />

            {/* Resultados, paginación y acciones */}
            <ReservationsResultsPanel
              pageAlert={pageAlert}
              onCloseAlert={() => setPageAlert(null)}
              loading={loading}
              error={error}
              reservations={reservations}
              pagination={pagination}
              onEdit={handleEditReservation}
              onDelete={handleDeleteReservation}
              onPageChange={handlePageChange}
            />
          </div>
        </Card>
      </section>

      {/* Modal de creación de reserva */}
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
      {/* Modal de edición de reserva */}
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
