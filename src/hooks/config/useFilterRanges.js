import useAsyncData from '../core/useAsyncData';
import ConfigService from '../../api/services/configService';

export default function useFilterRanges() {
  const { data: filterRanges, loading } = useAsyncData(
    () => ConfigService.getFilterRanges(),
    [],
    { errorMessage: 'Error al cargar rangos de filtro' }
  );
  return { filterRanges: filterRanges ?? null, loading };
}
