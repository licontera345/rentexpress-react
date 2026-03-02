import { FiRefreshCw } from 'react-icons/fi';
import LoadingSpinner from '../common/feedback/LoadingSpinner';
import KpiCard from './KpiCard';
import RevenueChart from './RevenueChart';
import DonutPanel from './DonutPanel';
import HqTable from './HqTable';
import { MESSAGES } from '../../constants';
import { useStatisticsPage } from '../../hooks/private/useStatisticsPage';

export default function EmployeeDashboard({ displayName }) {
    const { state, actions } = useStatisticsPage();

    if (state.loading) {
        return <LoadingSpinner message={MESSAGES.STATS_LOADING} />;
    }

    if (state.error) {
        return (
            <div className="stats-error-wrap">
                <p className="stats-error-msg">{state.error}</p>
                <button className="btn btn-primary btn-small" type="button" onClick={actions.retry}>
                    <FiRefreshCw size={16} />
                    {MESSAGES.STATS_RETRY}
                </button>
            </div>
        );
    }

    return (
        <section className="stats-page">
            <header className="stats-header">
                <div>
                    <p className="personal-space-greeting">{MESSAGES.WELCOME_BACK}, {displayName}</p>
                    <h1>{MESSAGES.STATS_TITLE}</h1>
                    <p className="stats-subtitle">{MESSAGES.DASHBOARD_SUBTITLE_EMPLOYEE}</p>
                </div>
            </header>

            <section className="stats-kpi-grid" aria-label={MESSAGES.STATS_SECTION_KPI}>
                {state.kpis.map((item) => (
                    <KpiCard key={item.key} item={item} />
                ))}
            </section>

            <RevenueChart
                data={state.revenueChartData}
                selectedYear={state.selectedYear}
                yearOptions={state.yearOptions}
                onYearChange={actions.setSelectedYear}
            />

            <div className="stats-two-col">
                <DonutPanel title={MESSAGES.STATS_SECTION_RESERVATIONS} data={state.reservationChartData} />
                <DonutPanel title={MESSAGES.STATS_SECTION_FLEET} data={state.fleetChartData} />
            </div>

            <HqTable data={state.hqStats} />
        </section>
    );
}
