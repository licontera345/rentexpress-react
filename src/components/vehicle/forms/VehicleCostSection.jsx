import FormField from '../../common/forms/FormField';
import { MESSAGES } from '../../../constants';

// Componente VehicleCostSection que define la interfaz y organiza la lógica de esta vista.

function VehicleCostSection({ formData, onChange, isDisabled }) {
  return (
    <section className="vehicle-create-section">
      <div className="vehicle-create-section-header">
        <h3>{MESSAGES.VEHICLE_SECTION_COST}</h3>
      </div>
      <div className="vehicle-create-grid">
        <FormField
          label={MESSAGES.DAILY_PRICE}
          name="dailyPrice"
          type="number"
          value={formData.dailyPrice}
          onChange={onChange}
          placeholder={MESSAGES.DAILY_PRICE_PLACEHOLDER}
          min={0}
          step={0.01}
          prefix="€"
          required
          disabled={isDisabled}
        />
        <FormField
          label={MESSAGES.MILEAGE}
          name="currentMileage"
          type="number"
          value={formData.currentMileage}
          onChange={onChange}
          placeholder={MESSAGES.MILEAGE_PLACEHOLDER}
          min={0}
          step={1}
          suffix="km"
          disabled={isDisabled}
        />
      </div>
    </section>
  );
}

export default VehicleCostSection;
