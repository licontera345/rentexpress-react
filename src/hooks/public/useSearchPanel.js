import { useEffect, useState, useCallback, useId, useMemo } from 'react';
import useHeadquarters from '../location/useHeadquarters';
import { DEFAULT_ACTIVE_STATUS, PAGINATION } from '../../constants';
import { getHeadquartersOptionLabel } from '../../constants';
import { buildClassName } from '../../utils/uiUtils';

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

/**
 * Hook con la lógica del panel de búsqueda: sedes, formulario y criterios.
 * @param {object|null} initialCriteria - Criterios iniciales (opcional)
 * @param {function} onSearch - Callback al enviar búsqueda
 * @param {string} [variant='default'] - Variante para clases CSS
 * @param {string} [className=''] - Clase adicional del contenedor
 */
function useSearchPanel(initialCriteria, onSearch, variant = DEFAULT_VARIANT, className = '') {
  const { headquarters, loading: hqLoading } = useHeadquarters();
  const idPrefix = useId();
  const [formData, setFormData] = useState(initialFormData);

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

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

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

  const panelClassName = buildClassName(
    'search-panel',
    variant !== DEFAULT_VARIANT ? `search-panel--${variant}` : '',
    className
  );
  const formClassName = buildClassName(
    'search-form',
    variant !== DEFAULT_VARIANT ? `search-form--${variant}` : ''
  );

  const headquartersOptions = useMemo(
    () => (headquarters || []).map((hq) => ({ id: hq.id, label: getHeadquartersOptionLabel(hq) })),
    [headquarters]
  );

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
