import { useState } from 'react';
import { MESSAGES } from '../../../constants';

// Valores iniciales del formulario de filtros del catálogo.

const INITIAL_FILTERS = {
  priceMin: '',
  priceMax: '',
  yearMin: '',
  yearMax: '',
  sortBy: 'price_asc'
};

// Panel lateral que permite aplicar filtros y ordenamiento al catálogo.
function FiltersPanel({ onApplyFilters, isOpen, onToggle }) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className={`filters-panel ${isOpen ? 'open' : ''}`}>
      <div className="filters-header">
        <h3>{MESSAGES.FILTER_BY}</h3>
        <button className="filter-close" onClick={onToggle} type="button">
          ×
        </button>
      </div>

      <div className="filters-content">
        <div className="filter-section">
          <label className="filter-title">{MESSAGES.PRICE_RANGE}</label>
          <div className="filter-row">
            <input
              type="number"
              name="priceMin"
              placeholder={MESSAGES.MIN_PLACEHOLDER}
              value={filters.priceMin}
              onChange={handleChange}
              className="filter-input"
            />
            <span className="filter-separator">-</span>
            <input
              type="number"
              name="priceMax"
              placeholder={MESSAGES.MAX_PLACEHOLDER}
              value={filters.priceMax}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <label className="filter-title">{MESSAGES.YEAR_RANGE}</label>
          <div className="filter-row">
            <input
              type="number"
              name="yearMin"
              placeholder={MESSAGES.YEAR_FROM}
              value={filters.yearMin}
              onChange={handleChange}
              className="filter-input"
            />
            <span className="filter-separator">-</span>
            <input
              type="number"
              name="yearMax"
              placeholder={MESSAGES.YEAR_TO}
              value={filters.yearMax}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <label className="filter-title">{MESSAGES.SORT_BY}</label>
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            className="filter-select"
          >
            <option value="price_asc">{MESSAGES.MIN_PRICE}</option>
            <option value="price_desc">{MESSAGES.MAX_PRICE}</option>
            <option value="year_desc">{MESSAGES.SORT_NEWEST}</option>
            <option value="year_asc">{MESSAGES.SORT_OLDEST}</option>
          </select>
        </div>
      </div>

      <div className="filters-footer">
        <button className="btn-reset" onClick={handleReset} type="button">
          {MESSAGES.CLEAR}
        </button>
        <button className="btn-apply" onClick={handleApply} type="button">
          {MESSAGES.APPLY_FILTERS}
        </button>
      </div>
    </div>
  );
}

export default FiltersPanel;
