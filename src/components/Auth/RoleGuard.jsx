"use client"

import { useAuth } from "../../contexts/AuthContext"

const RoleGuard = ({ children, requiredRole, fallback = null }) => {
  const { hasPermission } = useAuth()

  if (!hasPermission(requiredRole)) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Acceso Restringido</h2>
            <p className="text-gray-600">No tienes permisos para acceder a esta sección</p>
          </div>
        </div>
      )
    )
  }

  return children
}

export default RoleGuard
