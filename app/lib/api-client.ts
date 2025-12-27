const API_BASE_URL = "/api"

export async function apiRequest(endpoint: string, options?: RequestInit) {
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
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
  }) => apiRequest("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  login: (email: string, password: string) =>
    apiRequest("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  verifyEmail: (userId: string, token: string) =>
    apiRequest("/auth/verify-email", { method: "POST", body: JSON.stringify({ userId, token }) }),

  getCurrentUser: () => apiRequest("/auth/me"),
}

export const kycAPI = {
  submit: (formData: FormData) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null
    const headers: HeadersInit = {}
    if (token) headers.Authorization = `Bearer ${token}`

    return fetch(`${API_BASE_URL}/kyc/submit`, {
      method: "POST",
      headers,
      body: formData,
      credentials: "include",
    }).then((res) => (res.ok ? res.json() : Promise.reject(res)))
  },
}

export const adminAPI = {
  getKYCRequests: () => apiRequest("/admin/kyc-requests"),
  getAllUsers: () => apiRequest("/admin/users"),
  getAnalytics: () => apiRequest("/admin/analytics"),
  approveKYC: (userId: string) => apiRequest(`/admin/kyc/${userId}/approve`, { method: "POST" }),
  rejectKYC: (userId: string, reason: string) =>
    apiRequest(`/admin/kyc/${userId}/reject`, { method: "POST", body: JSON.stringify({ reason }) }),
}
