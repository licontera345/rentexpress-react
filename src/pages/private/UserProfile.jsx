import { useEffect, useState } from 'react';
import PrivateLayout from '../../components/layout/private/PrivateLayout';
import AuthService from '../../api/services/AuthService';
import UserService from '../../api/services/UserService';
import EmployeeService from '../../api/services/EmployeeService';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { MESSAGES, BUTTON_VARIANTS, ALERT_TYPES, DEFAULT_FORM_DATA, LOGIN_TYPES } from '../../constants';
import './UserProfile.css';

const buildProfileFormData = (profile = {}) => {
  const nameParts = [profile.firstName, profile.lastName1, profile.lastName2].filter(Boolean);
  const fullName = profile.name || (nameParts.length ? nameParts.join(' ') : '') || profile.employeeName || profile.username || '';
  const documentValue = profile.document
    || profile.username
    || profile.employeeName
    || profile.userId
    || profile.employeeId
    || profile.id
    || '';

  return {
    name: fullName,
    email: profile.email || '',
    phone: profile.phone || '',
    document: documentValue ? String(documentValue) : ''
  };
};

function UserProfile() {
  const user = AuthService.getCurrentUser();
  const [formData, setFormData] = useState(() => ({
    ...DEFAULT_FORM_DATA.USER_PROFILE,
    ...buildProfileFormData(user)
  }));
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(ALERT_TYPES.INFO);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setIsFetching(false);
        return;
      }

      const token = AuthService.getToken();
      if (!token) {
        setIsFetching(false);
        return;
      }

      setIsFetching(true);

      try {
        let profileData = null;

        if (user.loginType === LOGIN_TYPES.EMPLOYEE) {
          const employeeId = user.employeeId || user.id;
          if (employeeId) {
            profileData = await EmployeeService.findById(employeeId, token);
          } else if (user.employeeName || user.username) {
            const response = await EmployeeService.search(
              { employeeName: user.employeeName || user.username },
              token
            );
            profileData = Array.isArray(response) ? response[0] : response?.results?.[0];
          }
        } else {
          const userId = user.userId || user.id;
          if (userId) {
            profileData = await UserService.findById(userId, token);
          } else if (user.username) {
            const response = await UserService.search({ username: user.username }, token);
            profileData = Array.isArray(response) ? response[0] : response?.results?.[0];
          }
        }

        if (profileData) {
          setFormData(prev => ({
            ...prev,
            ...buildProfileFormData(profileData)
          }));
          AuthService.updateStoredUser({ ...profileData, loginType: user.loginType });
        } else {
          setAlertMessage(MESSAGES.USER_NOT_FOUND);
          setAlertType(ALERT_TYPES.WARNING);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setAlertMessage(MESSAGES.ERROR_LOADING_DATA);
        setAlertType(ALERT_TYPES.ERROR);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [user]);

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
            {isFetching && (
              <LoadingSpinner message={MESSAGES.LOADING} />
            )}
            <FormField
              label={MESSAGES.FULL_NAME}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading || isFetching}
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
              disabled={loading || isFetching}
            />

            <FormField
              label={MESSAGES.DOCUMENT}
              type="text"
              name="document"
              value={formData.document}
              onChange={handleChange}
              disabled={loading || isFetching}
            />

            <div className="profile-actions">
              <Button
                type="submit"
                variant={BUTTON_VARIANTS.PRIMARY}
                size="large"
                disabled={loading || isFetching}
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
