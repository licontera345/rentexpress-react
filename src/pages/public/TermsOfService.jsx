import PublicLayout from '../../components/layout/public/PublicLayout';
import { MESSAGES } from '../../constants';

function TermsOfService() {
  return (
    <PublicLayout>
      <article className="privacy-policy terms-of-service">
        <header className="privacy-policy-header">
          <h1>{MESSAGES.TERMS_TITLE}</h1>
          <p className="privacy-policy-updated">{MESSAGES.TERMS_UPDATED}</p>
        </header>

        <p className="privacy-policy-intro">{MESSAGES.TERMS_INTRO}</p>

        <section className="privacy-policy-section">
          <h2>{MESSAGES.TERMS_S1_TITLE}</h2>
          <p>{MESSAGES.TERMS_S1_TEXT}</p>
        </section>

        <section className="privacy-policy-section">
          <h2>{MESSAGES.TERMS_S2_TITLE}</h2>
          <p>{MESSAGES.TERMS_S2_TEXT}</p>
        </section>

        <section className="privacy-policy-section">
          <h2>{MESSAGES.TERMS_S3_TITLE}</h2>
          <p>{MESSAGES.TERMS_S3_TEXT}</p>
        </section>

        <section className="privacy-policy-section privacy-policy-section-contact">
          <h2>{MESSAGES.TERMS_S4_TITLE}</h2>
          <p>{MESSAGES.TERMS_S4_TEXT}</p>
        </section>
      </article>
    </PublicLayout>
  );
}

export default TermsOfService;
