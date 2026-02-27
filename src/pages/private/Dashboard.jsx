import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  FiDollarSign, FiCalendar, FiCheckCircle, FiActivity,
  FiTruck, FiUsers, FiRefreshCw,
} from 'react-icons/fi';

import PrivateLayout from '../../components/layout/private/PrivateLayout';
import { Card } from '../../components/common/layout/LayoutPrimitives';
import LoadingSpinner from '../../components/common/feedback/LoadingSpinner';
import CustomSelect from '../../components/common/forms/CustomSelect';
import { MESSAGES } from '../../constants';
import { usePrivateDashboardPage } from '../../hooks/private/usePrivatePages';
import { useStatisticsPage } from '../../hooks/private/useStatisticsPage';


const KPI_ICONS = {
  revenue: FiDollarSign,
  reservations: FiCalendar,
  completed: FiCheckCircle,
  active: FiActivity,
  fleet: FiTruck,
  clients: FiUsers,
};

function KpiCard({ item }) {
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

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="stats-chart-tooltip">
      <p className="stats-chart-tooltip-label">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{Number(p.value).toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
}

function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function RevenueChart({ data, selectedYear, yearOptions, onYearChange }) {
  return (
    <section className="stats-panel stats-panel-wide">
      <div className="stats-panel-header">
        <h2>{MESSAGES.STATS_SECTION_REVENUE_CHART}</h2>
        <CustomSelect
          id="stats-year-select"
          value={String(selectedYear)}
          onChange={(e) => onYearChange(Number(e.target.value))}
          options={yearOptions.map((y) => ({ value: String(y), label: String(y) }))}
          variant="stats"
          aria-label={MESSAGES.STATS_YEAR_LABEL}
          className="stats-year-select"
        />
      </div>
      {data.every((d) => d.revenue === 0) ? (
        <p className="stats-no-data">{MESSAGES.STATS_NO_DATA}</p>
      ) : (
        <div className="stats-chart-container">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-muted)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-muted)' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" name={MESSAGES.STATS_HQ_REVENUE} fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="rentals" name={MESSAGES.STATS_COMPLETED_RENTALS} fill="var(--color-primary-light)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

function DonutPanel({ title, data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (!data.length || total === 0) {
    return (
      <section className="stats-panel">
        <h2>{title}</h2>
        <p className="stats-no-data">{MESSAGES.STATS_NO_DATA}</p>
      </section>
    );
  }
  return (
    <section className="stats-panel">
      <h2>{title}</h2>
      <div className="stats-chart-container stats-donut-wrap">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={95}
              paddingAngle={3}
              labelLine={false}
              label={PieLabel}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 13 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="stats-donut-center">
          <span className="stats-donut-total">{total}</span>
        </div>
      </div>
    </section>
  );
}

function HqTable({ data }) {
  if (!data.length) {
    return (
      <section className="stats-panel stats-panel-wide">
        <h2>{MESSAGES.STATS_SECTION_HQ}</h2>
        <p className="stats-no-data">{MESSAGES.STATS_NO_DATA}</p>
      </section>
    );
  }
  return (
    <section className="stats-panel stats-panel-wide">
      <h2>{MESSAGES.STATS_SECTION_HQ}</h2>
      <div className="stats-table-wrap">
        <table className="stats-table">
          <thead>
            <tr>
              <th>{MESSAGES.STATS_HQ_NAME}</th>
              <th>{MESSAGES.STATS_HQ_RESERVATIONS}</th>
              <th>{MESSAGES.STATS_HQ_RENTALS}</th>
              <th>{MESSAGES.STATS_HQ_REVENUE}</th>
              <th>{MESSAGES.STATS_HQ_VEHICLES}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((hq) => (
              <tr key={hq.headquartersId}>
                <td className="stats-hq-name">{hq.headquartersName}</td>
                <td>{hq.reservationCount ?? 0}</td>
                <td>{hq.rentalCount ?? 0}</td>
                <td className="stats-hq-revenue">{Number(hq.totalRevenue ?? 0).toLocaleString()} {MESSAGES.STATS_CURRENCY}</td>
                <td>{hq.vehiclesAtHeadquarters ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ── Employee dashboard (full statistics) ──────────────────────────── */

function EmployeeDashboard({ displayName }) {
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

/* ── Main Dashboard (role-based) ───────────────────────────────────── */

function Dashboard() {
  const { state } = usePrivateDashboardPage();

  return (
    <PrivateLayout>
      {state.isEmployee ? (
        <EmployeeDashboard displayName={state.displayName} />
      ) : (
        <section className="personal-space">
          <header className="personal-space-header">
            <div>
              <p className="personal-space-greeting">{MESSAGES.WELCOME_BACK}, {state.displayName}</p>
              <h1>{state.title}</h1>
              <p className="personal-space-subtitle">{state.subtitle}</p>
            </div>
          </header>

          <section>
            <h2>{MESSAGES.DASHBOARD_QUICK_ACTIONS}</h2>
            <div className="dashboard-actions-grid">
              {state.quickActions.map((action) => (
                <Card className="personal-space-card" key={action.route}>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                  <Link className="btn btn-primary btn-small personal-space-card-link" to={action.route}>
                    {action.cta}
                  </Link>
                </Card>
              ))}
            </div>
          </section>

          <p className="personal-space-hint">{MESSAGES.DASHBOARD_MENU_HINT}</p>
        </section>
      )}
    </PrivateLayout>
  );
}

export default Dashboard;
