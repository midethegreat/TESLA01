"use client"

import type React from "react"
import { useState } from "react"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../hooks/useAuth"

interface LoginProps {
  onBack: () => void
  onRegisterClick: () => void
  onLoginSuccess: () => void
  onForgetPasswordClick?: () => void
}

const Login: React.FC<LoginProps> = ({ onBack, onRegisterClick, onLoginSuccess, onForgetPasswordClick }) => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(formData.email, formData.password)
      onLoginSuccess()
    } catch (err: any) {
      setError(err.message || "Invalid credentials.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center py-8 md:py-12 px-4 md:px-6 relative overflow-x-hidden">
      <div className="mb-6 md:mb-8 z-10">
        <button onClick={onBack}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png"
            alt="Tesla"
            className="h-10 md:h-12 tesla-red-filter hover:scale-105 transition"
          />
        </button>
      </div>
      <div className="w-full max-w-[700px] glass-card p-6 md:p-16 rounded-[2rem] border border-white/10 z-10 text-center shadow-2xl animate-in fade-in zoom-in duration-500">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black mb-2 tracking-tight uppercase text-white leading-tight">
          Tesla Investment
        </h1>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-12">Login to Account</p>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 md:space-y-8 text-left max-w-sm mx-auto">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
            <input
              required
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl py-4 px-6 text-sm text-white font-medium focus:outline-none focus:border-amber-500/30 transition shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Password</label>
            <div className="relative">
              <input
                required
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl py-4 px-6 text-sm text-white font-medium focus:outline-none focus:border-amber-500/30 transition shadow-inner pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500/20"
              />
              <span className="text-[9px] font-bold text-gray-400 uppercase group-hover:text-white transition">
                Remember
              </span>
            </label>
            <button
              type="button"
              onClick={onForgetPasswordClick}
              className="text-[9px] font-bold text-orange-400 uppercase tracking-widest hover:underline"
            >
              Forgot?
            </button>
          </div>
          <div className="pt-4 flex flex-col items-center space-y-6 md:space-y-8">
            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 md:py-5 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 transition active:scale-95 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Account Login"}
            </button>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Don't have an account?{" "}
              <span onClick={onRegisterClick} className="text-white hover:underline cursor-pointer">
                Sign Up
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
