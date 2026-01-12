import clientAxios from '../ClientAxios'
import Config from '../../config/Config'

export const searchVehicles = (params) => {
  return clientAxios
    .post(Config.VEHICLES.SEARCH, params)
    .then(res => res.data)
}

export const getVehicleById = (id) => {
  return clientAxios
    .get(Config.VEHICLES.BY_ID(id))
    .then(res => res.data)
}

export const createVehicle = (data) => {
  return clientAxios
    .post(Config.VEHICLES.CREATE, data)
    .then(res => res.data)
}

export const updateVehicle = (id, data) => {
  return clientAxios
    .put(Config.VEHICLES.UPDATE(id), data)
    .then(res => res.data)
}

export const deleteVehicle = (id) => {
  return clientAxios
    .delete(Config.VEHICLES.DELETE(id))
    .then(res => res.data)
}
