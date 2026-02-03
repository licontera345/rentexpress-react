import { MESSAGES } from '../../../constants';

function HomeRequirementsSection() {
  const requirements = [
    {
      title: MESSAGES.HOME_REQUIREMENT_1_TITLE,
      text: MESSAGES.HOME_REQUIREMENT_1_TEXT,
    },
    {
      title: MESSAGES.HOME_REQUIREMENT_2_TITLE,
      text: MESSAGES.HOME_REQUIREMENT_2_TEXT,
    },
    {
      title: MESSAGES.HOME_REQUIREMENT_3_TITLE,
      text: MESSAGES.HOME_REQUIREMENT_3_TEXT,
    },
    {
      title: MESSAGES.HOME_REQUIREMENT_4_TITLE,
      text: MESSAGES.HOME_REQUIREMENT_4_TEXT,
    },
  ];

  return (
    <section className="home-requirements">
      <div className="home-section">
        <div className="home-section-header">
          <h2>{MESSAGES.HOME_REQUIREMENTS_TITLE}</h2>
          <p>{MESSAGES.HOME_REQUIREMENTS_SUBTITLE}</p>
        </div>
        <div className="requirements-grid">
          {requirements.map((item) => (
            <article className="requirement-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeRequirementsSection;
