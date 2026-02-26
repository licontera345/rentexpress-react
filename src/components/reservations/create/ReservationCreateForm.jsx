import { MESSAGES } from '../../../constants';
import ReservationFormFields from '../form/ReservationFormFields';

const ReservationCreateForm = ({
  formData,
  fieldErrors,
  headquarters,
  headquartersError,
  headquartersLoading,
  errorMessage,
  statusMessage,
  isSubmitting,
  onChange,
  onSubmit
}) => (
  <div className="reservation-create-form-col">
    <p className="reservation-create-required-note">
      <span className="reservation-create-required-bullet" aria-hidden="true">•</span>
      {MESSAGES.REQUIRED_FIELDS_PREFIX} <span className="required">*</span> {MESSAGES.REQUIRED_FIELDS_SUFFIX}
    </p>
    <form className="reservation-form reservation-form--create" onSubmit={onSubmit}>
      <ReservationFormFields
        formData={formData}
        fieldErrors={fieldErrors}
        headquarters={headquarters}
        headquartersError={headquartersError}
        headquartersLoading={headquartersLoading}
        isSubmitting={isSubmitting}
        onChange={onChange}
      />

      {errorMessage && (
        <p className="profile-alert profile-alert--error" role="alert">
          {errorMessage}
        </p>
      )}

      {statusMessage && (
        <p className="profile-alert profile-alert--success" role="status">
          {statusMessage}
        </p>
      )}
    </form>
  </div>
);

export default ReservationCreateForm;
