// Error reporting service integration
import logger from "./logger"

class ErrorReportingService {
  constructor() {
    this.isInitialized = false
    this.init()
  }

  init() {
    // Initialize error reporting service (Sentry, LogRocket, etc.)
    if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
      // Example Sentry integration
      this.initSentry()
    }

    // Global error handler for unhandled promises
    window.addEventListener("unhandledrejection", this.handleUnhandledRejection)

    // Global error handler for JavaScript errors
    window.addEventListener("error", this.handleGlobalError)

    this.isInitialized = true
  }

  initSentry() {
    // Placeholder for Sentry initialization
    // import * as Sentry from "@sentry/react"
    // Sentry.init({
    //   dsn: import.meta.env.VITE_SENTRY_DSN,
    //   environment: import.meta.env.MODE,
    // })
  }

  handleUnhandledRejection = (event) => {
    logger.error("Unhandled Promise Rejection", {
      reason: event.reason,
      promise: event.promise,
      timestamp: new Date().toISOString(),
    })

    this.reportError(event.reason, {
      type: "unhandledRejection",
      promise: event.promise,
    })
  }

  handleGlobalError = (event) => {
    logger.error("Global JavaScript Error", {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      timestamp: new Date().toISOString(),
    })

    this.reportError(event.error || event.message, {
      type: "globalError",
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    })
  }

  reportError(error, context = {}) {
    if (!this.isInitialized) return

    const errorData = {
      message: error?.message || error,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...context,
    }

    // Log locally
    logger.error("Error reported", errorData)

    // Send to external service
    if (import.meta.env.PROD) {
      // Example: Send to Sentry
      // Sentry.captureException(error, { extra: context })

      // Or send to custom endpoint
      this.sendToCustomEndpoint(errorData)
    }
  }

  async sendToCustomEndpoint(errorData) {
    try {
      await fetch("/api/errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(errorData),
      })
    } catch (err) {
      logger.error("Failed to send error report", err)
    }
  }

  reportUserAction(action, data = {}) {
    if (import.meta.env.PROD) {
      logger.info("User Action", { action, data, timestamp: new Date().toISOString() })
    }
  }
}

// Create singleton instance
const errorReporting = new ErrorReportingService()

// Make it available globally for React Error Boundaries
window.reportError = (error, errorInfo) => {
  errorReporting.reportError(error, {
    type: "reactError",
    componentStack: errorInfo?.componentStack,
  })
}

export default errorReporting
