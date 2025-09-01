"use client"

import { useState, useCallback } from "react"
import { handleApiError } from "../utils/errorHandler"

export const useErrorHandler = (showToast = null) => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleError = useCallback(
    (error) => {
      const message = handleApiError(error, showToast)
      setError(message)
      return message
    },
    [showToast],
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const executeAsync = useCallback(
    async (asyncFunction) => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await asyncFunction()
        return result
      } catch (error) {
        handleError(error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [handleError],
  )

  return {
    error,
    isLoading,
    handleError,
    clearError,
    executeAsync,
  }
}
