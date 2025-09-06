"use client"

import { useState } from "react"
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
  Typography,
  Box,
  TablePagination,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material"
import { Edit as EditIcon, Delete as DeleteIcon, DirectionsCar as CarIcon } from "@mui/icons-material"

const VehiculosList = ({ vehiculos, loading, pagination, onEdit, onDelete, onPageChange, onRowsPerPageChange }) => {
  const [deleteDialog, setDeleteDialog] = useState({ open: false, vehiculo: null })

  const handleDeleteClick = (vehiculo) => {
    setDeleteDialog({ open: true, vehiculo })
  }

  const handleDeleteConfirm = () => {
    if (deleteDialog.vehiculo) {
      onDelete(deleteDialog.vehiculo.id)
    }
    setDeleteDialog({ open: false, vehiculo: null })
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, vehiculo: null })
  }

  const handleChangePage = (event, newPage) => {
    onPageChange(newPage + 1)
  }

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = Number.parseInt(event.target.value, 10)
    onRowsPerPageChange(newRowsPerPage)
  }

  const formatKilometraje = (km) => {
    return new Intl.NumberFormat("es-AR").format(km) + " km"
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Cargando vehículos...</Typography>
      </Box>
    )
  }

  if (!vehiculos || !Array.isArray(vehiculos) || vehiculos.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="200px"
        textAlign="center"
      >
        <CarIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
        <Typography variant="h6" color="textSecondary">
          No hay vehículos registrados
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Comienza agregando el primer vehículo
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#d84315" }}>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Patente</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Marca/Modelo</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Año</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Color</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Kilometraje</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Estado</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", color: "white" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehiculos.map((vehiculo) => (
              <TableRow
                key={vehiculo.id}
                sx={{
                  "&:hover": { bgcolor: "rgba(216, 67, 21, 0.08)" },
                  opacity: vehiculo.activo ? 1 : 0.6,
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" fontWeight="bold" sx={{ color: "#171717" }}>
                      {vehiculo.patente}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: "#171717" }}>
                    {vehiculo.cliente_nombre || "Cliente no encontrado"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium" sx={{ color: "#171717" }}>
                    {vehiculo.marca} {vehiculo.modelo}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: "#171717" }}>
                    {vehiculo.año}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: "#171717" }}>
                    {vehiculo.color}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: "#171717" }}>
                    {formatKilometraje(vehiculo.kilometraje)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={vehiculo.activo ? "Activo" : "Inactivo"}
                    color={vehiculo.activo ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" gap={0.5} justifyContent="center">
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(vehiculo)}
                        sx={{
                          color: "#d84315",
                          "&:hover": { bgcolor: "rgba(216, 67, 21, 0.1)" },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(vehiculo)}
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

        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.currentPage - 1}
          onPageChange={handleChangePage}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
          labelRowsPerPage="Filas por página:"
          sx={{
            borderTop: "1px solid #e0e0e0",
            ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
              fontSize: "0.875rem",
              color: "#171717",
            },
            ".MuiTablePagination-select": {
              color: "#171717",
            },
            ".MuiIconButton-root": {
              color: "#171717",
              "&:hover": {
                bgcolor: "rgba(216, 67, 21, 0.1)",
              },
            },
          }}
        />
      </TableContainer>

      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle sx={{ bgcolor: "#d84315", color: "white", fontWeight: "bold" }}>Confirmar Eliminación</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography sx={{ color: "#171717" }}>
            ¿Estás seguro de que deseas eliminar el vehículo <strong>{deleteDialog.vehiculo?.patente}</strong>?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleDeleteCancel}
            sx={{
              color: "#171717",
              "&:hover": { bgcolor: "rgba(23, 23, 23, 0.1)" },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              bgcolor: "#f44336",
              "&:hover": { bgcolor: "#d32f2f" },
            }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default VehiculosList
