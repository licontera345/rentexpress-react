import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CustomSelect from '../common/forms/CustomSelect';
import CustomTooltip from './CustomTooltip';
import { MESSAGES } from '../../constants';

export default function RevenueChart({ data, selectedYear, yearOptions, onYearChange }) {
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
