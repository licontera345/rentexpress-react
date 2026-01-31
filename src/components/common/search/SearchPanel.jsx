import { useEffect, useState, useCallback, useId } from 'react';
import useHeadquarters from '../../../hooks/useHeadquarters';
import { DEFAULT_ACTIVE_STATUS, MESSAGES, PAGINATION } from '../../../constants';
import { getHeadquartersOptionLabel } from '../../../config/headquartersLabels';

const DEFAULT_SEARCH_TIME = '10:00';
const DEFAULT_VARIANT = 'default';

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

  const panelClassName = [
    'search-panel',
    variant !== DEFAULT_VARIANT ? `search-panel--${variant}` : '',
    className
  ].filter(Boolean).join(' ');
  const formClassName = [
    'search-form',
    variant !== DEFAULT_VARIANT ? `search-form--${variant}` : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={panelClassName}>
      <form onSubmit={handleSearch} className={formClassName}>
        <div className="search-group">
          <label className="search-label" htmlFor={`${idPrefix}-pickup-location`}>
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
              const headquartersId = hq.headquartersId ?? hq.id;
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
              const headquartersId = hq.headquartersId ?? hq.id;
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
          {MESSAGES.SEARCH}
        </button>
      </form>
    </div>
  );
}

export default SearchPanel;
