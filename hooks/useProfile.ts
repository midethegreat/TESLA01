"use client"

import { useState, useCallback } from "react"
import type { ProfileImage } from "../types"
import { profileAPI } from "../lib/api"
import { ProfileStorage } from "../lib/storage"

export function useProfile() {
  const [profileImage, setProfileImage] = useState<ProfileImage | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfileImage = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await profileAPI.getImage()
      setProfileImage(response.image || null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const uploadProfileImage = useCallback(async (file: File) => {
    setError(null)
    try {
      const response = await profileAPI.uploadImage(file)
      setProfileImage({
        id: Math.random().toString(),
        userId: "",
        imagePath: response.imagePath,
        uploadedAt: response.uploadedAt,
      })
      ProfileStorage.updateProfile({ image: response.imagePath })
      return response
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const updateProfile = useCallback(async (data: { firstName: string; lastName: string; country: string }) => {
    setError(null)
    try {
      const response = await profileAPI.updateProfile(data)
      ProfileStorage.updateProfile(data)
      return response
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  return {
    profileImage,
    loading,
    error,
    fetchProfileImage,
    uploadProfileImage,
    updateProfile,
  }
}
