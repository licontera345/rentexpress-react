import './VehicleFormFields.css';
import FormField from '../common/FormField';
import { MESSAGES } from '../../constants';

function VehicleFormFields({ formData = {}, onChange, categories = [] }) {
  const safeFormData = {
    brand: formData.brand ?? '',
    model: formData.model ?? '',
    licensePlate: formData.licensePlate ?? '',
    vin: formData.vin ?? '',
    description: formData.description ?? '',
    year: formData.year ?? '',
    categoryId: formData.categoryId ?? '',
    mileage: formData.mileage ?? '',
    dailyPrice: formData.dailyPrice ?? ''
  };

  return (
    <>
      <div className="form-section">
        <h3>{MESSAGES.VEHICLE_DETAILS}</h3>
        <div className="form-grid">
          <FormField
            label={MESSAGES.BRAND}
            name="brand"
            value={safeFormData.brand}
            onChange={onChange}
            placeholder="Ej: Toyota, Honda, Ford"
            required
          />
          <FormField
            label={MESSAGES.MODEL}
            name="model"
            value={safeFormData.model}
            onChange={onChange}
            placeholder="Ej: Corolla, Civic, Focus"
            required
          />
        </div>

        <div className="form-grid">
          <FormField
            label={MESSAGES.LICENSE_PLATE}
            name="licensePlate"
            value={safeFormData.licensePlate}
            onChange={onChange}
            placeholder="Ej: ABC-1234"
            required
          />
          <FormField
            label={MESSAGES.VIN}
            name="vin"
            value={safeFormData.vin}
            onChange={onChange}
            placeholder="Número de identificación del vehículo"
          />
        </div>

        <FormField
          label={MESSAGES.DESCRIPTION}
          name="description"
          value={safeFormData.description}
          onChange={onChange}
          placeholder="Características adicionales del vehículo"
          as="textarea"
          rows={3}
        />
      </div>

      <div className="form-section">
        <h3>Especificaciones Técnicas</h3>
        <div className="form-grid">
          <FormField
            label={MESSAGES.YEAR}
            name="year"
            type="number"
            value={safeFormData.year}
            onChange={onChange}
            required
          />
          <FormField
            label={MESSAGES.CATEGORY}
            name="categoryId"
            as="select"
            value={safeFormData.categoryId}
            onChange={onChange}
          >
            <option value="">{MESSAGES.SELECT_CATEGORY}</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </FormField>
        </div>

        <div className="form-grid">
          <FormField
            label={MESSAGES.MILEAGE}
            name="mileage"
            type="number"
            value={safeFormData.mileage}
            onChange={onChange}
            placeholder="0"
          />
          <FormField
            label={MESSAGES.DAILY_PRICE}
            name="dailyPrice"
            type="number"
            step="0.01"
            value={safeFormData.dailyPrice}
            onChange={onChange}
            placeholder="Ej: 50.00"
            required
          />
        </div>
      </div>
    </>
  );
}

export default VehicleFormFields;
