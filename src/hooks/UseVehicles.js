import { useState } from 'react'
import * as vehicleService from '../api/services/VehicleService'

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(false)

  const search = async (params) => {
    setLoading(true)
    const data = await vehicleService.searchVehicles(params)
    setVehicles(data)
    setLoading(false)
  }

  const remove = async (id) => {
    await vehicleService.deleteVehicle(id)
    setVehicles(prev => prev.filter(v => v.id !== id))
  }

  return { vehicles, loading, search, remove }
}
