"use client"

import { useState, useEffect, useCallback } from "react"
import type { User } from "@/app/types"
import { authAPI } from "@/app/lib/api-client"
import { AuthStorage } from "@/app/lib/auth-storage"

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
      console.log("[v0] Restored auth from storage")
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
        console.log("[v0] Registering user:", data.email)
        const response = await authAPI.register(data)
        console.log("[v0] Registration response:", response)
        return response
      } catch (err: any) {
        console.error("[v0] Registration error:", err.message)
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
      console.log("[v0] Logging in user:", email)
      const response = await authAPI.login(email, password)
      const { token: newToken, user: newUser } = response

      AuthStorage.setToken(newToken)
      AuthStorage.setUser(newUser)

      setToken(newToken)
      setUser(newUser)

      console.log("[v0] Login successful")
      return response
    } catch (err: any) {
      console.error("[v0] Login error:", err.message)
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
      console.log("[v0] Verifying email for user:", userId)
      const response = await authAPI.verifyEmail(userId, token)
      const { token: newToken, user: newUser } = response

      AuthStorage.setToken(newToken)
      AuthStorage.setUser(newUser)

      setToken(newToken)
      setUser(newUser)

      console.log("[v0] Email verified")
      return response
    } catch (err: any) {
      console.error("[v0] Email verification error:", err.message)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    console.log("[v0] Logging out user")
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
