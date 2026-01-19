import { useState, useCallback } from 'react';
import useHeadquarters from '../../../hooks/useHeadquarters';
import './SearchPanel.css';

function SearchPanel({ onSearch }) {
  const [formData, setFormData] = useState({
    pickupHeadquartersId: '',
    returnHeadquartersId: '',
    pickupDate: '',
    pickupTime: '10:00',
    returnDate: '',
    returnTime: '10:00'
  });

  const { headquarters, loading: hqLoading } = useHeadquarters();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch({
        currentHeadquartersId: formData.pickupHeadquartersId,
        returnHeadquartersId: formData.returnHeadquartersId,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        returnDate: formData.returnDate,
        returnTime: formData.returnTime,
        activeStatus: true,
        pageNumber: 1,
        pageSize: 25
      });
    }
  }, [formData, onSearch]);

  return (
    <div className="search-panel">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-row">
          <div className="search-group">
            <label className="search-label">Lugar de recogida</label>
            <select 
              name="pickupHeadquartersId" 
              className="search-select"
              value={formData.pickupHeadquartersId}
              onChange={handleChange}
              disabled={hqLoading}
              required
            >
              <option value="">Seleccionar</option>
              {headquarters?.map(hq => (
                <option key={hq.id} value={hq.id}>{hq.name}</option>
              ))}
            </select>
          </div>

          <div className="search-group">
            <label className="search-label">Lugar de devolución</label>
            <select 
              name="returnHeadquartersId" 
              className="search-select"
              value={formData.returnHeadquartersId}
              onChange={handleChange}
              disabled={hqLoading}
              required
            >
              <option value="">Seleccionar</option>
              {headquarters?.map(hq => (
                <option key={hq.id} value={hq.id}>{hq.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="search-row">
          <div className="search-group">
            <label className="search-label">Fecha de recogida</label>
            <input 
              type="date" 
              name="pickupDate" 
              value={formData.pickupDate}
              onChange={handleChange}
              className="search-input"
            />
          </div>

          <div className="search-group">
            <label className="search-label">Hora</label>
            <input 
              type="time" 
              name="pickupTime" 
              value={formData.pickupTime}
              onChange={handleChange}
              className="search-input"
            />
          </div>
        </div>

        <div className="search-row">
          <div className="search-group">
            <label className="search-label">Fecha de devolución</label>
            <input 
              type="date" 
              name="returnDate" 
              value={formData.returnDate}
              onChange={handleChange}
              className="search-input"
            />
          </div>

          <div className="search-group">
            <label className="search-label">Hora</label>
            <input 
              type="time" 
              name="returnTime" 
              value={formData.returnTime}
              onChange={handleChange}
              className="search-input"
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="search-submit" 
          disabled={hqLoading}
        >
          BUSCAR
        </button>
      </form>
    </div>
  );
}

export default SearchPanel;
