import PublicLayout from '../../components/layout/public/PublicLayout';
import { MESSAGES } from '../../constants';

// Página estática con el contenido de la política de privacidad.
function PrivacyPolicy() {
  return (
    <PublicLayout>
      {/* Sección principal de la política */}
      <section className="privacy-policy">
        <header className="privacy-policy-header">
          <h1>{MESSAGES.PRIVACY_POLICY_TITLE}</h1>
          <p className="privacy-policy-updated">{MESSAGES.PRIVACY_POLICY_UPDATED}</p>
        </header>

        {/* Introducción y secciones informativas */}
        <p>{MESSAGES.PRIVACY_POLICY_INTRO}</p>

        <h2>{MESSAGES.PRIVACY_POLICY_SECTION_DATA_TITLE}</h2>
        <ul>
          <li>{MESSAGES.PRIVACY_POLICY_SECTION_DATA_ITEM_1}</li>
          <li>{MESSAGES.PRIVACY_POLICY_SECTION_DATA_ITEM_2}</li>
          <li>{MESSAGES.PRIVACY_POLICY_SECTION_DATA_ITEM_3}</li>
        </ul>

        <h2>{MESSAGES.PRIVACY_POLICY_SECTION_USE_TITLE}</h2>
        <ul>
          <li>{MESSAGES.PRIVACY_POLICY_SECTION_USE_ITEM_1}</li>
          <li>{MESSAGES.PRIVACY_POLICY_SECTION_USE_ITEM_2}</li>
          <li>{MESSAGES.PRIVACY_POLICY_SECTION_USE_ITEM_3}</li>
        </ul>

        <h2>{MESSAGES.PRIVACY_POLICY_SECTION_RIGHTS_TITLE}</h2>
        <p>{MESSAGES.PRIVACY_POLICY_SECTION_RIGHTS_TEXT}</p>

        <h2>{MESSAGES.PRIVACY_POLICY_SECTION_CONTACT_TITLE}</h2>
        <p>{MESSAGES.PRIVACY_POLICY_SECTION_CONTACT_TEXT}</p>
      </section>
    </PublicLayout>
  );
}

export default PrivacyPolicy;
