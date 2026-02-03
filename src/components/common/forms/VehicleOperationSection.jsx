import FormField from './FormField';
import { MESSAGES } from '../../../constants';

const getCategoryId = (category) => category.categoryId || category.id;
const getCategoryName = (category) => category.categoryName || category.name;
const getStatusId = (status) => status.vehicleStatusId || status.id;
const getStatusName = (status) => status.statusName || status.name;

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
            <option key={getCategoryId(category)} value={getCategoryId(category)}>
              {getCategoryName(category)}
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
            <option key={getStatusId(status)} value={getStatusId(status)}>
              {getStatusName(status)}
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
