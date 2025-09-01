"use client"

import { useState, useCallback } from "react"

let toastId = 0

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = ++toastId
    const newToast = { id, ...toast }

    setToasts((prev) => [...prev, newToast])

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const toast = useCallback(
    (options) => {
      return addToast(options)
    },
    [addToast],
  )

  // Convenience methods
  toast.success = useCallback(
    (title, description) => {
      return addToast({ title, description, variant: "success" })
    },
    [addToast],
  )

  toast.error = useCallback(
    (title, description) => {
      return addToast({ title, description, variant: "error" })
    },
    [addToast],
  )

  toast.warning = useCallback(
    (title, description) => {
      return addToast({ title, description, variant: "warning" })
    },
    [addToast],
  )

  toast.info = useCallback(
    (title, description) => {
      return addToast({ title, description, variant: "default" })
    },
    [addToast],
  )

  return {
    toast,
    toasts,
    removeToast,
  }
}
