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
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  DirectionsCar as CarIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material"

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
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell>
                <strong>Patente</strong>
              </TableCell>
              <TableCell>
                <strong>Cliente</strong>
              </TableCell>
              <TableCell>
                <strong>Marca/Modelo</strong>
              </TableCell>
              <TableCell>
                <strong>Año</strong>
              </TableCell>
              <TableCell>
                <strong>Color</strong>
              </TableCell>
              <TableCell>
                <strong>Kilometraje</strong>
              </TableCell>
              <TableCell>
                <strong>Estado</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Acciones</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehiculos.map((vehiculo) => (
              <TableRow key={vehiculo.id} hover sx={{ "&:nth-of-type(odd)": { bgcolor: "action.hover" } }}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Typography variant="body2" fontWeight="bold">
                      {vehiculo.patente}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{vehiculo.cliente_nombre || "Cliente no encontrado"}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {vehiculo.marca} {vehiculo.modelo}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{vehiculo.año}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{vehiculo.color}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{formatKilometraje(vehiculo.kilometraje)}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={vehiculo.activo ? "Activo" : "Inactivo"}
                    color={vehiculo.activo ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Box display="flex" gap={1} justifyContent="center">
                    <Tooltip title="Ver detalles">
                      <IconButton size="small" color="info" onClick={() => onEdit(vehiculo)}>
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar">
                      <IconButton size="small" color="primary" onClick={() => onEdit(vehiculo)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(vehiculo)}>
                        <DeleteIcon />
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
        />
      </TableContainer>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialog.open} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el vehículo <strong>{deleteDialog.vehiculo?.patente}</strong>?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default VehiculosList
