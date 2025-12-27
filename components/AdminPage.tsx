"use client"

import { useState, useEffect } from "react"
import AdminLogin from "./AdminLogin"
import AdminDashboard from "./AdminDashboard"

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<"admin" | "superadmin" | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken")
    const storedRole = localStorage.getItem("adminRole")
    if (storedToken && storedRole) {
      setToken(storedToken)
      setRole(storedRole as "admin" | "superadmin")
    }
    setLoading(false)
  }, [])

  const handleLoginSuccess = (data: { token: string; role: "admin" | "superadmin" }) => {
    localStorage.setItem("adminToken", data.token)
    localStorage.setItem("adminRole", data.role)
    setToken(data.token)
    setRole(data.role)
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminRole")
    setToken(null)
    setRole(null)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-black text-white">Loading...</div>
  }

  if (!token || !role) {
    return <AdminLogin onSuccess={handleLoginSuccess} />
  }

  return <AdminDashboard token={token} role={role} onLogout={handleLogout} />
}
