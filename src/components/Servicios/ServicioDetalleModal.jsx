"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Chip,
  Grid,
  IconButton,
  Paper,
  Alert,
} from "@mui/material"
import {
  Close as CloseIcon,
  Build as BuildIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  Inventory as PackageIcon,
  Description as FileTextIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as DollarSignIcon,
  CreditCard as CreditCardIcon,
  Phone as PhoneIcon,
  LocationOn as MapPinIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as XCircleIcon,
  AccessTime as ClockIcon,
  Tag as HashIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
} from "@mui/icons-material"

const ServicioDetalleModal = ({ open, onClose, servicio }) => {
  const [activeTab, setActiveTab] = useState(0)

  const formatDate = (dateString) => {
    if (!dateString) return "No disponible"
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount) => {
    if (!amount) return "$0"
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount)
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  if (!servicio) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          bgcolor: "#d84315",
          color: "white",
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              p: 1,
              bgcolor: "rgba(255, 255, 255, 0.2)",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BuildIcon />
          </Box>
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", mb: 0.5 }}>
              {servicio.numero}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.9)" }}>
              {servicio.items?.length > 0
                ? `${servicio.items.length} tipo${servicio.items.length > 1 ? "s" : ""} de servicio realizados`
                : "Detalles completos del servicio"}
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
      </DialogTitle>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              minHeight: 56,
              "&.Mui-selected": {
                color: "#d84315",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#d84315",
            },
          }}
        >
          <Tab icon={<BuildIcon />} label="Servicio" iconPosition="start" sx={{ gap: 1 }} />
          <Tab icon={<PersonIcon />} label="Cliente" iconPosition="start" sx={{ gap: 1 }} />
          <Tab icon={<CarIcon />} label="Vehículo" iconPosition="start" sx={{ gap: 1 }} />
        </Tabs>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 3 }}>
        {/* Servicio Tab */}
        {activeTab === 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* General Information Card */}
            <Card elevation={2}>
              <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderBottom: 1, borderColor: "divider" }}>
                <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, color: "#171717" }}>
                  <BuildIcon sx={{ color: "#d84315" }} />
                  Información General del Servicio
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={3}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <HashIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        Número de Servicio
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ fontFamily: "monospace", color: "#d84315", fontWeight: "bold" }}>
                      {servicio.numero}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} lg={3}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <PackageIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        Tipos de Servicio
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ color: "#d84315", fontWeight: "bold" }}>
                      {servicio.items?.length || 0} servicio{(servicio.items?.length || 0) !== 1 ? "s" : ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} lg={3}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <DollarSignIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        Precio de Referencia
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ color: "green", fontWeight: "bold" }}>
                      {formatCurrency(servicio.precio_referencia)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} lg={3}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        Fecha de Creación
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: "#171717", fontWeight: "medium" }}>
                      {formatDate(servicio.created_at)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card elevation={2}>
              <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderBottom: 1, borderColor: "divider" }}>
                <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, color: "#171717" }}>
                  <BusinessIcon sx={{ color: "#d84315" }} />
                  Sucursal y Personal
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <BusinessIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        Sucursal
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{ color: "#171717", fontWeight: "bold" }}>
                      {servicio.sucursal_nombre || "No especificada"}
                    </Typography>
                    {servicio.sucursal_ubicacion && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {servicio.sucursal_ubicacion}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                      <GroupIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        Personal Asignado
                      </Typography>
                    </Box>
                    {servicio.empleados && servicio.empleados.length > 0 ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {servicio.empleados.map((empleado, index) => (
                          <Chip
                            key={index}
                            icon={<PersonIcon />}
                            label={`${empleado.nombre} ${empleado.apellido}`}
                            variant="outlined"
                            sx={{
                              color: "#d84315",
                              borderColor: "#d84315",
                              "& .MuiChip-icon": { color: "#d84315" },
                            }}
                          />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                        Sin personal asignado
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Services Performed */}
            {servicio.items && servicio.items.length > 0 && (
              <Card elevation={2}>
                <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderBottom: 1, borderColor: "divider" }}>
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, color: "#171717" }}>
                      <PackageIcon sx={{ color: "#d84315" }} />
                      Servicios Realizados
                    </Typography>
                    <Chip
                      label={`${servicio.items.length} tipo${servicio.items.length > 1 ? "s" : ""}`}
                      sx={{ bgcolor: "#d84315", color: "white" }}
                    />
                  </Box>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {servicio.items.map((item, index) => (
                      <Grid item xs={12} xl={6} key={index}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 3,
                            border: 2,
                            borderColor: "rgba(216, 67, 21, 0.2)",
                            borderRadius: 2,
                            "&:hover": {
                              boxShadow: 3,
                              borderColor: "rgba(216, 67, 21, 0.4)",
                            },
                            transition: "all 0.2s",
                          }}
                        >
                          {/* Service Type Header */}
                          <Box sx={{ pb: 2, borderBottom: 1, borderColor: "divider", mb: 2 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <Box>
                                <Typography variant="h6" sx={{ color: "#171717", fontWeight: "bold", mb: 0.5 }}>
                                  {item.tipo_servicio_nombre || `Servicio ${index + 1}`}
                                </Typography>
                                {item.tipo_servicio_descripcion && (
                                  <Typography variant="body2" color="text.secondary">
                                    {item.tipo_servicio_descripcion}
                                  </Typography>
                                )}
                              </Box>
                              <Chip
                                icon={<PackageIcon />}
                                label={`${item.productos?.length || 0} productos`}
                                variant="outlined"
                                sx={{ color: "#d84315", borderColor: "#d84315" }}
                                size="small"
                              />
                            </Box>
                          </Box>

                          {/* Products Used */}
                          {item.productos && item.productos.length > 0 ? (
                            <Box sx={{ mb: 2 }}>
                              <Typography
                                variant="subtitle2"
                                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5, color: "#171717" }}
                              >
                                <PackageIcon sx={{ fontSize: 16, color: "#d84315" }} />
                                Productos Utilizados
                              </Typography>
                              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {item.productos.map((producto, prodIndex) => (
                                  <Paper
                                    key={prodIndex}
                                    sx={{
                                      p: 1.5,
                                      bgcolor: "#f5f5f5",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                      <Box
                                        sx={{
                                          p: 0.5,
                                          bgcolor: "white",
                                          borderRadius: "50%",
                                          border: 1,
                                          borderColor: "divider",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <PackageIcon sx={{ fontSize: 12, color: "#d84315" }} />
                                      </Box>
                                      <Typography variant="body2" sx={{ fontWeight: "medium", color: "#171717" }}>
                                        {producto.nombre}
                                      </Typography>
                                    </Box>
                                    {producto.es_nuestro ? (
                                      <Chip
                                        icon={<CheckCircleIcon />}
                                        label="Nuestro"
                                        size="small"
                                        sx={{ bgcolor: "#e8f5e8", color: "#2e7d32" }}
                                      />
                                    ) : (
                                      <Chip
                                        icon={<XCircleIcon />}
                                        label="Del Cliente"
                                        size="small"
                                        sx={{ bgcolor: "#e3f2fd", color: "#1976d2" }}
                                      />
                                    )}
                                  </Paper>
                                ))}
                              </Box>
                            </Box>
                          ) : (
                            <Paper
                              sx={{
                                p: 3,
                                textAlign: "center",
                                bgcolor: "#f5f5f5",
                                border: 2,
                                borderStyle: "dashed",
                                borderColor: "divider",
                                mb: 2,
                              }}
                            >
                              <PackageIcon sx={{ fontSize: 32, color: "text.disabled", mb: 1 }} />
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: "medium", color: "text.secondary", mb: 0.5 }}
                              >
                                No se utilizaron productos específicos
                              </Typography>
                              <Typography variant="caption" color="text.disabled">
                                Este servicio no requirió productos adicionales
                              </Typography>
                            </Paper>
                          )}

                          {/* Observations and Notes */}
                          <Box>
                            {item.observaciones && (
                              <Box sx={{ mb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, color: "#171717" }}
                                >
                                  <FileTextIcon sx={{ fontSize: 16, color: "#d84315" }} />
                                  Observaciones
                                </Typography>
                                <Alert severity="info" sx={{ "& .MuiAlert-message": { fontSize: "0.875rem" } }}>
                                  {item.observaciones}
                                </Alert>
                              </Box>
                            )}
                            {item.notas && (
                              <Box sx={{ mb: 1.5 }}>
                                <Typography
                                  variant="subtitle2"
                                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, color: "#171717" }}
                                >
                                  <ClockIcon sx={{ fontSize: 16, color: "#d84315" }} />
                                  Notas Adicionales
                                </Typography>
                                <Alert severity="warning" sx={{ "& .MuiAlert-message": { fontSize: "0.875rem" } }}>
                                  {item.notas}
                                </Alert>
                              </Box>
                            )}
                            {!item.observaciones && !item.notas && (
                              <Paper
                                sx={{
                                  p: 2,
                                  textAlign: "center",
                                  bgcolor: "#f5f5f5",
                                  border: 1,
                                  borderColor: "divider",
                                }}
                              >
                                <FileTextIcon sx={{ fontSize: 24, color: "text.disabled", mb: 0.5 }} />
                                <Typography variant="caption" color="text.disabled">
                                  No hay observaciones o notas adicionales
                                </Typography>
                              </Paper>
                            )}
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* General Observations */}
            {servicio.observaciones && (
              <Card elevation={2}>
                <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderBottom: 1, borderColor: "divider" }}>
                  <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, color: "#171717" }}>
                    <FileTextIcon sx={{ color: "#d84315" }} />
                    Observaciones Generales del Servicio
                  </Typography>
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Alert
                    severity="warning"
                    sx={{
                      bgcolor: "linear-gradient(to right, #fff3e0, #ffebee)",
                      borderLeft: 4,
                      borderLeftColor: "#d84315",
                      "& .MuiAlert-message": { fontSize: "1rem", lineHeight: 1.6 },
                    }}
                  >
                    {servicio.observaciones}
                  </Alert>
                </CardContent>
              </Card>
            )}

            {/* Show message if no service items */}
            {(!servicio.items || servicio.items.length === 0) && (
              <Card elevation={2}>
                <CardContent sx={{ p: 6, textAlign: "center" }}>
                  <BuildIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
                  <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
                    No hay servicios registrados
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Este servicio no tiene tipos de servicios asociados
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {/* Cliente Tab */}
        {activeTab === 1 && (
          <Card elevation={2}>
            <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderBottom: 1, borderColor: "divider" }}>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, color: "#171717" }}>
                <PersonIcon sx={{ color: "#d84315" }} />
                Información del Cliente
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Nombre Completo
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#171717", fontWeight: "bold" }}>
                    {servicio.cliente_nombre && servicio.cliente_apellido
                      ? `${servicio.cliente_nombre} ${servicio.cliente_apellido}`
                      : "Cliente no encontrado"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <CreditCardIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      DNI
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontFamily: "monospace", fontWeight: "medium", color: "#171717" }}>
                    {servicio.cliente_dni || "No especificado"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      Teléfono
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#171717" }}>
                    {servicio.cliente_telefono || "No especificado"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <MapPinIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      Dirección
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#171717" }}>
                    {servicio.cliente_direccion || "No especificada"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Vehículo Tab */}
        {activeTab === 2 && (
          <Card elevation={2}>
            <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderBottom: 1, borderColor: "divider" }}>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1, color: "#171717" }}>
                <CarIcon sx={{ color: "#d84315" }} />
                Información del Vehículo
              </Typography>
            </Box>
            <CardContent sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Patente
                  </Typography>
                  <Typography variant="h6" sx={{ fontFamily: "monospace", color: "#d84315", fontWeight: "bold" }}>
                    {servicio.patente || "No especificada"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Marca y Modelo
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#171717", fontWeight: "bold" }}>
                    {servicio.marca} {servicio.modelo}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Año
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#171717" }}>
                    {servicio.año || "No especificado"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <SpeedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                    <Typography variant="body2" color="text.secondary">
                      Kilometraje
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: "medium", color: "#171717" }}>
                    {servicio.kilometraje ? `${servicio.kilometraje.toLocaleString()} km` : "No especificado"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ServicioDetalleModal
