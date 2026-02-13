import Config from '../../config/apiConfig';
import { request } from '../axiosClient';

const UserService = {
  update(id, user) {
    return request({
      url: Config.USERS.UPDATE(id),
      method: 'PUT',
      data: user
    });
  }
};

export default UserService;
