import FormField from '../../common/forms/FormField';
import { MESSAGES } from '../../../constants';

// Sección del formulario que gestiona categoría, estado y sede actual.
function VehicleOperationSection({
  formData,
  onChange,
  categories,
  statuses,
  headquartersOptions,
  isDisabled,
  hqLoading
}) {
  return (
    <section className="vehicle-create-section">
      <div className="vehicle-create-section-header">
        <h3>{MESSAGES.VEHICLE_SECTION_OPERATION}</h3>
      </div>
      <div className="vehicle-create-grid">
        <FormField
          label={MESSAGES.CATEGORY}
          name="categoryId"
          value={formData.categoryId}
          onChange={onChange}
          as="select"
          required
          disabled={isDisabled}
        >
          <option value="">{MESSAGES.SELECT_CATEGORY}</option>
          {categories.map((category) => (
            <option key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </option>
          ))}
        </FormField>

        <FormField
          label={MESSAGES.STATUS}
          name="vehicleStatusId"
          value={formData.vehicleStatusId}
          onChange={onChange}
          as="select"
          required
          disabled={isDisabled}
        >
          <option value="">{MESSAGES.SELECT_STATUS}</option>
          {statuses.map((status) => (
            <option key={status.vehicleStatusId} value={status.vehicleStatusId}>
              {status.statusName}
            </option>
          ))}
        </FormField>

        <FormField
          label={MESSAGES.HEADQUARTERS_LABEL}
          name="currentHeadquartersId"
          value={formData.currentHeadquartersId}
          onChange={onChange}
          as="select"
          required
          disabled={hqLoading || isDisabled}
        >
          <option value="">{MESSAGES.SELECT_LOCATION}</option>
          {headquartersOptions.map((hq) => (
            <option key={hq.value} value={hq.value}>
              {hq.label}
            </option>
          ))}
        </FormField>
      </div>
    </section>
  );
}

export default VehicleOperationSection;
