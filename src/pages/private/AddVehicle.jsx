import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrivateLayout from '../../components/layout/private/PrivateLayout';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import VehicleService from '../../api/services/VehicleService';
import VehicleCategoryService from '../../api/services/VehicleCategoryService';
import ImageService from '../../api/services/ImageService';
import VehicleFormFields from '../../components/forms/VehicleFormFields';
import ImageUpload from '../../components/forms/ImageUpload';
import { MESSAGES, ROUTES, BUTTON_VARIANTS, ALERT_TYPES, DEFAULT_FORM_DATA } from '../../constants';
import './AddVehicle.css';
import { useEffect } from 'react';

function AddVehicle() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
    status: DEFAULT_FORM_DATA.VEHICLE.status
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await VehicleCategoryService.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

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
        ...formData,
        dailyPrice: parseFloat(formData.dailyPrice),
        mileage: parseInt(formData.mileage, 10),
        year: parseInt(formData.year, 10)
      };

      const newVehicle = await VehicleService.create(vehicleData);
      
      if (imageFile && newVehicle?.id) {
        try {
          await ImageService.upload(imageFile, newVehicle.id);
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
        }
      }

      setAlert({
        type: ALERT_TYPES.SUCCESS,
        message: MESSAGES.VEHICLE_CREATED
      });

      setTimeout(() => {
        navigate(ROUTES.MANAGE_VEHICLES);
      }, 1500);
    } catch (error) {
      console.error('Error adding vehicle:', error);
      setAlert({
        type: ALERT_TYPES.ERROR,
        message: error.message || MESSAGES.ERROR_SAVING
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateLayout>
      <div className="add-vehicle-container">
        <div className="add-vehicle-header">
          <h1>{MESSAGES.ADD_VEHICLE}</h1>
          <p>{MESSAGES.VEHICLE_DETAILS}</p>
        </div>

        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <form onSubmit={handleSubmit} className="add-vehicle-form">
          <VehicleFormFields
            formData={formData}
            onChange={handleInputChange}
            categories={categories}
          />

          <ImageUpload
            imageFile={imageFile}
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
            onRemove={handleRemoveImage}
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
              {loading ? MESSAGES.LOADING : `✓ ${MESSAGES.ADD_VEHICLE}`}
            </Button>
          </div>
        </form>
      </div>
    </PrivateLayout>
  );
}

export default AddVehicle;
