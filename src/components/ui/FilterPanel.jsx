import { useId } from 'react';
import FormField from './FormField.jsx';
import Select from './Select.jsx';
import Button from './Button.jsx';
import { BUTTON_VARIANTS } from '../../constants/index.js';

/**
 * Panel de filtros reutilizable. fields = [{ name, label, type, placeholder, options?, min, max, step }].
 * values y onChange vienen del hook (filters, setFilterFromEvent). applyLabel, resetLabel por props.
 */
export function FilterPanel({
  fields = [],
  values = {},
  onChange,
  onApply,
  onReset,
  title = 'Filtrar',
  applyLabel = 'Aplicar',
  resetLabel = 'Limpiar',
  isLoading = false,
  className = '',
}) {
  const idPrefix = useId();

  const renderField = (field) => {
    const inputId = `${idPrefix}-${field.name}`;
    const value = values[field.name];

    if (field.type === 'range') {
      const hasValue = value !== undefined && value !== '';
      const displayValue = hasValue ? value : (field.fallbackValue ?? field.min ?? 0);
      return (
        <div key={field.name} className="form-field range-field">
          <label className="form-label" htmlFor={inputId}>
            {field.label}
          </label>
          <div className="range-input-row">
            <input
              id={inputId}
              name={field.name}
              type="range"
              value={hasValue ? value : displayValue}
              onChange={onChange}
              className="form-range"
              min={field.min}
              max={field.max}
              step={field.step}
              disabled={isLoading || field.disabled}
            />
            <output className="range-input-value" htmlFor={inputId}>
              {hasValue ? value : (field.placeholder ?? displayValue)}
            </output>
          </div>
        </div>
      );
    }

    if (field.type === 'select') {
      return (
        <div key={field.name} className="form-field">
          <label className="form-label" htmlFor={inputId}>
            {field.label}
          </label>
          <Select
            id={inputId}
            name={field.name}
            value={value ?? ''}
            onChange={onChange}
            options={[
              { value: '', label: field.placeholder ?? '' },
              ...(field.options?.map((o) => ({ value: o.value, label: o.label })) ?? []),
            ]}
            disabled={isLoading || field.disabled}
          />
        </div>
      );
    }

    return (
      <FormField
        key={field.name}
        label={field.label}
        name={field.name}
        type={field.type ?? 'text'}
        value={value ?? ''}
        onChange={onChange}
        placeholder={field.placeholder}
        disabled={isLoading || field.disabled}
      />
    );
  };

  return (
    <section className={`search-filters ${className}`.trim()} aria-label={title}>
      <form
        className="filter-form"
        onSubmit={(e) => { e.preventDefault(); onApply?.(); }}
        noValidate
      >
        <h3>{title}</h3>
        <div className="filter-grid">
          {fields.map(renderField)}
        </div>
        <div className="filter-actions">
          <Button type="button" variant={BUTTON_VARIANTS.SECONDARY} onClick={onReset} disabled={isLoading}>
            {resetLabel}
          </Button>
          <Button type="submit" disabled={isLoading}>
            {applyLabel}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default FilterPanel;
