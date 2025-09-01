"use client"

import { useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"

const SessionManager = () => {
  const { logout, isAuthenticated } = useAuth()

  useEffect(() => {
    let inactivityTimer

    const resetTimer = () => {
      clearTimeout(inactivityTimer)
      if (isAuthenticated) {
        // Auto logout después de 2 horas de inactividad
        inactivityTimer = setTimeout(
          () => {
            logout()
            alert("Su sesión ha expirado por inactividad")
          },
          2 * 60 * 60 * 1000,
        ) // 2 horas
      }
    }

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"]

    if (isAuthenticated) {
      events.forEach((event) => {
        document.addEventListener(event, resetTimer, true)
      })
      resetTimer()
    }

    return () => {
      clearTimeout(inactivityTimer)
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer, true)
      })
    }
  }, [isAuthenticated, logout])

  return null
}

export default SessionManager
