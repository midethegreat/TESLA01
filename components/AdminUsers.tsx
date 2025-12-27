"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { getAllUsers } from "../lib/admin-api"
import type { User } from "../types"

interface AdminUsersProps {
  token: string
  role: "admin" | "superadmin"
}

const AdminUsers: React.FC<AdminUsersProps> = ({ token, role }) => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers(token)
        setUsers(data)
      } catch (error) {
        console.error("Failed to fetch users")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [token])

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search by email or name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50"
      />

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading users...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-400">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-400">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-400">Gender</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-400">Phone</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-400">Country</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-400">Date Joined</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-400">Referrals</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-400">KYC Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-400">Email Verified</th>
                {role === "superadmin" && <th className="text-left py-3 px-4 font-semibold text-gray-400">API Key</th>}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.firstName ? `${user.firstName} ${user.lastName || ""}` : "-"}</td>
                  <td className="py-3 px-4">{user.gender || "-"}</td>
                  <td className="py-3 px-4">{user.phone || "-"}</td>
                  <td className="py-3 px-4">{user.country || "-"}</td>
                  <td className="py-3 px-4 text-gray-400">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded text-xs font-semibold">
                      {user.referralCount || 0}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        user.kycStatus === "verified"
                          ? "bg-green-500/20 text-green-400"
                          : user.kycStatus === "submitted"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {user.kycStatus || "Not Submitted"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        user.emailVerified ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {user.emailVerified ? "Yes" : "No"}
                    </span>
                  </td>
                  {role === "superadmin" && (
                    <td className="py-3 px-4 text-gray-400 max-w-xs truncate" title={user.id}>
                      {user.id.substring(0, 8)}...
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminUsers
