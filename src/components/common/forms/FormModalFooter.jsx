import Button from '../actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';

/** Pie de modal reutilizable: texto de ayuda opcional + Cancelar + Enviar. */
function FormModalFooter({
  helperText,
  onClose,
  submitLabel,
  isDisabled,
  isSubmitting
}) {
  return (
    <div className="vehicle-create-footer">
      {helperText && <p className="form-helper">{helperText}</p>}
      <div className="vehicle-create-actions">
        <Button
          type="button"
          variant={BUTTON_VARIANTS.OUTLINED}
          onClick={onClose}
          disabled={isDisabled}
        >
          {MESSAGES.CANCEL}
        </Button>
        <Button
          type="submit"
          variant={BUTTON_VARIANTS.PRIMARY}
          loading={isSubmitting}
          disabled={isDisabled}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}

export default FormModalFooter;
