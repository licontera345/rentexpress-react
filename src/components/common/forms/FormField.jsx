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
  const inputClassName = `form-input ${error ? 'form-input--error' : ''}`;

  const renderField = () => {
    if (as === 'textarea') {
      return (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={inputClassName}
          placeholder={placeholder}
          rows={rows}
        />
      );
    }

    if (as === 'select') {
      return (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={inputClassName}
        >
          {children}
        </select>
      );
    }

    return (
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={inputClassName}
        placeholder={placeholder}
        step={step}
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
