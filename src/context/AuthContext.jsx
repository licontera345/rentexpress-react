import { createContext, useState } from 'react'
import * as authService from '../api/services/authService'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const loginUser = async (credentials) => {
    const data = await authService.loginUser(credentials)
    setUser(data)
  }

  const loginEmployee = async (credentials) => {
    const data = await authService.loginEmployee(credentials)
    setUser(data)
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, loginUser, loginEmployee, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
