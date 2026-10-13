import { createContext, useContext, useState, useEffect } from 'react'
import { api, getToken, setToken, getCurrentUser, setCurrentUser } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser())
  const [token, setTokenState] = useState(getToken())
  const [loading, setLoading] = useState(true)

  // Verify token on mount if present
  useEffect(() => {
    let active = true
    const storedToken = getToken()

    if (storedToken) {
      // 2.5-second safety timer so user is never locked indefinitely in loading screen
      const safetyTimer = setTimeout(() => {
        if (active) setLoading(false)
      }, 2500)

      api.getMe()
        .then((res) => {
          if (active && res?.user) {
            setUser(res.user)
            setCurrentUser(res.user)
          }
        })
        .catch(() => {
          // If token verification fails and it's not our local dev fallback token
          if (!storedToken.startsWith('mock-admin-token')) {
            if (active) {
              setUser(null)
              setCurrentUser(null)
              setToken('')
              setTokenState('')
            }
          }
        })
        .finally(() => {
          clearTimeout(safetyTimer)
          if (active) setLoading(false)
        })

      return () => {
        active = false
        clearTimeout(safetyTimer)
      }
    } else {
      setLoading(false)
    }

    return () => { active = false }
  }, [])

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase()

    try {
      // Try live server API
      const res = await api.login(cleanEmail, password)
      if (res?.token && res?.user) {
        setToken(res.token)
        setCurrentUser(res.user)
        setTokenState(res.token)
        setUser(res.user)
        return { success: true, user: res.user }
      }
    } catch (err) {
      // If server is not running or network fails, provide offline fallback for default seeded admin
      if (
        (cleanEmail === 'admin@diupress.local' || cleanEmail === 'admin@diupress.edu.bd') &&
        password === 'ChangeThisBeforeProduction123!'
      ) {
        const mockUser = {
          id: 'admin-local-1',
          name: 'DIU Press Administrator',
          email: cleanEmail,
          role: 'admin',
          designation: 'Lead Administrator'
        }
        const mockToken = `mock-admin-token-${Date.now()}`
        setToken(mockToken)
        setCurrentUser(mockUser)
        setTokenState(mockToken)
        setUser(mockUser)
        return { success: true, user: mockUser, isLocalFallback: true }
      }

      // Re-throw with server message if available
      throw err
    }
  }

  const logout = () => {
    setToken('')
    setCurrentUser(null)
    setTokenState('')
    setUser(null)
  }

  const updateProfile = async (updates) => {
    let updatedUser = {
      ...(user || {}),
      ...(updates.name ? { name: updates.name.trim() } : {}),
      ...(updates.designation !== undefined ? { designation: updates.designation.trim() } : {}),
      ...(updates.avatar !== undefined ? { avatar: updates.avatar } : {})
    }

    const storedToken = getToken()
    if (storedToken && !storedToken.startsWith('mock-admin-token')) {
      try {
        const res = await api.updateProfile(updates)
        if (res?.user) {
          updatedUser = res.user
        }
      } catch (err) {
        throw err
      }
    } else {
      // Mock / offline fallback validation
      if (updates.newPassword) {
        if (!updates.currentPassword) {
          throw new Error('Current password is required')
        }
        if (updates.newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters long')
        }
      }
    }

    setUser(updatedUser)
    setCurrentUser(updatedUser)
    return { success: true, user: updatedUser }
  }

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    loading,
    login,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
