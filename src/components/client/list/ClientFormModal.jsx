import Alert from '../../common/feedback/Alert';
import Button from '../../common/actions/Button';
import FormField from '../../common/forms/FormField';
import LoadingSpinner from '../../common/feedback/LoadingSpinner';
import { MESSAGES } from '../../../constants';

function ClientFormModal({
  isOpen,
  title,
  description,
  titleId,
  formData,
  fieldErrors,
  onChange,
  onSubmit,
  onClose,
  provinces,
  cities,
  provincesLoading,
  citiesLoading,
  alert,
  isSubmitting,
  isLoading = false,
  submitLabel,
  isEdit = false
}) {
  const isDisabled = isSubmitting || isLoading;
  const resolvedTitleId = titleId || 'client-form-title';

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
                <h3>{MESSAGES.USER_MANAGEMENT_SECTION}</h3>
              </div>
              <div className="vehicle-create-grid">
                <FormField label={MESSAGES.USERNAME} name="username" value={formData.username} onChange={onChange} required disabled={isDisabled} error={fieldErrors.username} />
                <FormField label={MESSAGES.FIRST_NAME} name="firstName" value={formData.firstName} onChange={onChange} required disabled={isDisabled} error={fieldErrors.firstName} />
                <FormField label={MESSAGES.LAST_NAME1} name="lastName1" value={formData.lastName1} onChange={onChange} required disabled={isDisabled} error={fieldErrors.lastName1} />
                <FormField label={MESSAGES.LAST_NAME2} name="lastName2" value={formData.lastName2} onChange={onChange} disabled={isDisabled} error={fieldErrors.lastName2} />
                <FormField label={MESSAGES.BIRTH_DATE} type="date" name="birthDate" value={formData.birthDate} onChange={onChange} required disabled={isDisabled} error={fieldErrors.birthDate} />
                <FormField label={MESSAGES.EMAIL} type="email" name="email" value={formData.email} onChange={onChange} required disabled={isDisabled} error={fieldErrors.email} />
                <FormField label={MESSAGES.PHONE} name="phone" value={formData.phone} onChange={onChange} required disabled={isDisabled} error={fieldErrors.phone} />
                <FormField label={MESSAGES.PASSWORD} type="password" name="password" value={formData.password} onChange={onChange} required={!isEdit} disabled={isDisabled} error={fieldErrors.password} />
                <FormField label={MESSAGES.CONFIRM_PASSWORD} type="password" name="confirmPassword" value={formData.confirmPassword} onChange={onChange} required={!isEdit} disabled={isDisabled} error={fieldErrors.confirmPassword} />
                <FormField
                  label={MESSAGES.PROVINCE}
                  name="provinceId"
                  value={formData.provinceId}
                  onChange={onChange}
                  required
                  disabled={isDisabled || provincesLoading}
                  error={fieldErrors.provinceId}
                  as="select"
                >
                  <option value="">{MESSAGES.SELECT_PROVINCE}</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.id}>{province.name}</option>
                  ))}
                </FormField>
                <FormField
                  label={MESSAGES.CITY}
                  name="cityId"
                  value={formData.cityId}
                  onChange={onChange}
                  required
                  disabled={isDisabled || citiesLoading || !formData.provinceId}
                  error={fieldErrors.cityId}
                  as="select"
                >
                  <option value="">{MESSAGES.SELECT_CITY}</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </FormField>
                <FormField label={MESSAGES.STREET} name="street" value={formData.street} onChange={onChange} required disabled={isDisabled} error={fieldErrors.street} />
                <FormField label={MESSAGES.NUMBER} name="number" value={formData.number} onChange={onChange} required disabled={isDisabled} error={fieldErrors.number} />
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
              <p className="form-helper">{MESSAGES.USER_FORM_REVIEW}</p>
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

export default ClientFormModal;
