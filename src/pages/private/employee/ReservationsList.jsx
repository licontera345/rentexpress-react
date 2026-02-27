import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import { Card } from '../../../components/common/layout/LayoutPrimitives';
import ListResultsPanel from '../../../components/common/layout/ListResultsPanel';
import SectionHeader from '../../../components/common/layout/SectionHeader';
import ReservationFormModal from '../../../components/reservations/form/ReservationFormModal';
import FilterPanel from '../../../components/common/filters/FilterPanel';
import ReservationListItem from '../../../components/reservations/list/ReservationListItem';
import { MESSAGES } from '../../../constants';
import useEmployeeReservationsPage from '../../../hooks/employee/useEmployeeReservationsPage';

// Página del empleado para listar, filtrar y gestionar reservas. Orquesta el flujo de control del módulo.
function ReservationsList() {
  const { state, ui, actions, options } = useEmployeeReservationsPage();

  return (
    <PrivateLayout>
      {/* Cabecera con acción para crear nuevas reservas */}
      <section className="personal-space">
        <SectionHeader
          title={MESSAGES.RESERVATIONS_LIST_TITLE}
          subtitle={MESSAGES.RESERVATIONS_LIST_SUBTITLE}
        >
          <button
            type="button"
            className="vehicle-create-trigger"
            onClick={actions.handleOpenCreateModal}
            aria-label={MESSAGES.ADD_RESERVATION}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M11 5a1 1 0 0 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5z" />
            </svg>
          </button>
        </SectionHeader>

        <Card className="personal-space-card">
          <div className="vehicle-list-layout">
            {/* Panel de filtros para la búsqueda */}
            <aside className="vehicle-filter-panel">
              <FilterPanel
                fields={options.filterFields}
                values={state.filters}
                onChange={actions.handleFilterChange}
                onApply={actions.applyFilters}
                onReset={actions.resetFilters}
                title={MESSAGES.FILTER_BY}
                isLoading={ui.isLoading}
                className="vehicle-filters-panel"
              />
            </aside>

            <ListResultsPanel
              pageAlert={ui.pageAlert}
              onCloseAlert={() => actions.setPageAlert(null)}
              loading={ui.isLoading}
              error={ui.error}
              emptyDescription={MESSAGES.NO_RESERVATIONS_REGISTERED}
              hasItems={state.reservations.length > 0}
              pagination={options.pagination}
              onPageChange={actions.handlePageChange}
            >
              {state.reservations.map((reservation) => (
                <ReservationListItem
                  key={reservation.reservationId}
                  reservation={reservation}
                  onEdit={actions.handleEditReservation}
                  onDelete={actions.handleDeleteReservation}
                  onGenerateCode={reservation.allowedActions?.includes('generatePickupCode') ? actions.handleGeneratePickupCode : undefined}
                  headquartersById={options.headquartersById}
                  statusById={options.statusById}
                />
              ))}
            </ListResultsPanel>
          </div>
        </Card>
      </section>

      {/* Modal de creación de reserva */}
      <ReservationFormModal
        isOpen={ui.isCreateOpen}
        title={MESSAGES.RESERVATION_CREATE_TITLE}
        description={MESSAGES.RESERVATION_CREATE_SUBTITLE}
        titleId="reservation-create-title"
        formData={state.createForm.formData}
        fieldErrors={state.createErrors}
        onChange={actions.handleCreateChange}
        onSubmit={actions.handleCreateReservation}
        onClose={actions.closeCreateModal}
        vehicles={state.vehicles}
        statuses={state.statuses}
        headquarters={state.headquarters}
        headquartersError={ui.headquartersError}
        headquartersLoading={ui.headquartersLoading}
        alert={state.createForm.formAlert && {
          ...state.createForm.formAlert,
          onClose: () => state.createForm.setFormAlert(null)
        }}
        isSubmitting={ui.isSubmitting}
        submitLabel={MESSAGES.ADD_RESERVATION}
      />
      {/* Modal de edición de reserva */}
      <ReservationFormModal
        isOpen={ui.isEditOpen}
        title={MESSAGES.RESERVATION_EDIT_TITLE}
        description={MESSAGES.RESERVATION_EDIT_DESCRIPTION}
        titleId="reservation-edit-title"
        formData={state.editForm.formData}
        fieldErrors={state.editErrors}
        onChange={actions.handleEditChange}
        onSubmit={actions.handleUpdateReservation}
        onClose={actions.closeEditModal}
        vehicles={state.vehicles}
        statuses={state.statuses}
        headquarters={state.headquarters}
        headquartersError={ui.headquartersError}
        headquartersLoading={ui.headquartersLoading}
        alert={state.editForm.formAlert && {
          ...state.editForm.formAlert,
          onClose: () => state.editForm.setFormAlert(null)
        }}
        isSubmitting={ui.isSubmitting}
        isLoading={ui.isEditLoading}
        submitLabel={MESSAGES.UPDATE_RESERVATION}
      />
    </PrivateLayout>
  );
}

export default ReservationsList;
