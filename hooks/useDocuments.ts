"use client"

import { useState, useCallback } from "react"
import type { Document } from "../types"
import { documentsAPI } from "../lib/api"
import { DocumentStorage } from "../lib/storage"

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>(() => DocumentStorage.getDocuments())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await documentsAPI.getDocuments()
      const docs = response.documents || []
      DocumentStorage.setDocuments(docs)
      setDocuments(docs)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const uploadDocument = useCallback(async (file: File) => {
    setError(null)
    try {
      const response = await documentsAPI.upload(file)
      DocumentStorage.addDocument(response.document)
      setDocuments((prev) => [response.document, ...prev])
      return response
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const deleteDocument = useCallback(async (id: string) => {
    setError(null)
    try {
      await documentsAPI.deleteDocument(id)
      DocumentStorage.removeDocument(id)
      setDocuments((prev) => prev.filter((doc) => doc.id !== id))
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
  }
}
