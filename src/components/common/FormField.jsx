import './FormField.css';

function FormField({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error = null,
  disabled = false,
  helper = null,
  as = 'input',
  children,
  rows,
  step
}) {
  const commonProps = {
    id: name,
    name,
    value,
    onChange,
    required,
    disabled,
    className: `form-input ${error ? 'form-input--error' : ''}`
  };

  const renderField = () => {
    if (as === 'textarea') {
      return (
        <textarea
          placeholder={placeholder}
          rows={rows}
          {...commonProps}
        />
      );
    }

    if (as === 'select') {
      return (
        <select {...commonProps}>
          {children}
        </select>
      );
    }

    return (
      <input
        type={type}
        placeholder={placeholder}
        step={step}
        {...commonProps}
      />
    );
  };
  return (
    <div className="form-field">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      {renderField()}
      {error && <p className="form-error">{error}</p>}
      {helper && <p className="form-helper">{helper}</p>}
    </div>
  );
}

export default FormField;
