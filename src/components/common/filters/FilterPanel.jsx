import { useId } from 'react';
import { MESSAGES } from '../../../constants';
import CustomSelect from '../forms/CustomSelect';
import DualRangeSlider from './DualRangeSlider';

/** Pares de campos range que se muestran como un solo dual slider en catálogo: [minKey, maxKey, labelKey] */
const DUAL_RANGE_PAIRS = [
  ['manufactureYearFrom', 'manufactureYearTo', MESSAGES.YEAR],
  ['currentMileageMin', 'currentMileageMax', MESSAGES.MILEAGE],
  ['minPrice', 'maxPrice', MESSAGES.MIN_PRICE],
];

function getDualRangePair(fieldName, nextFieldName) {
  return DUAL_RANGE_PAIRS.find(([minK, maxK]) => fieldName === minK && nextFieldName === maxK);
}
function FilterPanel({
  fields,
  values,
  onChange,
  onApply,
  onReset,
  title = MESSAGES.FILTER_BY,
  className = '',
  isLoading = false,
  variant
}) {
  const isCatalog = variant === 'catalog';
  const idPrefix = useId();

  const getFieldId = (fieldName) => `${idPrefix}-${fieldName}`;
  const getDatalistId = (field) => (
    field.datalist?.length ? `${getFieldId(field.name)}-list` : undefined
  );

  const renderRangeField = (field) => {
    const inputId = getFieldId(field.name);
    const rawValue = values[field.name];
    const hasValue = rawValue !== undefined && rawValue !== '';
    const fallbackValue = field.fallbackValue ?? field.min ?? 0;
    const rangeValue = hasValue ? rawValue : fallbackValue;
    const displayValue = hasValue ? rawValue : field.placeholder;
    const isYear = field.name && (field.name.toLowerCase().includes('year') || field.name.toLowerCase().includes('año'));
    const isPrice = field.name && field.name.toLowerCase().includes('price');
    const isMileage = field.name && (field.name.toLowerCase().includes('mileage') || field.name.toLowerCase().includes('km'));
    const formatDisplay = (v) => {
      if (isYear) return v;
      if (isPrice) return `${v}€`;
      if (isMileage) return `${Number(v).toLocaleString()}km`;
      return v;
    };

    if (isCatalog) {
      return (
        <div className="catalog-filter-field" key={field.name}>
          <label className="catalog-filter-label" htmlFor={inputId}>
            {field.label}
          </label>
          <div className="catalog-range-row">
            <input
              id={inputId}
              name={field.name}
              type="range"
              value={rangeValue}
              onChange={onChange}
              min={field.min}
              max={field.max}
              step={field.step}
              disabled={isLoading || field.disabled}
            />
            <span className="catalog-range-val">
              {typeof displayValue === 'number' ? formatDisplay(displayValue) : displayValue}
            </span>
          </div>
        </div>
      );
    }

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

    if (isCatalog) {
      return (
        <div className="catalog-filter-field" key={field.name}>
          <label className="catalog-filter-label" htmlFor={inputId}>
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
            className="catalog-filter-select"
          />
        </div>
      );
    }

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

    if (isCatalog) {
      return (
        <div className="catalog-filter-field" key={field.name}>
          <label className="catalog-filter-label" htmlFor={inputId}>
            {field.label}
          </label>
          <input
            id={inputId}
            name={field.name}
            type={field.type}
            value={values[field.name] || ''}
            onChange={onChange}
            className="catalog-filter-input"
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

  /** Para catálogo: agrupa pares range en DualRangeSlider y añade divisores. */
  const buildCatalogFields = () => {
    const out = [];
    let i = 0;
    while (i < fields.length) {
      const field = fields[i];
      const next = fields[i + 1];
      const pair =
        field.type === 'range' &&
        next?.type === 'range' &&
        getDualRangePair(field.name, next.name);

      if (pair) {
        const [minKey, maxKey, label] = pair;
        const minF = field;
        const maxF = next;
        if (shouldAddDividerBefore(field, i)) {
          out.push(<div key={`div-${minKey}`} className="catalog-filter-divider" />);
        }
        const isYear = minKey === 'manufactureYearFrom';
        const isMileage = minKey === 'currentMileageMin';
        const isPrice = minKey === 'minPrice';
        const formatValue = (v) => {
          if (isYear) return v;
          if (isMileage) return `${Number(v).toLocaleString()}`;
          if (isPrice) return `${v} €`;
          return v;
        };
        const parseInput = (v) => {
          const n = Number(v);
          if (Number.isNaN(n)) return minF.min;
          return n;
        };
        out.push(
          <div className="catalog-filter-field" key={`${minKey}-${maxKey}`}>
            <DualRangeSlider
              minName={minKey}
              maxName={maxKey}
              minVal={values[minKey]}
              maxVal={values[maxKey]}
              min={minF.min}
              max={minF.max}
              step={minF.step}
              label={label}
              onChange={onChange}
              formatValue={formatValue}
              parseInput={parseInput}
              disabled={isLoading || minF.disabled}
            />
          </div>
        );
        i += 2;
      } else {
        if (shouldAddDividerBefore(field, i)) {
          out.push(<div key={`div-${field.name}`} className="catalog-filter-divider" />);
        }
        out.push(renderField(field));
        i += 1;
      }
    }
    return out;
  };

  const shouldAddDividerBefore = (f, i) => {
    const prev = fields[i - 1];
    if (!prev) return false;
    if (f.type === 'range' && prev.type !== 'range') return true;
    if (!f.name || !prev.name) return false;
    const name = f.name.toLowerCase();
    const prevName = prev.name.toLowerCase();
    if (name.includes('year') && !prevName.includes('year')) return true;
    if (name.includes('mileage') && !prevName.includes('mileage')) return true;
    if (name.includes('price') && !prevName.includes('price')) return true;
    return false;
  };

  const fieldsWithDividers = isCatalog
    ? buildCatalogFields()
    : fields.map(renderField);

  const containerClasses = isCatalog
    ? ''
    : ['search-filters', className].filter(Boolean).join(' ');

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply?.();
  };

  if (isCatalog) {
    return (
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="catalog-filters-head">
          <div className="catalog-filters-head-left">
            <div className="catalog-filter-icon-wrap" aria-hidden>⚙</div>
            <span className="catalog-filters-title">{title}</span>
          </div>
          <button type="button" className="catalog-btn-clear-all" onClick={onReset} disabled={isLoading}>
            {MESSAGES.CLEAR_ALL}
          </button>
        </div>
        <div className="catalog-filters-body">
          {fieldsWithDividers}
        </div>
        <div className="catalog-filters-foot">
          <button type="submit" className="catalog-btn-apply" disabled={isLoading}>
            {MESSAGES.APPLY_FILTERS}
          </button>
        </div>
      </form>
    );
  }

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
