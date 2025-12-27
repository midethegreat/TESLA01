"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLogin from "@/app/components/admin/admin-login"
import AdminDashboard from "@/app/components/admin/admin-dashboard"

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken")
    console.log("[v0] Checking admin token:", storedToken ? "found" : "not found")

    if (storedToken) {
      setToken(storedToken)
    }

    setLoading(false)
  }, [])

  const handleLoginSuccess = (data: { token: string }) => {
    console.log("[v0] Admin login successful")
    localStorage.setItem("adminToken", data.token)
    setToken(data.token)
  }

  const handleLogout = () => {
    console.log("[v0] Admin logging out")
    localStorage.removeItem("adminToken")
    setToken(null)
    router.push("/admin")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p>Loading Admin Panel...</p>
        </div>
      </div>
    )
  }

  if (!token) {
    return <AdminLogin onSuccess={handleLoginSuccess} />
  }

  return <AdminDashboard token={token} onLogout={handleLogout} />
}
