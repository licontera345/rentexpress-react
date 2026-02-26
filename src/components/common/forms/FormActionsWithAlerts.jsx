import Button from '../actions/Button';
import { BUTTON_SIZES, BUTTON_VARIANTS, MESSAGES } from '../../../constants';

function FormActionsWithAlerts({
  errorMessage,
  statusMessage,
  isSaving,
  isSubmitDisabled = false,
  onCancel,
  cancelLabel = MESSAGES.CANCEL,
  submitLabel
}) {
  const resolvedSubmitLabel = submitLabel ?? (isSaving ? MESSAGES.STARTING : MESSAGES.SAVE_CHANGES);

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
          {cancelLabel}
        </Button>
        <Button
          type="submit"
          variant={BUTTON_VARIANTS.PRIMARY}
          size={BUTTON_SIZES.LARGE}
          disabled={isSubmitDisabled}
        >
          {resolvedSubmitLabel}
        </Button>
      </div>
    </>
  );
}

export default FormActionsWithAlerts;
