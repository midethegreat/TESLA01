"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Camera, Loader2, Copy, Check, ShieldCheck, Upload, LockIcon } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { useProfile } from "../hooks/useProfile"
import KYCVerification from "./KYCVerification"
import PasswordReset from "./PasswordReset"

const ProfileSettings: React.FC = () => {
  const { user } = useAuth()
  const { profileImage, uploadProfileImage, updateProfile, loading } = useProfile()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [kycOpen, setKycOpen] = useState(false)
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    country: "",
    city: "",
    zipCode: "",
    address: "",
    joiningDate: "",
  })

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        dateOfBirth: user.dateOfBirth || "",
        country: user.country || "",
        city: user.city || "",
        zipCode: user.zipCode || "",
        address: user.address || "",
        joiningDate: user.joiningDate || new Date().toISOString().split("T")[0],
      }))
    }
  }, [user])

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    try {
      setError(null)
      await uploadProfileImage(e.target.files[0])
      setSuccess("Profile picture updated successfully")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      if (user?.kycVerified) {
        setError("Your profile is locked after KYC verification. Contact support for changes.")
        return
      }

      await updateProfile(formData)
      setSuccess("Profile updated successfully")
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === "email" || name === "joiningDate") {
      return
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const referralLink = `${window.location.origin}?referrer=${user?.id || ""}`

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 pb-8">
      <h2 className="text-white text-2xl font-bold">Settings</h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">{error}</div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-green-400 text-sm">
          {success}
        </div>
      )}

      {user?.kycStatus === "submitted" && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-center gap-3">
          <Loader2 className="text-blue-400 animate-spin" size={20} />
          <div>
            <p className="text-blue-400 font-semibold">KYC in Review</p>
            <p className="text-blue-400/80 text-sm">
              Your KYC documents are being reviewed by our team. This typically takes 24-48 hours.
            </p>
          </div>
        </div>
      )}

      {user?.kycVerified && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3">
          <ShieldCheck className="text-green-400" size={20} />
          <div>
            <p className="text-green-400 font-semibold">KYC Verified</p>
            <p className="text-green-400/80 text-sm">
              Your profile is now locked for security. Contact support for changes.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Avatar Section */}
        <div className="space-y-3">
          <label className="text-white font-semibold text-sm">Avatar</label>
          <div className="bg-[#1c1c1c] border border-white/5 rounded-lg p-4">
            <div className="relative w-32 h-32 mx-auto">
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-dashed border-amber-500/50 flex items-center justify-center overflow-hidden">
                {profileImage?.imagePath ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${profileImage.imagePath}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="text-amber-500" size={40} />
                )}
              </div>
              <label
                htmlFor="profile-pic"
                className="absolute bottom-0 right-0 p-2 bg-amber-500 rounded-full cursor-pointer hover:bg-amber-600 transition"
              >
                <Camera size={16} className="text-black" />
              </label>
              <input
                id="profile-pic"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
                disabled={user?.kycVerified}
              />
            </div>
          </div>
        </div>

        {/* Profile Form Grid */}
        <div className="space-y-4">
          {/* Row 1: First Name, Last Name, Username */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="mide"
                disabled={user?.kycVerified}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="jole"
                disabled={user?.kycVerified}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                disabled={user?.kycVerified}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Row 2: Gender, Date of Birth, Email */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                disabled={user?.kycVerified}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                disabled={user?.kycVerified}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="lawsonannie033@gmail.com"
                readOnly
                className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg py-3 px-4 text-sm text-gray-500 placeholder:text-gray-600 focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>

          {/* Row 3: Phone, Country, City */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={user?.kycVerified}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={user?.kycVerified}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                disabled={user?.kycVerified}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Row 4: Zip Code, Address, Joining Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                disabled={user?.kycVerified}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={user?.kycVerified}
                className="w-full bg-[#1c1c1c] border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Joining Date</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                readOnly
                className="w-full bg-[#0d0d0d] border border-white/10 rounded-lg py-3 px-4 text-sm text-gray-500 focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Referral Link Section */}
        <div className="space-y-3 pt-6 border-t border-white/10">
          <label className="text-white font-semibold text-sm">Referral Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 bg-[#1c1c1c] border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={copyReferralLink}
              className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-lg transition flex items-center gap-2"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-400">
            Share this link with others. When they register and verify their email, they'll appear in your referrals.
          </p>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end pt-6 border-t border-white/10">
          <button
            type="submit"
            disabled={loading || user?.kycVerified}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "✎"}
            Save Changes
          </button>
        </div>
      </form>

      {/* KYC Section */}
      <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-bold text-lg mb-4">KYC</h3>
        <button
          type="button"
          onClick={() => setKycOpen(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center gap-2"
        >
          <Upload size={18} />
          Upload KYC
        </button>
      </div>

      {/* Change Password Section */}
      <div className="bg-[#1c1c1c] border border-white/5 rounded-2xl p-6">
        <h3 className="text-white font-bold text-lg mb-4">Change Password</h3>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setResetPasswordOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center gap-2"
          >
            <LockIcon size={18} />
            Change Password
          </button>
        </div>
      </div>

      <KYCVerification isOpen={kycOpen} onClose={() => setKycOpen(false)} />
      <PasswordReset isOpen={resetPasswordOpen} onClose={() => setResetPasswordOpen(false)} />
    </div>
  )
}

export default ProfileSettings
