import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import ReservationCreateForm from '../../../components/reservations/create/ReservationCreateForm';
import ReservationCreateSummary from '../../../components/reservations/create/ReservationCreateSummary';
import { useClientReservationCreatePage } from '../../../hooks/client/useClientPages';
import { MESSAGES } from '../../../constants';

function ReservationCreate() {
  const { state, ui, actions } = useClientReservationCreatePage();

  return (
    <PrivateLayout>
      <section className="personal-space reservation-create-page">
        <header className="reservation-create-header">
          <div>
            <h1 className="reservation-create-title">{MESSAGES.RESERVATION_CREATE_TITLE}</h1>
            <p className="reservation-create-subtitle">{MESSAGES.RESERVATION_CREATE_SUBTITLE}</p>
          </div>
        </header>

        <div className="reservation-create-layout">
          <ReservationCreateForm
            formData={state.formData}
            fieldErrors={state.fieldErrors}
            statusMessage={ui.statusMessage}
            errorMessage={ui.errorMessage}
            isSubmitting={ui.isSubmitting}
            headquarters={state.headquarters}
            headquartersLoading={ui.headquartersLoading}
            headquartersError={ui.headquartersError}
            onChange={actions.handleChange}
            onSubmit={actions.handleSubmit}
          />

          <ReservationCreateSummary
            summaryView={state.summaryView}
            vehicleSearchTerm={state.vehicleSearchTerm}
            vehicleOptions={state.vehicleOptions}
            pickupLocationSelected={state.pickupLocationSelected}
            isSubmitting={ui.isSubmitting}
            vehicleSearchLoading={ui.vehicleSearchLoading}
            vehicleSearchError={ui.vehicleSearchError}
            onVehicleSearchTermChange={actions.handleVehicleSearchTermChange}
            onVehicleSelect={actions.handleVehicleSelect}
            onSubmit={actions.handleSubmit}
          />
        </div>
      </section>
    </PrivateLayout>
  );
}

export default ReservationCreate;
