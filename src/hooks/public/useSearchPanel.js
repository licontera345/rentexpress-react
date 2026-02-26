import { useEffect, useState, useCallback, useId, useMemo } from 'react';
import useHeadquarters from '../location/useHeadquarters';
import { DEFAULT_ACTIVE_STATUS, PAGINATION } from '../../constants';
import { getHeadquartersOptionLabel } from '../../constants';
import { buildClassName } from '../../utils/ui/uiUtils';

const DEFAULT_SEARCH_TIME = '10:00';
const DEFAULT_VARIANT = 'default';

const initialFormData = {
  pickupHeadquartersId: '',
  returnHeadquartersId: '',
  pickupDate: '',
  pickupTime: DEFAULT_SEARCH_TIME,
  returnDate: '',
  returnTime: DEFAULT_SEARCH_TIME,
};

function useSearchPanel(initialCriteria, onSearch, variant = DEFAULT_VARIANT, className = '') {
  const { headquarters, loading: hqLoading } = useHeadquarters();
  const idPrefix = useId();
  const [formData, setFormData] = useState(initialFormData);

  // Sincroniza el formulario con los criterios iniciales
  useEffect(() => {
    if (!initialCriteria) return;
    queueMicrotask(() => {
      setFormData((prev) => ({
        pickupHeadquartersId: initialCriteria.currentHeadquartersId ?? prev.pickupHeadquartersId,
        returnHeadquartersId: initialCriteria.returnHeadquartersId ?? prev.returnHeadquartersId,
        pickupDate: initialCriteria.pickupDate ?? prev.pickupDate,
        pickupTime: initialCriteria.pickupTime ?? prev.pickupTime,
        returnDate: initialCriteria.returnDate ?? prev.returnDate,
        returnTime: initialCriteria.returnTime ?? prev.returnTime,
      }));
    });
  }, [initialCriteria]);

  // Manejador de cambios en el formulario
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Manejador de búsqueda
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault();
      onSearch?.({
        currentHeadquartersId: formData.pickupHeadquartersId,
        returnHeadquartersId: formData.returnHeadquartersId,
        pickupDate: formData.pickupDate,
        pickupTime: formData.pickupTime,
        returnDate: formData.returnDate,
        returnTime: formData.returnTime,
        activeStatus: DEFAULT_ACTIVE_STATUS,
        pageNumber: PAGINATION.DEFAULT_PAGE,
        pageSize: PAGINATION.SEARCH_PAGE_SIZE,
      });
    },
    [formData, onSearch]
  );

  // Clases CSS para el panel y el formulario
  const panelClassName = buildClassName(
    'search-panel',
    variant !== DEFAULT_VARIANT ? `search-panel--${variant}` : '',
    className
  );
  const formClassName = buildClassName(
    'search-form',
    variant !== DEFAULT_VARIANT ? `search-form--${variant}` : ''
  );

  // Opciones de sedes para el select
  const headquartersOptions = useMemo(
    () => (headquarters || []).map((hq) => ({ id: hq.id, label: getHeadquartersOptionLabel(hq) })),
    [headquarters]
  );

  // Estado y callbacks para el panel
  return {
    formData,
    headquartersOptions,
    hqLoading,
    idPrefix,
    handleChange,
    handleSearch,
    panelClassName,
    formClassName,
  };
}

export default useSearchPanel;
export { DEFAULT_VARIANT };
