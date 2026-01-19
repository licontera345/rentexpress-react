import { useState } from 'react';
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
      ...prev,
      [name]: value
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
        <h3>Filtros</h3>
        <button className="filter-close" onClick={onToggle}>×</button>
      </div>

      <div className="filters-content">
        {/* Price Filter */}
        <div className="filter-section">
          <label className="filter-title">Rango de Precio (€/día)</label>
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
          <label className="filter-title">Ordenar Por</label>
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleChange}
            className="filter-select"
          >
            <option value="price_asc">Precio Menor</option>
            <option value="price_desc">Precio Mayor</option>
            <option value="year_desc">Más Nuevo</option>
            <option value="year_asc">Más Viejo</option>
          </select>
        </div>
      </div>

      <div className="filters-footer">
        <button className="btn-reset" onClick={handleReset}>Limpiar</button>
        <button className="btn-apply" onClick={handleApply}>Aplicar</button>
      </div>
    </div>
  );
}

export default FiltersPanel;
