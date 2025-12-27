"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Check, X, Loader2, ChevronDown } from "lucide-react"
import { getKYCRequests, approveKYC, rejectKYC } from "../lib/admin-api"
import type { KYCRequest } from "../types"

interface AdminKYCProps {
  token: string
}

const AdminKYC: React.FC<AdminKYCProps> = ({ token }) => {
  const [requests, setRequests] = useState<KYCRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [showRejectInput, setShowRejectInput] = useState<string | null>(null)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getKYCRequests(token)
        setRequests(data)
      } catch (error) {
        console.error("[v0] Failed to fetch KYC requests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [token])

  const handleApprove = async (userId: string) => {
    setProcessingId(userId)
    try {
      await approveKYC(token, userId)
      setRequests((prev) => prev.filter((r) => r.userId !== userId))
      alert("KYC approved successfully! User will receive a congratulations notification.")
    } catch (error) {
      console.error("[v0] Failed to approve KYC:", error)
      alert("Failed to approve KYC. Please try again.")
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (userId: string) => {
    if (!rejectReason.trim()) {
      alert("Please enter a rejection reason")
      return
    }

    setProcessingId(userId)
    try {
      await rejectKYC(token, userId, rejectReason)
      setRequests((prev) => prev.filter((r) => r.userId !== userId))
      setRejectReason("")
      setShowRejectInput(null)
      setExpandedId(null)
      alert("KYC rejected. User will be notified with the reason.")
    } catch (error) {
      console.error("[v0] Failed to reject KYC:", error)
      alert("Failed to reject KYC. Please try again.")
    } finally {
      setProcessingId(null)
    }
  }

  const pendingRequests = requests.filter((r) => r.status === "pending")

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading KYC requests...</div>
      ) : pendingRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-400">No pending KYC requests</div>
      ) : (
        <div className="space-y-3">
          {pendingRequests.map((request) => (
            <div key={request.userId} className="bg-[#0d0d0d] border border-white/10 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedId(expandedId === request.userId ? null : request.userId)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition"
              >
                <div className="text-left">
                  <p className="font-semibold text-white">{request.fullName}</p>
                  <p className="text-sm text-gray-400">{request.idType}</p>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-gray-400 transition ${expandedId === request.userId ? "rotate-180" : ""}`}
                />
              </button>

              {expandedId === request.userId && (
                <div className="border-t border-white/10 p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Date of Birth</p>
                      <p className="text-white">{request.dob}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-2">ID Type</p>
                      <p className="text-white">{request.idType}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400">ID Front</p>
                      <img
                        src={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${request.idFrontPath}`}
                        alt="ID Front"
                        className="w-full rounded border border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400">ID Back</p>
                      <img
                        src={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${request.idBackPath}`}
                        alt="ID Back"
                        className="w-full rounded border border-white/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-gray-400">Selfie</p>
                      <img
                        src={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${request.selfiePath}`}
                        alt="Selfie"
                        className="w-full rounded border border-white/10"
                      />
                    </div>
                  </div>

                  {showRejectInput === request.userId ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Enter rejection reason (e.g., 'ID image is blurry')..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg py-3 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-red-500/50"
                        disabled={processingId === request.userId}
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleReject(request.userId)}
                          disabled={processingId === request.userId || !rejectReason.trim()}
                          className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-2 px-4 rounded transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {processingId === request.userId ? (
                            <Loader2 className="animate-spin" size={18} />
                          ) : (
                            <X size={18} />
                          )}
                          Confirm Reject
                        </button>
                        <button
                          onClick={() => {
                            setShowRejectInput(null)
                            setRejectReason("")
                          }}
                          disabled={processingId === request.userId}
                          className="px-4 text-gray-400 hover:text-white transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(request.userId)}
                        disabled={processingId === request.userId}
                        className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-semibold py-3 px-4 rounded transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {processingId === request.userId ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <Check size={18} />
                        )}
                        Approve KYC
                      </button>
                      <button
                        onClick={() => setShowRejectInput(request.userId)}
                        disabled={processingId === request.userId}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-3 px-4 rounded transition flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <X size={18} />
                        Reject KYC
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminKYC
