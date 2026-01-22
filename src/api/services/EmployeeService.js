import Config from '../../config/apiConfig';
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
