import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useVehicleSearch from './useVehicleSearch';

const useCatalogPage = () => {
  const location = useLocation();
  const { vehicles, loading, error, searchVehicles } = useVehicleSearch();
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const initialCriteria = useMemo(() => location.state?.criteria ?? null, [location.state]);

  useEffect(() => {
    if (initialCriteria) {
      searchVehicles(initialCriteria).catch(() => {});
    }
  }, [initialCriteria, searchVehicles]);

  const handleSearch = useCallback((criteria) => {
    searchVehicles(criteria).catch(() => {});
  }, [searchVehicles]);

  const handleCloseDetail = useCallback(() => {
    setSelectedVehicleId(null);
  }, []);

  return {
    vehicles,
    loading,
    error,
    initialCriteria,
    selectedVehicleId,
    setSelectedVehicleId,
    handleSearch,
    handleCloseDetail
  };
};

export default useCatalogPage;
