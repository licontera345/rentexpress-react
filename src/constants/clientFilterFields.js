import { MESSAGES } from '../constants';

export const buildClientFilterFields = () => [
  {
    name: 'userId',
    label: MESSAGES.USER_ID,
    type: 'number',
    placeholder: MESSAGES.USER_ID
  },
  {
    name: 'username',
    label: MESSAGES.USERNAME,
    type: 'text',
    placeholder: MESSAGES.USERNAME
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
    name: 'email',
    label: MESSAGES.EMAIL,
    type: 'text',
    placeholder: MESSAGES.EMAIL
  },
  {
    name: 'phone',
    label: MESSAGES.PHONE,
    type: 'text',
    placeholder: MESSAGES.PHONE
  },
  {
    name: 'birthDateFrom',
    label: MESSAGES.BIRTH_DATE_FROM,
    type: 'date',
    placeholder: MESSAGES.BIRTH_DATE_FROM
  },
  {
    name: 'birthDateTo',
    label: MESSAGES.BIRTH_DATE_TO,
    type: 'date',
    placeholder: MESSAGES.BIRTH_DATE_TO
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
