import { MESSAGES } from '../../../constants';

function HomeTipsSection() {
  const tips = [
    {
      title: MESSAGES.HOME_TIP_1_TITLE,
      text: MESSAGES.HOME_TIP_1_TEXT,
    },
    {
      title: MESSAGES.HOME_TIP_2_TITLE,
      text: MESSAGES.HOME_TIP_2_TEXT,
    },
    {
      title: MESSAGES.HOME_TIP_3_TITLE,
      text: MESSAGES.HOME_TIP_3_TEXT,
    },
    {
      title: MESSAGES.HOME_TIP_4_TITLE,
      text: MESSAGES.HOME_TIP_4_TEXT,
    },
  ];

  return (
    <section className="home-tips">
      <div className="home-section">
        <div className="home-section-header">
          <h2>{MESSAGES.HOME_TIPS_TITLE}</h2>
          <p>{MESSAGES.HOME_TIPS_SUBTITLE}</p>
        </div>
        <div className="tips-grid">
          {tips.map((tip) => (
            <article className="tip-card" key={tip.title}>
              <h3>{tip.title}</h3>
              <p>{tip.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeTipsSection;
