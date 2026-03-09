import { resolveUserId } from '../../utils/ui/uiUtils';
import useProfileForm from '../profile/useProfileForm';
import {
  EMPLOYEE_PROFILE_TRIM_FIELDS,
  getInitialFormData,
  getBaselineData,
  checkDirty,
  validate,
  submit,
} from '../../utils/employee/employeeProfileFormHelpers';

const useEmployeeProfilePage = () => {
  return useProfileForm({
    profileType: 'employee',
    entityType: 'employee',
    getEntityId: (user) => user?.employeeId ?? resolveUserId(user),
    getInitialFormData,
    getBaselineData,
    trimFields: EMPLOYEE_PROFILE_TRIM_FIELDS,
    checkDirty,
    validate,
    submit,
    useAddress: false,
  });
};

export default useEmployeeProfilePage;
