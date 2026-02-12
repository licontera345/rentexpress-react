import Config from '../../config/apiConfig';
import { request } from '../axiosClient';

const RoleService = {
  getAll() {
    return request({
      url: Config.ROLES.ALL,
      method: 'GET'
    });
  }
};

export default RoleService;
