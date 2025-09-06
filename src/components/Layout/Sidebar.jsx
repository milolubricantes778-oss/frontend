"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  Collapse,
  Divider,
  Chip,
  Paper,
} from "@mui/material"
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  DirectionsCar as CarIcon,
  Build as BuildIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  ManageAccounts as ManageAccountsIcon,
  ExpandLess,
  ExpandMore,
  Close as CloseIcon,
  Tune as TuneIcon,
  Business as BusinessIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material"

const drawerWidth = 280

function Sidebar({ open, onClose, isMobile }) {
  const navigate = useNavigate()

  return (
    <>
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              border: "none",
              boxShadow: 4,
            },
          }}
        >
          <SidebarContent onNavigation={(path) => navigate(path)} onClose={onClose} showCloseButton={false} />
        </Drawer>
      )}

      {isMobile && (
        <Drawer
          variant="temporary"
          open={open}
          onClose={onClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              boxShadow: 4,
            },
          }}
        >
          <SidebarContent onNavigation={(path) => navigate(path)} onClose={onClose} showCloseButton={true} />
        </Drawer>
      )}
    </>
  )
}

function SidebarContent({ onNavigation, onClose, showCloseButton }) {
  const location = useLocation()
  const { isAdmin } = useAuth()
  const [configOpen, setConfigOpen] = useState(false)

  const menuItems = [
    { text: "Dashboard", icon: DashboardIcon, path: "/dashboard" },
    { text: "Clientes", icon: PeopleIcon, path: "/clientes" },
    { text: "Vehículos", icon: CarIcon, path: "/vehiculos" },
    { text: "Servicios", icon: BuildIcon, path: "/servicios" },
    { text: "Reportes", icon: BarChartIcon, path: "/reportes" },
  ]

  const configItems = [
    { text: "General", path: "/configuracion", icon: SettingsIcon },
    { text: "Tipos de Servicios", path: "/configuracion/tipos-servicios", icon: TuneIcon },
    { text: "Empleados", path: "/configuracion/empleados", icon: PersonAddIcon },
    { text: "Sucursales", path: "/configuracion/sucursales", icon: BusinessIcon },
    ...(isAdmin() ? [{ text: "Usuarios", path: "/configuracion/usuarios", icon: ManageAccountsIcon }] : []),
  ]

  const isConfigPath = () => {
    return location.pathname.startsWith("/configuracion")
  }

  const isActivePath = (path) => {
    return location.pathname === path
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Paper
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #d84315 0%, #c13711 100%)",
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: 0,
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              width: 42,
              height: 42,
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            M
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "white", fontSize: "1.1rem" }}>
              Milo
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)", mt: -0.5, fontSize: "0.8rem" }}>
              Lubricantes
            </Typography>
          </Box>
        </Box>
        {showCloseButton && (
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              bgcolor: "rgba(255, 255, 255, 0.1)",
              "&:hover": {
                bgcolor: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Paper>

      <Box
        sx={{
          flexGrow: 1,
          p: 1.5,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(0,0,0,0.1)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(216, 67, 21, 0.3)",
            borderRadius: "3px",
            "&:hover": {
              background: "rgba(216, 67, 21, 0.5)",
            },
          },
        }}
      >
        <List sx={{ pt: 0 }}>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = isActivePath(item.path)

            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => onNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    py: 1.2,
                    px: 1.5,
                    bgcolor: isActive ? "#d84315" : "transparent",
                    color: isActive ? "white" : "#171717",
                    "&:hover": {
                      bgcolor: isActive ? "#c13711" : "rgba(216, 67, 21, 0.1)",
                    },
                    boxShadow: isActive ? 2 : 0,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon sx={{ color: isActive ? "white" : "#d84315", fontSize: 22 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? "bold" : "medium",
                      fontSize: "0.9rem",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}

          <Divider sx={{ my: 1.5 }} />

          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => setConfigOpen(!configOpen)}
              sx={{
                borderRadius: 2,
                py: 1.2,
                px: 1.5,
                bgcolor: isConfigPath() ? "#d84315" : "transparent",
                color: isConfigPath() ? "white" : "#171717",
                "&:hover": {
                  bgcolor: isConfigPath() ? "#c13711" : "rgba(216, 67, 21, 0.1)",
                },
                boxShadow: isConfigPath() ? 2 : 0,
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <SettingsIcon sx={{ color: isConfigPath() ? "white" : "#d84315", fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText
                primary="Configuración"
                primaryTypographyProps={{
                  fontWeight: isConfigPath() ? "bold" : "medium",
                  fontSize: "0.9rem",
                }}
              />
              {configOpen ? (
                <ExpandLess sx={{ color: isConfigPath() ? "white" : "#666", fontSize: 20 }} />
              ) : (
                <ExpandMore sx={{ color: isConfigPath() ? "white" : "#666", fontSize: 20 }} />
              )}
            </ListItemButton>
          </ListItem>

          <Collapse in={configOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 1.5 }}>
              {configItems.map((item) => {
                const Icon = item.icon
                const isActive = isActivePath(item.path)

                return (
                  <ListItem key={item.text} disablePadding sx={{ mb: 0.3 }}>
                    <ListItemButton
                      onClick={() => onNavigation(item.path)}
                      sx={{
                        borderRadius: 2,
                        py: 0.8,
                        px: 1.5,
                        bgcolor: isActive ? "#d84315" : "transparent",
                        color: isActive ? "white" : "#666",
                        "&:hover": {
                          bgcolor: isActive ? "#c13711" : "rgba(216, 67, 21, 0.1)",
                          color: isActive ? "white" : "#171717",
                        },
                        boxShadow: isActive ? 1 : 0,
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Icon sx={{ fontSize: 18, color: isActive ? "white" : "#d84315" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: "0.85rem",
                          fontWeight: isActive ? "bold" : "medium",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                )
              })}
            </List>
          </Collapse>
        </List>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: "rgba(216, 67, 21, 0.05)",
          borderTop: "1px solid rgba(216, 67, 21, 0.2)",
          textAlign: "center",
          borderRadius: 0,
          position: "sticky",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Chip
          label="Sistema v1.0"
          size="small"
          sx={{
            bgcolor: "white",
            color: "#d84315",
            border: "1px solid rgba(216, 67, 21, 0.3)",
            fontWeight: "medium",
            mb: 0.5,
            fontSize: "0.7rem",
            height: 24,
          }}
        />
        <Typography variant="caption" sx={{ display: "block", color: "#666", fontSize: "0.7rem" }}>
          © 2025 Milo Lubricantes
        </Typography>
      </Paper>
    </Box>
  )
}

export default Sidebar
