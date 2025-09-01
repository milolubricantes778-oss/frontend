"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Tooltip,
} from "@mui/material"
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon } from "@mui/icons-material"
import { useTiposServicios } from "../../hooks/useTiposServicios"

const TiposServiciosPage = () => {
  const {
    tiposServicios,
    loading,
    pagination,
    loadTiposServicios,
    createTipoServicio,
    updateTipoServicio,
    deleteTipoServicio,
    setPagination,
  } = useTiposServicios()

  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTipoServicio, setEditingTipoServicio] = useState(null)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  })
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tipoServicioToDelete, setTipoServicioToDelete] = useState(null)

  useEffect(() => {
    loadTiposServicios()
  }, [])

  useEffect(() => {
    if (pagination.currentPage > 1) {
      loadTiposServicios()
    }
  }, [pagination.currentPage])

  const handleSearch = () => {
    loadTiposServicios(1, searchTerm)
  }

  const handleOpenDialog = (tipoServicio = null) => {
    if (tipoServicio) {
      setEditingTipoServicio(tipoServicio)
      setFormData({
        nombre: tipoServicio.nombre,
        descripcion: tipoServicio.descripcion || "",
      })
    } else {
      setEditingTipoServicio(null)
      setFormData({
        nombre: "",
        descripcion: "",
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingTipoServicio(null)
    setFormData({
      nombre: "",
      descripcion: "",
    })
  }

  const handleSubmit = async () => {
    try {
      if (editingTipoServicio) {
        await updateTipoServicio(editingTipoServicio.id, formData)
      } else {
        await createTipoServicio(formData)
      }
      handleCloseDialog()
    } catch (error) {
      // Error ya manejado por el hook
    }
  }

  const handleDeleteClick = (tipoServicio) => {
    setTipoServicioToDelete(tipoServicio)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (tipoServicioToDelete) {
      try {
        await deleteTipoServicio(tipoServicioToDelete.id)
        setDeleteDialogOpen(false)
        setTipoServicioToDelete(null)
      } catch (error) {
        // Error ya manejado por el hook
      }
    }
  }

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage + 1 }))
  }

  const handleRowsPerPageChange = (event) => {
    setPagination((prev) => ({
      ...prev,
      limit: Number.parseInt(event.target.value, 10),
      currentPage: 1,
    }))
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Tipos de Servicios
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{ bgcolor: "#1976d2" }}
        >
          Nuevo Tipo de Servicio
        </Button>
      </Box>

      {/* Barra de búsqueda */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            fullWidth
            placeholder="Buscar tipos de servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch} sx={{ minWidth: 120 }}>
            Buscar
          </Button>
        </Box>
      </Paper>

      {/* Tabla de tipos de servicios */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Descripción</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Cargando tipos de servicios...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : Array.isArray(tiposServicios) && tiposServicios.length > 0 ? (
                tiposServicios.map((tipoServicio) => (
                  <TableRow key={tipoServicio.id} hover>
                    <TableCell sx={{ fontWeight: "medium" }}>{tipoServicio.nombre}</TableCell>
                    <TableCell>{tipoServicio.descripcion || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={tipoServicio.activo ? "Activo" : "Inactivo"}
                        color={tipoServicio.activo ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Tooltip title="Editar">
                        <IconButton onClick={() => handleOpenDialog(tipoServicio)} color="primary" size="small">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton onClick={() => handleDeleteClick(tipoServicio)} color="error" size="small">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No hay tipos de servicios registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={pagination?.total || 0}
          page={(pagination?.currentPage || 1) - 1}
          onPageChange={handlePageChange}
          rowsPerPage={pagination?.limit || 10}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>

      {/* Dialog para crear/editar */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTipoServicio ? "Editar Tipo de Servicio" : "Nuevo Tipo de Servicio"}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Descripción"
              value={formData.descripcion}
              onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
              margin="normal"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.nombre.trim()}>
            {editingTipoServicio ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el tipo de servicio "{tipoServicioToDelete?.nombre}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TiposServiciosPage
