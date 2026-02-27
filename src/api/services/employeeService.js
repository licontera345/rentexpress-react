import api from '../../config/api.js';
import { request, buildParams } from '../axiosClient.js';

const searchParams = (criteria) => buildParams({
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
  updatedAtTo: criteria.updatedAtTo,
});

export const employeeService = {
  findById(id) {
    return request({ url: api.employees.byId(id), method: 'GET' });
  },
  search(criteria = {}) {
    return request({ url: api.employees.search, method: 'GET', params: searchParams(criteria) });
  },
  create(data) {
    return request({ url: api.employees.create, method: 'POST', data });
  },
  update(id, data) {
    return request({ url: api.employees.update(id), method: 'PUT', data });
  },
  async delete(id) {
    await request({ url: api.employees.delete(id), method: 'DELETE' });
  },
  activate(id) {
    return request({ url: api.employees.activate(id), method: 'POST' });
  },
};

export default employeeService;
