import { useState } from 'react';
import { MESSAGES } from '../../../constants';
import './FiltersPanel.css';

function FiltersPanel({ onApplyFilters, isOpen, onToggle }) {
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
    sortBy: 'price_asc'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      priceMin: name === 'priceMin' ? value : prev.priceMin,
      priceMax: name === 'priceMax' ? value : prev.priceMax,
      yearMin: name === 'yearMin' ? value : prev.yearMin,
      yearMax: name === 'yearMax' ? value : prev.yearMax,
      sortBy: name === 'sortBy' ? value : prev.sortBy
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
      sortBy: 'price_asc'
    });
  };

  return (
    <div className={`filters-panel ${isOpen ? 'open' : ''}`}>
      <div className="filters-header">
        <h3>{MESSAGES.FILTER_BY}</h3>
        <button className="filter-close" onClick={onToggle} type="button">×</button>
      </div>

      <div className="filters-content">
        {/* Price Filter */}
        <div className="filter-section">
          <label className="filter-title">{MESSAGES.PRICE_RANGE}</label>
          <div className="filter-row">
            <input
              type="number"
              name="priceMin"
              placeholder="Mín"
              value={filters.priceMin}
              onChange={handleChange}
              className="filter-input"
            />
            <span className="filter-separator">-</span>
            <input
              type="number"
              name="priceMax"
              placeholder="Máx"
              value={filters.priceMax}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
        </div>

        {/* Year Filter */}
        <div className="filter-section">
          <label className="filter-title">Rango de Año</label>
          <div className="filter-row">
            <input
              type="number"
              name="yearMin"
              placeholder="Desde"
              value={filters.yearMin}
              onChange={handleChange}
              className="filter-input"
            />
            <span className="filter-separator">-</span>
            <input
              type="number"
              name="yearMax"
              placeholder="Hasta"
              value={filters.yearMax}
              onChange={handleChange}
              className="filter-input"
            />
          </div>
        </div>

        {/* Sort Filter */}
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
            <option value="year_desc">Más Nuevo</option>
            <option value="year_asc">Más Viejo</option>
          </select>
        </div>
      </div>

      <div className="filters-footer">
        <button className="btn-reset" onClick={handleReset} type="button">{MESSAGES.CLEAR}</button>
        <button className="btn-apply" onClick={handleApply} type="button">{MESSAGES.APPLY_FILTERS}</button>
      </div>
    </div>
  );
}

export default FiltersPanel;
