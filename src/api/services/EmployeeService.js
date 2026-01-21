import Config from '../../config/Config';
import { buildAuthHeaders, request } from '../axiosClient';

const EmployeeService = {
  update(id, employee, token) {
    return request({
      url: Config.EMPLOYEES.UPDATE(id),
      method: 'PUT',
      data: employee,
      headers: buildAuthHeaders(token)
    });
  }
};

export default EmployeeService;
