import api from '../../config/api.js';
import { request, buildParams } from '../axiosClient.js';

const searchParams = (criteria) => buildParams({
  userId: criteria.userId,
  roleId: criteria.roleId,
  addressId: criteria.addressId,
  username: criteria.username,
  firstName: criteria.firstName,
  lastName1: criteria.lastName1,
  lastName2: criteria.lastName2,
  email: criteria.email,
  phone: criteria.phone,
  birthDateFrom: criteria.birthDateFrom,
  birthDateTo: criteria.birthDateTo,
  activeStatus: criteria.activeStatus,
  pageNumber: criteria.pageNumber,
  pageSize: criteria.pageSize,
  createdAtFrom: criteria.createdAtFrom,
  createdAtTo: criteria.createdAtTo,
  updatedAtFrom: criteria.updatedAtFrom,
  updatedAtTo: criteria.updatedAtTo,
});

export const userService = {
  findById(id) {
    return request({ url: api.users.byId(id), method: 'GET' });
  },
  search(criteria = {}) {
    return request({ url: api.users.search, method: 'GET', params: searchParams(criteria) });
  },
  createPublic(data) {
    return request({ url: api.users.createOpen, method: 'POST', data });
  },
  update(id, data) {
    return request({ url: api.users.byId(id), method: 'PUT', data });
  },
  async delete(id) {
    await request({ url: api.users.byId(id), method: 'DELETE' });
  },
  activate(id) {
    return request({ url: api.users.activate(id), method: 'POST' });
  },
};

export default userService;
