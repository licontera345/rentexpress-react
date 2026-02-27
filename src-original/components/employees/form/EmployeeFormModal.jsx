import Alert from '../../common/feedback/Alert';
import FormField from '../../common/forms/FormField';
import { FormModalFooter, FormSection } from '../../common/forms/FormPrimitives';
import LoadingSpinner from '../../common/feedback/LoadingSpinner';
import { ModalHeader } from '../../common/layout/LayoutPrimitives';
import { MESSAGES } from '../../../constants';
import { headquartersOptionsForFilters } from '../../../utils/location/headquartersUtils';
import { isClientRole } from '../../../utils/roleUtils';

export default function EmployeeFormModal({
  isOpen,
  title,
  description,
  titleId,
  formData,
  fieldErrors,
  onChange,
  onSubmit,
  onClose,
  roles = [],
  headquarters = [],
  alert,
  isSubmitting,
  isLoading = false,
  submitLabel,
  isCreate = false,
  readOnly = false,
  canChangeRole = true,
}) {
  const isDisabled = readOnly || isSubmitting || isLoading;
  const resolvedTitleId = titleId || 'employee-form-title';
  const headquartersOptions = headquartersOptionsForFilters(headquarters);
  const roleOptions = (roles || [])
    .filter((r) => !isClientRole(r))
    .map((r) => ({
      value: r.roleId,
      label: r.roleName || ''
    }));
  const roleFieldDisabled = isDisabled || !canChangeRole;

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
            {description ? <p className="vehicle-create-description">{description}</p> : null}
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
                label={MESSAGES.EMPLOYEE_NAME_LABEL}
                name="employeeName"
                value={formData.employeeName}
                onChange={onChange}
                required={isCreate}
                disabled={isDisabled}
                error={fieldErrors.employeeName}
                placeholder={MESSAGES.USERNAME_PLACEHOLDER}
              />
              {isCreate ? (
                <FormField
                  label={MESSAGES.PASSWORD}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={onChange}
                  required
                  disabled={isDisabled}
                  error={fieldErrors.password}
                  helper={MESSAGES.PASSWORD_MIN_LENGTH}
                />
              ) : (
                <FormField
                  label={MESSAGES.NEW_PASSWORD}
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={onChange}
                  disabled={isDisabled}
                  error={fieldErrors.password}
                  helper={MESSAGES.PASSWORD_CHANGE_DESC}
                />
              )}
              <FormField
                label={MESSAGES.ROLE_LABEL}
                name="roleId"
                value={formData.roleId}
                onChange={onChange}
                required={isCreate && canChangeRole}
                disabled={roleFieldDisabled}
                error={fieldErrors.roleId}
                as="select"
              >
                <option value="">{MESSAGES.SELECT_ROLE}</option>
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </FormField>
              <FormField
                label={MESSAGES.HEADQUARTERS_LABEL}
                name="headquartersId"
                value={formData.headquartersId}
                onChange={onChange}
                required={isCreate}
                disabled={isDisabled}
                error={fieldErrors.headquartersId}
                as="select"
              >
                <option value="">{MESSAGES.SELECT_LOCATION}</option>
                {headquartersOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </FormField>
              <FormField
                label={MESSAGES.FIRST_NAME}
                name="firstName"
                value={formData.firstName}
                onChange={onChange}
                required
                disabled={isDisabled}
                error={fieldErrors.firstName}
              />
              <FormField
                label={MESSAGES.LAST_NAME_1}
                name="lastName1"
                value={formData.lastName1}
                onChange={onChange}
                required
                disabled={isDisabled}
                error={fieldErrors.lastName1}
                placeholder={MESSAGES.LAST_NAME_1_PLACEHOLDER}
              />
              <FormField
                label={MESSAGES.LAST_NAME_2}
                name="lastName2"
                value={formData.lastName2}
                onChange={onChange}
                disabled={isDisabled}
                error={fieldErrors.lastName2}
                placeholder={MESSAGES.LAST_NAME_2_PLACEHOLDER}
              />
              <FormField
                label={MESSAGES.EMAIL}
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                required
                disabled={isDisabled}
                error={fieldErrors.email}
              />
              <FormField
                label={MESSAGES.PHONE}
                name="phone"
                value={formData.phone}
                onChange={onChange}
                disabled={isDisabled}
                error={fieldErrors.phone}
              />
              <FormField
                label={MESSAGES.ACTIVE_STATUS}
                name="activeStatus"
                type="checkbox"
                value={formData.activeStatus}
                onChange={onChange}
                disabled={isDisabled}
                error={fieldErrors.activeStatus}
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
