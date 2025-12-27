"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Mail, CheckCircle, Loader2, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../hooks/useAuth"

interface AuthProps {
  onBack: () => void
  onLoginClick: () => void
}

const Auth: React.FC<AuthProps> = ({ onBack, onLoginClick }) => {
  const [step, setStep] = useState<"register" | "verify">("register")
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string>("")
  const { register, verifyEmail } = useAuth()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "Nigeria",
    password: "",
    confirmPassword: "",
    referrerId: null,
  })

  const [verificationCode, setVerificationCode] = useState("")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const referrerId = params.get("referrer")
    if (referrerId) {
      setFormData((prev) => ({ ...prev, referrerId }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setLoading(true)
    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country,
        referrerId: formData.referrerId,
      })

      setUserId(result.userId)
      setEmail(formData.email)
      setStep("verify")
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during registration.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyEmail = async () => {
    if (!userId || !verificationCode) {
      setError("Please enter the verification code")
      return
    }

    if (!/^\d{6}$/.test(verificationCode)) {
      setError("Please enter a valid 6-digit code")
      return
    }

    setRefreshing(true)
    try {
      await verifyEmail(userId, verificationCode)
      window.location.reload()
    } catch (err: any) {
      setError(err.message || "Verification failed")
    } finally {
      setRefreshing(false)
    }
  }

  const handleSignOut = () => {
    setStep("register")
    onBack()
  }

  if (step === "verify") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4 md:p-6 overflow-x-hidden">
        <div className="w-full max-w-[600px] glass-card p-8 md:p-16 rounded-[2rem] border border-white/10 z-10 text-center shadow-2xl space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="flex justify-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center p-5">
              <Mail size={40} className="text-amber-500 md:size-[48px]" />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">Verify Your Email</h1>
            <p className="text-gray-400 text-xs md:text-sm font-light leading-relaxed">
              We sent a 6-digit verification code to <span className="text-white font-bold">{email}</span>.
            </p>
            <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest">Code expires in 15 minutes</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Verification Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl py-3.5 md:py-4 px-5 text-2xl md:text-3xl text-white focus:outline-none focus:border-amber-500/30 shadow-inner text-center tracking-[0.5em] font-mono font-bold"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>
          )}

          <div className="pt-4 flex flex-col gap-4">
            <button
              onClick={handleVerifyEmail}
              disabled={refreshing || verificationCode.length !== 6}
              className="w-full py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 hover:scale-105 transition"
            >
              {refreshing ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
              Verify Email
            </button>
            <button
              onClick={handleSignOut}
              className="text-[10px] font-bold text-gray-500 hover:text-white transition uppercase tracking-widest"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center py-8 md:py-12 px-4 md:px-6 relative overflow-x-hidden">
      <div className="mb-6 md:mb-8 z-10">
        <button onClick={onBack}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png"
            alt="Tesla"
            className="h-10 md:h-12 tesla-red-filter hover:scale-105 transition"
          />
        </button>
      </div>
      <div className="w-full max-w-[700px] glass-card p-6 md:p-16 rounded-[2rem] border border-white/10 z-10 text-center shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black mb-2 tracking-tight uppercase text-white leading-tight">
          Tesla Investment
        </h1>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-10">Create Your Account</p>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>
        )}

        <form
          onSubmit={handleRegister}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 md:gap-y-8 text-left"
        >
          <div className="space-y-1.5">
            <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
              First Name
            </label>
            <input
              required
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl py-3.5 md:py-4 px-5 text-sm text-white focus:outline-none focus:border-amber-500/30 shadow-inner"
              placeholder="John"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Last Name
            </label>
            <input
              required
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl py-3.5 md:py-4 px-5 text-sm text-white focus:outline-none focus:border-amber-500/30 shadow-inner"
              placeholder="Doe"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Email Address
            </label>
            <input
              required
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl py-3.5 md:py-4 px-5 text-sm text-white font-bold focus:outline-none focus:border-amber-500/30 transition shadow-inner"
              placeholder="email@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Country
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl py-3.5 md:py-4 px-5 text-sm text-white focus:outline-none focus:border-amber-500/30 appearance-none cursor-pointer"
            >
              <option>Nigeria</option>
              <option>United States</option>
              <option>Canada</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Password
            </label>
            <div className="relative">
              <input
                required
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl py-3.5 md:py-4 px-5 text-sm text-white font-bold focus:outline-none focus:border-amber-500/30 transition shadow-inner pr-12"
                placeholder="Min. 6 chars"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Confirm Password
            </label>
            <div className="relative">
              <input
                required
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full bg-[#1c1c1c] border border-white/5 rounded-xl py-3.5 md:py-4 px-5 text-sm text-white focus:outline-none focus:border-amber-500/30 shadow-inner pr-12"
                placeholder="Repeat password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="md:col-span-2 pt-6 flex flex-col items-center space-y-6">
            <button
              disabled={loading}
              type="submit"
              className="w-full max-w-sm py-4 md:py-5 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 transition active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : "Create Account"}
            </button>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Already have an account?{" "}
              <span className="text-white hover:underline cursor-pointer" onClick={onLoginClick}>
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Auth
