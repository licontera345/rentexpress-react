import Alert from '../../common/feedback/Alert';
import Button from '../../common/actions/Button';
import FormField from '../../common/forms/FormField';
import LoadingSpinner from '../../common/feedback/LoadingSpinner';
import { MESSAGES } from '../../../constants';

function EmployeeFormModal({
  isOpen,
  title,
  description,
  titleId,
  formData,
  fieldErrors,
  onChange,
  onSubmit,
  onClose,
  roles,
  headquarters,
  headquartersLoading,
  alert,
  isSubmitting,
  isLoading = false,
  submitLabel,
  isEdit = false
}) {
  const isDisabled = isSubmitting || isLoading;
  const resolvedTitleId = titleId || 'employee-form-title';

  return (
    <div
      className={`modal-backdrop ${isOpen ? 'active' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={resolvedTitleId}
      onClick={onClose}
    >
      <div className="modal-dialog vehicle-create-modal" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2 id={resolvedTitleId}>{title}</h2>
          <button className="btn-close" type="button" onClick={onClose} aria-label={MESSAGES.CLOSE}>×</button>
        </div>

        <div className="modal-body">
          <div className="vehicle-create-intro">
            <p className="vehicle-create-description">{description}</p>
            <p className="vehicle-create-required">
              {MESSAGES.REQUIRED_FIELDS_PREFIX} <span className="required">*</span> {MESSAGES.REQUIRED_FIELDS_SUFFIX}
            </p>
          </div>

          {alert && <Alert type={alert.type} message={alert.message} onClose={alert.onClose} />}
          {isLoading && <LoadingSpinner message={MESSAGES.LOADING} />}

          <form className="vehicle-create-form" onSubmit={onSubmit}>
            <section className="vehicle-create-section">
              <div className="vehicle-create-section-header">
                <h3>{MESSAGES.EMPLOYEE_MANAGEMENT_SECTION}</h3>
              </div>
              <div className="vehicle-create-grid">
                <FormField
                  label={MESSAGES.EMPLOYEE_NAME}
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={onChange}
                  required
                  disabled={isDisabled}
                  error={fieldErrors.employeeName}
                  placeholder={MESSAGES.EMPLOYEE_NAME_PLACEHOLDER}
                />
                <FormField
                  label={MESSAGES.EMPLOYEE_POSITION_LABEL}
                  name="roleId"
                  value={formData.roleId}
                  onChange={onChange}
                  required
                  disabled={isDisabled}
                  error={fieldErrors.roleId}
                  as="select"
                >
                  <option value="">{MESSAGES.SELECT_ROLE}</option>
                  {roles.map((role) => (
                    <option key={role.roleId} value={role.roleId}>{role.roleName}</option>
                  ))}
                </FormField>
                <FormField
                  label={MESSAGES.HEADQUARTERS_LABEL}
                  name="headquartersId"
                  value={formData.headquartersId}
                  onChange={onChange}
                  required
                  disabled={isDisabled || headquartersLoading}
                  error={fieldErrors.headquartersId}
                  as="select"
                >
                  <option value="">{MESSAGES.SELECT_LOCATION}</option>
                  {headquarters.map((hq) => (
                    <option key={hq.id} value={hq.id}>{hq.name}</option>
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
                  label={MESSAGES.LAST_NAME1}
                  name="lastName1"
                  value={formData.lastName1}
                  onChange={onChange}
                  required
                  disabled={isDisabled}
                  error={fieldErrors.lastName1}
                />
                <FormField
                  label={MESSAGES.LAST_NAME2}
                  name="lastName2"
                  value={formData.lastName2}
                  onChange={onChange}
                  disabled={isDisabled}
                  error={fieldErrors.lastName2}
                />
                <FormField
                  label={MESSAGES.EMAIL}
                  type="email"
                  name="email"
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
                  label={MESSAGES.PASSWORD}
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  required={!isEdit}
                  disabled={isDisabled}
                  error={fieldErrors.password}
                />
                <FormField
                  label={MESSAGES.CONFIRM_PASSWORD}
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={onChange}
                  required={!isEdit}
                  disabled={isDisabled}
                  error={fieldErrors.confirmPassword}
                />
                <FormField
                  label={MESSAGES.ACTIVE_STATUS}
                  name="activeStatus"
                  value={String(Number(Boolean(formData.activeStatus === true || formData.activeStatus === '1' || formData.activeStatus === 1)))}
                  onChange={onChange}
                  required
                  disabled={isDisabled}
                  error={fieldErrors.activeStatus}
                  as="select"
                >
                  <option value="1">{MESSAGES.ACTIVE}</option>
                  <option value="0">{MESSAGES.INACTIVE}</option>
                </FormField>
              </div>
            </section>

            <div className="vehicle-create-footer">
              <p className="form-helper">{MESSAGES.EMPLOYEE_FORM_REVIEW}</p>
              <div className="vehicle-create-actions">
                <Button type="button" variant="outlined" onClick={onClose} disabled={isDisabled}>
                  {MESSAGES.CANCEL}
                </Button>
                <Button type="submit" variant="primary" loading={isSubmitting} disabled={isDisabled}>
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

export default EmployeeFormModal;
