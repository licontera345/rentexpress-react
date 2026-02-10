import Button from '../../common/actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';

function ProfileFormActions({
  errorMessage,
  statusMessage,
  isSaving,
  isSubmitDisabled = false,
  onCancel
}) {
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
          type="button"
          variant={BUTTON_VARIANTS.OUTLINED}
          onClick={onCancel}
          disabled={isSaving}
        >
          {MESSAGES.CANCEL}
        </Button>

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
