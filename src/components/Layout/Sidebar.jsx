"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import {
  LayoutDashboard,
  Users,
  Car,
  Wrench,
  BarChart3,
  Settings,
  UserCog,
  ChevronDown,
  ChevronRight,
  X,
  Cog,
} from "lucide-react"

const drawerWidth = 280

function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAdmin } = useAuth()
  const [configOpen, setConfigOpen] = useState(false)

  const menuItems = [
    { text: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { text: "Clientes", icon: Users, path: "/clientes" },
    { text: "Vehículos", icon: Car, path: "/vehiculos" },
    { text: "Servicios", icon: Wrench, path: "/servicios" },
    { text: "Reportes", icon: BarChart3, path: "/reportes" },
  ]

  const configItems = [
    { text: "General", path: "/configuracion", icon: Settings },
    { text: "Tipos de Servicios", path: "/configuracion/tipos-servicios", icon: Cog },
    ...(isAdmin() ? [{ text: "Usuarios", path: "/configuracion/usuarios", icon: UserCog }] : []),
  ]

  const handleNavigation = (path) => {
    navigate(path)
    onClose()
  }

  const isConfigPath = () => {
    return location.pathname.startsWith("/configuracion")
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-screen bg-background border-r shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex-shrink-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        style={{ width: drawerWidth }}
      >
        <div className="flex flex-col h-full">
          <div
            className="px-6 py-4 relative flex-shrink-0 h-16 flex items-center justify-between"
            style={{ backgroundColor: "#d84315" }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white -mb-1">Milo</h1>
                <p className="text-white/80 text-xl font-medium -mt-1">Lubricantes</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden text-[#d84315] hover:text-white hover:bg-white/10 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 px-4 py-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <Button
                    key={item.text}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      "w-full justify-start h-11 px-4 font-medium transition-all duration-200",
                      isActive ? "shadow-sm" : "hover:bg-muted",
                      isActive && "bg-[#d84315] hover:bg-[#d84315]/90 text-white",
                    )}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.text}
                  </Button>
                )
              })}


              <Collapsible open={configOpen} onOpenChange={setConfigOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant={isConfigPath() ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-between h-11 px-4 font-medium transition-all duration-200",
                      isConfigPath() ? "shadow-sm bg-[#d84315] hover:bg-[#d84315]/90 text-white" : "hover:bg-muted",
                    )}
                  >
                    <div className="flex items-center">
                      <Settings className="h-5 w-5 mr-3" />
                      Configuración
                    </div>
                    {configOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="space-y-1 mt-2 ml-4">
                  {configItems.map((item) => {
                    const isActive = location.pathname === item.path
                    const Icon = item.icon

                    return (
                      <Button
                        key={item.text}
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handleNavigation(item.path)}
                        className={cn(
                          "w-full justify-start h-9 px-4 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "shadow-sm bg-[#d84315] hover:bg-[#d84315]/90 text-white"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {item.text}
                      </Button>
                    )
                  })}
                </CollapsibleContent>
              </Collapsible>
            </nav>
          </ScrollArea>

          <div className="p-4 border-t bg-muted/30">
            <div className="flex flex-col items-center space-y-2">
              <Badge variant="secondary" className="text-xs">
                Sistema de Gestión v1.0
              </Badge>
              <p className="text-xs text-muted-foreground">© 2024 Milo Lubricantes</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
