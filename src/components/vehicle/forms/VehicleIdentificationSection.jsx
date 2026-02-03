import FormField from '../../common/forms/FormField';
import { MESSAGES } from '../../../constants';

function VehicleIdentificationSection({ formData, onChange, isDisabled }) {
  return (
    <section className="vehicle-create-section">
      <div className="vehicle-create-section-header">
        <h3>{MESSAGES.VEHICLE_SECTION_IDENTIFICATION}</h3>
      </div>
      <div className="vehicle-create-grid">
        <FormField
          label={MESSAGES.BRAND}
          name="brand"
          value={formData.brand}
          onChange={onChange}
          placeholder={MESSAGES.PLACEHOLDER_BRAND}
          required
          disabled={isDisabled}
        />
        <FormField
          label={MESSAGES.MODEL}
          name="model"
          value={formData.model}
          onChange={onChange}
          placeholder={MESSAGES.MODEL_PLACEHOLDER}
          required
          disabled={isDisabled}
        />
        <FormField
          label={MESSAGES.YEAR}
          name="manufactureYear"
          type="number"
          value={formData.manufactureYear}
          onChange={onChange}
          placeholder={MESSAGES.YEAR_PLACEHOLDER}
          min={1900}
          step={1}
          required
          disabled={isDisabled}
        />
        <FormField
          label={MESSAGES.LICENSE_PLATE}
          name="licensePlate"
          value={formData.licensePlate}
          onChange={onChange}
          placeholder={MESSAGES.LICENSE_PLATE_PLACEHOLDER}
          required
          disabled={isDisabled}
        />
        <FormField
          label={MESSAGES.VIN}
          name="vinNumber"
          value={formData.vinNumber}
          onChange={onChange}
          placeholder={MESSAGES.VIN_PLACEHOLDER}
          helper={MESSAGES.VIN_HELPER}
          required
          disabled={isDisabled}
        />
      </div>
    </section>
  );
}

export default VehicleIdentificationSection;
