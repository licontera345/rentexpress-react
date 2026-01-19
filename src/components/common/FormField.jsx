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
  ...props 
}) {
  return (
    <div className="form-field">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      <input 
        id={name}
        type={type} 
        name={name} 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`form-input ${error ? 'form-input--error' : ''}`}
        {...props}
      />
      {error && <p className="form-error">{error}</p>}
      {helper && <p className="form-helper">{helper}</p>}
    </div>
  );
}

export default FormField;