import { MESSAGES } from '../../constants/messages';

function HomeFaqSection() {
  const faqs = [
    {
      question: MESSAGES.HOME_FAQ_1_QUESTION,
      answer: MESSAGES.HOME_FAQ_1_ANSWER,
    },
    {
      question: MESSAGES.HOME_FAQ_2_QUESTION,
      answer: MESSAGES.HOME_FAQ_2_ANSWER,
    },
    {
      question: MESSAGES.HOME_FAQ_3_QUESTION,
      answer: MESSAGES.HOME_FAQ_3_ANSWER,
    },
    {
      question: MESSAGES.HOME_FAQ_4_QUESTION,
      answer: MESSAGES.HOME_FAQ_4_ANSWER,
    },
  ];

  return (
    <section className="home-faq">
      <div className="home-section">
        <div className="home-section-header">
          <h2>{MESSAGES.HOME_FAQ_TITLE}</h2>
          <p>{MESSAGES.HOME_FAQ_SUBTITLE}</p>
        </div>
        <div className="faq-grid">
          {faqs.map((item) => (
            <article className="faq-card" key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeFaqSection;
