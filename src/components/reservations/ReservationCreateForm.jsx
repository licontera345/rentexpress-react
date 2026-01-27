import Card from '../common/layout/Card';
import FormField from '../common/forms/FormField';
import Button from '../common/actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../constants';

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
    <form className="profile-form reservation-form" onSubmit={onSubmit}>
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
      />

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
      />

      {formData.dailyPrice && (
        <FormField
          label={MESSAGES.DAILY_PRICE}
          type="number"
          name="dailyPrice"
          value={formData.dailyPrice}
          onChange={onChange}
          disabled
        />
      )}

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

      <div className="profile-form-actions">
        <Button
          type="submit"
          variant={BUTTON_VARIANTS.PRIMARY}
          size="large"
          disabled={isSubmitting}
        >
          {isSubmitting ? MESSAGES.STARTING : MESSAGES.RESERVE}
        </Button>
      </div>
    </form>
  </Card>
);

export default ReservationCreateForm;
