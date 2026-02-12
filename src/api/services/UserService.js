import Config from '../../config/apiConfig';
import { buildParams, request } from '../axiosClient';

const UserService = {
  findById(id) {
    return request({
      url: Config.USERS.BY_ID(id),
      method: 'GET'
    });
  },

  create(user) {
    return request({
      url: Config.USERS.CREATE,
      method: 'POST',
      data: user
    });
  },

  update(id, user) {
    return request({
      url: Config.USERS.UPDATE(id),
      method: 'PUT',
      data: user
    });
  },

  async delete(id) {
    await request({
      url: Config.USERS.DELETE(id),
      method: 'DELETE'
    });
    return true;
  },

  search(criteria = {}) {
    return request({
      url: Config.USERS.SEARCH,
      method: 'GET',
      params: buildParams({
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
        createdAtFrom: criteria.createdAtFrom,
        createdAtTo: criteria.createdAtTo,
        updatedAtFrom: criteria.updatedAtFrom,
        updatedAtTo: criteria.updatedAtTo,
        pageNumber: criteria.pageNumber,
        pageSize: criteria.pageSize
      })
    });
  },

  activate(id) {
    return request({
      url: Config.USERS.ACTIVATE(id),
      method: 'PUT'
    });
  }
};

export default UserService;
