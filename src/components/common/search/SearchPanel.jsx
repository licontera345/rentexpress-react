import { useEffect, useState, useCallback, useId } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiSearch } from 'react-icons/fi';
import useHeadquarters from '../../../hooks/location/useHeadquarters';
import { DEFAULT_ACTIVE_STATUS, MESSAGES, PAGINATION } from '../../../constants';
import { getHeadquartersOptionLabel } from '../../../constants/headquartersLabels';
import { buildClassName } from '../../../utils/componentUtils';

// Hora por defecto usada para las búsquedas cuando el usuario no define una.
// Variante visual por defecto para el panel de búsqueda.

const DEFAULT_SEARCH_TIME = '10:00';
const DEFAULT_VARIANT = 'default';

// Formulario principal para seleccionar sucursales, fechas y horas de reserva.
function SearchPanel({ onSearch, variant = DEFAULT_VARIANT, className = '', initialCriteria = null }) {
  const [formData, setFormData] = useState({
    pickupHeadquartersId: '',
    returnHeadquartersId: '',
    pickupDate: '',
    pickupTime: DEFAULT_SEARCH_TIME,
    returnDate: '',
    returnTime: DEFAULT_SEARCH_TIME
  });

  const { headquarters, loading: hqLoading } = useHeadquarters();
  const idPrefix = useId();

  useEffect(() => {
    if (!initialCriteria) {
      return;
    }

    queueMicrotask(() => {
      setFormData(prev => ({
        pickupHeadquartersId: initialCriteria.currentHeadquartersId ?? prev.pickupHeadquartersId,
        returnHeadquartersId: initialCriteria.returnHeadquartersId ?? prev.returnHeadquartersId,
        pickupDate: initialCriteria.pickupDate ?? prev.pickupDate,
        pickupTime: initialCriteria.pickupTime ?? prev.pickupTime,
        returnDate: initialCriteria.returnDate ?? prev.returnDate,
        returnTime: initialCriteria.returnTime ?? prev.returnTime
      }));
    });
  }, [initialCriteria]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => Object.assign({}, prev, {
      [name]: value
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
        activeStatus: DEFAULT_ACTIVE_STATUS,
        pageNumber: PAGINATION.DEFAULT_PAGE,
        pageSize: PAGINATION.SEARCH_PAGE_SIZE
      });
    }
  }, [formData, onSearch]);

  const panelClassName = buildClassName(
    'search-panel',
    variant !== DEFAULT_VARIANT ? `search-panel--${variant}` : '',
    className
  );
  const formClassName = buildClassName(
    'search-form',
    variant !== DEFAULT_VARIANT ? `search-form--${variant}` : ''
  );

  return (
    <div className={panelClassName}>
      <form onSubmit={handleSearch} className={formClassName}>
        <div className="search-group">
          <label className="search-label" htmlFor={`${idPrefix}-pickup-location`}>
            <FiMapPin aria-hidden="true" className="search-label-icon" />
            {MESSAGES.PICKUP_LOCATION}
          </label>
          <select 
            id={`${idPrefix}-pickup-location`}
            name="pickupHeadquartersId" 
            className="search-select"
            value={formData.pickupHeadquartersId}
            onChange={handleChange}
            disabled={hqLoading}
            required
          >
            <option value="">{MESSAGES.SELECT_LOCATION}</option>
            {headquarters?.map((hq) => {
              const headquartersId = hq.id;
              return (
                <option key={headquartersId} value={headquartersId}>
                  {getHeadquartersOptionLabel(hq)}
                </option>
              );
            })}
          </select>
        </div>

        <div className="search-group">
          <label className="search-label" htmlFor={`${idPrefix}-return-location`}>
            <FiMapPin aria-hidden="true" className="search-label-icon" />
            {MESSAGES.RETURN_LOCATION}
          </label>
          <select 
            id={`${idPrefix}-return-location`}
            name="returnHeadquartersId" 
            className="search-select"
            value={formData.returnHeadquartersId}
            onChange={handleChange}
            disabled={hqLoading}
            required
          >
            <option value="">{MESSAGES.SELECT_LOCATION}</option>
            {headquarters?.map((hq) => {
              const headquartersId = hq.id;
              return (
                <option key={headquartersId} value={headquartersId}>
                  {getHeadquartersOptionLabel(hq)}
                </option>
              );
            })}
          </select>
        </div>

        <div className="search-group">
          <label className="search-label" htmlFor={`${idPrefix}-pickup-date`}>
            <FiCalendar aria-hidden="true" className="search-label-icon" />
            {MESSAGES.PICKUP_DATE}
          </label>
          <input 
            type="date" 
            id={`${idPrefix}-pickup-date`}
            name="pickupDate" 
            value={formData.pickupDate}
            onChange={handleChange}
            className="search-input"
            placeholder={MESSAGES.DATE_PLACEHOLDER}
          />
        </div>

        <div className="search-group">
          <label className="search-label" htmlFor={`${idPrefix}-pickup-time`}>
            <FiClock aria-hidden="true" className="search-label-icon" />
            {MESSAGES.TIME}
          </label>
          <input 
            type="time" 
            id={`${idPrefix}-pickup-time`}
            name="pickupTime" 
            value={formData.pickupTime}
            onChange={handleChange}
            className="search-input"
          />
        </div>

        <div className="search-group">
          <label className="search-label" htmlFor={`${idPrefix}-return-date`}>
            <FiCalendar aria-hidden="true" className="search-label-icon" />
            {MESSAGES.RETURN_DATE}
          </label>
          <input 
            type="date" 
            id={`${idPrefix}-return-date`}
            name="returnDate" 
            value={formData.returnDate}
            onChange={handleChange}
            className="search-input"
            placeholder={MESSAGES.DATE_PLACEHOLDER}
          />
        </div>

        <div className="search-group">
          <label className="search-label" htmlFor={`${idPrefix}-return-time`}>
            <FiClock aria-hidden="true" className="search-label-icon" />
            {MESSAGES.TIME}
          </label>
          <input 
            type="time" 
            id={`${idPrefix}-return-time`}
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
          <FiSearch aria-hidden="true" className="search-submit-icon" />
          {MESSAGES.SEARCH}
        </button>
      </form>
    </div>
  );
}

export default SearchPanel;
