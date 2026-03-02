import { FiDollarSign, FiCalendar, FiCheckCircle, FiActivity, FiTruck, FiUsers } from 'react-icons/fi';

const KPI_ICONS = {
    revenue: FiDollarSign,
    reservations: FiCalendar,
    completed: FiCheckCircle,
    active: FiActivity,
    fleet: FiTruck,
    clients: FiUsers,
};

export default function KpiCard({ item }) {
    const Icon = KPI_ICONS[item.key] ?? FiActivity;
    return (
        <div className={`stats-kpi-card stats-kpi-${item.accent}`}>
            <div className="stats-kpi-icon-wrap">
                <Icon size={22} />
            </div>
            <div className="stats-kpi-body">
                <span className="stats-kpi-value">{item.value}</span>
                <span className="stats-kpi-label">{item.label}</span>
            </div>
        </div>
    );
}
