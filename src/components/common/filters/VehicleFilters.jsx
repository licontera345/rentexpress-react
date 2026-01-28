import { useId } from 'react';
import { MESSAGES } from '../../../constants';

function VehicleFilters({
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

  return (
    <section className={['search-filters', className].filter(Boolean).join(' ')} aria-label={title}>
      <h3>{title}</h3>
      <div className="filter-grid">
        {fields.map((field) => {
          const inputId = `${idPrefix}-${field.name}`;
          const datalistId = field.datalist?.length ? `${inputId}-list` : undefined;

          if (field.type === 'range') {
            const rawValue = values[field.name];
            const hasValue = rawValue !== undefined && rawValue !== '';
            const fallbackValue = field.fallbackValue ?? field.min ?? 0;
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
          }

          if (field.type === 'select') {
            return (
              <div className="form-field" key={field.name}>
                <label className="form-label" htmlFor={inputId}>
                  {field.label}
                </label>
                <select
                  id={inputId}
                  name={field.name}
                  value={values[field.name] ?? ''}
                  onChange={onChange}
                  className="form-input"
                  disabled={isLoading || field.disabled}
                >
                  <option value="">{field.placeholder}</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          return (
            <div className="form-field" key={field.name}>
              <label className="form-label" htmlFor={inputId}>
                {field.label}
              </label>
              <input
                id={inputId}
                name={field.name}
                type={field.type}
                value={values[field.name] ?? ''}
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
        })}
      </div>
      <div className="filter-actions">
        <button className="btn btn-secondary" type="button" onClick={onReset} disabled={isLoading}>
          {MESSAGES.CLEAR}
        </button>
        <button className="btn btn-primary" type="button" onClick={onApply} disabled={isLoading}>
          {MESSAGES.APPLY_FILTERS}
        </button>
      </div>
    </section>
  );
}

export default VehicleFilters;
