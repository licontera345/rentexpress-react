import Alert from '../feedback/Alert';
import Button from '../actions/Button';
import FormField from './FormField';
import LoadingSpinner from '../feedback/LoadingSpinner';
import { MESSAGES } from '../../../constants';

function VehicleFormModal({
  isOpen,
  title,
  description,
  titleId,
  formData,
  onChange,
  onSubmit,
  onClose,
  categories,
  statuses,
  headquartersOptions,
  hqLoading,
  alert,
  isSubmitting,
  submitLabel,
  isLoading = false
}) {
  const isDisabled = isSubmitting || isLoading;
  const modalTitleId = titleId || 'vehicle-form-title';

  const stopPropagation = (e) => e.stopPropagation();

  const getCategoryId = (category) => category.categoryId || category.id;
  const getCategoryName = (category) => category.categoryName || category.name;
  const getStatusId = (status) => status.vehicleStatusId || status.id;
  const getStatusName = (status) => status.statusName || status.name;

  return (
    <div
      className={`modal-backdrop ${isOpen ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={modalTitleId}
      onClick={onClose}
    >
      <div className="modal-dialog vehicle-create-modal" onClick={stopPropagation}>
        <div className="modal-header">
          <h2 id={modalTitleId}>{title}</h2>
          <button 
            className="btn-close" 
            type="button" 
            onClick={onClose} 
            aria-label={MESSAGES.CLOSE}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="vehicle-create-intro">
            <p className="vehicle-create-description">{description}</p>
            <p className="vehicle-create-required">
              {MESSAGES.REQUIRED_FIELDS_PREFIX} <span className="required">*</span> {MESSAGES.REQUIRED_FIELDS_SUFFIX}
            </p>
          </div>

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={alert.onClose}
            />
          )}

          {isLoading && <LoadingSpinner message={MESSAGES.LOADING} />}

          <form className="vehicle-create-form" onSubmit={onSubmit}>
            {/* Identification Section */}
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

            {/* Operation Section */}
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

            {/* Cost Section */}
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

            {/* Footer */}
            <div className="vehicle-create-footer">
              <p className="form-helper">{MESSAGES.VEHICLE_CREATE_REVIEW}</p>
              <div className="vehicle-create-actions">
                <Button
                  type="button"
                  variant="outlined"
                  onClick={onClose}
                  disabled={isDisabled}
                >
                  {MESSAGES.CANCEL}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  disabled={isDisabled}
                >
                  {submitLabel}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VehicleFormModal;