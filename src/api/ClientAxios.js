import axios from 'axios'
import Config from '../config/Config'

const clientAxios = axios.create({
  baseURL: Config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default clientAxios
