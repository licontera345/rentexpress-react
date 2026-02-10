import Button from '../../common/actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';

function ProfileFormActions({ errorMessage, statusMessage, isSaving, isSubmitDisabled = false }) {
  return (
    <>
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
          disabled={isSubmitDisabled}
        >
          {isSaving ? MESSAGES.STARTING : MESSAGES.SAVE_CHANGES}
        </Button>
      </div>
    </>
  );
}

export default ProfileFormActions;
