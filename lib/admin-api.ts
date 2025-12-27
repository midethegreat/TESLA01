const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export async function adminLogin(email: string, password: string) {
  const response = await fetch(`${API_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Login failed")
  }

  return response.json()
}

export async function getAdminDashboard(token: string) {
  const response = await fetch(`${API_URL}/api/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) throw new Error("Failed to fetch dashboard")
  return response.json()
}

export async function getAllUsers(token: string) {
  const response = await fetch(`${API_URL}/api/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) throw new Error("Failed to fetch users")
  return response.json()
}

export async function getKYCRequests(token: string) {
  const response = await fetch(`${API_URL}/api/admin/kyc-requests`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) throw new Error("Failed to fetch KYC requests")
  return response.json()
}

export async function approveKYC(token: string, userId: string) {
  const response = await fetch(`${API_URL}/api/admin/kyc/${userId}/approve`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) throw new Error("Failed to approve KYC")
  return response.json()
}

export async function rejectKYC(token: string, userId: string, reason: string) {
  const response = await fetch(`${API_URL}/api/admin/kyc/${userId}/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ reason }),
  })

  if (!response.ok) throw new Error("Failed to reject KYC")
  return response.json()
}

export async function getAnalytics(token: string) {
  const response = await fetch(`${API_URL}/api/admin/analytics`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) throw new Error("Failed to fetch analytics")
  return response.json()
}
