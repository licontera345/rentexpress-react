import Alert from '../../common/feedback/Alert';
import FormField from '../../common/forms/FormField';
import { FormModalFooter } from '../../common/forms/FormPrimitives';
import LoadingSpinner from '../../common/feedback/LoadingSpinner';
import { ModalHeader } from '../../common/layout/LayoutPrimitives';
import { MESSAGES } from '../../../constants';
import ReservationFormFields from './ReservationFormFields';
import { buildVehicleLabel } from '../../../utils/vehicle';
import { getReservationStatusMessageKey } from '../../../utils/reservation/reservationUtils';

// Componente ReservationFormModal que define la interfaz y organiza la lógica de esta vista.

const ReservationFormModal = ({
  isOpen,
  title,
  description,
  titleId,
  formData,
  fieldErrors,
  onChange,
  onSubmit,
  onClose,
  vehicles = [],
  statuses = [],
  headquarters = [],
  headquartersError,
  headquartersLoading,
  alert,
  isSubmitting,
  isLoading = false,
  submitLabel,
  clientEditMode = false
}) => {
  const isDisabled = isSubmitting || isLoading;
  const resolvedTitleId = titleId || 'reservation-form-title';

  return (
    <div
      className={`modal-backdrop ${isOpen ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={resolvedTitleId}
      onClick={onClose}
    >
      <div className="modal-dialog vehicle-create-modal" onClick={(event) => event.stopPropagation()}>
        <ModalHeader title={title} titleId={resolvedTitleId} onClose={onClose} />
        <div className="modal-body">
          <div className="vehicle-create-intro">
            <p className="vehicle-create-description">{description}</p>
            <p className="vehicle-create-required">
              {MESSAGES.REQUIRED_FIELDS_PREFIX} <span className="required">*</span> {MESSAGES.REQUIRED_FIELDS_SUFFIX}
            </p>
          </div>
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={alert.onClose}
            />
          )}
          {isLoading && <LoadingSpinner message={MESSAGES.LOADING} />}
          <form className="vehicle-create-form" onSubmit={onSubmit}>
            {!clientEditMode && (
              <section className="vehicle-create-section">
                <div className="vehicle-create-section-header">
                  <h3>{MESSAGES.RESERVATION_MANAGEMENT_SECTION}</h3>
                </div>
                <div className="vehicle-create-grid">
                  <FormField
                    label={MESSAGES.VEHICLE_ID}
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={onChange}
                    required
                    disabled={isDisabled}
                    error={fieldErrors.vehicleId}
                    as="select"
                  >
                    <option value="">{MESSAGES.SELECT_VEHICLE}</option>
                    {vehicles.map((vehicle) => {
                      const vehicleId = vehicle.vehicleId;
                      const label = buildVehicleLabel(vehicle, { includePlate: true, fallback: `${MESSAGES.VEHICLE_ID}: ${vehicleId}` });
                      return (
                        <option key={vehicleId} value={vehicleId}>
                          {label}
                        </option>
                      );
                    })}
                  </FormField>
                  <FormField
                    label={MESSAGES.CUSTOMER_ID}
                    name="userId"
                    type="number"
                    value={formData.userId}
                    onChange={onChange}
                    required
                    disabled={isDisabled}
                    error={fieldErrors.userId}
                    placeholder={MESSAGES.CUSTOMER_ID_PLACEHOLDER}
                  />
                  <FormField
                    label={MESSAGES.RESERVATION_STATUS_LABEL}
                    name="reservationStatusId"
                    value={formData.reservationStatusId}
                    onChange={onChange}
                    required
                    disabled={isDisabled}
                    error={fieldErrors.reservationStatusId}
                    as="select"
                  >
                    <option value="">{MESSAGES.SELECT_STATUS}</option>
                    {statuses.map((status) => (
                      <option
                        key={status.reservationStatusId}
                        value={status.reservationStatusId}
                      >
                        {(() => {
                          const key = getReservationStatusMessageKey(status.statusName);
                          return key ? MESSAGES[key] : status.statusName;
                        })()}
                      </option>
                    ))}
                  </FormField>
                </div>
              </section>
            )}

            <ReservationFormFields
              formData={formData}
              fieldErrors={fieldErrors}
              headquarters={headquarters}
              headquartersError={headquartersError}
              headquartersLoading={headquartersLoading}
              isSubmitting={isDisabled}
              onChange={onChange}
              clientEditMode={clientEditMode}
            />

            <FormModalFooter
              helperText={MESSAGES.RESERVATION_FORM_REVIEW}
              onClose={onClose}
              submitLabel={submitLabel}
              isDisabled={isDisabled}
              isSubmitting={isSubmitting}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationFormModal;
