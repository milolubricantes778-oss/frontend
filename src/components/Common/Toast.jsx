"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "../../lib/utils"

const Toast = ({ title, description, variant = "default", duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const variants = {
    default: {
      className: "bg-white border-gray-200",
      icon: Info,
      iconColor: "text-blue-500",
    },
    success: {
      className: "bg-green-50 border-green-200",
      icon: CheckCircle,
      iconColor: "text-green-500",
    },
    error: {
      className: "bg-red-50 border-red-200",
      icon: AlertCircle,
      iconColor: "text-red-500",
    },
    destructive: {
      className: "bg-red-50 border-red-200",
      icon: AlertCircle,
      iconColor: "text-red-500",
    },
    warning: {
      className: "bg-yellow-50 border-yellow-200",
      icon: AlertTriangle,
      iconColor: "text-yellow-500",
    },
  }

  const config = variants[variant] || variants.default
  const Icon = config.icon

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 w-96 max-w-sm border rounded-lg shadow-lg p-4 transition-all duration-300",
        config.className,
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
      )}
    >
      <div className="flex items-start space-x-3">
        <Icon className={cn("h-5 w-5 mt-0.5", config.iconColor)} />
        <div className="flex-1 min-w-0">
          {title && <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>}
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default Toast
