import clientAxios from '../HttpClient'
import Config from '../../config/Config'

export const loginUser = (credentials) =>
  clientAxios.post(Config.AUTH.LOGIN_USER, credentials).then(r => r.data)

export const loginEmployee = (credentials) =>
  clientAxios.post(Config.AUTH.LOGIN_EMPLOYEE, credentials).then(r => r.data)
