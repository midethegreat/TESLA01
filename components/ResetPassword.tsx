"use client"

import type React from "react"
import { useState } from "react"
import { ArrowLeft, Loader2, Send } from "lucide-react"

interface ResetPasswordProps {
  onBack: () => void
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState("")

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // For now, this shows a placeholder message
      setSuccess(true)
    } catch (err: any) {
      console.error(err)
      setError(err.message || "An error occurred. Please check your email and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center py-12 px-6 relative overflow-hidden font-display">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%]"
        >
          <path d="M0 500 Q 250 400 500 500 T 1000 500" fill="none" stroke="white" strokeWidth="0.5" />
          <path d="M0 550 Q 250 450 500 550 T 1000 550" fill="none" stroke="white" strokeWidth="0.5" />
          <path d="M0 600 Q 250 500 500 600 T 1000 600" fill="none" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="fixed top-1/2 left-0 w-64 h-64 bg-amber-500/10 blur-[120px] rounded-full -translate-y-1/2 -z-10"></div>

      {/* Tesla Logo */}
      <div className="mb-8 z-10">
        <button onClick={onBack}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png"
            alt="Tesla"
            className="h-12 tesla-red-filter transition-transform hover:scale-105"
          />
        </button>
      </div>

      {/* Reset Card */}
      <div className="w-full max-w-[800px] glass-card p-10 md:p-20 rounded-[2.5rem] border border-white/10 z-10 text-center shadow-2xl animate-in fade-in zoom-in duration-500 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>

        <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight uppercase text-white leading-tight">
          Tesla Investment - Best Place To Grow Your Money
        </h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-16">Reset your Password</p>

        {success ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm font-bold uppercase tracking-widest">
              Success! Check your email for the reset link.
            </div>
            <button
              onClick={onBack}
              className="px-12 py-4 rounded-full bg-white/5 text-white font-black uppercase text-[10px] tracking-widest border border-white/10 hover:bg-white/10 transition"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-10 text-left max-w-lg mx-auto">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl py-4 px-6 text-sm text-white font-medium focus:outline-none focus:border-amber-500/30 transition shadow-inner"
                placeholder="your@email.com"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold">
                {error}
              </div>
            )}

            <div className="flex flex-col items-center gap-6 pt-6">
              <button
                disabled={loading}
                type="submit"
                className="w-full py-4 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 transition active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                Send Reset Link
              </button>
              <button
                type="button"
                onClick={onBack}
                className="text-[10px] font-bold text-gray-500 hover:text-white transition uppercase tracking-widest flex items-center gap-2"
              >
                <ArrowLeft size={14} />
                Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
