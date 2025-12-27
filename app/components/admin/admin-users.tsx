"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Loader } from "lucide-react"

interface AdminUsersProps {
  token: string
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  country: string
  emailVerified: boolean
  kycStatus: string
  createdAt: string
}

export default function AdminUsers({ token }: AdminUsersProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("[v0] Fetching all users")
        const response = await fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          console.error("[v0] Failed to fetch users:", response.status)
          setError("Failed to load users")
          return
        }

        const data = await response.json()
        console.log("[v0] Users fetched:", data.length)
        setUsers(data)
      } catch (err: any) {
        console.error("[v0] Error fetching users:", err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-600">
          <tr className="text-left text-slate-300 font-semibold">
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Country</th>
            <th className="px-4 py-3">Email Verified</th>
            <th className="px-4 py-3">KYC Status</th>
            <th className="px-4 py-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/50">
                <td className="px-4 py-3 text-white">{user.email}</td>
                <td className="px-4 py-3 text-slate-300">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-3 text-slate-300">{user.country}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.emailVerified ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {user.emailVerified ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.kycStatus === "verified"
                        ? "bg-green-900/30 text-green-400"
                        : user.kycStatus === "submitted"
                          ? "bg-amber-900/30 text-amber-400"
                          : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {user.kycStatus || "None"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
