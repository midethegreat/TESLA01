export const AuthStorage = {
  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token)
    }
  },

  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken")
    }
    return null
  },

  setUser: (user: any) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("authUser", JSON.stringify(user))
    }
  },

  getUser: () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("authUser")
      return user ? JSON.parse(user) : null
    }
    return null
  },

  clear: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
      localStorage.removeItem("authUser")
    }
  },
}
