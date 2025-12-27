"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { getAnalytics } from "../lib/admin-api"

interface AdminAnalyticsProps {
  token: string
}

const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ token }) => {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await getAnalytics(token)
        setAnalytics(data)
      } catch (error) {
        console.error("Failed to fetch analytics")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [token])

  if (loading) {
    return <div className="text-center py-8 text-gray-400">Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Total Registrations</p>
          <p className="text-4xl font-bold text-white">{analytics?.totalUsers || 0}</p>
        </div>
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Email Verified</p>
          <p className="text-4xl font-bold text-green-400">{analytics?.emailVerified || 0}</p>
        </div>
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">KYC Verified</p>
          <p className="text-4xl font-bold text-amber-400">{analytics?.kycVerified || 0}</p>
        </div>
        <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6">
          <p className="text-gray-400 text-sm mb-2">Pending KYC</p>
          <p className="text-4xl font-bold text-blue-400">{analytics?.kycPending || 0}</p>
        </div>
      </div>

      <div className="bg-[#0d0d0d] border border-white/10 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-4">Registration Trend</h3>
        <div className="space-y-2">
          {Object.entries(analytics?.registrationByCountry || {}).map(([country, count]: any) => (
            <div key={country} className="flex items-center justify-between">
              <span className="text-gray-400">{country}</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-700 rounded">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded"
                    style={{ width: `${(count / (analytics?.totalUsers || 1)) * 100}%` }}
                  />
                </div>
                <span className="text-white font-semibold min-w-8">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics
