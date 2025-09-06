"use client"
import { Card, CardContent, Typography, Box, Chip, Grid, Button, Divider, Paper } from "@mui/material"
import {
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  Build as BuildIcon,
  Phone as PhoneIcon,
  Launch as LaunchIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  Chat as ChatIcon,
} from "@mui/icons-material"

const ClienteCard = ({ cliente }) => {
  const handleViewAllServices = () => {
    window.location.href = `/reportes?cliente=${cliente.id}`
  }

  const handleViewServiceDetail = (servicioId) => {
    window.location.href = `/reportes?servicio=${servicioId}&autoOpen=true`
  }

  const vehiculos = cliente.vehiculos || []
  const servicios = cliente.servicios || []

  const latestService = servicios.length > 0 ? servicios[0] : null

  const getVehicleForService = (servicio) => {
    return vehiculos.find((v) => v.id === servicio.vehiculo_id) || null
  }

  const getServiceTypesCount = (servicio) => {
    return servicio.items_count || servicio.items?.length || 1
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "N/A"
      }
      return date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return "N/A"
    }
  }

  return (
    <Card
      elevation={3}
      sx={{
        width: "100%",
        border: "2px solid",
        borderColor: "#d84315",
        borderRadius: 2,
        "&:hover": {
          boxShadow: 6,
          transform: "translateY(-2px)",
          transition: "all 0.3s ease",
        },
        background: "linear-gradient(135deg, #ffffff 0%, rgba(216, 67, 21, 0.05) 100%)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: "linear-gradient(135deg, rgba(216, 67, 21, 0.1) 0%, rgba(216, 67, 21, 0.05) 100%)",
          borderBottom: "2px solid",
          borderBottomColor: "rgba(216, 67, 21, 0.2)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: "#d84315",
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <PersonIcon sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#171717", mb: 0.5 }}>
                {cliente.nombre} {cliente.apellido}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {cliente.dni && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <PersonIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">
                      DNI: {cliente.dni}
                    </Typography>
                  </Box>
                )}
                {cliente.telefono && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <PhoneIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">
                      {cliente.telefono}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Chip
              label={`${vehiculos.length} vehículo${vehiculos.length !== 1 ? "s" : ""}`}
              size="small"
              sx={{
                bgcolor: "white",
                color: "#d84315",
                border: "1px solid rgba(216, 67, 21, 0.3)",
                fontWeight: "medium",
              }}
            />
            <Chip
              label={`${servicios.length} servicio${servicios.length !== 1 ? "s" : ""}`}
              size="small"
              sx={{
                bgcolor: "rgba(216, 67, 21, 0.1)",
                color: "#d84315",
                border: "1px solid rgba(216, 67, 21, 0.3)",
                fontWeight: "medium",
              }}
            />
          </Box>
        </Box>
      </Box>

      <CardContent sx={{ p: 3 }}>
        {/* Vehículos Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <CarIcon sx={{ color: "#d84315", fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#171717" }}>
              Vehículos
            </Typography>
            <Chip
              label={vehiculos.length}
              size="small"
              sx={{
                bgcolor: "rgba(216, 67, 21, 0.1)",
                color: "#d84315",
                fontSize: "0.75rem",
                fontWeight: "medium",
              }}
            />
          </Box>

          {vehiculos.length > 0 ? (
            <Grid container spacing={2}>
              {vehiculos.map((vehiculo, index) => (
                <Grid item xs={12} md={6} key={vehiculo.id || index}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      bgcolor: "grey.50",
                      border: "1px solid",
                      borderColor: "grey.200",
                      borderRadius: 2,
                      "&:hover": {
                        borderColor: "rgba(216, 67, 21, 0.3)",
                        transition: "border-color 0.2s ease",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#171717" }}>
                          {vehiculo.patente}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {vehiculo.marca} {vehiculo.modelo}
                        </Typography>
                      </Box>
                      {vehiculo.año && (
                        <Chip
                          label={vehiculo.año}
                          size="small"
                          variant="outlined"
                          sx={{
                            color: "#d84315",
                            borderColor: "#d84315",
                            fontSize: "0.75rem",
                          }}
                        />
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Typography variant="body2" color="text.secondary">
                No hay vehículos registrados
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Último Servicio Section */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <BuildIcon sx={{ color: "#d84315", fontSize: 20 }} />
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#171717" }}>
              Último Servicio
            </Typography>
          </Box>

          {servicios.length > 0 && latestService ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  background: "linear-gradient(135deg, rgba(216, 67, 21, 0.1) 0%, rgba(216, 67, 21, 0.05) 100%)",
                  border: "2px solid rgba(216, 67, 21, 0.3)",
                  borderRadius: 2,
                  "&:hover": {
                    borderColor: "rgba(216, 67, 21, 0.4)",
                    transition: "border-color 0.2s ease",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#171717" }}>
                      {latestService.numero}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(latestService.created_at)}
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={4}>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: "rgba(255, 255, 255, 0.5)",
                        border: "1px solid rgba(216, 67, 21, 0.2)",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <BuildIcon sx={{ color: "#d84315", fontSize: 16 }} />
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                        >
                          Servicios realizados
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#d84315" }}>
                          {getServiceTypesCount(latestService)} tipo
                          {getServiceTypesCount(latestService) !== 1 ? "s" : ""}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  {(() => {
                    const vehicle = getVehicleForService(latestService)
                    return vehicle ? (
                      <Grid item xs={12} md={4}>
                        <Paper
                          sx={{
                            p: 2,
                            bgcolor: "rgba(255, 255, 255, 0.5)",
                            border: "1px solid rgba(216, 67, 21, 0.2)",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <CarIcon sx={{ color: "#d84315", fontSize: 16 }} />
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                            >
                              Vehículo
                            </Typography>
                            <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#d84315" }}>
                              {vehicle.patente}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {vehicle.marca} {vehicle.modelo}
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    ) : null
                  })()}

                  {latestService.precio_referencia && (
                    <Grid item xs={12} md={4}>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: "rgba(255, 255, 255, 0.5)",
                          border: "1px solid rgba(216, 67, 21, 0.2)",
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <MoneyIcon sx={{ color: "#d84315", fontSize: 16 }} />
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                          >
                            Precio
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#d84315" }}>
                            ${Number.parseFloat(latestService.precio_referencia).toLocaleString()}
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  )}
                </Grid>

                {(latestService.observaciones || latestService.notas) && (
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    {latestService.observaciones && (
                      <Grid item xs={12} md={6}>
                        <Paper
                          sx={{
                            p: 2,
                            bgcolor: "rgba(255, 255, 255, 0.5)",
                            border: "1px solid rgba(216, 67, 21, 0.2)",
                            borderRadius: 2,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <DescriptionIcon sx={{ color: "#d84315", fontSize: 16 }} />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ textTransform: "uppercase", letterSpacing: 0.5, fontWeight: "medium" }}
                            >
                              Observaciones
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {latestService.observaciones}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}

                    {latestService.notas && (
                      <Grid item xs={12} md={6}>
                        <Paper
                          sx={{
                            p: 2,
                            bgcolor: "rgba(255, 255, 255, 0.5)",
                            border: "1px solid rgba(216, 67, 21, 0.2)",
                            borderRadius: 2,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <ChatIcon sx={{ color: "#d84315", fontSize: 16 }} />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ textTransform: "uppercase", letterSpacing: 0.5, fontWeight: "medium" }}
                            >
                              Notas Internas
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {latestService.notas}
                          </Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                )}

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    onClick={() => handleViewServiceDetail(latestService.id)}
                    variant="contained"
                    size="small"
                    endIcon={<LaunchIcon />}
                    sx={{
                      bgcolor: "#d84315",
                      "&:hover": { bgcolor: "rgba(216, 67, 21, 0.9)" },
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: "medium",
                    }}
                  >
                    Ver Detalle
                  </Button>
                </Box>
              </Paper>

              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  background: "linear-gradient(135deg, #f5f5f5 0%, rgba(216, 67, 21, 0.05) 100%)",
                  border: "1px solid rgba(216, 67, 21, 0.2)",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#171717" }}>
                    Historial Completo
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {servicios.length} servicio{servicios.length !== 1 ? "s" : ""} registrado
                    {servicios.length !== 1 ? "s" : ""} en total
                  </Typography>
                </Box>
                <Button
                  onClick={handleViewAllServices}
                  variant="contained"
                  endIcon={<LaunchIcon />}
                  sx={{
                    bgcolor: "#d84315",
                    "&:hover": { bgcolor: "rgba(216, 67, 21, 0.9)" },
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: "medium",
                  }}
                >
                  Ver Todos
                </Button>
              </Paper>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <BuildIcon sx={{ fontSize: 32, color: "grey.300", mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No hay servicios registrados
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  )
}

export default ClienteCard
