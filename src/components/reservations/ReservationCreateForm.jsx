import Card from '../common/layout/Card';
import FormField from '../common/forms/FormField';
import { MESSAGES } from '../../constants';

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
        <span className="personal-space-meta-value">*</span>
        <span className="personal-space-meta-label">{MESSAGES.REQUIRED_FIELDS_SUFFIX}</span>
      </div>
    </div>
    <form className="profile-form reservation-form" onSubmit={onSubmit}>
      <div className="reservation-form-section">
        <h3>{MESSAGES.RESERVATION_PICKUP_SECTION}</h3>
        <div className="reservation-form-grid">
          <FormField
            label={MESSAGES.PICKUP_LOCATION}
            name="pickupHeadquartersId"
            value={formData.pickupHeadquartersId}
            onChange={onChange}
            required
            disabled={isSubmitting || headquartersLoading}
            error={fieldErrors.pickupHeadquartersId}
            as="select"
            helper={headquartersError || null}
          >
            <option value="">{MESSAGES.SELECT_LOCATION}</option>
            {headquarters.map((hq) => (
              <option key={hq.headquartersId || hq.id} value={hq.headquartersId || hq.id}>
                {hq.headquartersName || hq.name}
              </option>
            ))}
          </FormField>

          <FormField
            label={MESSAGES.PICKUP_DATE}
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={onChange}
            required
            disabled={isSubmitting}
            error={fieldErrors.startDate}
          />

          <FormField
            label={MESSAGES.PICKUP_TIME}
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={onChange}
            required
            disabled={isSubmitting}
            error={fieldErrors.startTime}
            className="reservation-form-field--compact"
          />
        </div>
      </div>

      <div className="reservation-form-section">
        <h3>{MESSAGES.RESERVATION_RETURN_SECTION}</h3>
        <div className="reservation-form-grid">
          <FormField
            label={MESSAGES.RETURN_LOCATION}
            name="returnHeadquartersId"
            value={formData.returnHeadquartersId}
            onChange={onChange}
            required
            disabled={isSubmitting || headquartersLoading}
            error={fieldErrors.returnHeadquartersId}
            as="select"
            helper={headquartersError || null}
          >
            <option value="">{MESSAGES.SELECT_LOCATION}</option>
            {headquarters.map((hq) => (
              <option key={hq.headquartersId || hq.id} value={hq.headquartersId || hq.id}>
                {hq.headquartersName || hq.name}
              </option>
            ))}
          </FormField>

          <FormField
            label={MESSAGES.RETURN_DATE}
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={onChange}
            required
            disabled={isSubmitting}
            error={fieldErrors.endDate}
          />

          <FormField
            label={MESSAGES.RETURN_TIME}
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={onChange}
            required
            disabled={isSubmitting}
            error={fieldErrors.endTime}
            className="reservation-form-field--compact"
          />
        </div>
        <p className="reservation-form-hint">{MESSAGES.RESERVATION_DATE_RANGE_INVALID}</p>
      </div>

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
