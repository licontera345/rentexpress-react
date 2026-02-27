import Button from '../actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';

export function FormSection({ title, children }) {
  return (
    <section className="vehicle-create-section">
      <div className="vehicle-create-section-header">
        <h3>{title}</h3>
      </div>
      <div className="vehicle-create-grid">
        {children}
      </div>
    </section>
  );
}

export function FormModalFooter({
  helperText,
  onClose,
  submitLabel,
  isDisabled,
  isSubmitting,
  readOnly = false,
}) {
  return (
    <div className="vehicle-create-footer">
      {helperText && !readOnly && <p className="form-helper">{helperText}</p>}
      <div className="vehicle-create-actions">
        {readOnly ? (
          <Button
            type="button"
            variant={BUTTON_VARIANTS.PRIMARY}
            onClick={onClose}
          >
            {MESSAGES.CLOSE}
          </Button>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
