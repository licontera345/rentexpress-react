import { useCallback, useMemo, useState } from 'react';
import RecommendationService from '../../api/services/RecommendationService';
import { t } from '../../i18n';

const INITIAL_PREFERENCES = {
  destination: '',
  passengers: '',
  tripDuration: '',
  roadCondition: '',
};

export function useVehicleRecommendation(vehicles) {
  const [preferences, setPreferences] = useState(INITIAL_PREFERENCES);
  const [recommendedIds, setRecommendedIds] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasResult, setHasResult] = useState(false);

  const isComplete = Boolean(
    preferences.destination &&
    preferences.passengers &&
    preferences.tripDuration &&
    preferences.roadCondition
  );

  const setPreference = useCallback((name, value) => {
    setPreferences((prev) => ({ ...prev, [name]: value }));
    setError('');
  }, []);

  const vehicleSummaries = useMemo(() => {
    if (!vehicles?.length) return [];
    return vehicles.map((v) => ({
      vehicleId: v.vehicleId,
      brand: v.brand || '',
      model: v.model || '',
      categoryName:
        v.vehicleCategory?.[0]?.categoryName ||
        v.categoryName ||
        '',
      dailyPrice: v.dailyPrice || 0,
    }));
  }, [vehicles]);

  const submit = useCallback(async () => {
    if (!isComplete) {
      setError(t('REC_ERROR_INCOMPLETE'));
      return;
    }
    if (!vehicleSummaries.length) {
      setError(t('REC_ERROR_NO_VEHICLES'));
      return;
    }

    setLoading(true);
    setError('');
    setRecommendedIds([]);
    setExplanation('');
    setHasResult(false);

    try {
      const result = await RecommendationService.getRecommendations(
        preferences,
        vehicleSummaries
      );
      setRecommendedIds(result.recommendedVehicleIds || []);
      setExplanation(result.explanation || '');
      setHasResult(true);
    } catch (err) {
      setError(err?.message || t('REC_ERROR_GENERIC'));
    } finally {
      setLoading(false);
    }
  }, [isComplete, preferences, vehicleSummaries]);

  const reset = useCallback(() => {
    setPreferences(INITIAL_PREFERENCES);
    setRecommendedIds([]);
    setExplanation('');
    setError('');
    setHasResult(false);
  }, []);

  return {
    preferences,
    setPreference,
    isComplete,
    recommendedIds,
    explanation,
    loading,
    error,
    hasResult,
    submit,
    reset,
  };
}

export default useVehicleRecommendation;
