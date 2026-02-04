import VehicleFilters from '../../vehicle/filters/VehicleFilters';
import { MESSAGES } from '../../../constants';

// Componente ReservationsFiltersPanel que define la interfaz y organiza la lógica de esta vista.

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

export default ReservationsFiltersPanel;
