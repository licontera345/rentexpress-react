import { useCallback, useEffect, useMemo, useState } from 'react';
import ReservationService from '../../api/services/ReservationService';
import RentalService from '../../api/services/RentalService';
import VehicleService from '../../api/services/VehicleService';
import { MESSAGES, ROUTES, PAGINATION } from '../../constants';
import { getResultsList } from '../../utils/api/apiResponseUtils';
import { getReservationStatusCanonical } from '../../utils/reservation/reservationUtils';
import { resolveUserId } from '../../utils/ui/uiUtils';
import { useAuth } from '../core/useAuth';

const UPCOMING_DAYS = 7;
const UPCOMING_LIST_SIZE = 5;
const RECOMMENDED_VEHICLES_SIZE = 4;

export function useClientDashboardPage() {
  const { user } = useAuth();
  const userId = resolveUserId(user);
  const displayName = user?.firstName || user?.username || MESSAGES.USERNAME;

  const [reservations, setReservations] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [recommendedVehicles, setRecommendedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    if (!userId) {
      setReservations([]);
      setRentals([]);
      setRecommendedVehicles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [resRes, rentRes, vehiclesRes] = await Promise.all([
        ReservationService.search({ userId, pageSize: PAGINATION.MAX_PAGE_SIZE }),
        RentalService.search({ userId, pageSize: PAGINATION.MAX_PAGE_SIZE }),
        VehicleService.search({
          pageNumber: 1,
          pageSize: RECOMMENDED_VEHICLES_SIZE,
          vehicleStatusId: 1,
          activeStatus: true,
        }),
      ]);
      setReservations(getResultsList(resRes));
      setRentals(getResultsList(rentRes));
      setRecommendedVehicles(getResultsList(vehiclesRes));
    } catch (err) {
      setReservations([]);
      setRentals([]);
      setRecommendedVehicles([]);
      setError(err?.message ?? MESSAGES.ERROR_LOADING_DATA);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const quickActions = useMemo(
    () => [
      {
        title: MESSAGES.DASHBOARD_ACTION_NEW_RESERVATION,
        description: MESSAGES.DASHBOARD_ACTION_NEW_RESERVATION_DESC,
        route: ROUTES.RESERVATION_CREATE,
        cta: MESSAGES.DASHBOARD_ACTION_START,
        icon: 'car',
      },
      {
        title: MESSAGES.DASHBOARD_ACTION_MY_RESERVATIONS,
        description: MESSAGES.DASHBOARD_ACTION_MY_RESERVATIONS_DESC,
        route: ROUTES.MY_RESERVATIONS,
        cta: MESSAGES.DASHBOARD_VIEW_RESERVATIONS,
        icon: 'calendar',
      },
      {
        title: MESSAGES.DASHBOARD_ACTION_MY_RENTALS,
        description: MESSAGES.DASHBOARD_ACTION_MY_RENTALS_DESC,
        route: ROUTES.MY_RENTALS,
        cta: MESSAGES.DASHBOARD_VIEW_RENTALS,
        icon: 'key',
      },
    ],
    []
  );

  const { reservationCounts, rentalCounts, upcomingReservations } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const in7Days = new Date(now);
    in7Days.setDate(in7Days.getDate() + UPCOMING_DAYS);

    let activeRes = 0;
    let pendingRes = 0;
    let completedRes = 0;
    const upcoming = [];

    reservations.forEach((r) => {
      const start = r?.startDate ? new Date(r.startDate) : null;
      const end = r?.endDate ? new Date(r.endDate) : null;
      const canonical = getReservationStatusCanonical(
        r?.reservationStatus?.[0]?.statusName ?? r?.reservationStatus?.statusName ?? ''
      );
      if (canonical === 'canceled') return;
      if (canonical === 'pending') pendingRes += 1;
      else if (canonical === 'confirmed' || canonical === 'active') {
        if (start && start >= now && start <= in7Days) activeRes += 1;
        if (end && end >= now) {
          upcoming.push({ ...r, _sort: start?.getTime() ?? 0 });
        }
      }
      if (end && end < now) completedRes += 1;
    });

    upcoming.sort((a, b) => a._sort - b._sort);
    const upcomingList = upcoming.slice(0, UPCOMING_LIST_SIZE).map(({ _sort, ...r }) => r);

    let inProgressRent = 0;
    let completedRent = 0;
    let cancelledRent = 0;
    const nowTime = now.getTime();

    rentals.forEach((r) => {
      const end = r?.endDateEffective ? new Date(r.endDateEffective) : null;
      const statusName = (r?.rentalStatus?.statusName ?? r?.rentalStatus?.[0]?.statusName ?? '').toLowerCase();
      if (statusName.includes('cancel') || statusName.includes('annul')) {
        cancelledRent += 1;
        return;
      }
      if (end && end.getTime() >= nowTime) inProgressRent += 1;
      else completedRent += 1;
    });

    return {
      reservationCounts: {
        active: activeRes,
        pending: pendingRes,
        completed: completedRes,
      },
      rentalCounts: {
        inProgress: inProgressRent,
        completed: completedRent,
        cancelled: cancelledRent,
      },
      upcomingReservations: upcomingList,
    };
  }, [reservations, rentals]);

  return {
    state: {
      displayName,
      quickActions,
      reservationCounts,
      rentalCounts,
      upcomingReservations,
      recommendedVehicles,
    },
    ui: { loading, error },
    actions: { reload: loadData },
  };
}
