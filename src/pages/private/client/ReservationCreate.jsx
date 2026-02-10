import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import ReservationCreateHeader from '../../../components/reservations/create/ReservationCreateHeader';
import ReservationCreateForm from '../../../components/reservations/create/ReservationCreateForm';
import ReservationCreateSummary from '../../../components/reservations/create/ReservationCreateSummary';
import useClientReservationCreatePage from '../../../hooks/pages/client/useClientReservationCreatePage';

function ReservationCreate() {
  const { state, ui, actions } = useClientReservationCreatePage();

  return (
    <PrivateLayout>
      <section className="personal-space">
        <ReservationCreateHeader />

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
            formData={state.formData}
            headquarters={state.headquarters}
            vehicleSummary={state.vehicleSummary}
            isSubmitting={ui.isSubmitting}
            onSubmit={actions.handleSubmit}
          />
        </div>
      </section>
    </PrivateLayout>
  );
}

export default ReservationCreate;
