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
import { MESSAGES, ROUTES, BUTTON_VARIANTS, ALERT_TYPES, VEHICLE_STATUS } from '../../constants';
import { useAuth } from '../../context/AuthContext';
import './EditVehicle.css';

function EditVehicle() {
  const navigate = useNavigate();
  const { vehicleId } = useParams();
  const { token } = useAuth();
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
    status: VEHICLE_STATUS.AVAILABLE
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
          mileage: vehicle.currentMileage?.toString() || vehicle.mileage?.toString() || '0',
          year: vehicle.manufactureYear?.toString() || vehicle.year?.toString() || new Date().getFullYear().toString(),
          vin: vehicle.vinNumber || vehicle.vin || '',
          categoryId: vehicle.categoryId || '',
          description: vehicle.description || '',
          status: vehicle.activeStatus === false ? VEHICLE_STATUS.INACTIVE : VEHICLE_STATUS.AVAILABLE
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
          type: ALERT_TYPES.ERROR,
          message: MESSAGES.ERROR_LOADING_DATA
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
        type: ALERT_TYPES.ERROR,
        message: MESSAGES.REQUIRED_FIELDS
      });
      return;
    }

    setLoading(true);
    try {
      const vehicleData = {
        brand: formData.brand,
        model: formData.model,
        licensePlate: formData.licensePlate,
        dailyPrice: parseFloat(formData.dailyPrice),
        currentMileage: parseInt(formData.mileage, 10),
        manufactureYear: parseInt(formData.year, 10),
        vinNumber: formData.vin,
        categoryId: formData.categoryId,
        description: formData.description,
        activeStatus: formData.status === VEHICLE_STATUS.AVAILABLE
      };

      await VehicleService.update(vehicleId, vehicleData, token);
      
      if (imageFile) {
        try {
          await ImageService.upload(imageFile, vehicleId);
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
        }
      }

      setAlert({
        type: ALERT_TYPES.SUCCESS,
        message: MESSAGES.VEHICLE_UPDATED
      });

      setTimeout(() => {
        navigate(ROUTES.MANAGE_VEHICLES);
      }, 1500);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      setAlert({
        type: ALERT_TYPES.ERROR,
        message: error.message || MESSAGES.ERROR_UPDATING
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
          <h1>{MESSAGES.EDIT}</h1>
          <p>{MESSAGES.VEHICLE_DETAILS}</p>
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
            <h3>{MESSAGES.STATUS}</h3>
            <FormField
              label={MESSAGES.STATUS}
              name="status"
              as="select"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value={VEHICLE_STATUS.AVAILABLE}>{MESSAGES.AVAILABLE}</option>
              <option value={VEHICLE_STATUS.INACTIVE}>{MESSAGES.NOT_AVAILABLE}</option>
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
              variant={BUTTON_VARIANTS.SECONDARY}
              onClick={() => navigate(ROUTES.MANAGE_VEHICLES)}
            >
              ← {MESSAGES.CANCEL}
            </Button>
            <Button
              type="submit"
              variant={BUTTON_VARIANTS.PRIMARY}
              loading={loading}
            >
              {loading ? MESSAGES.LOADING : `✓ ${MESSAGES.SAVE_CHANGES}`}
            </Button>
          </div>
        </form>
      </div>
    </PrivateLayout>
  );
}

export default EditVehicle;
