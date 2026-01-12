import Config from '../../config/Config';
import httpClient from '../httpClient';

export const getAllCategories = (isoCode = 'es') => 
  httpClient.get(Config.CATEGORIES.ALL(isoCode));

export const getCategoryById = (id, isoCode = 'es') => 
  httpClient.get(Config.CATEGORIES.BY_ID(id, isoCode));