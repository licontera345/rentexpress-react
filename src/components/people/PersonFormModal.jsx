import Alert from '../common/feedback/Alert';
import Button from '../common/actions/Button';
import FormField from '../common/forms/FormField';
import { MESSAGES } from '../../constants';

function PersonFormModal({
  isOpen,
  title,
  description,
  titleId,
  fields,
  formData,
  fieldErrors,
  onChange,
  onSubmit,
  onClose,
  alert,
  isSubmitting,
  isLoading = false,
  submitLabel
}) {
  if (!isOpen) return null;

  const isDisabled = isSubmitting || isLoading;

  return (
    <div className="vehicle-modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="vehicle-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="vehicle-modal-header">
          <div>
            <h3 id={titleId}>{title}</h3>
            {description && <p>{description}</p>}
          </div>
          <button type="button" className="close-modal-btn" onClick={onClose} disabled={isDisabled}>
            {MESSAGES.CLOSE}
          </button>
        </div>

        {alert && <Alert type={alert.type} message={alert.message} onClose={alert.onClose} />}

        <form className="vehicle-form-grid" onSubmit={onSubmit}>
          <div className="vehicle-form-section">
            <div className="vehicle-fields-grid">
              {fields.map((field) => (
                <FormField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  type={field.type || 'text'}
                  value={formData[field.name]}
                  onChange={onChange}
                  required={field.required}
                  disabled={isDisabled}
                  error={fieldErrors[field.name]}
                  as={field.as}
                  placeholder={field.placeholder}
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </FormField>
              ))}
            </div>
          </div>

          <div className="vehicle-create-footer">
            <div className="vehicle-create-actions">
              <Button type="button" variant="outlined" onClick={onClose} disabled={isDisabled}>
                {MESSAGES.CANCEL}
              </Button>
              <Button type="submit" variant="primary" loading={isSubmitting} disabled={isDisabled}>
                {submitLabel}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PersonFormModal;
