import { buildAriaDescribedBy } from '../../utils/ui.js';

/**
 * Campo de formulario reutilizable: label, input/select/textarea, error, helper.
 * onChange recibe el evento; para select nativo se puede normalizar a { target: { name, value } }.
 */
export function FormField({
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
  as = 'input',
  children,
  rows,
  options = [],
  className = '',
  autoComplete,
}) {
  const hasError = Boolean(error);
  const inputClassName = `form-input ${hasError ? 'form-input--error' : ''}`;
  const errorId = error ? `${name}-error` : undefined;
  const helperId = helper ? `${name}-helper` : undefined;
  const describedBy = buildAriaDescribedBy(errorId, helperId);

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
    ...(autoComplete != null && { autoComplete }),
  };

  const renderControl = () => {
    if (as === 'textarea') {
      return (
        <textarea
          {...commonProps}
          placeholder={placeholder}
          rows={rows}
          value={value ?? ''}
        />
      );
    }
    if (as === 'select') {
      return (
        <select
          {...commonProps}
          value={value ?? ''}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }
    const isCheckbox = type === 'checkbox';
    return (
      <input
        {...commonProps}
        type={type}
        placeholder={placeholder}
        value={isCheckbox ? undefined : (value ?? '')}
        checked={isCheckbox ? Boolean(value) : undefined}
      />
    );
  };

  return (
    <div className={`form-field ${className}`.trim()}>
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required" aria-hidden="true">*</span>}
      </label>
      {renderControl()}
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
