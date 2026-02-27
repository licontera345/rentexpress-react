import { FiCheck, FiSearch, FiUser, FiTruck, FiCalendar, FiMapPin, FiRefreshCw } from 'react-icons/fi';
import PrivateLayout from '../../../components/layout/private/PrivateLayout';
import { Card } from '../../../components/common/layout/LayoutPrimitives';
import SectionHeader from '../../../components/common/layout/SectionHeader';
import Alert from '../../../components/common/feedback/Alert';
import Button from '../../../components/common/actions/Button';
import { BUTTON_VARIANTS, MESSAGES } from '../../../constants';
import { formatDate } from '../../../utils/form/formatters';
import usePickupVerificationPage from '../../../hooks/employee/usePickupVerificationPage';

function PickupVerification() {
  const { state, ui, actions } = usePickupVerificationPage();
  const { reservation, confirmed } = state;

  return (
    <PrivateLayout>
      <section className="personal-space">
        <SectionHeader
          title={MESSAGES.PICKUP_VERIFICATION_TITLE}
          subtitle={MESSAGES.PICKUP_VERIFICATION_SUBTITLE}
        />

        <Card className="personal-space-card">
          <div className="pickup-verification">
            {ui.alert && (
              <Alert
                type={ui.alert.type}
                message={ui.alert.message}
                onClose={() => actions.setAlert(null)}
              />
            )}

            <form className="pickup-verification__form" onSubmit={actions.handleVerifyCode}>
              <div className="pickup-verification__input-group">
                <label htmlFor="pickup-code" className="pickup-verification__label">
                  {MESSAGES.PICKUP_CODE_LABEL}
                </label>
                <div className="pickup-verification__input-row">
                  <input
                    id="pickup-code"
                    type="text"
                    className="pickup-verification__input"
                    value={state.pickupCode}
                    onChange={actions.handleCodeChange}
                    placeholder={MESSAGES.PICKUP_CODE_PLACEHOLDER}
                    maxLength={6}
                    autoComplete="off"
                    autoFocus
                    disabled={confirmed}
                  />
                  <Button
                    type="submit"
                    variant={BUTTON_VARIANTS.PRIMARY}
                    disabled={ui.isVerifying || confirmed || state.pickupCode.length < 4}
                  >
                    <FiSearch aria-hidden />
                    {ui.isVerifying ? MESSAGES.VERIFYING_CODE : MESSAGES.VERIFY_CODE}
                  </Button>
                </div>
              </div>
            </form>

            {reservation && (
              <div className="pickup-verification__result">
                <div className="pickup-verification__section">
                  <h3 className="pickup-verification__section-title">
                    <FiUser aria-hidden />
                    {MESSAGES.CUSTOMER_INFO}
                  </h3>
                  <div className="pickup-verification__details">
                    <div className="pickup-verification__detail">
                      <span className="pickup-verification__detail-label">{MESSAGES.CUSTOMER_NAME}</span>
                      <span className="pickup-verification__detail-value">
                        {reservation.userFirstName} {reservation.userLastName1}
                      </span>
                    </div>
                    <div className="pickup-verification__detail">
                      <span className="pickup-verification__detail-label">{MESSAGES.CUSTOMER_EMAIL}</span>
                      <span className="pickup-verification__detail-value">
                        {reservation.userEmail || MESSAGES.NOT_AVAILABLE_SHORT}
                      </span>
                    </div>
                    <div className="pickup-verification__detail">
                      <span className="pickup-verification__detail-label">{MESSAGES.RESERVATION_REFERENCE}</span>
                      <span className="pickup-verification__detail-value">#{reservation.reservationId}</span>
                    </div>
                  </div>
                </div>

                <div className="pickup-verification__section">
                  <h3 className="pickup-verification__section-title">
                    <FiTruck aria-hidden />
                    {MESSAGES.VEHICLE_INFO}
                  </h3>
                  <div className="pickup-verification__details">
                    <div className="pickup-verification__detail">
                      <span className="pickup-verification__detail-label">{MESSAGES.VEHICLE_LABEL || 'Vehículo'}</span>
                      <span className="pickup-verification__detail-value">
                        {reservation.vehicle?.[0]?.brand} {reservation.vehicle?.[0]?.model}
                        {reservation.vehicle?.[0]?.licensePlate && ` (${reservation.vehicle[0].licensePlate})`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pickup-verification__section">
                  <h3 className="pickup-verification__section-title">
                    <FiCalendar aria-hidden />
                    {MESSAGES.RESERVATION_DETAILS}
                  </h3>
                  <div className="pickup-verification__details">
                    <div className="pickup-verification__detail">
                      <span className="pickup-verification__detail-label">{MESSAGES.PICKUP_DATE}</span>
                      <span className="pickup-verification__detail-value">
                        {formatDate(reservation.startDate, { fallback: MESSAGES.NOT_AVAILABLE_SHORT })}
                      </span>
                    </div>
                    <div className="pickup-verification__detail">
                      <span className="pickup-verification__detail-label">{MESSAGES.RETURN_DATE}</span>
                      <span className="pickup-verification__detail-value">
                        {formatDate(reservation.endDate, { fallback: MESSAGES.NOT_AVAILABLE_SHORT })}
                      </span>
                    </div>
                    <div className="pickup-verification__detail">
                      <span className="pickup-verification__detail-label">
                        <FiMapPin aria-hidden />
                        {MESSAGES.PICKUP_LOCATION}
                      </span>
                      <span className="pickup-verification__detail-value">
                        {reservation.pickupHeadquarters?.[0]?.name || MESSAGES.NOT_AVAILABLE_SHORT}
                      </span>
                    </div>
                    <div className="pickup-verification__detail">
                      <span className="pickup-verification__detail-label">
                        <FiMapPin aria-hidden />
                        {MESSAGES.RETURN_LOCATION}
                      </span>
                      <span className="pickup-verification__detail-value">
                        {reservation.returnHeadquarters?.[0]?.name || MESSAGES.NOT_AVAILABLE_SHORT}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pickup-verification__actions">
                  {!confirmed ? (
                    <Button
                      variant={BUTTON_VARIANTS.SUCCESS}
                      onClick={actions.handleConfirmPickup}
                      disabled={ui.isConfirming}
                      size="large"
                    >
                      <FiCheck aria-hidden />
                      {ui.isConfirming ? MESSAGES.VERIFYING_CODE : MESSAGES.CONFIRM_PICKUP}
                    </Button>
                  ) : (
                    <Button
                      variant={BUTTON_VARIANTS.PRIMARY}
                      onClick={actions.handleReset}
                    >
                      <FiRefreshCw aria-hidden />
                      {MESSAGES.PICKUP_VERIFICATION_TITLE}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </section>
    </PrivateLayout>
  );
}

export default PickupVerification;
