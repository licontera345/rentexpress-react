import Config from '../../config/Config';
import httpClient from '../httpClient';

export const getAllHeadquarters = () => 
  httpClient.get(Config.HEADQUARTERS.ALL);

export const getHeadquarterById = (id) => 
  httpClient.get(Config.HEADQUARTERS.BY_ID(id));