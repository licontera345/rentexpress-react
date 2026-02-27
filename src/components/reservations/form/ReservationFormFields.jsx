import FormField from '../../common/forms/FormField';
import { FiTruck, FiFlag, FiInfo } from 'react-icons/fi';
import { MESSAGES } from '../../../constants';
import { getHeadquartersOptionLabel } from '../../../constants';

const ReservationFormFields = ({
  formData,
  fieldErrors = {},
  headquarters = [],
  headquartersError,
  headquartersLoading,
  isSubmitting,
  onChange,
  clientEditMode = false
}) => (
  <>
    <div className="reservation-form-section reservation-form-section--pickup">
      <div className="reservation-form-section-head">
        <span className="reservation-form-section-icon reservation-form-section-icon--pickup" aria-hidden="true">
          <FiTruck size={22} />
        </span>
        <h3>{MESSAGES.RESERVATION_PICKUP_SECTION}</h3>
      </div>
      <div className="reservation-form-grid">
        {!clientEditMode && (
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
            {headquarters.map((hq) => {
              const headquartersId = hq.id;
              return (
                <option key={headquartersId} value={headquartersId}>
                  {getHeadquartersOptionLabel(hq)}
                </option>
              );
            })}
          </FormField>
        )}

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

    <div className="reservation-form-section reservation-form-section--return">
      <div className="reservation-form-section-head">
        <span className="reservation-form-section-icon reservation-form-section-icon--return" aria-hidden="true">
          <FiFlag size={22} />
        </span>
        <h3>{MESSAGES.RESERVATION_RETURN_SECTION}</h3>
      </div>
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
          {headquarters.map((hq) => {
            const headquartersId = hq.id;
            return (
              <option key={headquartersId} value={headquartersId}>
                {getHeadquartersOptionLabel(hq)}
              </option>
            );
          })}
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
      <p className="reservation-form-hint">
        <FiInfo size={16} className="reservation-form-hint-icon" aria-hidden="true" />
        {MESSAGES.RESERVATION_DATE_RANGE_INVALID}
      </p>
    </div>
  </>
);

export default ReservationFormFields;
