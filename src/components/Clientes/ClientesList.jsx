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
  Chip,
  TablePagination,
  Tooltip,
  Box,
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material"

const ClientesList = ({ clientes, loading, pagination, onPageChange, onEdit, onDelete, onViewMore }) => {
  const handleRowsPerPageChange = (event) => {
    const newLimit = Number.parseInt(event.target.value, 10)
    onPageChange(1, newLimit) // Reset to page 1 with new limit
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("es-AR")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500">Cargando clientes...</div>
      </div>
    )
  }

  if (!clientes || clientes.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-2">No se encontraron clientes</div>
        <div className="text-sm text-gray-400">Utiliza el botón "Nuevo Cliente" para agregar el primer cliente</div>
      </div>
    )
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold", color: "#171717" }}>Cliente ({pagination.total || 0})</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#171717" }}>DNI</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#171717" }}>Teléfono</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#171717" }}>Dirección</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#171717" }}>Registro</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#171717" }} align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow
                key={cliente.id}
                sx={{
                  "&:hover": { bgcolor: "rgba(204, 122, 63, 0.04)" },
                  opacity: cliente.activo ? 1 : 0.6,
                }}
              >
                <TableCell>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {cliente.nombre} {cliente.apellido}
                    </div>
                    {!cliente.activo && (
                      <Chip label="Inactivo" size="small" color="error" variant="outlined" sx={{ mt: 0.5 }} />
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">
                    {cliente.dni ? (
                      <>
                        <BadgeIcon sx={{ fontSize: 16, color: "#666" }} />
                        <span className="font-mono text-sm">{cliente.dni}</span>
                      </>
                    ) : (
                      <span className="text-gray-400 text-sm">Sin DNI</span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">
                    {cliente.telefono ? (
                      <>
                        <PhoneIcon sx={{ fontSize: 16, color: "#666" }} />
                        <span className="text-sm">{cliente.telefono} </span>
                      </>
                    ) : (
                      <span className="text-gray-400 text-sm">Sin teléfono</span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-start gap-1">
                    {cliente.direccion ? (
                      <>
                        <LocationIcon sx={{ fontSize: 16, color: "#666", mt: 0.2 }} />
                        <span className="text-sm">{cliente.direccion}</span>
                      </>
                    ) : (
                      <span className="text-gray-400 text-sm">Sin dirección</span>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-sm text-gray-600">{formatDate(cliente.created_at)}</span>
                </TableCell>

                <TableCell align="center">
                  <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                    <Tooltip title="Ver más">
                      <IconButton
                        onClick={() => onViewMore(cliente)}
                        size="small"
                        sx={{
                          color: "#2196F3",
                          "&:hover": { bgcolor: "rgba(33, 150, 243, 0.1)" },
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Editar cliente">
                      <IconButton
                        onClick={() => onEdit(cliente)}
                        size="small"
                        sx={{
                          color: "#CC7A3F",
                          "&:hover": { bgcolor: "rgba(204, 122, 63, 0.1)" },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar cliente">
                      <IconButton
                        onClick={() => onDelete(cliente)}
                        size="small"
                        sx={{
                          color: "#f44336",
                          "&:hover": { bgcolor: "rgba(244, 67, 54, 0.1)" },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        component="div"
        count={pagination.total}
        page={pagination.currentPage - 1}
        onPageChange={(event, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={pagination.limit}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
        sx={{
          borderTop: "1px solid #e0e0e0",
          ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
            fontSize: "0.875rem",
          },
        }}
      />
    </>
  )
}

export default ClientesList
