import Config from '../../config/apiConfig';
import { request } from '../axiosClient';

const EmployeeService = {
  update(id, employee) {
    return request({
      url: Config.EMPLOYEES.UPDATE(id),
      method: 'PUT',
      data: employee
    });
  }
};

export default EmployeeService;
