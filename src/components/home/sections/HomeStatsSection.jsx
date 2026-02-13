import { HOME_STATS_VALUES, MESSAGES } from '../../../constants';

// Componente HomeStatsSection que define la interfaz y organiza la lógica de esta vista.

function HomeStatsSection() {
  const stats = [
    { value: HOME_STATS_VALUES.COUNTRIES, label: MESSAGES.HOME_STAT_COUNTRIES },
    { value: HOME_STATS_VALUES.LOCATIONS, label: MESSAGES.HOME_STAT_LOCATIONS },
    { value: HOME_STATS_VALUES.PARTNERS, label: MESSAGES.HOME_STAT_PARTNERS },
    { value: HOME_STATS_VALUES.LANGUAGES, label: MESSAGES.HOME_STAT_LANGUAGES },
  ];

  return (
    <section className="home-stats">
      <div className="home-section stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HomeStatsSection;
