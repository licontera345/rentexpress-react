import { useState } from 'react';
import PrivateLayout from '../../components/layout/private/PrivateLayout';
import AuthService from '../../api/services/AuthService';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { MESSAGES, BUTTON_VARIANTS, ALERT_TYPES, DEFAULT_FORM_DATA } from '../../constants';
import './UserProfile.css';

function UserProfile() {
  const user = AuthService.getCurrentUser();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    document: user?.document || ''
  });
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(ALERT_TYPES.INFO);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aquí iría la llamada al API para actualizar el perfil
      // await UserService.updateProfile(formData);
      
      setAlertMessage(MESSAGES.PROFILE_UPDATED);
      setAlertType(ALERT_TYPES.SUCCESS);
    } catch (error) {
      setAlertMessage(MESSAGES.PROFILE_ERROR + error.message);
      setAlertType(ALERT_TYPES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateLayout>
      <div className="user-profile-container">
        <div className="profile-card">
          <h1>{MESSAGES.MY_PROFILE_TITLE}</h1>
          
          {alertMessage && (
            <Alert
              type={alertType}
              message={alertMessage}
              onClose={() => setAlertMessage(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <FormField
              label={MESSAGES.FULL_NAME}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <FormField
              label={MESSAGES.EMAIL}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
            />

            <FormField
              label={MESSAGES.PHONE}
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <FormField
              label={MESSAGES.DOCUMENT}
              type="text"
              name="document"
              value={formData.document}
              onChange={handleChange}
            />

            <div className="profile-actions">
              <Button
                type="submit"
                variant={BUTTON_VARIANTS.PRIMARY}
                size="large"
                disabled={loading}
              >
                {loading ? MESSAGES.LOADING : `💾 ${MESSAGES.SAVE}`}
              </Button>
              <Button
                type="button"
                variant={BUTTON_VARIANTS.SECONDARY}
                size="large"
                onClick={() => window.history.back()}
              >
                ← {MESSAGES.CANCEL}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PrivateLayout>
  );
}

export default UserProfile;