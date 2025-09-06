"use client"
import { Card, CardContent, Typography, Box, Chip, Button, Paper } from "@mui/material"
import {
  DirectionsCar as CarIcon,
  Person as PersonIcon,
  Event as EventIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  Visibility as VisibilityIcon,
  Phone as PhoneIcon,
  Speed as SpeedIcon,
  Info as InfoIcon,
} from "@mui/icons-material"

const VehiculoCard = ({ vehiculo }) => {
  const handleVerTodosServicios = () => {
    window.location.href = `/reportes?vehiculo=${vehiculo.patente}`
  }

  const handleVerDetalleServicio = (servicio) => {
    window.location.href = `/reportes?servicio=${servicio.id}&autoOpen=true`
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card
      elevation={2}
      sx={{
        width: "100%",
        border: "1px solid",
        borderColor: "grey.200",
        borderRadius: 2,
        "&:hover": {
          boxShadow: 4,
          transition: "box-shadow 0.2s ease",
        },
        bgcolor: "white",
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Header del Vehículo */}
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                background: "linear-gradient(135deg, #d84315 0%, #bf360c 100%)",
                borderRadius: "50%",
              }}
            >
              <CarIcon sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#171717", mb: 0.5 }}>
                {vehiculo.patente}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                {vehiculo.marca} {vehiculo.modelo} {vehiculo.año}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {vehiculo.kilometraje && (
                  <Chip
                    icon={<SpeedIcon />}
                    label={`${vehiculo.kilometraje.toLocaleString()} km`}
                    size="small"
                    sx={{
                      bgcolor: "grey.100",
                      color: "grey.800",
                      fontSize: "0.75rem",
                      fontWeight: "medium",
                    }}
                  />
                )}
                {vehiculo.observaciones && (
                  <Chip
                    icon={<InfoIcon />}
                    label="Con observaciones"
                    size="small"
                    sx={{
                      color: "warning.dark",
                      fontSize: "0.75rem",
                      fontWeight: "medium",
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 2,
              textAlign: "right",
              minWidth: 200,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, ml: 12 }}>
              <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", letterSpacing: 0.5}}
              >
                Propietario
              </Typography>
            </Box>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#171717", mb: 1 }}>
              {vehiculo.cliente_nombre}
            </Typography>
            {vehiculo.cliente_dni && (
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                DNI: {vehiculo.cliente_dni}
              </Typography>
            )}
            {vehiculo.cliente_telefono && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, justifyContent: "flex-end" }}>
                <PhoneIcon sx={{ fontSize: 12, color: "text.secondary" }} />
                <Typography variant="caption" color="text.secondary">
                  {vehiculo.cliente_telefono}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {vehiculo.observaciones && (
          <Paper
            elevation={1}
            sx={{
              p: 2,
              mb: 3,
              border: "1px solid",
              borderColor: "warning.main",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <InfoIcon sx={{ fontSize: 16, color: "warning.dark" }} />
              <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "warning.dark" }}>
                Observaciones del Vehículo
              </Typography>
            </Box>
            <Typography variant="body2" color="warning.dark">
              {vehiculo.observaciones}
            </Typography>
          </Paper>
        )}

        {/* Servicios del Vehículo */}
        <Paper
          elevation={2}
          sx={{
            background: "linear-gradient(135deg, rgba(216, 67, 21, 0.05) 0%, rgba(216, 67, 21, 0.1) 100%)",
            border: "1px solid rgba(216, 67, 21, 0.2)",
            borderRadius: 2,
          }}
        >
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    p: 1,
                    bgcolor: "#d84315",
                    borderRadius: "50%",
                  }}
                >
                  <DescriptionIcon sx={{ color: "white", fontSize: 20 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#d84315" }}>
                  Historial de Servicios
                </Typography>
              </Box>
              <Chip
                label={`${vehiculo.servicios?.length || 0} servicio${(vehiculo.servicios?.length || 0) !== 1 ? "s" : ""}`}
                sx={{
                  bgcolor: "#d84315",
                  color: "white",
                  fontSize: "1rem",
                  fontWeight: "medium",
                  px: 2,
                  py: 0.5,
                }}
              />
            </Box>

            {vehiculo.servicios && vehiculo.servicios.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Mostrar hasta 3 servicios más recientes */}
                {vehiculo.servicios.slice(0, 3).map((servicio, index) => {
                  return (
                    <Paper
                      key={index}
                      elevation={1}
                      sx={{
                        p: 2,
                        bgcolor: "white",
                        border: "1px solid rgba(216, 67, 21, 0.2)",
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Chip
                          label={servicio.numero}
                          sx={{
                            bgcolor: "#d84315",
                            color: "white",
                            fontWeight: "medium",
                          }}
                        />
                        {index === 0 && (
                          <Chip
                            label="Más Reciente"
                            size="small"
                            variant="outlined"
                            sx={{
                              color: "#d84315",
                              borderColor: "#d84315",
                              fontSize: "0.75rem",
                              fontWeight: "medium",
                              textTransform: "uppercase",
                              letterSpacing: 0.5,
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: "medium", color: "#171717", mb: 2 }}>
                        {servicio.descripcion}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <EventIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(servicio.fecha_creacion)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: "bold", color: "success.main" }}>
                            {formatCurrency(servicio.total)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          onClick={() => handleVerDetalleServicio(servicio)}
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          sx={{
                            color: "#d84315",
                            borderColor: "#d84315",
                            "&:hover": {
                              bgcolor: "rgba(216, 67, 21, 0.1)",
                              borderColor: "#d84315",
                            },
                            borderRadius: 2,
                            textTransform: "none",
                            fontWeight: "medium",
                          }}
                        >
                          Ver Detalle
                        </Button>
                      </Box>
                    </Paper>
                  )
                })}

                {vehiculo.servicios.length > 3 && (
                  <Box sx={{ textAlign: "center", py: 1 }}>
                    <Typography variant="body2" sx={{ color: "#d84315", fontWeight: "medium" }}>
                      + {vehiculo.servicios.length - 3} servicio{vehiculo.servicios.length - 3 !== 1 ? "s" : ""} más
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <DescriptionIcon sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No hay servicios registrados para este vehículo
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Botón Ver Todos los Servicios */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Button
            onClick={handleVerTodosServicios}
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#d84315",
              "&:hover": { bgcolor: "#bf360c" },
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
            }}
          >
            Ver Historial Completo del Vehículo
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default VehiculoCard
