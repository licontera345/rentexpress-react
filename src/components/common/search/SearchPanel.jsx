import { FiCalendar, FiClock, FiMapPin, FiSearch } from 'react-icons/fi';
import { MESSAGES } from '../../../constants';
import SearchField from './SearchField';

/** Panel de búsqueda presentacional: recibe estado y callbacks por props. */
function SearchPanel({
  formData,
  headquartersOptions,
  hqLoading,
  idPrefix,
  handleChange,
  handleSearch,
  panelClassName,
  formClassName,
}) {
  return (
    <div className={panelClassName}>
      <form onSubmit={handleSearch} className={formClassName}>
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
            {headquartersOptions?.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
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
            {headquartersOptions?.map((opt) => (
              <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
          </select>
        </SearchField>
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
