import { createContext, useContext } from 'react'

export type AuthData = {
  claims?: Record<string, any> | null
  hasSession: boolean
  isLoading: boolean
  isLoggedIn: boolean
}

export const AuthContext = createContext<AuthData>({
  claims: undefined,
  hasSession: false,
  isLoading: true,
  isLoggedIn: false,
})

export const useAuthContext = () => useContext(AuthContext)