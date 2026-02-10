import { MESSAGES } from '../../../constants';
import { FaCalendarCheck, FaCarSide, FaCreditCard, FaMapMarkedAlt } from 'react-icons/fa';

// Componente HomeTipsSection que define la interfaz y organiza la lógica de esta vista.

function HomeTipsSection() {
  const tips = [
    {
      title: MESSAGES.HOME_TIP_1_TITLE,
      text: MESSAGES.HOME_TIP_1_TEXT,
      icon: FaCalendarCheck,
    },
    {
      title: MESSAGES.HOME_TIP_2_TITLE,
      text: MESSAGES.HOME_TIP_2_TEXT,
      icon: FaMapMarkedAlt,
    },
    {
      title: MESSAGES.HOME_TIP_3_TITLE,
      text: MESSAGES.HOME_TIP_3_TEXT,
      icon: FaCreditCard,
    },
    {
      title: MESSAGES.HOME_TIP_4_TITLE,
      text: MESSAGES.HOME_TIP_4_TEXT,
      icon: FaCarSide,
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
          {tips.map((tip) => {
            const TipIcon = tip.icon;

            return (
              <article className="tip-card" key={tip.title}>
                <span className="tip-card-icon" aria-hidden="true">
                  <TipIcon />
                </span>
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HomeTipsSection;
