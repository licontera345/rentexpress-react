import { FiCalendar, FiClock, FiMapPin, FiSearch, FiAlertCircle } from 'react-icons/fi';
import { MESSAGES } from '../../../constants';
import SearchField from './SearchField';
import CustomSelect from '../forms/CustomSelect';

function FieldValidationMsg({ text }) {
  if (!text) return null;
  return (
    <div className="form-field-validation-msg" role="alert" aria-live="polite">
      <span className="form-field-validation-msg__icon" aria-hidden="true">
        <FiAlertCircle />
      </span>
      <span className="form-field-validation-msg__text">{text}</span>
    </div>
  );
}

function SearchPanel({
  formData,
  headquartersOptions,
  hqLoading,
  idPrefix,
  handleChange,
  handleSearch,
  panelClassName,
  formClassName,
  validationMessage = null,
}) {
  const pickupError = validationMessage === 'pickup' ? MESSAGES.CATALOG_SEARCH_NEED_PICKUP : null;
  const returnError = validationMessage === 'return' ? MESSAGES.CATALOG_SEARCH_NEED_RETURN : null;

  return (
    <div className={panelClassName}>
      <form onSubmit={handleSearch} className={formClassName}>
        <div className="search-field-with-validation">
          <SearchField id={`${idPrefix}-pickup-location`} label={MESSAGES.PICKUP_LOCATION} icon={FiMapPin}>
            <CustomSelect
              id={`${idPrefix}-pickup-location`}
              name="pickupHeadquartersId"
              value={formData.pickupHeadquartersId}
              onChange={handleChange}
              options={[
                { value: '', label: MESSAGES.SELECT_LOCATION },
                ...(headquartersOptions?.map((opt) => ({ value: String(opt.id), label: opt.label })) ?? []),
              ]}
              placeholder={MESSAGES.SELECT_LOCATION}
              disabled={hqLoading}
              required
              variant="search"
            />
          </SearchField>
          <FieldValidationMsg text={pickupError} />
        </div>
        <div className="search-field-with-validation">
          <SearchField id={`${idPrefix}-return-location`} label={MESSAGES.RETURN_LOCATION} icon={FiMapPin}>
            <CustomSelect
              id={`${idPrefix}-return-location`}
              name="returnHeadquartersId"
              value={formData.returnHeadquartersId}
              onChange={handleChange}
              options={[
                { value: '', label: MESSAGES.SELECT_LOCATION },
                ...(headquartersOptions?.map((opt) => ({ value: String(opt.id), label: opt.label })) ?? []),
              ]}
              placeholder={MESSAGES.SELECT_LOCATION}
              disabled={hqLoading}
              required
              variant="search"
            />
          </SearchField>
          <FieldValidationMsg text={returnError} />
        </div>
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
        <button type="submit" className="search-submit" disabled={hqLoading} aria-label={MESSAGES.SEARCH}>
          <FiSearch aria-hidden="true" className="search-submit-icon" />
          {MESSAGES.SEARCH}
        </button>
      </form>
    </div>
  );
}

export default SearchPanel;
