import clientAxios from '../ClientAxios'
import Config from '../../config/Config'

export const searchReservations = (params) =>
  clientAxios.post(Config.RESERVATIONS.SEARCH, params).then(r => r.data)

export const createReservation = (data) =>
  clientAxios.post(Config.RESERVATIONS.CREATE, data).then(r => r.data)

export const updateReservation = (id, data) =>
  clientAxios.put(Config.RESERVATIONS.UPDATE(id), data).then(r => r.data)

export const deleteReservation = (id) =>
  clientAxios.delete(Config.RESERVATIONS.DELETE(id))
