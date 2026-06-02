import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }

    api.get('/auth/me')
      .then(res => setUser(res.data.user))
      .catch(() => {
     
        localStorage.removeItem('token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password })
    
    if (res.data.token) {
      localStorage.setItem('token', res.data.token)
    }
    
    setUser(res.data.user)
    return res.data
  }

  async function register(username, email, password) {
    const res = await api.post('/auth/register', { username, email, password })
    
    if (res.data.token) {
      localStorage.setItem('token', res.data.token)
    }
    
    setUser(res.data.user)
    return res.data
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.error("Backend logout failed:", err)
    } finally {
   
      localStorage.removeItem('token')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}