export default function PieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} className="stats-pie-label">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
}
