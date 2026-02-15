import { useEffect, useState, useCallback, useId } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiSearch } from 'react-icons/fi';
import useHeadquarters from '../../../hooks/location/useHeadquarters';
import { DEFAULT_ACTIVE_STATUS, MESSAGES, PAGINATION } from '../../../constants';
import { getHeadquartersOptionLabel } from '../../../constants/headquartersLabels';
import { buildClassName } from '../../../utils/uiUtils';
import SearchField from './SearchField';

const DEFAULT_SEARCH_TIME = '10:00';
const DEFAULT_VARIANT = 'default';

const headquartersOptions = (headquarters, idPrefix, formData, handleChange, hqLoading) => (
  <>
    <SearchField id={`${idPrefix}-pickup-location`} label={MESSAGES.PICKUP_LOCATION} icon={FiMapPin}>
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
        {headquarters?.map((hq) => (
          <option key={hq.id} value={hq.id}>{getHeadquartersOptionLabel(hq)}</option>
        ))}
      </select>
    </SearchField>
    <SearchField id={`${idPrefix}-return-location`} label={MESSAGES.RETURN_LOCATION} icon={FiMapPin}>
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
        {headquarters?.map((hq) => (
          <option key={hq.id} value={hq.id}>{getHeadquartersOptionLabel(hq)}</option>
        ))}
      </select>
    </SearchField>
  </>
);

function SearchPanel({ onSearch, variant = DEFAULT_VARIANT, className = '', initialCriteria = null }) {
  const [formData, setFormData] = useState({
    pickupHeadquartersId: '',
    returnHeadquartersId: '',
    pickupDate: '',
    pickupTime: DEFAULT_SEARCH_TIME,
    returnDate: '',
    returnTime: DEFAULT_SEARCH_TIME,
  });

  const { headquarters, loading: hqLoading } = useHeadquarters();
  const idPrefix = useId();

  useEffect(() => {
    if (!initialCriteria) return;
    queueMicrotask(() => {
      setFormData((prev) => ({
        pickupHeadquartersId: initialCriteria.currentHeadquartersId ?? prev.pickupHeadquartersId,
        returnHeadquartersId: initialCriteria.returnHeadquartersId ?? prev.returnHeadquartersId,
        pickupDate: initialCriteria.pickupDate ?? prev.pickupDate,
        pickupTime: initialCriteria.pickupTime ?? prev.pickupTime,
        returnDate: initialCriteria.returnDate ?? prev.returnDate,
        returnTime: initialCriteria.returnTime ?? prev.returnTime,
      }));
    });
  }, [initialCriteria]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => Object.assign({}, prev, { [name]: value }));
  };

  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      onSearch?.({
        currentHeadquartersId: formData.pickupHeadquartersId,
        returnHeadquartersId: formData.returnHeadquartersId,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        returnDate: formData.returnDate,
        returnTime: formData.returnTime,
        activeStatus: DEFAULT_ACTIVE_STATUS,
        pageNumber: PAGINATION.DEFAULT_PAGE,
        pageSize: PAGINATION.SEARCH_PAGE_SIZE,
      });
    },
    [formData, onSearch]
  );

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
        {headquartersOptions(headquarters, idPrefix, formData, handleChange, hqLoading)}
        <SearchField id={`${idPrefix}-pickup-date`} label={MESSAGES.PICKUP_DATE} icon={FiCalendar}>
          <input
            type="date"
            id={`${idPrefix}-pickup-date`}
            name="pickupDate"
            value={formData.pickupDate}
            onChange={handleChange}
            className="search-input"
            placeholder={MESSAGES.DATE_PLACEHOLDER}
          />
        </SearchField>
        <SearchField id={`${idPrefix}-pickup-time`} label={MESSAGES.TIME} icon={FiClock}>
          <input
            type="time"
            id={`${idPrefix}-pickup-time`}
            name="pickupTime"
            value={formData.pickupTime}
            onChange={handleChange}
            className="search-input"
          />
        </SearchField>
        <SearchField id={`${idPrefix}-return-date`} label={MESSAGES.RETURN_DATE} icon={FiCalendar}>
          <input
            type="date"
            id={`${idPrefix}-return-date`}
            name="returnDate"
            value={formData.returnDate}
            onChange={handleChange}
            className="search-input"
            placeholder={MESSAGES.DATE_PLACEHOLDER}
          />
        </SearchField>
        <SearchField id={`${idPrefix}-return-time`} label={MESSAGES.TIME} icon={FiClock}>
          <input
            type="time"
            id={`${idPrefix}-return-time`}
            name="returnTime"
            value={formData.returnTime}
            onChange={handleChange}
            className="search-input"
          />
        </SearchField>
        <button type="submit" className="search-submit" disabled={hqLoading}>
          <FiSearch aria-hidden="true" className="search-submit-icon" />
          {MESSAGES.SEARCH}
        </button>
      </form>
    </div>
  );
}

export default SearchPanel;
