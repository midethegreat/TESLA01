"use client"

import { useState, useEffect } from "react"
import { LogOut, Users, FileCheck, BarChart3, AlertCircle } from "lucide-react"
import AdminUsers from "./admin-users"
import AdminKYC from "./admin-kyc"
import AdminAnalytics from "./admin-analytics"

interface AdminDashboardProps {
  token: string
  onLogout: () => void
}

type Tab = "dashboard" | "users" | "kyc" | "analytics"

export default function AdminDashboard({ token, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [stats, setStats] = useState({ totalUsers: 0, emailVerified: 0, kycPending: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("[v0] Fetching dashboard stats")
        const response = await fetch("/api/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          console.error("[v0] Failed to fetch stats:", response.status)
          setError("Failed to load dashboard stats")
          return
        }

        const data = await response.json()
        console.log("[v0] Dashboard stats:", data)
        setStats(data)
      } catch (err: any) {
        console.error("[v0] Error fetching stats:", err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [token])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 flex items-gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users className="w-10 h-10 text-blue-500 opacity-50" />
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Email Verified</p>
                  <p className="text-3xl font-bold text-white">{stats.emailVerified}</p>
                </div>
                <FileCheck className="w-10 h-10 text-green-500 opacity-50" />
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">KYC Pending</p>
                  <p className="text-3xl font-bold text-white">{stats.kycPending}</p>
                </div>
                <AlertCircle className="w-10 h-10 text-amber-500 opacity-50" />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-slate-700 mb-8">
          <div className="flex gap-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "users", label: "Users", icon: Users },
              { id: "kyc", label: "KYC Requests", icon: FileCheck },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`py-4 px-2 border-b-2 transition font-medium flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-amber-500 text-amber-500"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          {activeTab === "users" && <AdminUsers token={token} />}
          {activeTab === "kyc" && <AdminKYC token={token} />}
          {activeTab === "analytics" && <AdminAnalytics token={token} />}
          {activeTab === "dashboard" && (
            <div className="text-center text-slate-400 py-8">
              <p>Select a tab to view details</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
