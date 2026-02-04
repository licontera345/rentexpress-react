import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import ReservationCreateHeader from '../../../components/reservations/create/ReservationCreateHeader';
import ReservationCreateForm from '../../../components/reservations/create/ReservationCreateForm';
import ReservationCreateSummary from '../../../components/reservations/create/ReservationCreateSummary';
import useReservationCreateForm from '../../../hooks/useReservationCreateForm';

// Página para crear una nueva reserva desde el área privada.
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
      {/* Layout principal de creación de reserva */}
      <section className="personal-space">
        <ReservationCreateHeader />

        {/* Formulario y resumen en columnas */}
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

          {/* Resumen con el detalle del vehículo y totales */}
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
