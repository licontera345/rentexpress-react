import PublicLayout from '../../components/layout/public/PublicLayout';
import { MESSAGES } from '../../constants';

// Página de Política de Privacidad con estructura profesional (RGPD / empresas).
function PrivacyPolicy() {
  return (
    <PublicLayout>
      <article className="privacy-policy">
        <header className="privacy-policy-header">
          <h1>{MESSAGES.PRIVACY_POLICY_TITLE}</h1>
          <p className="privacy-policy-updated">{MESSAGES.PRIVACY_POLICY_UPDATED}</p>
        </header>

        <p className="privacy-policy-intro">{MESSAGES.PRIVACY_POLICY_INTRO}</p>

        <section className="privacy-policy-section">
          <h2>{MESSAGES.PRIVACY_POLICY_S1_TITLE}</h2>
          <p>{MESSAGES.PRIVACY_POLICY_S1_TEXT}</p>
        </section>

        <section className="privacy-policy-section">
          <h2>{MESSAGES.PRIVACY_POLICY_S2_TITLE}</h2>
          <p>{MESSAGES.PRIVACY_POLICY_S2_INTRO}</p>
          <ul>
            <li>{MESSAGES.PRIVACY_POLICY_S2_IDENTITY}</li>
            <li>{MESSAGES.PRIVACY_POLICY_S2_CONTACT}</li>
            <li>{MESSAGES.PRIVACY_POLICY_S2_ACCOUNT}</li>
            <li>{MESSAGES.PRIVACY_POLICY_S2_RESERVATIONS}</li>
            <li>{MESSAGES.PRIVACY_POLICY_S2_USAGE}</li>
            <li>{MESSAGES.PRIVACY_POLICY_S2_TECHNICAL}</li>
          </ul>
        </section>

        <section className="privacy-policy-section">
          <h2>{MESSAGES.PRIVACY_POLICY_S3_TITLE}</h2>
          <p>{MESSAGES.PRIVACY_POLICY_S3_INTRO}</p>
          <ul>
            <li>{MESSAGES.PRIVACY_POLICY_S3_CONTRACT}</li>
            <li>{MESSAGES.PRIVACY_POLICY_S3_LEGAL}</li>
            <li>{MESSAGES.PRIVACY_POLICY_S3_LEGITIMATE}</li>
            <li>{MESSAGES.PRIVACY_POLICY_S3_CONSENT}</li>
          </ul>
        </section>

        <section className="privacy-policy-section">
          <h2>{MESSAGES.PRIVACY_POLICY_S4_TITLE}</h2>
          <p>{MESSAGES.PRIVACY_POLICY_S4_TEXT}</p>
        </section>

        <section className="privacy-policy-section">
          <h2>{MESSAGES.PRIVACY_POLICY_S5_TITLE}</h2>
          <p>{MESSAGES.PRIVACY_POLICY_S5_TEXT}</p>
        </section>

        <section className="privacy-policy-section">
          <h2>{MESSAGES.PRIVACY_POLICY_S6_TITLE}</h2>
          <p>{MESSAGES.PRIVACY_POLICY_S6_TEXT}</p>
        </section>

        <section className="privacy-policy-section">
          <h2>{MESSAGES.PRIVACY_POLICY_S7_TITLE}</h2>
          <p>{MESSAGES.PRIVACY_POLICY_S7_INTRO}</p>
          <ul>
            <li>{MESSAGES.PRIVACY_POLICY_S7_ACCESS}</li>
            <li>{MESSAGES.PRIVACY_POLICY_S7_RECTIFICATION}</li>
            <li>{MESSAGES.PRIVACY_POLICY_S7_ERASURE}</li>
            <li>{MESSAGES.PRIVACY_POLICY_S7_RESTRICTION}</li>
            <li>{MESSAGES.PRIVACY_POLICY_S7_PORTABILITY}</li>
            <li>{MESSAGES.PRIVACY_POLICY_S7_OBJECTION}</li>
            <li>{MESSAGES.PRIVACY_POLICY_S7_WITHDRAW}</li>
            <li>{MESSAGES.PRIVACY_POLICY_S7_COMPLAINT}</li>
          </ul>
          <p>{MESSAGES.PRIVACY_POLICY_S7_HOW}</p>
        </section>

        <section className="privacy-policy-section">
          <h2>{MESSAGES.PRIVACY_POLICY_S8_TITLE}</h2>
          <p>{MESSAGES.PRIVACY_POLICY_S8_TEXT}</p>
        </section>

        <section className="privacy-policy-section">
          <h2>{MESSAGES.PRIVACY_POLICY_S9_TITLE}</h2>
          <p>{MESSAGES.PRIVACY_POLICY_S9_TEXT}</p>
        </section>

        <section className="privacy-policy-section">
          <h2>{MESSAGES.PRIVACY_POLICY_S10_TITLE}</h2>
          <p>{MESSAGES.PRIVACY_POLICY_S10_TEXT}</p>
        </section>

        <section className="privacy-policy-section">
          <h2>{MESSAGES.PRIVACY_POLICY_S11_TITLE}</h2>
          <p>{MESSAGES.PRIVACY_POLICY_S11_TEXT}</p>
        </section>

        <section className="privacy-policy-section privacy-policy-section-contact">
          <h2>{MESSAGES.PRIVACY_POLICY_S12_TITLE}</h2>
          <p>{MESSAGES.PRIVACY_POLICY_S12_TEXT}</p>
        </section>
      </article>
    </PublicLayout>
  );
}

export default PrivacyPolicy;
