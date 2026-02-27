import { useState } from 'react';
import Alert from '../../common/feedback/Alert';
import FormField from '../../common/forms/FormField';
import { FormModalFooter, FormSection } from '../../common/forms/FormPrimitives';
import { ModalHeader } from '../../common/layout/LayoutPrimitives';
import { MESSAGES } from '../../../constants';
import { formatDate } from '../../../utils/form/formatters';

export default function RentalReturnModal({
  isOpen,
  rental,
  onConfirm,
  onClose,
  alert,
  isSubmitting,
}) {
  const [finalKm, setFinalKm] = useState(rental?.initialKm || '');
  const titleId = 'rental-return-title';

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(Number(finalKm) || 0);
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop active"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div className="modal-dialog vehicle-create-modal" onClick={(e) => e.stopPropagation()}>
        <ModalHeader title={MESSAGES.COMPLETE_RETURN_TITLE} titleId={titleId} onClose={onClose} />
        <div className="modal-body">
          <div className="vehicle-create-intro">
            <p className="vehicle-create-description">{MESSAGES.COMPLETE_RETURN_DESCRIPTION}</p>
            <p className="pickup-verification__grace-info">{MESSAGES.GRACE_PERIOD_INFO}</p>
          </div>
          {alert && (
            <Alert type={alert.type} message={alert.message} onClose={alert.onClose} />
          )}
          <form className="vehicle-create-form" onSubmit={handleSubmit}>
            <FormSection title={MESSAGES.RESERVATION_DETAILS}>
              <div className="pickup-verification__details">
                <div className="pickup-verification__detail">
                  <span className="pickup-verification__detail-label">{MESSAGES.RENTAL_REFERENCE || 'Alquiler'}</span>
                  <span className="pickup-verification__detail-value">#{rental?.rentalId}</span>
                </div>
                <div className="pickup-verification__detail">
                  <span className="pickup-verification__detail-label">{MESSAGES.VEHICLE_LABEL || 'Vehículo'}</span>
                  <span className="pickup-verification__detail-value">
                    {rental?.brand} {rental?.model} ({rental?.licensePlate})
                  </span>
                </div>
                <div className="pickup-verification__detail">
                  <span className="pickup-verification__detail-label">{MESSAGES.CUSTOMER_NAME}</span>
                  <span className="pickup-verification__detail-value">
                    {rental?.userFirstName} {rental?.userLastName1}
                  </span>
                </div>
                <div className="pickup-verification__detail">
                  <span className="pickup-verification__detail-label">{MESSAGES.RETURN_DATE}</span>
                  <span className="pickup-verification__detail-value">
                    {formatDate(rental?.endDateEffective, { fallback: MESSAGES.NOT_AVAILABLE_SHORT })}
                  </span>
                </div>
                <div className="pickup-verification__detail">
                  <span className="pickup-verification__detail-label">{MESSAGES.TOTAL_COST}</span>
                  <span className="pickup-verification__detail-value">
                    {rental?.totalCost != null ? `${Number(rental.totalCost).toFixed(2)} €` : MESSAGES.NOT_AVAILABLE_SHORT}
                  </span>
                </div>
              </div>

              <FormField
                label={MESSAGES.FINAL_KM_LABEL}
                name="finalKm"
                type="number"
                min={rental?.initialKm || 0}
                value={finalKm}
                onChange={(e) => setFinalKm(e.target.value)}
                placeholder={MESSAGES.FINAL_KM_PLACEHOLDER}
                required
                disabled={isSubmitting}
              />
            </FormSection>
            <FormModalFooter
              onClose={onClose}
              submitLabel={MESSAGES.CONFIRM_RETURN}
              isDisabled={isSubmitting}
              isSubmitting={isSubmitting}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
