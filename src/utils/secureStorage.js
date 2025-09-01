class SecureStorage {
  constructor() {
    this.isSecureContext = window.isSecureContext || location.protocol === "https:"
  }

  // Store token securely
  setToken(token) {
    if (this.isSecureContext) {
      // In production, use secure httpOnly cookies via API
      this.setSecureCookie("auth_token", token, {
        httpOnly: false, // Will be handled by backend in production
        secure: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60, // 24 hours
      })
    } else {
      // Development fallback to sessionStorage (more secure than localStorage)
      sessionStorage.setItem("auth_token", token)
    }
  }

  // Get token
  getToken() {
    if (this.isSecureContext) {
      return this.getCookie("auth_token")
    } else {
      return sessionStorage.getItem("auth_token")
    }
  }

  // Remove token
  removeToken() {
    if (this.isSecureContext) {
      this.deleteCookie("auth_token")
    } else {
      sessionStorage.removeItem("auth_token")
    }
  }

  // Store user data (less sensitive, can use localStorage)
  setUser(user) {
    try {
      localStorage.setItem("user_data", JSON.stringify(user))
    } catch (error) {
      console.error("Error storing user data:", error)
    }
  }

  // Get user data
  getUser() {
    try {
      const userData = localStorage.getItem("user_data")
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error("Error parsing user data:", error)
      this.removeUser()
      return null
    }
  }

  // Remove user data
  removeUser() {
    localStorage.removeItem("user_data")
  }

  // Clear all auth data
  clearAll() {
    this.removeToken()
    this.removeUser()
  }

  // Cookie utilities
  setSecureCookie(name, value, options = {}) {
    const defaults = {
      path: "/",
      secure: true,
      sameSite: "strict",
    }
    const opts = { ...defaults, ...options }

    let cookieString = `${name}=${encodeURIComponent(value)}`

    Object.entries(opts).forEach(([key, val]) => {
      if (val === true) {
        cookieString += `; ${key}`
      } else if (val !== false) {
        cookieString += `; ${key}=${val}`
      }
    })

    document.cookie = cookieString
  }

  getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(";").shift())
    }
    return null
  }

  deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  }
}

export const secureStorage = new SecureStorage()
export default secureStorage
