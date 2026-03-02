export default function CustomTooltip({ active, payload, label }) {
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
