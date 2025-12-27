// Session storage utilities that persist auth state across page refreshes

export const AuthStorage = {
  setToken: (token: string) => {
    localStorage.setItem("authToken", token)
  },

  getToken: (): string | null => {
    return localStorage.getItem("authToken")
  },

  removeToken: () => {
    localStorage.removeItem("authToken")
  },

  setUser: (user: any) => {
    localStorage.setItem("authUser", JSON.stringify(user))
  },

  getUser: () => {
    const user = localStorage.getItem("authUser")
    return user ? JSON.parse(user) : null
  },

  removeUser: () => {
    localStorage.removeItem("authUser")
  },

  clear: () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("authUser")
  },
}

// Profile data storage
export const ProfileStorage = {
  setProfile: (profile: any) => {
    localStorage.setItem("userProfile", JSON.stringify(profile))
  },

  getProfile: () => {
    const profile = localStorage.getItem("userProfile")
    return profile ? JSON.parse(profile) : null
  },

  updateProfile: (updates: any) => {
    const current = ProfileStorage.getProfile() || {}
    const updated = { ...current, ...updates }
    ProfileStorage.setProfile(updated)
    return updated
  },

  clear: () => {
    localStorage.removeItem("userProfile")
  },
}

// Document cache storage
export const DocumentStorage = {
  setDocuments: (docs: any[]) => {
    localStorage.setItem("userDocuments", JSON.stringify(docs))
  },

  getDocuments: () => {
    const docs = localStorage.getItem("userDocuments")
    return docs ? JSON.parse(docs) : []
  },

  addDocument: (doc: any) => {
    const current = DocumentStorage.getDocuments()
    DocumentStorage.setDocuments([doc, ...current])
  },

  removeDocument: (id: string) => {
    const current = DocumentStorage.getDocuments()
    DocumentStorage.setDocuments(current.filter((d: any) => d.id !== id))
  },

  clear: () => {
    localStorage.removeItem("userDocuments")
  },
}
