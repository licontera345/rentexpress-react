import { MESSAGES } from '../constants';
import { getHeadquartersOptionLabel } from './headquartersLabels';

const buildRoleOptions = (roles) => (
  roles.map((role) => ({
    value: role.roleId,
    label: role.roleName
  }))
);

const buildHeadquartersOptions = (headquarters) => (
  headquarters.map((hq) => ({
    value: hq.id,
    label: getHeadquartersOptionLabel(hq)
  }))
);

export const buildEmployeeFilterFields = ({
  roles = [],
  headquarters = []
} = {}) => [
  {
    name: 'employeeId',
    label: MESSAGES.EMPLOYEE_ID,
    type: 'number',
    placeholder: MESSAGES.EMPLOYEE_ID
  },
  {
    name: 'employeeName',
    label: MESSAGES.EMPLOYEE_NAME,
    type: 'text',
    placeholder: MESSAGES.EMPLOYEE_NAME_PLACEHOLDER
  },
  {
    name: 'firstName',
    label: MESSAGES.FIRST_NAME,
    type: 'text',
    placeholder: MESSAGES.FIRST_NAME
  },
  {
    name: 'lastName1',
    label: MESSAGES.LAST_NAME1,
    type: 'text',
    placeholder: MESSAGES.LAST_NAME1
  },
  {
    name: 'lastName2',
    label: MESSAGES.LAST_NAME2,
    type: 'text',
    placeholder: MESSAGES.LAST_NAME2
  },
  {
    name: 'email',
    label: MESSAGES.EMAIL,
    type: 'text',
    placeholder: MESSAGES.EMAIL
  },
  {
    name: 'roleId',
    label: MESSAGES.EMPLOYEE_POSITION_LABEL,
    type: 'select',
    placeholder: MESSAGES.ALL_ROLES,
    options: buildRoleOptions(roles)
  },
  {
    name: 'headquartersId',
    label: MESSAGES.HEADQUARTERS_LABEL,
    type: 'select',
    placeholder: MESSAGES.SELECT_LOCATION,
    options: buildHeadquartersOptions(headquarters)
  },
  {
    name: 'activeStatus',
    label: MESSAGES.ACTIVE_STATUS,
    type: 'select',
    placeholder: MESSAGES.ALL,
    options: [
      { value: '1', label: MESSAGES.ACTIVE },
      { value: '0', label: MESSAGES.INACTIVE }
    ]
  }
];
