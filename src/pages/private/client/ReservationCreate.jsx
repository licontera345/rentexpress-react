import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import ReservationCreateHeader from '../../../components/reservations/ReservationCreateHeader';
import ReservationCreateForm from '../../../components/reservations/ReservationCreateForm';
import useReservationCreateForm from '../../../hooks/useReservationCreateForm';

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
    isVehicleLocked,
    handleChange,
    handleSubmit
  } = useReservationCreateForm();

  return (
    <PrivateLayout>
      <section className="personal-space">
        <ReservationCreateHeader />

        <ReservationCreateForm
          formData={formData}
          fieldErrors={fieldErrors}
          statusMessage={statusMessage}
          errorMessage={errorMessage}
          isSubmitting={isSubmitting}
          headquarters={headquarters}
          headquartersLoading={headquartersLoading}
          headquartersError={headquartersError}
          isVehicleLocked={isVehicleLocked}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </section>
    </PrivateLayout>
  );
}

export default ReservationCreate;
