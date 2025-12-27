"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Loader } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface AdminAnalyticsProps {
  token: string
}

interface Analytics {
  totalUsers: number
  emailVerified: number
  kycVerified: number
  kycPending: number
  registrationByCountry: Record<string, number>
}

export default function AdminAnalytics({ token }: AdminAnalyticsProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        console.log("[v0] Fetching analytics")
        const response = await fetch("/api/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          console.error("[v0] Failed to fetch analytics:", response.status)
          setError("Failed to load analytics")
          return
        }

        const data = await response.json()
        console.log("[v0] Analytics fetched:", data)
        setAnalytics(data)
      } catch (err: any) {
        console.error("[v0] Error fetching analytics:", err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [token])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-6 h-6 text-amber-500 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 flex items-gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  if (!analytics) {
    return <div className="text-slate-400">No data available</div>
  }

  const countryData = Object.entries(analytics.registrationByCountry)
    .map(([country, count]) => ({ country, users: count }))
    .sort((a, b) => b.users - a.users)
    .slice(0, 10)

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Total Users</p>
          <p className="text-2xl font-bold text-white">{analytics.totalUsers}</p>
        </div>
        <div className="bg-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">Email Verified</p>
          <p className="text-2xl font-bold text-green-400">{analytics.emailVerified}</p>
        </div>
        <div className="bg-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">KYC Verified</p>
          <p className="text-2xl font-bold text-blue-400">{analytics.kycVerified}</p>
        </div>
        <div className="bg-slate-700 rounded-lg p-4">
          <p className="text-slate-400 text-sm mb-1">KYC Pending</p>
          <p className="text-2xl font-bold text-amber-400">{analytics.kycPending}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-slate-700 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Top 10 Countries by Registration</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={countryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="country" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569", borderRadius: "8px" }}
              labelStyle={{ color: "#f1f5f9" }}
            />
            <Legend />
            <Bar dataKey="users" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
