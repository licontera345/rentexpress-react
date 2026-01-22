import { MESSAGES } from '../../constants';

function HomeStatsSection() {
  const stats = [
    { value: '164', label: MESSAGES.HOME_STAT_COUNTRIES },
    { value: '50 000+', label: MESSAGES.HOME_STAT_LOCATIONS },
    { value: '1000+', label: MESSAGES.HOME_STAT_PARTNERS },
    { value: '33', label: MESSAGES.HOME_STAT_LANGUAGES },
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
