"use client"

import { useState, useEffect, useCallback } from "react"
import type { User } from "../types"
import { authAPI } from "../lib/api"
import { AuthStorage } from "../lib/storage"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = AuthStorage.getToken()
    const savedUser = AuthStorage.getUser()

    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(savedUser)
    }

    setLoading(false)
  }, [])

  const register = useCallback(
    async (data: {
      email: string
      password: string
      firstName: string
      lastName: string
      country: string
    }) => {
      setLoading(true)
      setError(null)
      try {
        const response = await authAPI.register(data)
        return response
      } catch (err: any) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.login(email, password)
      const { token: newToken, user: newUser } = response

      AuthStorage.setToken(newToken)
      AuthStorage.setUser(newUser)

      setToken(newToken)
      setUser(newUser)

      return response
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const verifyEmail = useCallback(async (userId: string, token: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authAPI.verifyEmail(userId, token)
      const { token: newToken, user: newUser } = response

      AuthStorage.setToken(newToken)
      AuthStorage.setUser(newUser)

      setToken(newToken)
      setUser(newUser)

      return response
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    AuthStorage.clear()
    setToken(null)
    setUser(null)
  }, [])

  return {
    user,
    token,
    loading,
    error,
    register,
    login,
    verifyEmail,
    logout,
    isAuthenticated: !!token,
  }
}
