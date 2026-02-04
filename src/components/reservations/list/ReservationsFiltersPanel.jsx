import PropTypes from 'prop-types';
import VehicleFilters from '../../vehicle/filters/VehicleFilters';
import { MESSAGES } from '../../../constants';

function ReservationsFiltersPanel({
  fields,
  values,
  onChange,
  onApply,
  onReset,
  isLoading
}) {
  return (
    <aside className="vehicle-filter-panel">
      <VehicleFilters
        fields={fields}
        values={values}
        onChange={onChange}
        onApply={onApply}
        onReset={onReset}
        title={MESSAGES.FILTER_BY}
        isLoading={isLoading}
        className="vehicle-filters-panel"
      />
    </aside>
  );
}

ReservationsFiltersPanel.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  values: PropTypes.shape({}).isRequired,
  onChange: PropTypes.func.isRequired,
  onApply: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

ReservationsFiltersPanel.defaultProps = {
  isLoading: false
};

export default ReservationsFiltersPanel;
