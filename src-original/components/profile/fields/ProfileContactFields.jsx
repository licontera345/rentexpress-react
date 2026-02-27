import FormField from '../../common/forms/FormField';
import { MESSAGES } from '../../../constants';

function ProfileContactFields({
  formData,
  fieldErrors,
  isSaving,
  onChange,
  showBirthDate = false,
  readOnlyEmail = false,
  wrapperClassName = ''
}) {
  const content = (
    <>
      <FormField
        label={MESSAGES.FIRST_NAME}
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={onChange}
        required
        disabled={isSaving}
        error={fieldErrors.firstName}
      />

      <FormField
        label={MESSAGES.LAST_NAME_1}
        type="text"
        name="lastName1"
        value={formData.lastName1}
        onChange={onChange}
        required
        disabled={isSaving}
        error={fieldErrors.lastName1}
      />

      <FormField
        label={MESSAGES.LAST_NAME_2}
        type="text"
        name="lastName2"
        value={formData.lastName2}
        onChange={onChange}
        disabled={isSaving}
        error={fieldErrors.lastName2}
      />

      {showBirthDate ? (
        <FormField
          label={MESSAGES.BIRTH_DATE}
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={onChange}
          required
          disabled={isSaving}
          error={fieldErrors.birthDate}
        />
      ) : null}

      <FormField
        label={MESSAGES.EMAIL}
        type="email"
        name="email"
        value={formData.email}
        onChange={onChange}
        required
        disabled={isSaving}
        readOnly={readOnlyEmail}
        error={fieldErrors.email}
      />

      <FormField
        label={MESSAGES.PHONE}
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={onChange}
        required
        disabled={isSaving}
        error={fieldErrors.phone}
      />
    </>
  );

  if (wrapperClassName) {
    return <div className={wrapperClassName}>{content}</div>;
  }

  return content;
}

export default ProfileContactFields;
