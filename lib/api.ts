const API_BASE_URL = import.meta.env.VITE_API_URL || "https://tesla-backend-ipk1.onrender.com"

export async function apiRequest(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem("authToken")
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const fullUrl = `${API_BASE_URL}${endpoint}`
    console.log("[v0] Making API request to:", fullUrl)
    const response = await fetch(fullUrl, {
      ...options,
      headers,
      credentials: "include",
    })

    if (!response.ok) {
      let error: string
      try {
        const data = await response.json()
        error = data.error || `HTTP ${response.status}: ${response.statusText}`
      } catch {
        error = `HTTP ${response.status}: ${response.statusText}`
      }
      console.error("[v0] API Error Response:", error)
      throw new Error(error)
    }

    return response.json()
  } catch (error: any) {
    console.error("[v0] API Request Failed:", error.message)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(`Failed to connect to backend. API URL: ${API_BASE_URL}`)
    }
    throw error
  }
}

export const authAPI = {
  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    country: string
  }) => apiRequest("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (email: string, password: string) =>
    apiRequest("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  verifyEmail: (userId: string, token: string) =>
    apiRequest("/api/auth/verify-email", { method: "POST", body: JSON.stringify({ userId, token }) }),

  getCurrentUser: () => apiRequest("/api/auth/me"),
}

// Documents API
export const documentsAPI = {
  upload: (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    const token = localStorage.getItem("authToken")
    const headers: HeadersInit = {}
    if (token) headers.Authorization = `Bearer ${token}`

    return fetch(`${API_BASE_URL}/api/documents/upload`, {
      method: "POST",
      headers,
      body: formData,
    }).then((res) => (res.ok ? res.json() : Promise.reject(res)))
  },

  getDocuments: () => apiRequest("/api/documents"),

  deleteDocument: (id: string) => apiRequest(`/api/documents/${id}`, { method: "DELETE" }),
}

// Profile API
export const profileAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    const token = localStorage.getItem("authToken")
    const headers: HeadersInit = {}
    if (token) headers.Authorization = `Bearer ${token}`

    return fetch(`${API_BASE_URL}/api/profile/image`, {
      method: "POST",
      headers,
      body: formData,
    }).then((res) => (res.ok ? res.json() : Promise.reject(res)))
  },

  getImage: () => apiRequest("/api/profile/image"),

  updateProfile: (data: { firstName: string; lastName: string; country: string }) =>
    apiRequest("/api/profile", { method: "PUT", body: JSON.stringify(data) }),
}

// Admin API
export const adminAPI = {
  getAllUploads: () => apiRequest("/api/admin/uploads"),

  getAllUsers: () => apiRequest("/api/admin/users"),
}

// Updates API
export const updatesAPI = {
  getUpdates: () => apiRequest("/api/updates"),
}
