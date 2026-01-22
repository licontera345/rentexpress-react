import Config from '../../config/apiConfig';
import { buildAuthHeaders, request } from '../axiosClient';

const UserService = {
  update(id, user, token) {
    return request({
      url: Config.USERS.UPDATE(id),
      method: 'PUT',
      data: user,
      headers: buildAuthHeaders(token)
    });
  }
};

export default UserService;
