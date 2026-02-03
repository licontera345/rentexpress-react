import Button from '../actions/Button';
import { MESSAGES } from '../../../constants';

function VehicleFormFooter({ onClose, submitLabel, isDisabled, isSubmitting }) {
  return (
    <div className="vehicle-create-footer">
      <p className="form-helper">{MESSAGES.VEHICLE_CREATE_REVIEW}</p>
      <div className="vehicle-create-actions">
        <Button
          type="button"
          variant="outlined"
          onClick={onClose}
          disabled={isDisabled}
        >
          {MESSAGES.CANCEL}
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isDisabled}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}

export default VehicleFormFooter;
