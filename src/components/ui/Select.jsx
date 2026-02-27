/**
 * Select nativo. options = [{ value, label }]. onChange recibe el evento (target.name, target.value).
 */
export function Select({
  name,
  id = name,
  value,
  onChange,
  options = [],
  placeholder,
  disabled = false,
  required = false,
  className = '',
  'aria-label': ariaLabel,
}) {
  return (
    <select
      id={id}
      name={name}
      value={value ?? ''}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={`form-input form-select ${className}`.trim()}
      aria-label={ariaLabel}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default Select;
