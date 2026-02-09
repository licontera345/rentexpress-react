import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import Card from '../../../components/common/layout/Card';
import ReservationFormModal from '../../../components/reservations/form/ReservationFormModal';
import ReservationsFiltersPanel from '../../../components/reservations/list/ReservationsFiltersPanel';
import ReservationsListHeader from '../../../components/reservations/list/ReservationsListHeader';
import ReservationsResultsPanel from '../../../components/reservations/list/ReservationsResultsPanel';
import { MESSAGES } from '../../../constants';
import useEmployeeReservationsPage from '../../../hooks/useEmployeeReservationsPage';

// Página del empleado para listar, filtrar y gestionar reservas. Orquesta el flujo de control del módulo.
function ReservationsList() {
  const {
    headquarters,
    headquartersLoading,
    headquartersError,
    reservations,
    loading,
    error,
    filters,
    pagination,
    filterFields,
    handleFilterChange,
    applyFilters,
    resetFilters,
    handlePageChange,
    vehicles,
    statuses,
    createForm,
    editForm,
    pageAlert,
    setPageAlert,
    isSubmitting,
    isCreateOpen,
    setIsCreateOpen,
    isEditOpen,
    isEditLoading,
    createErrors,
    editErrors,
    handleCreateChange,
    handleEditChange,
    handleCreateReservation,
    handleEditReservation,
    handleUpdateReservation,
    handleDeleteReservation,
    closeCreateModal,
    closeEditModal
  } = useEmployeeReservationsPage();

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
        onClose={closeCreateModal}
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
        onClose={closeEditModal}
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
