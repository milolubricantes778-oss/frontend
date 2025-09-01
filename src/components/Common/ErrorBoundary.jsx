"use client"

import React from "react"
import { Alert, AlertDescription, AlertTitle } from "@mui/material"
import { AlertTriangle, RefreshCw } from "lucide-react"
import logger from "../../utils/logger"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    logger.error("React Error Boundary caught an error", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    })

    this.setState({
      error,
      errorInfo,
    })

    // Report to error tracking service (Sentry, etc.)
    if (window.reportError) {
      window.reportError(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full">
            <Alert severity="error" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>¡Oops! Algo salió mal</AlertTitle>
              <AlertDescription className="mt-2">
                {this.props.fallbackMessage ||
                  "Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado automáticamente."}
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <button
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Intentar de nuevo
              </button>

              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Recargar página
              </button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <summary className="cursor-pointer font-medium text-red-800">
                  Detalles del error (solo en desarrollo)
                </summary>
                <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
