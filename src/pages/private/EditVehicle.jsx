import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PrivateLayout from '../../components/layout/private/PrivateLayout';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import VehicleService from '../../api/services/VehicleService';
import VehicleCategoryService from '../../api/services/VehicleCategoryService';
import ImageService from '../../api/services/ImageService';
import VehicleFormFields from '../../components/forms/VehicleFormFields';
import ImageUpload from '../../components/forms/ImageUpload';
import './EditVehicle.css';

function EditVehicle() {
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    licensePlate: '',
    dailyPrice: '',
    mileage: '0',
    year: new Date().getFullYear().toString(),
    vin: '',
    categoryId: '',
    description: '',
    status: 'available'
  });

  const fetchVehicle = useCallback(async () => {
    try {
      const vehicle = await VehicleService.getById(vehicleId);
      if (vehicle) {
        setFormData({
          brand: vehicle.brand || '',
          model: vehicle.model || '',
          licensePlate: vehicle.licensePlate || '',
          dailyPrice: vehicle.dailyPrice?.toString() || '',
          mileage: vehicle.mileage?.toString() || '0',
          year: vehicle.year?.toString() || new Date().getFullYear().toString(),
          vin: vehicle.vin || '',
          categoryId: vehicle.categoryId || '',
          description: vehicle.description || '',
          status: vehicle.status || 'available'
        });
        
        if (vehicle.imageUrl) {
          setCurrentImage(vehicle.imageUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
  }, [vehicleId]);

  const fetchCategories = async () => {
    try {
      const data = await VehicleCategoryService.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    const initPage = async () => {
      try {
        await Promise.all([
          fetchVehicle(),
          fetchCategories()
        ]);
      } catch (error) {
        console.error('Error initializing page:', error);
        setAlert({
          type: 'error',
          message: 'Error al cargar el vehículo'
        });
      } finally {
        setFetching(false);
      }
    };
    initPage();
  }, [fetchVehicle]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.brand || !formData.model || !formData.licensePlate || !formData.dailyPrice) {
      setAlert({
        type: 'error',
        message: 'Por favor completa los campos obligatorios'
      });
      return;
    }

    setLoading(true);
    try {
      const vehicleData = {
        ...formData,
        dailyPrice: parseFloat(formData.dailyPrice),
        mileage: parseInt(formData.mileage, 10),
        year: parseInt(formData.year, 10)
      };

      await VehicleService.update(vehicleId, vehicleData);
      
      if (imageFile) {
        try {
          await ImageService.upload(imageFile, vehicleId);
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
        }
      }

      setAlert({
        type: 'success',
        message: '✅ Vehículo actualizado correctamente'
      });

      setTimeout(() => {
        navigate('/manage-vehicles');
      }, 1500);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      setAlert({
        type: 'error',
        message: error.message || 'Error al actualizar el vehículo'
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <PrivateLayout>
        <LoadingSpinner />
      </PrivateLayout>
    );
  }

  return (
    <PrivateLayout>
      <div className="edit-vehicle-container">
        <div className="edit-vehicle-header">
          <h1>Editar Vehículo</h1>
          <p>Actualiza la información del vehículo</p>
        </div>

        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <form onSubmit={handleSubmit} className="edit-vehicle-form">
          <VehicleFormFields
            formData={formData}
            onChange={handleInputChange}
            categories={categories}
          />

          {/* Estado del vehículo */}
          <div className="form-section">
            <h3>Estado del Vehículo</h3>
            <FormField
              label="Estado"
              name="status"
              as="select"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="available">Disponible</option>
              <option value="rented">Rentado</option>
              <option value="maintenance">En Mantenimiento</option>
            </FormField>
          </div>

          <ImageUpload
            imageFile={imageFile}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onRemove={handleRemoveImage}
            currentImage={currentImage}
          />

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/manage-vehicles')}
            >
              ← Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              {loading ? 'Guardando...' : '✓ Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </PrivateLayout>
  );
}

export default EditVehicle;
