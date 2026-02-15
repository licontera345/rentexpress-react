import { buildAriaDescribedBy } from '../../../utils/uiUtils';

// Componente FormField que define la interfaz y organiza la lógica de esta vista.
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
  readOnly = false,
  helper = null,
  prefix = null,
  suffix = null,
  as = 'input',
  children,
  rows,
  step,
  className = ''
}) {
  const hasError = Boolean(error);
  const inputClassName = `form-input ${hasError ? 'form-input--error' : ''}`;
  
  const errorId = error ? `${name}-error` : undefined;
  const helperId = helper ? `${name}-helper` : undefined;
  const describedBy = buildAriaDescribedBy(errorId, helperId);

  const isCheckbox = type === 'checkbox';
  const commonProps = {
    id: name,
    name,
    onChange,
    required,
    disabled,
    readOnly,
    className: inputClassName,
    'aria-invalid': hasError,
    'aria-describedby': describedBy,
    ...(isCheckbox ? { checked: Boolean(value), value: 'on' } : { value: value ?? '' })
  };

  const renderInput = () => {
    if (as === 'textarea') {
      return (
        <textarea
          {...commonProps}
          placeholder={placeholder}
          rows={rows}
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
        {...commonProps}
        type={type}
        placeholder={placeholder}
        step={step}
      />
    );
  };

  const wrapWithAffix = (field) => {
    if (!prefix && !suffix) return field;

    const wrapperClassName = `form-input-wrapper ${hasError ? 'form-input-wrapper--error' : ''}`.trim();

    return (
      <div className={wrapperClassName}>
        {prefix && <span className="form-input-affix form-input-prefix">{prefix}</span>}
        {field}
        {suffix && <span className="form-input-affix form-input-suffix">{suffix}</span>}
      </div>
    );
  };

  return (
    <div className={`form-field ${className}`.trim()}>
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>

      {wrapWithAffix(renderInput())}

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
