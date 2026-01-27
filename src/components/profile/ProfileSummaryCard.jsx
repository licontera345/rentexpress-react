import Card from '../common/layout/Card';
import { MESSAGES } from '../../constants';

function ProfileSummaryCard({
  user,
  roleLabel,
  isEmployee,
  employeeRoleName,
  employeeHeadquartersName
}) {
  return (
    <Card className="personal-space-card personal-space-card--profile">
      <h3>{MESSAGES.PROFILE_SUMMARY_TITLE}</h3>
      <p>{MESSAGES.PROFILE_SUMMARY_DESC}</p>
      <div className="personal-space-profile-info">
        <span>{MESSAGES.USERNAME}: <strong>{user?.username || user?.employeeName || MESSAGES.NOT_AVAILABLE}</strong></span>
        <span>{MESSAGES.ACCOUNT_TYPE}: <strong>{roleLabel}</strong></span>
        {isEmployee && (
          <>
            <span>{MESSAGES.EMPLOYEE_POSITION_LABEL}: <strong>{employeeRoleName || MESSAGES.NOT_AVAILABLE}</strong></span>
            <span>{MESSAGES.HEADQUARTERS_LABEL}: <strong>{employeeHeadquartersName || MESSAGES.NOT_AVAILABLE}</strong></span>
          </>
        )}
      </div>
    </Card>
  );
}

export default ProfileSummaryCard;
