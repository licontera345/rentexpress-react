import Alert from '../../common/feedback/Alert';
import FormField from '../../common/forms/FormField';
import { FormModalFooter, FormSection } from '../../common/forms/FormPrimitives';
import LoadingSpinner from '../../common/feedback/LoadingSpinner';
import { ModalHeader } from '../../common/layout/LayoutPrimitives';
import { MESSAGES } from '../../../constants';
import { headquartersOptionsForFilters } from '../../../utils/location/headquartersUtils';

export default function RentalFormModal({
  isOpen,
  title,
  description,
  titleId,
  formData,
  fieldErrors,
  onChange,
  onSubmit,
  onClose,
  statuses = [],
  headquarters = [],
  alert,
  isSubmitting,
  isLoading = false,
  submitLabel,
  readOnly = false,
}) {
  const isDisabled = readOnly || isSubmitting || isLoading;
  const resolvedTitleId = titleId || 'rental-form-title';
  const headquartersOptions = headquartersOptionsForFilters(headquarters);
  const statusOptions = (statuses || []).map((s) => ({
    value: s.rentalStatusId,
    label: s.statusName || ''
  }));

  return (
    <div
      className={`modal-backdrop ${isOpen ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={resolvedTitleId}
      onClick={onClose}
    >
      <div className="modal-dialog vehicle-create-modal" onClick={(e) => e.stopPropagation()}>
        <ModalHeader title={title} titleId={resolvedTitleId} onClose={onClose} />
        <div className="modal-body">
          <div className="vehicle-create-intro">
            <p className="vehicle-create-description">{description}</p>
            {!readOnly && (
              <p className="vehicle-create-required">
                {MESSAGES.REQUIRED_FIELDS_PREFIX} <span className="required">*</span> {MESSAGES.REQUIRED_FIELDS_SUFFIX}
              </p>
            )}
          </div>
          {alert && (
            <Alert type={alert.type} message={alert.message} onClose={alert.onClose} />
          )}
          {isLoading && <LoadingSpinner message={MESSAGES.LOADING} />}
          <form className="vehicle-create-form" onSubmit={readOnly ? (e) => { e.preventDefault(); } : onSubmit}>
            <FormSection title={MESSAGES.RESERVATION_MANAGEMENT_SECTION}>
              <FormField
                label={MESSAGES.PICKUP_DATE}
                name="startDateEffective"
                type="datetime-local"
                value={formData.startDateEffective}
                onChange={onChange}
                required
                disabled={isDisabled}
                error={fieldErrors.startDateEffective}
              />
              <FormField
                label={MESSAGES.RETURN_DATE}
                name="endDateEffective"
                type="datetime-local"
                value={formData.endDateEffective}
                onChange={onChange}
                required
                disabled={isDisabled}
                error={fieldErrors.endDateEffective}
              />
              <FormField
                label={MESSAGES.PICKUP_LOCATION}
                name="pickupHeadquartersId"
                value={formData.pickupHeadquartersId}
                onChange={onChange}
                required
                disabled={isDisabled}
                error={fieldErrors.pickupHeadquartersId}
                as="select"
              >
                <option value="">{MESSAGES.SELECT_LOCATION}</option>
                {headquartersOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </FormField>
              <FormField
                label={MESSAGES.RETURN_LOCATION}
                name="returnHeadquartersId"
                value={formData.returnHeadquartersId}
                onChange={onChange}
                required
                disabled={isDisabled}
                error={fieldErrors.returnHeadquartersId}
                as="select"
              >
                <option value="">{MESSAGES.SELECT_LOCATION}</option>
                {headquartersOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </FormField>
              <FormField
                label={MESSAGES.RENTAL_STATUS_LABEL}
                name="rentalStatusId"
                value={formData.rentalStatusId}
                onChange={onChange}
                disabled={isDisabled}
                error={fieldErrors.rentalStatusId}
                as="select"
              >
                <option value="">{MESSAGES.ALL_STATUSES}</option>
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </FormField>
              <FormField
                label={MESSAGES.INITIAL_KM}
                name="initialKm"
                type="number"
                min={0}
                value={formData.initialKm}
                onChange={onChange}
                disabled={isDisabled}
                error={fieldErrors.initialKm}
              />
              <FormField
                label={MESSAGES.FINAL_KM}
                name="finalKm"
                type="number"
                min={0}
                value={formData.finalKm}
                onChange={onChange}
                disabled={isDisabled}
                error={fieldErrors.finalKm}
              />
              <FormField
                label={MESSAGES.TOTAL_COST}
                name="totalCost"
                type="number"
                min={0}
                step="0.01"
                value={formData.totalCost}
                onChange={onChange}
                disabled={isDisabled}
                error={fieldErrors.totalCost}
              />
            </FormSection>
            <FormModalFooter
              helperText={MESSAGES.VEHICLE_CREATE_REVIEW}
              onClose={onClose}
              submitLabel={submitLabel}
              isDisabled={isDisabled}
              isSubmitting={isSubmitting}
              readOnly={readOnly}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
