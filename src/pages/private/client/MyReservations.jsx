import { Link } from 'react-router-dom';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import { Card } from '../../../components/common/layout/LayoutPrimitives';
import ReservationListItem from '../../../components/reservations/list/ReservationListItem';
import ReservationFormModal from '../../../components/reservations/form/ReservationFormModal';
import { useClientMyReservationsPage } from '../../../hooks/client/useClientPages';
import { MESSAGES, ROUTES } from '../../../constants';

function MyReservations() {
  const { state, ui, actions, options } = useClientMyReservationsPage();
  const headquartersById = new Map((state.headquarters || []).map((hq) => [Number(hq.id), hq]));
  const statusById = new Map((state.statuses || []).map((s) => [Number(s.reservationStatusId), s]));

  return (
    <PrivateLayout>
      <section className="personal-space">
        <header className="personal-space-header">
          <div>
            <h1>{MESSAGES.MY_RESERVATIONS_TITLE}</h1>
            <p className="personal-space-subtitle">{MESSAGES.MY_RESERVATIONS_SUBTITLE}</p>
          </div>
          {options.hasReservations && (
            <div className="personal-space-meta">
              <span className="personal-space-meta-label">{MESSAGES.RESERVATIONS_COUNT}</span>
              <span className="personal-space-meta-value">{state.reservations.length}</span>
            </div>
          )}
        </header>

        {ui.isLoading && (
          <Card className="personal-space-card">
            <p>{MESSAGES.LOADING}</p>
          </Card>
        )}

        {!ui.isLoading && ui.error && (
          <Card className="personal-space-card">
            <div className="alert alert-error">
              <span>{ui.error}</span>
            </div>
          </Card>
        )}

        {ui.pageAlert && (
          <Card className="personal-space-card">
            <div className={`alert alert-${ui.pageAlert.type === 'success' ? 'success' : 'error'}`}>
              <span>{ui.pageAlert.message}</span>
              <button type="button" className="alert-close" onClick={() => actions.setPageAlert(null)} aria-label={MESSAGES.CLOSE}>
                ×
              </button>
            </div>
          </Card>
        )}

        {!ui.isLoading && !ui.error && !options.hasReservations && (
          <Card className="personal-space-card">
            <p>{MESSAGES.MY_RESERVATIONS_EMPTY}</p>
            <Link className="btn btn-primary btn-small personal-space-card-link" to={ROUTES.CATALOG}>
              {MESSAGES.NAV_CATALOG}
            </Link>
          </Card>
        )}

        {!ui.isLoading && !ui.error && options.hasReservations && (
          <div className="reservations-list">
            {state.reservations.map((reservation, index) => (
              <ReservationListItem
                key={reservation?.reservationId || reservation?.id || `reservation-${index}`}
                reservation={reservation}
                headquartersById={headquartersById}
                statusById={statusById}
                onEdit={options.isPendingReservation(reservation) ? actions.handleEditReservation : undefined}
                onDelete={options.isPendingReservation(reservation) ? actions.handleDeleteReservation : undefined}
                showPickupCode
              />
            ))}
          </div>
        )}

        <ReservationFormModal
          isOpen={ui.isEditOpen}
          title={MESSAGES.RESERVATION_EDIT_TITLE}
          description={MESSAGES.RESERVATION_EDIT_DESCRIPTION}
          titleId="reservation-client-edit-title"
          formData={state.editForm}
          fieldErrors={state.editErrors}
          onChange={actions.handleEditChange}
          onSubmit={actions.handleUpdateReservation}
          onClose={actions.closeEditModal}
          vehicles={state.vehicles}
          statuses={state.statuses}
          headquarters={state.headquarters}
          headquartersError={ui.headquartersError}
          headquartersLoading={ui.headquartersLoading}
          alert={state.editFormAlert ? {
            type: state.editFormAlert.type,
            message: state.editFormAlert.message,
            onClose: actions.clearEditFormAlert
          } : undefined}
          isSubmitting={ui.isSubmitting}
          isLoading={ui.isEditLoading}
          submitLabel={MESSAGES.UPDATE_RESERVATION}
          clientEditMode
        />
      </section>
    </PrivateLayout>
  );
}

export default MyReservations;
