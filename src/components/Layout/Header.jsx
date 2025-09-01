"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback } from "../ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Badge } from "../ui/badge"
import ChangePasswordModal from "../Auth/ChangePasswordModal"
import { Menu, User, Lock, LogOut, Settings } from "lucide-react"

function Header({ onMenuClick }) {
  const { user, logout, isAdmin } = useAuth()
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const navigate = useNavigate()

  const handleChangePassword = () => {
    setChangePasswordOpen(true)
  }

  const handleProfileClick = () => {
    navigate("/configuracion?tab=profile")
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <header className="bg-white border-b border-gray-100 shadow-sm flex-shrink-0 h-16">
        <div className="flex items-center justify-between px-6 h-full">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </Button>

            <div className="hidden sm:block">
              <div className="flex items-center space-x-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Sistema de Gestión</h2>
                  <p className="text-xs text-gray-500 hidden md:block -mt-4">
                    {new Date().toLocaleDateString("es-AR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 -mb-1">{user?.nombre || "Usuario"}</p>
                <Badge variant="outline" className={`text-xs border-[#d84315] text-[#d84315] bg-[#d84315]/5`}>
                  {isAdmin() ? "Administrador" : "Empleado"}
                </Badge>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-50">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-[#d84315] text-white font-medium">
                      {user?.nombre?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <div className="flex items-center justify-start gap-3 p-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-[#d84315] text-white font-medium text-lg">
                      {user?.nombre?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="font-medium text-gray-900 -mb-1">{user?.nombre || "Usuario"}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <Badge variant="outline" className="text-xs w-fit border-[#d84315] text-[#d84315] bg-[#d84315]/5">
                      {isAdmin() ? "Administrador" : "Empleado"}
                    </Badge>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick} className="hover:bg-gray-50">
                  <User className="mr-3 h-4 w-4 text-gray-500" />
                  <span>Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleChangePassword} className="hover:bg-gray-50">
                  <Lock className="mr-3 h-4 w-4 text-gray-500" />
                  <span>Cambiar Contraseña</span>
                </DropdownMenuItem>
                {isAdmin() && (
                  <DropdownMenuItem className="hover:bg-gray-50">
                    <Settings className="mr-3 h-4 w-4 text-gray-500" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <ChangePasswordModal open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
    </>
  )
}

export default Header
