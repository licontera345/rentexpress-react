import Config from '../../config/apiConfig';
import { request } from '../axiosClient';

const ConfigService = {
  async getFilterRanges() {
    try {
      const response = await request({
        url: Config.CONFIG.FILTER_RANGES,
        method: 'GET',
      });
      return response?.data ?? response ?? null;
    } catch {
      return null;
    }
  },
};

export default ConfigService;
