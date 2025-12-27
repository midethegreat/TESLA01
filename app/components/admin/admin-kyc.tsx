"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Loader, Check, X } from "lucide-react"

interface AdminKYCProps {
  token: string
}

interface KYCRequest {
  userId: string
  fullName: string
  dob: string
  idType: string
  idFrontPath: string
  idBackPath: string
  selfiePath: string
  submittedAt: string
  status: "pending" | "verified" | "rejected"
}

export default function AdminKYC({ token }: AdminKYCProps) {
  const [requests, setRequests] = useState<KYCRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        console.log("[v0] Fetching KYC requests")
        const response = await fetch("/api/admin/kyc-requests", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          console.error("[v0] Failed to fetch KYC requests:", response.status)
          setError("Failed to load KYC requests")
          return
        }

        const data = await response.json()
        console.log("[v0] KYC requests fetched:", data.length)
        setRequests(data)
      } catch (err: any) {
        console.error("[v0] Error fetching KYC requests:", err.message)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [token])

  const handleApprove = async (userId: string) => {
    try {
      console.log("[v0] Approving KYC for user:", userId)
      const response = await fetch(`/api/admin/kyc/${userId}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        console.error("[v0] Approval failed:", response.status)
        setError("Failed to approve KYC")
        return
      }

      console.log("[v0] KYC approved")
      setRequests((prev) => prev.map((r) => (r.userId === userId ? { ...r, status: "verified" } : r)))
    } catch (err: any) {
      console.error("[v0] Error approving KYC:", err.message)
      setError(err.message)
    }
  }

  const handleReject = async (userId: string) => {
    try {
      console.log("[v0] Rejecting KYC for user:", userId)
      const response = await fetch(`/api/admin/kyc/${userId}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: rejectionReason || "No reason provided" }),
      })

      if (!response.ok) {
        console.error("[v0] Rejection failed:", response.status)
        setError("Failed to reject KYC")
        return
      }

      console.log("[v0] KYC rejected")
      setRequests((prev) => prev.map((r) => (r.userId === userId ? { ...r, status: "rejected" } : r)))
      setSelectedUserId(null)
      setRejectionReason("")
    } catch (err: any) {
      console.error("[v0] Error rejecting KYC:", err.message)
      setError(err.message)
    }
  }

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

  const pendingRequests = requests.filter((r) => r.status === "pending")

  return (
    <div className="space-y-6">
      {pendingRequests.length === 0 ? (
        <div className="text-center text-slate-400 py-8">
          <p>No pending KYC requests</p>
        </div>
      ) : (
        pendingRequests.map((request) => (
          <div key={request.userId} className="bg-slate-700 border border-slate-600 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-slate-400 text-sm">Full Name</p>
                <p className="text-white font-medium">{request.fullName}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Date of Birth</p>
                <p className="text-white font-medium">{request.dob}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">ID Type</p>
                <p className="text-white font-medium">{request.idType}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Submitted</p>
                <p className="text-white font-medium">{new Date(request.submittedAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <a
                href={request.idFrontPath}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition text-center"
              >
                View ID Front
              </a>
              <a
                href={request.idBackPath}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition text-center"
              >
                View ID Back
              </a>
              <a
                href={request.selfiePath}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition text-center"
              >
                View Selfie
              </a>
            </div>

            {selectedUserId === request.userId ? (
              <div className="bg-slate-600 p-4 rounded-lg mb-4">
                <p className="text-slate-300 text-sm mb-2">Rejection Reason (optional):</p>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide reason for rejection..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-500 text-sm"
                  rows={3}
                />
              </div>
            ) : null}

            <div className="flex gap-3">
              <button
                onClick={() => handleApprove(request.userId)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
              >
                <Check className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={() => setSelectedUserId(selectedUserId === request.userId ? null : request.userId)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
              >
                <X className="w-4 h-4" />
                {selectedUserId === request.userId ? "Cancel" : "Reject"}
              </button>
              {selectedUserId === request.userId && (
                <button
                  onClick={() => handleReject(request.userId)}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded transition text-sm"
                >
                  Confirm Rejection
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
