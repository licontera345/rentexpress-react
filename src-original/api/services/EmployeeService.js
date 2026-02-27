import Config from '../../config/apiConfig';
import { buildParams, request } from '../axiosClient';

const EmployeeService = {
  findById(id) {
    return request({
      url: Config.EMPLOYEES.BY_ID(id),
      method: 'GET'
    });
  },

  search(criteria = {}) {
    return request({
      url: Config.EMPLOYEES.SEARCH,
      method: 'GET',
      params: buildParams({
        employeeId: criteria.employeeId,
        employeeName: criteria.employeeName,
        roleId: criteria.roleId,
        headquartersId: criteria.headquartersId,
        firstName: criteria.firstName,
        lastName1: criteria.lastName1,
        lastName2: criteria.lastName2,
        email: criteria.email,
        phone: criteria.phone,
        activeStatus: criteria.activeStatus,
        pageNumber: criteria.pageNumber,
        pageSize: criteria.pageSize,
        createdAtFrom: criteria.createdAtFrom,
        createdAtTo: criteria.createdAtTo,
        updatedAtFrom: criteria.updatedAtFrom,
        updatedAtTo: criteria.updatedAtTo
      })
    });
  },

  create(employee) {
    return request({
      url: Config.EMPLOYEES.CREATE,
      method: 'POST',
      data: employee
    });
  },

  update(id, employee) {
    return request({
      url: Config.EMPLOYEES.UPDATE(id),
      method: 'PUT',
      data: employee
    });
  },

  async delete(id) {
    await request({
      url: Config.EMPLOYEES.DELETE(id),
      method: 'DELETE'
    });
    return true;
  },

  activate(id) {
    return request({
      url: Config.EMPLOYEES.ACTIVATE(id),
      method: 'POST'
    });
  }
};

export default EmployeeService;
