import { useId } from 'react';
import { MESSAGES } from '../../../constants';
import CustomSelect from '../forms/CustomSelect';

// Panel de filtros reutilizable para búsquedas en distintas vistas.
function FilterPanel({
  fields,
  values,
  onChange,
  onApply,
  onReset,
  title = MESSAGES.FILTER_BY,
  className = '',
  isLoading = false
}) {
  const idPrefix = useId();

  const getFieldId = (fieldName) => `${idPrefix}-${fieldName}`;
  const getDatalistId = (field) => (
    field.datalist?.length ? `${getFieldId(field.name)}-list` : undefined
  );

  const renderRangeField = (field) => {
    const inputId = getFieldId(field.name);
    const rawValue = values[field.name];
    const hasValue = rawValue !== undefined && rawValue !== '';
    const fallbackValue = field.fallbackValue || field.min || 0;
    const rangeValue = hasValue ? rawValue : fallbackValue;
    const displayValue = hasValue ? rawValue : field.placeholder;

    return (
      <div className="form-field range-field" key={field.name}>
        <label className="form-label" htmlFor={inputId}>
          {field.label}
        </label>
        <div className="range-input-row">
          <input
            id={inputId}
            name={field.name}
            type="range"
            value={rangeValue}
            onChange={onChange}
            className="form-range"
            min={field.min}
            max={field.max}
            step={field.step}
            disabled={isLoading || field.disabled}
          />
          <output className="range-input-value" htmlFor={inputId}>
            {displayValue}
          </output>
        </div>
      </div>
    );
  };

  const renderSelectField = (field) => {
    const inputId = getFieldId(field.name);

    return (
      <div className="form-field" key={field.name}>
        <label className="form-label" htmlFor={inputId}>
          {field.label}
        </label>
        <CustomSelect
          id={inputId}
          name={field.name}
          value={values[field.name] || ''}
          onChange={onChange}
          options={[
            { value: '', label: field.placeholder },
            ...(field.options?.map((option) => ({ value: option.value, label: option.label })) ?? []),
          ]}
          placeholder={field.placeholder}
          disabled={isLoading || field.disabled}
          variant="form"
          submitOnEnterWhenClosed
        />
      </div>
    );
  };

  const renderTextField = (field) => {
    const inputId = getFieldId(field.name);
    const datalistId = getDatalistId(field);

    return (
      <div className="form-field" key={field.name}>
        <label className="form-label" htmlFor={inputId}>
          {field.label}
        </label>
        <input
          id={inputId}
          name={field.name}
          type={field.type}
          value={values[field.name] || ''}
          onChange={onChange}
          className="form-input"
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          step={field.step}
          list={datalistId}
          disabled={isLoading || field.disabled}
        />
        {datalistId && (
          <datalist id={datalistId}>
            {field.datalist.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        )}
      </div>
    );
  };

  const renderField = (field) => {
    if (field.type === 'range') return renderRangeField(field);
    if (field.type === 'select') return renderSelectField(field);
    return renderTextField(field);
  };

  const containerClasses = ['search-filters', className]
    .filter(Boolean)
    .join(' ');

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply?.();
  };

  return (
    <section className={containerClasses} aria-label={title}>
      <form onSubmit={handleSubmit} className="filter-form" noValidate>
        <h3>{title}</h3>

        <div className="filter-grid">
          {fields.map(renderField)}
        </div>

        <div className="filter-actions">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={onReset}
            disabled={isLoading}
          >
            {MESSAGES.CLEAR}
          </button>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isLoading}
          >
            {MESSAGES.APPLY_FILTERS}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FilterPanel;
