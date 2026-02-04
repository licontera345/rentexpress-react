import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import ReservationCreateHeader from '../../../components/reservations/create/ReservationCreateHeader';
import ReservationCreateForm from '../../../components/reservations/create/ReservationCreateForm';
import ReservationCreateSummary from '../../../components/reservations/create/ReservationCreateSummary';
import useReservationCreateForm from '../../../hooks/useReservationCreateForm';

// Componente Reservation Create que encapsula la interfaz y la lógica principal de esta sección.

function ReservationCreate() {
  const {
    formData,
    fieldErrors,
    statusMessage,
    errorMessage,
    isSubmitting,
    headquarters,
    headquartersLoading,
    headquartersError,
    vehicleSummary,
    handleChange,
    handleSubmit
  } = useReservationCreateForm();

  return (
    <PrivateLayout>
      <section className="personal-space">
        <ReservationCreateHeader />

        <div className="reservation-create-layout">
          <ReservationCreateForm
            formData={formData}
            fieldErrors={fieldErrors}
            statusMessage={statusMessage}
            errorMessage={errorMessage}
            isSubmitting={isSubmitting}
            headquarters={headquarters}
            headquartersLoading={headquartersLoading}
            headquartersError={headquartersError}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />

          <ReservationCreateSummary
            formData={formData}
            headquarters={headquarters}
            vehicleSummary={vehicleSummary}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>
      </section>
    </PrivateLayout>
  );
}

export default ReservationCreate;
