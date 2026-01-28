import FormField from '../common/forms/FormField';
import Button from '../common/actions/Button';
import { BUTTON_SIZES, BUTTON_VARIANTS, MESSAGES } from '../../constants';

function VehicleForm({
  formData,
  fieldErrors,
  categories,
  statuses,
  headquarters,
  isLoading,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
  statusMessage,
  errorMessage
}) {
  return (
    <div className="vehicle-form-wrapper">
      <div className="vehicle-form-header">
        <div>
          <h2>{isEditing ? MESSAGES.VEHICLE_FORM_EDIT_TITLE : MESSAGES.VEHICLE_FORM_CREATE_TITLE}</h2>
          <p className="vehicle-form-subtitle">{MESSAGES.VEHICLE_FORM_SUBTITLE}</p>
        </div>
        {isEditing && (
          <span className="vehicle-form-badge">{MESSAGES.EDIT}</span>
        )}
      </div>

      <form className="vehicle-form profile-form" onSubmit={onSubmit}>
        <FormField
          label={MESSAGES.BRAND}
          name="brand"
          value={formData.brand}
          onChange={onChange}
          required
          disabled={isLoading}
          error={fieldErrors.brand}
          placeholder={MESSAGES.PLACEHOLDER_BRAND}
        />
        <FormField
          label={MESSAGES.MODEL}
          name="model"
          value={formData.model}
          onChange={onChange}
          required
          disabled={isLoading}
          error={fieldErrors.model}
          placeholder={MESSAGES.PLACEHOLDER_MODEL}
        />
        <FormField
          label={MESSAGES.LICENSE_PLATE}
          name="licensePlate"
          value={formData.licensePlate}
          onChange={onChange}
          required
          disabled={isLoading}
          error={fieldErrors.licensePlate}
          placeholder={MESSAGES.PLACEHOLDER_LICENSE_PLATE}
        />
        <FormField
          label={MESSAGES.VIN}
          name="vinNumber"
          value={formData.vinNumber}
          onChange={onChange}
          disabled={isLoading}
          error={fieldErrors.vinNumber}
          placeholder={MESSAGES.PLACEHOLDER_VIN}
        />
        <FormField
          label={MESSAGES.YEAR}
          type="number"
          name="manufactureYear"
          value={formData.manufactureYear}
          onChange={onChange}
          required
          disabled={isLoading}
          error={fieldErrors.manufactureYear}
          placeholder={MESSAGES.PLACEHOLDER_YEAR}
        />
        <FormField
          label={MESSAGES.DAILY_PRICE}
          type="number"
          name="dailyPrice"
          value={formData.dailyPrice}
          onChange={onChange}
          required
          disabled={isLoading}
          error={fieldErrors.dailyPrice}
          placeholder={MESSAGES.PLACEHOLDER_DAILY_PRICE}
        />
        <FormField
          label={MESSAGES.MILEAGE}
          type="number"
          name="currentMileage"
          value={formData.currentMileage}
          onChange={onChange}
          disabled={isLoading}
          error={fieldErrors.currentMileage}
          placeholder={MESSAGES.PLACEHOLDER_MILEAGE}
        />
        <FormField
          label={MESSAGES.CATEGORY}
          name="categoryId"
          value={formData.categoryId}
          onChange={onChange}
          required
          disabled={isLoading}
          error={fieldErrors.categoryId}
          as="select"
        >
          <option value="">{MESSAGES.SELECT_CATEGORY}</option>
          {categories?.map((category) => (
            <option key={category.categoryId ?? category.id} value={category.categoryId ?? category.id}>
              {category.name}
            </option>
          ))}
        </FormField>
        <FormField
          label={MESSAGES.STATUS}
          name="vehicleStatusId"
          value={formData.vehicleStatusId}
          onChange={onChange}
          required
          disabled={isLoading}
          error={fieldErrors.vehicleStatusId}
          as="select"
        >
          <option value="">{MESSAGES.SELECT_STATUS}</option>
          {statuses?.map((status) => (
            <option key={status.vehicleStatusId ?? status.id} value={status.vehicleStatusId ?? status.id}>
              {status.name}
            </option>
          ))}
        </FormField>
        <FormField
          label={MESSAGES.HEADQUARTERS_LABEL}
          name="currentHeadquartersId"
          value={formData.currentHeadquartersId}
          onChange={onChange}
          required
          disabled={isLoading}
          error={fieldErrors.currentHeadquartersId}
          as="select"
        >
          <option value="">{MESSAGES.SELECT_HEADQUARTERS}</option>
          {headquarters?.map((hq) => (
            <option key={hq.id} value={hq.id}>
              {hq.name}
            </option>
          ))}
        </FormField>
        <FormField
          label={MESSAGES.ACTIVE_STATUS}
          name="activeStatus"
          value={formData.activeStatus}
          onChange={onChange}
          disabled={isLoading}
          error={fieldErrors.activeStatus}
          as="select"
        >
          <option value="true">{MESSAGES.ACTIVE}</option>
          <option value="false">{MESSAGES.INACTIVE}</option>
        </FormField>
        <FormField
          label={MESSAGES.DESCRIPTION}
          name="description"
          value={formData.description}
          onChange={onChange}
          disabled={isLoading}
          error={fieldErrors.description}
          as="textarea"
          rows={3}
          placeholder={MESSAGES.PLACEHOLDER_DESCRIPTION}
        />

        {errorMessage && (
          <p className="profile-alert profile-alert--error" role="alert">
            {errorMessage}
          </p>
        )}
        {statusMessage && (
          <p className="profile-alert profile-alert--success" role="status">
            {statusMessage}
          </p>
        )}

        <div className="vehicle-form-actions">
          {isEditing && (
            <Button
              type="button"
              variant={BUTTON_VARIANTS.SECONDARY}
              size={BUTTON_SIZES.SMALL}
              onClick={onCancel}
              disabled={isLoading}
            >
              {MESSAGES.CANCEL}
            </Button>
          )}
          <Button
            type="submit"
            variant={BUTTON_VARIANTS.PRIMARY}
            size={BUTTON_SIZES.SMALL}
            disabled={isLoading}
            loading={isLoading}
          >
            {isEditing ? MESSAGES.UPDATE_VEHICLE : MESSAGES.CREATE_VEHICLE}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default VehicleForm;
