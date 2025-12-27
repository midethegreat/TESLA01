"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { LogOut, Users, FileText, BarChart3 } from "lucide-react"
import { getAdminDashboard } from "../lib/admin-api"
import AdminUsers from "./AdminUsers"
import AdminKYC from "./AdminKYC"
import AdminAnalytics from "./AdminAnalytics"

interface AdminDashboardProps {
  token: string
  role: "admin" | "superadmin"
  onLogout: () => void
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, role, onLogout }) => {
  const [activeTab, setActiveTab] = useState<"users" | "kyc" | "analytics">("users")
  const [stats, setStats] = useState({ totalUsers: 0, kycPending: 0, emailVerified: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminDashboard(token)
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch dashboard stats")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [token])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d0d0d] to-[#1a1a1a] text-white">
      {/* Header */}
      <div className="bg-[#1c1c1c] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-xs text-amber-500 mt-1">Role: {role.charAt(0).toUpperCase() + role.slice(1)}</p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-[#1c1c1c] border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="text-amber-500" size={32} />
            </div>
          </div>

          <div className="bg-[#1c1c1c] border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">KYC Pending</p>
                <p className="text-3xl font-bold">{stats.kycPending}</p>
              </div>
              <FileText className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-[#1c1c1c] border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Email Verified</p>
                <p className="text-3xl font-bold">{stats.emailVerified}</p>
              </div>
              <BarChart3 className="text-green-500" size={32} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#1c1c1c] border border-white/10 rounded-lg">
          <div className="flex border-b border-white/10">
            {["users", "kyc", "analytics"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-4 px-6 font-semibold transition ${
                  activeTab === tab ? "text-amber-500 border-b-2 border-amber-500" : "text-gray-400 hover:text-white"
                }`}
              >
                {tab === "kyc" ? "KYC Requests" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "users" && <AdminUsers token={token} role={role} />}
            {activeTab === "kyc" && <AdminKYC token={token} />}
            {activeTab === "analytics" && <AdminAnalytics token={token} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
