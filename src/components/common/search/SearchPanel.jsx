import { useEffect, useState, useCallback } from 'react';
import useHeadquarters from '../../../hooks/useHeadquarters';
import { MESSAGES } from '../../../constants';
import './SearchPanel.css';

function SearchPanel({ onSearch, variant = 'default', className = '', initialCriteria = null }) {
  const [formData, setFormData] = useState({
    pickupHeadquartersId: '',
    returnHeadquartersId: '',
    pickupDate: '',
    pickupTime: '10:00',
    returnDate: '',
    returnTime: '10:00'
  });

  const { headquarters, loading: hqLoading } = useHeadquarters();

  useEffect(() => {
    if (!initialCriteria) {
      return;
    }

    setFormData(prev => ({
      pickupHeadquartersId: initialCriteria.currentHeadquartersId ?? prev.pickupHeadquartersId,
      returnHeadquartersId: initialCriteria.returnHeadquartersId ?? prev.returnHeadquartersId,
      pickupDate: initialCriteria.pickupDate ?? prev.pickupDate,
      pickupTime: initialCriteria.pickupTime ?? prev.pickupTime,
      returnDate: initialCriteria.returnDate ?? prev.returnDate,
      returnTime: initialCriteria.returnTime ?? prev.returnTime
    }));
  }, [initialCriteria]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      pickupHeadquartersId: name === 'pickupHeadquartersId' ? value : prev.pickupHeadquartersId,
      returnHeadquartersId: name === 'returnHeadquartersId' ? value : prev.returnHeadquartersId,
      pickupDate: name === 'pickupDate' ? value : prev.pickupDate,
      pickupTime: name === 'pickupTime' ? value : prev.pickupTime,
      returnDate: name === 'returnDate' ? value : prev.returnDate,
      returnTime: name === 'returnTime' ? value : prev.returnTime
    }));
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

  const panelClassName = [
    'search-panel',
    variant !== 'default' ? `search-panel--${variant}` : '',
    className
  ].filter(Boolean).join(' ');
  const formClassName = [
    'search-form',
    variant !== 'default' ? `search-form--${variant}` : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={panelClassName}>
      <form onSubmit={handleSearch} className={formClassName}>
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
            <option value="">{MESSAGES.SELECT_LOCATION}</option>
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
            <option value="">{MESSAGES.SELECT_LOCATION}</option>
            {headquarters?.map(hq => (
              <option key={hq.id} value={hq.id}>{hq.name}</option>
            ))}
          </select>
        </div>

        <div className="search-group">
          <label className="search-label">Fecha de recogida</label>
          <input 
            type="date" 
            name="pickupDate" 
            value={formData.pickupDate}
            onChange={handleChange}
            className="search-input"
            placeholder="mm/dd/yyyy"
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

        <div className="search-group">
          <label className="search-label">Fecha de devolución</label>
          <input 
            type="date" 
            name="returnDate" 
            value={formData.returnDate}
            onChange={handleChange}
            className="search-input"
            placeholder="mm/dd/yyyy"
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

        <button 
          type="submit" 
          className="search-submit" 
          disabled={hqLoading}
        >
          {MESSAGES.SEARCH}
        </button>
      </form>
    </div>
  );
}

export default SearchPanel;
