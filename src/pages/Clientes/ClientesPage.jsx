"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material"
import { useClientes } from "../../hooks/useClientes.js"
import ClientesList from "../../components/Clientes/ClientesList.jsx"
import ClienteForm from "../../components/Clientes/ClienteForm.jsx"
import ClienteDetalleModal from "../../components/Clientes/ClienteDetalleModal.jsx"

const ClientesPage = () => {
  const {
    clientes,
    loading,
    error,
    pagination,
    loadClientes,
    createCliente,
    updateCliente,
    deleteCliente,
    searchClientes,
  } = useClientes()

  const [searchTerm, setSearchTerm] = useState("")
  const [searchCriteria, setSearchCriteria] = useState("nombre")
  const [formOpen, setFormOpen] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [detalleModalOpen, setDetalleModalOpen] = useState(false)
  const [clienteDetalle, setClienteDetalle] = useState(null)

  const handleSearch = () => {
    if (searchTerm.trim()) {
      searchClientes(searchTerm, searchCriteria)
    } else {
      loadClientes(1)
    }
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSearchCriteria("nombre")
    loadClientes(1)
  }

  const handleNewCliente = () => {
    setSelectedCliente(null)
    setFormOpen(true)
  }

  const handleEditCliente = (cliente) => {
    setSelectedCliente(cliente)
    setFormOpen(true)
  }

  const handleDeleteCliente = (cliente) => {
    setClienteToDelete(cliente)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteCliente(clienteToDelete.id)
      setSnackbar({
        open: true,
        message: "Cliente eliminado correctamente",
        severity: "success",
      })
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al eliminar cliente: " + error.message,
        severity: "error",
      })
    } finally {
      setDeleteDialogOpen(false)
      setClienteToDelete(null)
    }
  }

  const handleFormSubmit = async (data) => {
    try {
      if (selectedCliente) {
        await updateCliente(selectedCliente.id, data)
        setSnackbar({
          open: true,
          message: "Cliente actualizado correctamente",
          severity: "success",
        })
      } else {
        await createCliente(data)
        setSnackbar({
          open: true,
          message: "Cliente creado correctamente",
          severity: "success",
        })
      }
      setFormOpen(false)
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al guardar cliente: " + error.message,
        severity: "error",
      })
    }
  }

  const handlePageChange = (page, newLimit = null) => {
    if (newLimit) {
      loadClientes(1, searchTerm, newLimit)
    } else {
      loadClientes(page, searchTerm)
    }
  }

  const handleViewMore = (cliente) => {
    setClienteDetalle(cliente)
    setDetalleModalOpen(true)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "#171717" }}>
            Gestión de Clientes
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Administra la información de tus clientes y mantén un registro completo
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewCliente}
          sx={{
            bgcolor: "#d84315",
            "&:hover": { bgcolor: "#ff5722" },
            minWidth: "200px",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(216, 67, 21, 0.3)",
          }}
        >
          Nuevo Cliente
        </Button>
      </Box>

      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filtros de Búsqueda
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Buscar cliente"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Buscar por</InputLabel>
                <Select
                  value={searchCriteria}
                  label="Buscar por"
                  onChange={(e) => setSearchCriteria(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="nombre">Nombre</MenuItem>
                  <MenuItem value="apellido">Apellido</MenuItem>
                  <MenuItem value="dni">DNI</MenuItem>
                  <MenuItem value="telefono">Teléfono</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  sx={{
                    bgcolor: "#d84315",
                    "&:hover": { bgcolor: "#ff5722" },
                    borderRadius: 2,
                  }}
                >
                  Buscar
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  sx={{
                    borderColor: "#171717",
                    color: "#171717",
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "#171717",
                      bgcolor: "rgba(23, 23, 23, 0.04)",
                    },
                  }}
                >
                  Limpiar
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <ClientesList
        clientes={clientes}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onEdit={handleEditCliente}
        onDelete={handleDeleteCliente}
        onViewMore={handleViewMore}
      />

      <ClienteForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        cliente={selectedCliente}
        loading={loading}
      />

      <ClienteDetalleModal
        open={detalleModalOpen}
        onClose={() => setDetalleModalOpen(false)}
        cliente={clienteDetalle}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: "#171717", fontWeight: "bold" }}>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar al cliente{" "}
            <strong>
              {clienteToDelete?.nombre} {clienteToDelete?.apellido}
            </strong>
            ?
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "#666" }}>
            Esta acción marcará al cliente como inactivo pero conservará su historial.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{
              borderColor: "#171717",
              color: "#171717",
            }}
          >
            Cancelar
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error" sx={{ borderRadius: 1 }}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ClientesPage
