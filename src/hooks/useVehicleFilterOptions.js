import { useEffect } from 'react';
import { MESSAGES } from '../constants';
import useVehicleCategories from './useVehicleCategories';
import useVehicleStatuses from './useVehicleStatuses';

/**
 * Hook de opciones de filtros para vehículos.
 * Centraliza la carga de categorías y estados con manejo de errores.
 */
const useVehicleFilterOptions = (isoCode) => {
  const {
    categories,
    categoryMap,
    loading: categoriesLoading,
    error: categoriesError
  } = useVehicleCategories(isoCode);
  const {
    statuses,
    loading: statusesLoading,
    error: statusesError
  } = useVehicleStatuses(isoCode);

  useEffect(() => {
    if (categoriesError) {
      console.error(MESSAGES.ERROR_LOADING_DATA, categoriesError);
    }
  }, [categoriesError]);

  useEffect(() => {
    if (statusesError) {
      console.error(MESSAGES.ERROR_LOADING_DATA, statusesError);
    }
  }, [statusesError]);

  return {
    categories,
    categoryMap,
    statuses,
    loading: categoriesLoading || statusesLoading,
    error: categoriesError || statusesError
  };
};

export default useVehicleFilterOptions;
