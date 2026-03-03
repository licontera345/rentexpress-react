import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';
import PieLabel from './PieLabel';
import { MESSAGES } from '../../constants';

export default function DonutPanel({ title, data = [] }) {
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
