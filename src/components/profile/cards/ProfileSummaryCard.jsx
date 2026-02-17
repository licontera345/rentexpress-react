import { Card } from '../../common/layout/LayoutPrimitives';
import { MESSAGES } from '../../../constants';

function ProfileSummaryCard({
  user,
  roleLabel,
  isEmployee,
  employeeRoleName,
  employeeHeadquartersName
}) {
  return (
    <Card className="personal-space-card personal-space-card--profile profile-card">
      <h3>{MESSAGES.PROFILE_SUMMARY_TITLE}</h3>

      <div className="profile-summary-grid">
        <div className="profile-summary-item">
          <span className="profile-summary-item-label">{MESSAGES.USERNAME}</span>
          <span className="profile-summary-item-value">{user?.username || user?.employeeName || MESSAGES.NOT_AVAILABLE}</span>
        </div>

        <div className="profile-summary-item">
          <span className="profile-summary-item-label">{MESSAGES.EMAIL}</span>
          <span className="profile-summary-item-value">{user?.email || MESSAGES.NOT_AVAILABLE}</span>
        </div>

        <div className="profile-summary-item">
          <span className="profile-summary-item-label">{MESSAGES.ACCOUNT_TYPE}</span>
          <span className="profile-summary-item-value">{roleLabel}</span>
        </div>

        {isEmployee && (
          <>
            <div className="profile-summary-item">
              <span className="profile-summary-item-label">{MESSAGES.EMPLOYEE_POSITION_LABEL}</span>
              <span className="profile-summary-item-value">{employeeRoleName || roleLabel || MESSAGES.NOT_AVAILABLE}</span>
            </div>

            <div className="profile-summary-item">
              <span className="profile-summary-item-label">{MESSAGES.HEADQUARTERS_LABEL}</span>
              <span className="profile-summary-item-value">{employeeHeadquartersName || MESSAGES.NOT_AVAILABLE}</span>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

export default ProfileSummaryCard;
