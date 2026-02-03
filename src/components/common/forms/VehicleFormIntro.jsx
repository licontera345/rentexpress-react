import { MESSAGES } from '../../../constants';

function VehicleFormIntro({ description }) {
  return (
    <div className="vehicle-create-intro">
      <p className="vehicle-create-description">{description}</p>
      <p className="vehicle-create-required">
        {MESSAGES.REQUIRED_FIELDS_PREFIX} <span className="required">*</span>{' '}
        {MESSAGES.REQUIRED_FIELDS_SUFFIX}
      </p>
    </div>
  );
}

export default VehicleFormIntro;
