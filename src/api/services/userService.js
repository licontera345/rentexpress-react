import Config from '../../config/apiConfig';
import { buildParams, request } from '../axiosClient';

const UserService = {
  findById(id) {
    return request({
      url: Config.USERS.BY_ID(id),
      method: 'GET'
    });
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
        pageNumber: criteria.pageNumber,
        pageSize: criteria.pageSize,
        createdAtFrom: criteria.createdAtFrom,
        createdAtTo: criteria.createdAtTo,
        updatedAtFrom: criteria.updatedAtFrom,
        updatedAtTo: criteria.updatedAtTo
      })
    });
  },

  createPublic(user) {
    return request({
      url: Config.USERS.CREATE_OPEN,
      method: 'POST',
      data: user
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

  activate(id) {
    return request({
      url: Config.USERS.ACTIVATE(id),
      method: 'POST'
    });
  },

  setup2FA(id) {
    return request({
      url: Config.USERS.SETUP_2FA(id),
      method: 'GET'
    });
  },

  confirm2FA(id, { secret, code }) {
    return request({
      url: Config.USERS.CONFIRM_2FA(id),
      method: 'POST',
      data: { secret, code: (code || '').trim() }
    });
  },

  disable2FA(id, { password }) {
    return request({
      url: Config.USERS.DISABLE_2FA(id),
      method: 'POST',
      data: { password: password || '' }
    });
  }
};

export default UserService;
