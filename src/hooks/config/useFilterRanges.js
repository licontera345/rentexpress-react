import { useEffect, useState } from 'react';
import ConfigService from '../../api/services/ConfigService';

export default function useFilterRanges() {
  const [filterRanges, setFilterRanges] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    ConfigService.getFilterRanges()
      .then((data) => {
        if (!cancelled) setFilterRanges(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return { filterRanges, loading };
}
