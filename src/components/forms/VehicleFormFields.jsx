import './VehicleFormFields.css';
import FormField from '../common/FormField';

function VehicleFormFields({ formData, onChange, categories }) {
  return (
    <>
      {/* Información General */}
      <div className="form-section">
        <h3>Información General</h3>
        <div className="form-grid">
          <FormField
            label="Marca *"
            name="brand"
            value={formData.brand}
            onChange={onChange}
            placeholder="Ej: Toyota, Honda, Ford"
            required
          />
          <FormField
            label="Modelo *"
            name="model"
            value={formData.model}
            onChange={onChange}
            placeholder="Ej: Corolla, Civic, Focus"
            required
          />
        </div>

        <div className="form-grid">
          <FormField
            label="Placa *"
            name="licensePlate"
            value={formData.licensePlate}
            onChange={onChange}
            placeholder="Ej: ABC-1234"
            required
          />
          <FormField
            label="VIN"
            name="vin"
            value={formData.vin}
            onChange={onChange}
            placeholder="Número de identificación del vehículo"
          />
        </div>

        <FormField
          label="Descripción"
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Características adicionales del vehículo"
          as="textarea"
          rows={3}
        />
      </div>

      {/* Especificaciones Técnicas */}
      <div className="form-section">
        <h3>Especificaciones Técnicas</h3>
        <div className="form-grid">
          <FormField
            label="Año *"
            name="year"
            type="number"
            value={formData.year}
            onChange={onChange}
            required
          />
          <FormField
            label="Categoría"
            name="categoryId"
            as="select"
            value={formData.categoryId}
            onChange={onChange}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </FormField>
        </div>

        <div className="form-grid">
          <FormField
            label="Kilometraje Actual"
            name="mileage"
            type="number"
            value={formData.mileage}
            onChange={onChange}
            placeholder="0"
          />
          <FormField
            label="Precio Diario *"
            name="dailyPrice"
            type="number"
            step="0.01"
            value={formData.dailyPrice}
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
