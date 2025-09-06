"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
  Divider,
} from "@mui/material"
import {
  Close as CloseIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CreditCard as CreditCardIcon,
  CalendarToday as CalendarIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material"
import vehiculosService from "../../services/vehiculosService"

const ClienteDetalleModal = ({ open, onClose, cliente }) => {
  const [activeTab, setActiveTab] = useState(0)
  const [vehiculos, setVehiculos] = useState([])
  const [loadingVehiculos, setLoadingVehiculos] = useState(false)
  const [errorVehiculos, setErrorVehiculos] = useState(null)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)

    if (newValue === 1 && vehiculos.length === 0) {
      loadVehiculos()
    }
  }

  const loadVehiculos = async () => {
    try {
      setLoadingVehiculos(true)
      setErrorVehiculos(null)
      const response = await vehiculosService.getByCliente(cliente.id)
      setVehiculos(response || [])
    } catch (error) {
      console.error("Error al cargar vehículos:", error)
      setErrorVehiculos("Error al cargar los vehículos del cliente")
    } finally {
      setLoadingVehiculos(false)
    }
  }

  useEffect(() => {
    if (!open) {
      setVehiculos([])
      setActiveTab(0)
      setErrorVehiculos(null)
    }
  }, [open])

  const formatDate = (dateString) => {
    if (!dateString) return "No disponible"
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatNumber = (number) => {
    if (!number) return "0"
    return new Intl.NumberFormat("es-AR").format(number)
  }

  if (!cliente) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          bgcolor: "#d84315",
          color: "white",
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0, // Prevent header from shrinking
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              width: 48,
              height: 48,
            }}
          >
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {cliente.nombre} {cliente.apellido}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Información completa del cliente
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "white",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          px: 3,
          pt: 2,
          flexShrink: 0, // Prevent tabs from shrinking
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            "& .MuiTab-root": {
              color: "#666",
              "&.Mui-selected": {
                color: "#d84315",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#d84315",
            },
          }}
        >
          <Tab icon={<PersonIcon />} label="General" iconPosition="start" />
          <Tab
            icon={<CarIcon />}
            label={`Vehículos ${vehiculos.length > 0 ? `(${vehiculos.length})` : ""}`}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      <DialogContent
        sx={{
          p: 0,
          flex: 1, // Take remaining space
          overflow: "hidden", // Prevent outer scroll
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            p: 3,
            flex: 1,
            overflowY: "auto", // Only content scrolls
            overflowX: "hidden",
          }}
        >
          {activeTab === 0 && (
            <Box sx={{ space: 3 }}>
              {/* Estado del Cliente */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Typography variant="h6" sx={{ color: "#171717" }}>
                  Estado del Cliente
                </Typography>
                <Chip
                  label={cliente.activo ? "Activo" : "Inactivo"}
                  color={cliente.activo ? "success" : "error"}
                  size="small"
                />
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                {/* Información Personal */}
                <Grid item xs={12}>
                  <Card elevation={2}>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: "#d84315", width: 40, height: 40 }}>
                          <PersonIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ color: "#171717" }}>
                          Información Personal
                        </Typography>
                      </Box>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            Nombre Completo
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {cliente.nombre} {cliente.apellido}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CreditCardIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                            <Box>
                              <Typography variant="body2" color="textSecondary" gutterBottom>
                                DNI
                              </Typography>
                              <Typography variant="body1" fontWeight="medium" sx={{ fontFamily: "monospace" }}>
                                {cliente.dni || "No especificado"}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Información de Contacto */}
                <Grid item xs={12}>
                  <Card elevation={2}>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: "#2196f3", width: 40, height: 40 }}>
                          <PhoneIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ color: "#171717" }}>
                          Información de Contacto
                        </Typography>
                      </Box>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <PhoneIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                            <Box>
                              <Typography variant="body2" color="textSecondary" gutterBottom>
                                Teléfono
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {cliente.telefono || "No especificado"}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                            <LocationIcon sx={{ color: "text.secondary", fontSize: 20, mt: 0.5 }} />
                            <Box>
                              <Typography variant="body2" color="textSecondary" gutterBottom>
                                Dirección
                              </Typography>
                              <Typography variant="body1" fontWeight="medium">
                                {cliente.direccion || "No especificada"}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Información del Sistema */}
                <Grid item xs={12}>
                  <Card elevation={2}>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: "#4caf50", width: 40, height: 40 }}>
                          <CalendarIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ color: "#171717" }}>
                          Información del Sistema
                        </Typography>
                      </Box>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            Fecha de Registro
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {formatDate(cliente.created_at)}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            Última Actualización
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {formatDate(cliente.updated_at)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ color: "#171717", mb: 3 }}>
                Vehículos del Cliente
              </Typography>

              {loadingVehiculos && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress sx={{ color: "#d84315" }} />
                </Box>
              )}

              {errorVehiculos && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {errorVehiculos}
                </Alert>
              )}

              {!loadingVehiculos && !errorVehiculos && vehiculos.length === 0 && (
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <CarIcon sx={{ fontSize: 48, color: "#d84315", mb: 2 }} />
                      <Typography variant="h6" sx={{ color: "#171717", mb: 1 }}>
                        Sin Vehículos Registrados
                      </Typography>
                      <Typography color="textSecondary">Este cliente no tiene vehículos asociados</Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {!loadingVehiculos && vehiculos.length > 0 && (
                <TableContainer component={Paper} elevation={2}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                        <TableCell sx={{ fontWeight: "bold", color: "#171717" }}>Vehículo</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#171717" }}>Patente</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#171717" }}>Año</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#171717" }}>Kilometraje</TableCell>
                        <TableCell sx={{ fontWeight: "bold", color: "#171717" }}>Estado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {vehiculos.map((vehiculo) => (
                        <TableRow
                          key={vehiculo.id}
                          sx={{
                            "&:hover": {
                              bgcolor: "rgba(216, 67, 21, 0.05)",
                            },
                          }}
                        >
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {vehiculo.marca} {vehiculo.modelo}
                              </Typography>
                              {vehiculo.numero_motor && (
                                <Typography variant="caption" color="textSecondary">
                                  Motor: {vehiculo.numero_motor}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium" sx={{ fontFamily: "monospace" }}>
                              {vehiculo.patente}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{vehiculo.año || "N/A"}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <SpeedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                              <Typography variant="body2">{formatNumber(vehiculo.kilometraje)} km</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={vehiculo.activo ? "Activo" : "Inactivo"}
                              color={vehiculo.activo ? "success" : "error"}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ClienteDetalleModal
