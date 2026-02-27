import { useCallback, useEffect, useMemo, useState } from 'react';
import StatisticsService from '../../api/services/StatisticsService';
import { MESSAGES } from '../../constants';
import { startAsyncLoad } from '../_internal/orchestratorUtils';

const CURRENT_YEAR = new Date().getFullYear();

const MONTH_KEYS = [
  'STATS_MONTH_1', 'STATS_MONTH_2', 'STATS_MONTH_3', 'STATS_MONTH_4',
  'STATS_MONTH_5', 'STATS_MONTH_6', 'STATS_MONTH_7', 'STATS_MONTH_8',
  'STATS_MONTH_9', 'STATS_MONTH_10', 'STATS_MONTH_11', 'STATS_MONTH_12',
];

function getMonthLabel(monthIndex) {
  return MESSAGES[MONTH_KEYS[monthIndex - 1]] ?? `M${monthIndex}`;
}

const RESERVATION_COLORS = {
  Pending: 'var(--color-warning-text)',
  Confirmed: 'var(--color-success-text)',
  Canceled: 'var(--color-danger-text)',
};

const FLEET_COLORS = {
  Available: 'var(--color-success-text)',
  Maintenance: 'var(--color-warning-text)',
  Rented: 'var(--color-primary)',
};

function resolveColor(map, name) {
  for (const [key, color] of Object.entries(map)) {
    if (name?.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return 'var(--color-muted)';
}

export function useStatisticsPage() {
  const [dashboard, setDashboard] = useState(null);
  const [revenueMonthly, setRevenueMonthly] = useState([]);
  const [reservationStats, setReservationStats] = useState([]);
  const [fleetStats, setFleetStats] = useState([]);
  const [hqStats, setHqStats] = useState([]);

  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async (year) => {
    startAsyncLoad(setLoading, setError);
    try {
      const [dashRes, monthlyRes, resStats, fleet, hq] = await Promise.all([
        StatisticsService.getDashboardStats(),
        StatisticsService.getRevenueByMonth(year),
        StatisticsService.getReservationStats(),
        StatisticsService.getVehicleFleetStats(),
        StatisticsService.getHeadquartersStats(),
      ]);

      setDashboard(dashRes);
      setRevenueMonthly(Array.isArray(monthlyRes) ? monthlyRes : []);
      setReservationStats(Array.isArray(resStats) ? resStats : []);
      setFleetStats(Array.isArray(fleet) ? fleet : []);
      setHqStats(Array.isArray(hq) ? hq : []);
    } catch (err) {
      setError(err.message || MESSAGES.STATS_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll(selectedYear);
  }, [fetchAll, selectedYear]);

  const revenueChartData = useMemo(() => {
    const map = new Map(revenueMonthly.map((r) => [r.month, r]));
    return Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      const entry = map.get(m);
      return {
        month: getMonthLabel(m),
        revenue: entry?.totalRevenue ?? 0,
        rentals: entry?.rentalCount ?? 0,
      };
    });
  }, [revenueMonthly]);

  const reservationChartData = useMemo(
    () =>
      reservationStats.map((r) => ({
        name: r.statusName,
        value: Number(r.count ?? 0),
        fill: resolveColor(RESERVATION_COLORS, r.statusName),
      })),
    [reservationStats],
  );

  const fleetChartData = useMemo(
    () =>
      fleetStats.map((f) => ({
        name: f.statusName,
        value: Number(f.count ?? 0),
        fill: resolveColor(FLEET_COLORS, f.statusName),
      })),
    [fleetStats],
  );

  const kpis = useMemo(() => {
    if (!dashboard) return [];
    return [
      { key: 'revenue', label: MESSAGES.STATS_TOTAL_REVENUE, value: `${Number(dashboard.totalRevenue ?? 0).toLocaleString()} ${MESSAGES.STATS_CURRENCY}`, accent: 'primary' },
      { key: 'reservations', label: MESSAGES.STATS_TOTAL_RESERVATIONS, value: dashboard.totalReservations ?? 0, accent: 'info' },
      { key: 'completed', label: MESSAGES.STATS_COMPLETED_RENTALS, value: dashboard.completedRentals ?? 0, accent: 'success' },
      { key: 'active', label: MESSAGES.STATS_ACTIVE_RENTALS, value: dashboard.activeRentals ?? 0, accent: 'warning' },
      { key: 'fleet', label: MESSAGES.STATS_TOTAL_VEHICLES, value: dashboard.totalVehicles ?? 0, accent: 'neutral' },
      { key: 'clients', label: MESSAGES.STATS_TOTAL_CLIENTS, value: dashboard.totalClients ?? 0, accent: 'accent' },
    ];
  }, [dashboard]);

  const yearOptions = useMemo(() => {
    const years = [];
    for (let y = CURRENT_YEAR; y >= CURRENT_YEAR - 4; y--) years.push(y);
    return years;
  }, []);

  return {
    state: { loading, error, dashboard, kpis, selectedYear, yearOptions, revenueChartData, reservationChartData, fleetChartData, hqStats },
    actions: {
      setSelectedYear,
      retry: () => fetchAll(selectedYear),
    },
  };
}
