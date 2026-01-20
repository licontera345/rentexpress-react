import PublicLayout from '../../components/layout/public/PublicLayout';
import VehicleCard from '../../components/common/card/VehicleCard';
import Button from '../../components/common/actions/Button';
import FormField from '../../components/common/forms/FormField';
import LoadingSpinner from '../../components/common/feedback/LoadingSpinner';
import usePublicVehicleSearch from '../../hooks/usePublicVehicleSearch';
import { MESSAGES, BUTTON_VARIANTS } from '../../constants';

function SearchVehicles() {
  const {
    vehicles,
    loading,
    categories,
    filters,
    applyFilters,
    handleFilterChange,
    loadInitialData
  } = usePublicVehicleSearch();

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
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </option>
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
            {vehicles.map((vehicle) => (
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
