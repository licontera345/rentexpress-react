
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
  prefix = null,
  suffix = null,
  as = 'input',
  children,
  rows,
  step
}) {
  const inputClassName = `form-input ${error ? 'form-input--error' : ''}`;
  const errorId = error ? `${name}-error` : undefined;
  const helperId = helper ? `${name}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

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
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
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
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
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
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
      />
    );
  };

  const field = renderField();
  const fieldWithAffix = prefix || suffix ? (
    <div className={`form-input-wrapper ${error ? 'form-input-wrapper--error' : ''}`.trim()}>
      {prefix && <span className="form-input-affix form-input-prefix">{prefix}</span>}
      {field}
      {suffix && <span className="form-input-affix form-input-suffix">{suffix}</span>}
    </div>
  ) : field;

  return (
    <div className="form-field">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>
      {fieldWithAffix}
      {error && (
        <p className="form-error" id={errorId} role="alert">
          {error}
        </p>
      )}
      {helper && (
        <p className="form-helper" id={helperId}>
          {helper}
        </p>
      )}
    </div>
  );
}

export default FormField;
