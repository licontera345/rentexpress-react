import FormField from '../../common/forms/FormField';
import { FormSection } from '../../common/forms/FormPrimitives';
import { DEFAULT_CURRENCY_SYMBOL, DISTANCE_UNIT_KM, MESSAGES } from '../../../constants';

export function VehicleIdentificationSection({ formData, onChange, isDisabled }) {
  return (
    <FormSection title={MESSAGES.VEHICLE_SECTION_IDENTIFICATION}>
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
    </FormSection>
  );
}

export function VehicleOperationSection({
  formData,
  onChange,
  categories,
  statuses,
  headquartersOptions,
  isDisabled,
  hqLoading
}) {
  return (
    <FormSection title={MESSAGES.VEHICLE_SECTION_OPERATION}>
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
    </FormSection>
  );
}

export function VehicleCostSection({ formData, onChange, isDisabled }) {
  return (
    <FormSection title={MESSAGES.VEHICLE_SECTION_COST}>
      <FormField
        label={MESSAGES.DAILY_PRICE}
        name="dailyPrice"
        type="number"
        value={formData.dailyPrice}
        onChange={onChange}
        placeholder={MESSAGES.DAILY_PRICE_PLACEHOLDER}
        min={0}
        step={0.01}
        prefix={DEFAULT_CURRENCY_SYMBOL}
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
        suffix={DISTANCE_UNIT_KM}
        disabled={isDisabled}
      />
    </FormSection>
  );
}
