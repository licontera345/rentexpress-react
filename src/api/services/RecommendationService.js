import Config from '../../config/apiConfig';
import { request } from '../axiosClient';

const RecommendationService = {
  getRecommendations(preferences, vehicles) {
    return request({
      url: Config.RECOMMENDATIONS.CREATE,
      method: 'POST',
      data: { ...preferences, vehicles },
    });
  },
};

export default RecommendationService;
