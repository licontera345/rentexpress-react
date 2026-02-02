import Card from '../common/layout/Card';
import { MESSAGES } from '../../constants';
import ReservationFormFields from './ReservationFormFields';

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
  <Card className="personal-space-card personal-space-card--profile reservation-card">
    <div className="reservation-card-header">
      <div className="reservation-card-title">
        <h2>{MESSAGES.RESERVATION_DETAILS_TITLE}</h2>
        <p>{MESSAGES.RESERVATION_DETAILS_DESC}</p>
      </div>
      <div className="personal-space-meta">
        <span className="personal-space-meta-label">{MESSAGES.REQUIRED_FIELDS_PREFIX}</span>
        <span className="personal-space-meta-value" style={{ color: 'red' }}>*</span>
        <span className="personal-space-meta-label">{MESSAGES.REQUIRED_FIELDS_SUFFIX}</span>
      </div>
    </div>
    <form className="profile-form reservation-form" onSubmit={onSubmit}>
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
  </Card>
);

export default ReservationCreateForm;
