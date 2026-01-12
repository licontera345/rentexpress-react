import { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import * as headquartersService from '../../api/services/HeadquartersService';
import * as categoryService from '../../api/services/CategoryService';

const SearchPanel = ({ onSearch }) => {
  const [headquarters, setHeadquarters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickupHeadquarters: '',
    returnHeadquarters: '',
    pickupDate: '',
    pickupTime: '10:00',
    returnDate: '',
    returnTime: '10:00',
    category: ''
  });
  const [pickupDetails, setPickupDetails] = useState(null);
  const [returnDetails, setReturnDetails] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (formData.pickupHeadquarters) {
      loadHeadquarterDetails(formData.pickupHeadquarters, setPickupDetails);
    } else {
      setPickupDetails(null);
    }
  }, [formData.pickupHeadquarters]);

  useEffect(() => {
    if (formData.returnHeadquarters) {
      loadHeadquarterDetails(formData.returnHeadquarters, setReturnDetails);
    } else {
      setReturnDetails(null);
    }
  }, [formData.returnHeadquarters]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [hqData, catData] = await Promise.all([
        headquartersService.getAllHeadquarters(),
        categoryService.getAllCategories('es')
      ]);
      setHeadquarters(hqData || []);
      setCategories(catData || []);
    } catch (error) {
      console.error('Error loading search data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHeadquarterDetails = async (id, setter) => {
    try {
      const hq = headquarters.find(h => h.id === parseInt(id));
      if (hq) {
        setter(hq);
      }
    } catch (error) {
      console.error('Error loading headquarter details:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.pickupHeadquarters) {
      alert('Por favor selecciona un lugar de recogida');
      return;
    }

    if (!formData.returnHeadquarters) {
      alert('Por favor selecciona un lugar de devolución');
      return;
    }

    if (!formData.pickupDate || !formData.returnDate) {
      alert('Por favor selecciona las fechas de recogida y devolución');
      return;
    }

    const pickupDateTime = new Date(`${formData.pickupDate}T${formData.pickupTime}`);
    const returnDateTime = new Date(`${formData.returnDate}T${formData.returnTime}`);

    if (returnDateTime <= pickupDateTime) {
      alert('La fecha de devolución debe ser posterior a la fecha de recogida');
      return;
    }

    onSearch({
      pickupHeadquartersId: formData.pickupHeadquarters,
      returnHeadquartersId: formData.returnHeadquarters,
      pickupDate: formData.pickupDate,
      pickupTime: formData.pickupTime,
      returnDate: formData.returnDate,
      returnTime: formData.returnTime,
      categoryId: formData.category
    });
  };

  const hqOptions = headquarters.map(hq => ({
    value: hq.id.toString(),
    label: hq.name
  }));

  const categoryOptions = categories.map(cat => ({
    value: cat.id.toString(),
    label: cat.name
  }));

  if (loading) {
    return (
      <section id="search-panel" className="search-panel">
        <p>Cargando opciones de búsqueda...</p>
      </section>
    );
  }

  return (
    <section id="search-panel" className="search-panel">
      <div className="search-container">
        <h2 className="search-title">Busca tu vehículo</h2>
        
        <div className="search-form-wrapper">
          <div className="search-fields">
            <div className="search-field-wrapper">
              <label className="search-field-label">Lugar de recogida *</label>
              <select
                id="pickup-headquarters"
                name="pickupHeadquarters"
                value={formData.pickupHeadquarters}
                onChange={handleChange}
                className="search-select"
                required
              >
                <option value="">Seleccionar</option>
                {hqOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {pickupDetails && (
                <div id="pickup-hq-details" className="hq-details">
                  <strong>{pickupDetails.name}</strong>
                  <br />
                  <span className="hq-address">
                    {pickupDetails.address || 'Dirección no disponible'}
                  </span>
                </div>
              )}
            </div>

            <div className="search-field-wrapper">
              <label className="search-field-label">Lugar de devolución *</label>
              <select
                id="return-headquarters"
                name="returnHeadquarters"
                value={formData.returnHeadquarters}
                onChange={handleChange}
                className="search-select"
                required
              >
                <option value="">Seleccionar</option>
                {hqOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {returnDetails && (
                <div id="return-hq-details" className="hq-details">
                  <strong>{returnDetails.name}</strong>
                  <br />
                  <span className="hq-address">
                    {returnDetails.address || 'Dirección no disponible'}
                  </span>
                </div>
              )}
            </div>

            <div className="search-field-wrapper">
              <label className="search-field-label">Fecha de recogida *</label>
              <input
                type="date"
                id="pickup-date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                className="search-input"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="search-field-wrapper small">
              <label className="search-field-label">Hora</label>
              <input
                type="time"
                id="pickup-time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                className="search-input"
              />
            </div>

            <div className="search-field-wrapper">
              <label className="search-field-label">Fecha de devolución *</label>
              <input
                type="date"
                id="return-date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                className="search-input"
                required
                min={formData.pickupDate || new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="search-field-wrapper small">
              <label className="search-field-label">Hora</label>
              <input
                type="time"
                id="return-time"
                name="returnTime"
                value={formData.returnTime}
                onChange={handleChange}
                className="search-input"
              />
            </div>

            {categories.length > 0 && (
              <div className="search-field-wrapper">
                <label className="search-field-label">Categoría (opcional)</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="search-select"
                >
                  <option value="">Todas las categorías</option>
                  {categoryOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="search-field-wrapper button">
              <button
                id="search-vehicles-btn"
                onClick={handleSubmit}
                className="btn-search"
                type="button"
              >
                🔍 BUSCAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchPanel;