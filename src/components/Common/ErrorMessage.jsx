"use client"

import { AlertCircle, X } from "lucide-react"

const ErrorMessage = ({ message, onClose, type = "error" }) => {
  const typeStyles = {
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  }

  if (!message) return null

  return (
    <div className={`border rounded-lg p-4 mb-4 ${typeStyles[type]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">{message}</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default ErrorMessage
