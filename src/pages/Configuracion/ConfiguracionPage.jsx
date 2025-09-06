"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useSearchParams } from "react-router-dom"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Tabs,
  Tab,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  InputAdornment,
  Divider,
} from "@mui/material"
import {
  Settings,
  Business,
  Person,
  Save,
  Email,
  Phone,
  LocationOn,
  Description,
  Lock,
  Cancel,
} from "@mui/icons-material"
import { useAuth } from "../../contexts/AuthContext"
import configuracionService from "../../services/configuracionService"
import ChangePasswordModal from "../../components/Auth/ChangePasswordModal"

const businessSchema = yup.object({
  nombreNegocio: yup.string().required("El nombre del negocio es requerido"),
  direccion: yup.string().required("La dirección es requerida"),
  telefono: yup.string().required("El teléfono es requerido"),
  email: yup.string().email("Email inválido").required("El email es requerido"),
  cuit: yup.string().matches(/^\d{2}-\d{8}-\d{1}$/, "CUIT inválido (formato: XX-XXXXXXXX-X)"),
})

const ConfiguracionPage = () => {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false)

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") === "profile" ? 1 : 0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(businessSchema),
    defaultValues: {
      nombreNegocio: "Milo Lubricantes",
      direccion: "",
      telefono: "",
      email: "",
      cuit: "",
    },
  })

  useEffect(() => {
    cargarConfiguracion()
  }, [])

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "profile") {
      setActiveTab(1)
    } else {
      setActiveTab(0)
    }
  }, [searchParams])

  const cargarConfiguracion = async () => {
    try {
      setInitialLoading(true)
      const config = await configuracionService.getConfiguracion()
      if (config) {
        Object.keys(config).forEach((key) => {
          setValue(key, config[key])
        })
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al cargar la configuración",
        severity: "error",
      })
    } finally {
      setInitialLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await configuracionService.updateConfiguracion(data)
      setSnackbar({
        open: true,
        message: "Configuración guardada exitosamente",
        severity: "success",
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al guardar la configuración",
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  if (initialLoading) {
    return (
      <Backdrop open={true} sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CircularProgress color="inherit" />
          <Typography sx={{ mt: 2 }}>Cargando configuración...</Typography>
        </Box>
      </Backdrop>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "#171717", mb: 0.5 }}>
            Configuración
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Gestiona la información del negocio y tu perfil
          </Typography>
        </Box>
      </Box>

      <Card elevation={2} sx={{ borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 500,
            },
            "& .Mui-selected": {
              color: "#d84315 !important",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#d84315",
            },
          }}
        >
          <Tab icon={<Business />} label="Información del Negocio" iconPosition="start" sx={{ minHeight: 64 }} />
          <Tab icon={<Person />} label="Mi Perfil" iconPosition="start" sx={{ minHeight: 64 }} />
        </Tabs>

        <CardContent sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Typography variant="h6" sx={{ mb: 3, display: "flex", alignItems: "center", color: "#d84315" }}>
                <Business sx={{ mr: 1 }} />
                Datos del Negocio
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nombre del Negocio"
                    {...register("nombreNegocio")}
                    error={!!errors.nombreNegocio}
                    helperText={errors.nombreNegocio?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#d84315",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#d84315",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="CUIT"
                    placeholder="XX-XXXXXXXX-X"
                    {...register("cuit")}
                    error={!!errors.cuit}
                    helperText={errors.cuit?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#d84315",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#d84315",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Dirección"
                    {...register("direccion")}
                    error={!!errors.direccion}
                    helperText={errors.direccion?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOn color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#d84315",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#d84315",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Teléfono"
                    {...register("telefono")}
                    error={!!errors.telefono}
                    helperText={errors.telefono?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#d84315",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#d84315",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#d84315",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#d84315",
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={() => reset()}
                  disabled={loading}
                  startIcon={<Cancel />}
                  sx={{
                    borderColor: "#171717",
                    color: "#171717",
                    "&:hover": {
                      borderColor: "#171717",
                      backgroundColor: "rgba(23, 23, 23, 0.04)",
                    },
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                  sx={{
                    backgroundColor: "#d84315",
                    "&:hover": {
                      backgroundColor: "rgba(216, 67, 21, 0.9)",
                    },
                    borderRadius: 2,
                  }}
                >
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
              </Box>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, display: "flex", alignItems: "center", color: "#d84315" }}>
                <Person sx={{ mr: 1 }} />
                Mi Perfil
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    value={user?.nombre || ""}
                    disabled
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={user?.email || ""}
                    disabled
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Rol"
                    value={user?.role === "admin" ? "Administrador" : "Empleado"}
                    disabled
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Settings color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                  />
                </Grid>

              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Para modificar tu información personal, contacta al administrador del sistema.
              </Typography>

              <Button
                variant="outlined"
                startIcon={<Lock />}
                onClick={() => setChangePasswordModalOpen(true)}
                sx={{
                  borderColor: "#d84315",
                  color: "#d84315",
                  "&:hover": {
                    borderColor: "#d84315",
                    backgroundColor: "rgba(216, 67, 21, 0.04)",
                  },
                }}
              >
                Cambiar Contraseña
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <ChangePasswordModal open={changePasswordModalOpen} onClose={() => setChangePasswordModalOpen(false)} />
    </Box>
  )
}

export default ConfiguracionPage
