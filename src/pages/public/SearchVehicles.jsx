import { useState, useEffect } from 'react';
import PublicLayout from '../../components/layout/public/PublicLayout';
import VehicleCard from '../../components/common/card/VehicleCard';
import Button from '../../components/common/actions/Button';
import FormField from '../../components/common/forms/FormField';
import LoadingSpinner from '../../components/common/feedback/LoadingSpinner';
import VehicleService from '../../api/services/VehicleService';
import VehicleCategoryService from '../../api/services/VehicleCategoryService';
import { MESSAGES, PAGINATION, FILTER_DEFAULTS, BUTTON_VARIANTS } from '../../constants';
import './SearchVehicles.css';

function SearchVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(FILTER_DEFAULTS);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      setFilters(FILTER_DEFAULTS);
      const [vehiclesData, categoriesData] = await Promise.all([
        VehicleService.search({
          activeStatus: true,
          pageNumber: PAGINATION.DEFAULT_PAGE,
          pageSize: PAGINATION.DEFAULT_PAGE_SIZE
        }),
        VehicleCategoryService.getAll()
      ]);
      setVehicles(vehiclesData.results || vehiclesData || []);
      setCategories(categoriesData || []);
    } catch (e) {
      console.error(MESSAGES.ERROR_LOADING_DATA, e);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      brand: name === 'brand' ? value : prev.brand,
      minPrice: name === 'minPrice' ? value : prev.minPrice,
      maxPrice: name === 'maxPrice' ? value : prev.maxPrice,
      categoryId: name === 'categoryId' ? value : prev.categoryId,
      provinceId: name === 'provinceId' ? value : prev.provinceId,
      cityId: name === 'cityId' ? value : prev.cityId
    }));
  };

  const applyFilters = async () => {
    setLoading(true);
    try {
      const results = await VehicleService.search({
        brand: filters.brand?.trim() || undefined,
        categoryId: filters.categoryId ? Number(filters.categoryId) : undefined,
        dailyPriceMin: filters.minPrice ? Number(filters.minPrice) : undefined,
        dailyPriceMax: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        activeStatus: true,
        pageNumber: PAGINATION.DEFAULT_PAGE,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE
      });
      setVehicles(results.results || results || []);
    } catch (e) {
      console.error(MESSAGES.ERROR_LOADING_DATA, e);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="search-vehicles-container">
        <div className="search-header">
          <h1>{MESSAGES.SEARCH_VEHICLES}</h1>
          <p>{MESSAGES.FIND_PERFECT_VEHICLE}</p>
        </div>

        <div className="search-filters">
          <div className="filter-grid">
            <FormField
              label={MESSAGES.BRAND}
              name="brand"
              value={filters.brand}
              onChange={handleFilterChange}
              placeholder={MESSAGES.PLACEHOLDER_BRAND}
            />
            <FormField
              label={MESSAGES.CATEGORY}
              name="categoryId"
              as="select"
              value={filters.categoryId}
              onChange={handleFilterChange}
            >
              <option value="">{MESSAGES.ALL_CATEGORIES}</option>
              {categories.map(cat => (
                <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
              ))}
            </FormField>
            <FormField
              label={MESSAGES.MIN_PRICE}
              name="minPrice"
              type="number"
              step="0.01"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
            <FormField
              label={MESSAGES.MAX_PRICE}
              name="maxPrice"
              type="number"
              step="0.01"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-actions">
            <Button variant={BUTTON_VARIANTS.PRIMARY} size="large" onClick={applyFilters}>
              {MESSAGES.APPLY_FILTERS}
            </Button>
            <Button variant={BUTTON_VARIANTS.SECONDARY} size="large" onClick={loadInitialData}>
              {MESSAGES.CLEAR}
            </Button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : vehicles && vehicles.length > 0 ? (
          <div className="vehicles-grid">
            {vehicles.map(vehicle => (
              <VehicleCard key={vehicle.vehicleId} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>{MESSAGES.NO_VEHICLES_FOUND}</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

export default SearchVehicles;
