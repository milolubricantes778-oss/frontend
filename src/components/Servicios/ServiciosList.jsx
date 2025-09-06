"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Tooltip,
} from "@mui/material"
import { Edit, Delete, Visibility } from "@mui/icons-material"

const ServiciosList = ({ servicios, onEdit, onDelete, onView, loading }) => {
  const formatearFecha = (fecha) => {
    if (!fecha) return "-"
    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Typography>Cargando servicios...</Typography>
      </Box>
    )
  }

  if (servicios.length === 0) {
    return (
      <Box textAlign="center" p={3}>
        <Typography variant="h6" color="textSecondary">
          No hay servicios registrados
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Crea tu primera orden de servicio para comenzar
        </Typography>
      </Box>
    )
  }

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: "#d84315" }}>
            <TableCell sx={{ fontWeight: "bold", color: "white" }}>Número</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "white" }}>Cliente</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "white" }}>Vehículo</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "white" }}>Sucursal</TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "white" }}>Items</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", color: "white" }}>
              Total
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "white" }}>Fecha</TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {servicios.map((servicio) => (
            <TableRow key={servicio.id} hover sx={{ "&:hover": { bgcolor: "rgba(216, 67, 21, 0.05)" } }}>
              <TableCell>
                <Typography variant="body2" fontWeight="bold" sx={{ color: "#d84315" }}>
                  {servicio.numero}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: "#171717" }}>
                  {servicio.cliente_nombre && servicio.cliente_apellido
                    ? `${servicio.cliente_nombre} ${servicio.cliente_apellido}`
                    : "Cliente no encontrado"}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  DNI: {servicio.cliente_dni || "N/A"}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: "#171717" }}>
                  {servicio.patente || "N/A"}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {servicio.marca} {servicio.modelo} {servicio.año}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: "#171717" }}>
                  {servicio.sucursal_nombre || "N/A"}
                </Typography>
              </TableCell>
              <TableCell>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: "#d84315" }}>
                    {servicio.items_count || 0}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {servicio.items_count === 1 ? "servicio" : "servicios"}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" fontWeight="bold" sx={{ color: "#d84315" }}>
                  ${servicio.precio_referencia?.toLocaleString() || "0"}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" sx={{ color: "#171717" }}>
                  {formatearFecha(servicio.created_at)}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                  <Tooltip title="Ver Detalle">
                    <IconButton
                      size="small"
                      onClick={() => onView(servicio)}
                      sx={{
                        color: "#d84315",
                        "&:hover": { bgcolor: "rgba(216, 67, 21, 0.1)" },
                      }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(servicio)}
                      sx={{
                        color: "#171717",
                        "&:hover": { bgcolor: "rgba(23, 23, 23, 0.1)" },
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(servicio)}
                      sx={{
                        color: "#f44336",
                        "&:hover": { bgcolor: "rgba(244, 67, 54, 0.1)" },
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default ServiciosList
