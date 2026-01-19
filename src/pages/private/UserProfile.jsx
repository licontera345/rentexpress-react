import { useState } from 'react';
import PrivateLayout from '../../components/layout/private/PrivateLayout';
import AuthService from '../../api/services/AuthService';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
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
  const [alertType, setAlertType] = useState('info');

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
      
      setAlertMessage('✅ Perfil actualizado correctamente');
      setAlertType('success');
    } catch (error) {
      setAlertMessage('❌ Error al actualizar perfil: ' + error.message);
      setAlertType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateLayout>
      <div className="user-profile-container">
        <div className="profile-card">
          <h1>Mi Perfil</h1>
          
          {alertMessage && (
            <Alert
              type={alertType}
              message={alertMessage}
              onClose={() => setAlertMessage(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <FormField
              label="Nombre Completo"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <FormField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
            />

            <FormField
              label="Teléfono"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <FormField
              label="Documento"
              type="text"
              name="document"
              value={formData.document}
              onChange={handleChange}
            />

            <div className="profile-actions">
              <Button
                type="submit"
                variant="primary"
                size="large"
                disabled={loading}
              >
                {loading ? '⏳ Guardando...' : '💾 Guardar Cambios'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="large"
                onClick={() => window.history.back()}
              >
                ← Atrás
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PrivateLayout>
  );
}

export default UserProfile;