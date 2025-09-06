"use client"

import { useState, useEffect } from "react"
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
import { Search as SearchIcon, GetApp as ExportIcon } from "@mui/icons-material"
import { useServicios } from "../../hooks/useServicios.js"
import ServiciosList from "../../components/Servicios/ServiciosList.jsx"
import ServicioDetalleModal from "../../components/Servicios/ServicioDetalleModal.jsx"
import serviciosService from "../../services/serviciosService.js"

const ReportesPage = () => {
  const { servicios, loading, error, pagination, loadServicios, updateServicio, deleteServicio, searchServicios } =
    useServicios()

  const [searchTerm, setSearchTerm] = useState("")
  const [searchCriteria, setSearchCriteria] = useState("numero")
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")
  const [selectedServicio, setSelectedServicio] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [servicioToDelete, setServicioToDelete] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [detalleModalOpen, setDetalleModalOpen] = useState(false)
  const [servicioDetalle, setServicioDetalle] = useState(null)
  const [clienteFilter, setClienteFilter] = useState(null)
  const [clienteFilterName, setClienteFilterName] = useState("")
  const [filteredServicios, setFilteredServicios] = useState([])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const clienteId = urlParams.get("cliente")
    const vehiculoPatente = urlParams.get("vehiculo")
    const servicioId = urlParams.get("servicio")
    const autoOpen = urlParams.get("autoOpen")

    if (clienteId) {
      loadServiciosByCliente(clienteId)
    } else if (vehiculoPatente) {
      loadServiciosByVehiculo(vehiculoPatente)
    } else if (servicioId) {
      loadSpecificService(servicioId, autoOpen === "true")
    } else {
      loadServicios()
    }
  }, [])

  useEffect(() => {
    setFilteredServicios(servicios)
  }, [servicios])

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity })
  }

  const handleSearch = () => {
    let filtered = servicios

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      if (searchCriteria === "cliente") {
        filtered = filtered.filter((servicio) =>
          `${servicio.cliente_nombre} ${servicio.cliente_apellido}`.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      } else if (searchCriteria === "vehiculo") {
        filtered = filtered.filter((servicio) => servicio.patente.toLowerCase().includes(searchTerm.toLowerCase()))
      } else {
        filtered = filtered.filter((servicio) => servicio.numero.toLowerCase().includes(searchTerm.toLowerCase()))
      }
    }

    // Filtrar por rango de fechas
    if (fechaDesde || fechaHasta) {
      filtered = filtered.filter((servicio) => {
        const servicioFecha = new Date(servicio.created_at)
        const desde = fechaDesde ? new Date(fechaDesde) : null
        const hasta = fechaHasta ? new Date(fechaHasta + "T23:59:59") : null

        if (desde && hasta) {
          return servicioFecha >= desde && servicioFecha <= hasta
        } else if (desde) {
          return servicioFecha >= desde
        } else if (hasta) {
          return servicioFecha <= hasta
        }
        return true
      })
    }

    setFilteredServicios(filtered)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSearchCriteria("numero")
    setFechaDesde("")
    setFechaHasta("")
    setClienteFilter(null)
    setClienteFilterName("")
    setFilteredServicios(servicios)

    window.history.replaceState({}, document.title, window.location.pathname)
    loadServicios(1)
  }

  const handleEditServicio = (servicio) => {
    setSelectedServicio(servicio)
  }

  const handleDeleteServicio = (servicio) => {
    setServicioToDelete(servicio)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      const servicioId = servicioToDelete.id || servicioToDelete.servicio_id || servicioToDelete.ID
      if (!servicioId) {
        throw new Error("No se pudo obtener el ID del servicio")
      }

      await deleteServicio(servicioId)
      showSnackbar("Servicio eliminado correctamente", "success")
    } catch (error) {
      showSnackbar("Error al eliminar servicio: " + error.message, "error")
    } finally {
      setDeleteDialogOpen(false)
      setServicioToDelete(null)
    }
  }

  const handlePageChange = (page, newLimit = null) => {
    if (newLimit) {
      loadServicios(1, searchTerm, newLimit)
    } else {
      loadServicios(page, searchTerm)
    }
  }

  const handleViewMore = async (servicio) => {
    try {
      const response = await serviciosService.getServicioById(servicio.id)
      setServicioDetalle(response)
      setDetalleModalOpen(true)
    } catch (error) {
      console.error("Error al cargar detalles del servicio:", error)
      showSnackbar("Error al cargar los detalles del servicio", "error")
    }
  }

  const loadServiciosByCliente = async (clienteId) => {
    try {
      const response = await serviciosService.getServiciosByCliente(clienteId)
      const serviciosData = Array.isArray(response) ? response : response.data || []

      setClienteFilter(clienteId)
      if (serviciosData.length > 0) {
        const clienteName = `${serviciosData[0].cliente_nombre} ${serviciosData[0].cliente_apellido}`
        setClienteFilterName(clienteName)
      }

      setFilteredServicios(serviciosData)
    } catch (error) {
      console.error("Error al cargar servicios del cliente:", error)
      showSnackbar("Error al cargar los servicios del cliente", "error")
    }
  }

  const loadSpecificService = async (servicioId, shouldAutoOpen = false) => {
    try {
      const response = await serviciosService.getServicioById(servicioId)
      setFilteredServicios([response])

      if (shouldAutoOpen) {
        setServicioDetalle(response)
        setDetalleModalOpen(true)
      }
    } catch (error) {
      console.error("Error al cargar servicio específico:", error)
      showSnackbar("Error al cargar el servicio específico", "error")
    }
  }

  const loadServiciosByVehiculo = async (patente) => {
    try {
      const response = await serviciosService.getServiciosByVehiculo(patente)
      const serviciosData = Array.isArray(response) ? response : response.data || []

      if (serviciosData.length > 0) {
        const vehicleName = `${serviciosData[0].patente} - ${serviciosData[0].marca} ${serviciosData[0].modelo}`
        setClienteFilterName(`Vehículo: ${vehicleName}`)
      }

      setFilteredServicios(serviciosData)
    } catch (error) {
      console.error("Error al cargar servicios del vehículo:", error)
      showSnackbar("Error al cargar los servicios del vehículo", "error")
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "#171717" }}>
            Reportes y Gestión de Servicios
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Visualiza y administra el historial de servicios realizados
          </Typography>
        </Box>
      </Box>

      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filtros de Búsqueda
          </Typography>

          {clienteFilter && (
            <Alert
              severity="info"
              sx={{ mb: 3, borderRadius: 2 }}
              action={
                <Button color="inherit" size="small" onClick={handleClearFilters} sx={{ fontWeight: "bold" }}>
                  Limpiar Filtro
                </Button>
              }
            >
              {clienteFilterName}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Buscar servicio"
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
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Buscar por</InputLabel>
                <Select
                  value={searchCriteria}
                  label="Buscar por"
                  onChange={(e) => setSearchCriteria(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="numero">Número</MenuItem>
                  <MenuItem value="cliente">Cliente</MenuItem>
                  <MenuItem value="vehiculo">Vehículo (Patente)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3} md={1.8}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Desde"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={1.8}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Hasta"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: { xs: "center", md: "flex-start" },
                  height: "100%",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleSearch}
                  size="small"
                  sx={{
                    bgcolor: "#d84315",
                    "&:hover": { bgcolor: "#ff5722" },
                    borderRadius: 2,
                    minWidth: "80px",
                    px: 2,
                  }}
                >
                  Buscar
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  size="small"
                  sx={{
                    borderColor: "#171717",
                    color: "#171717",
                    borderRadius: 2,
                    minWidth: "80px",
                    px: 2,
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

      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Historial de Servicios ({filteredServicios.length})
          </Typography>
          <ServiciosList
            servicios={filteredServicios}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onEdit={handleEditServicio}
            onDelete={handleDeleteServicio}
            onView={handleViewMore}
          />
        </CardContent>
      </Card>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ color: "#171717", fontWeight: "bold" }}>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar el servicio <strong>#{servicioToDelete?.numero}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: "#666" }}>
            Esta acción marcará el servicio como inactivo pero conservará su historial.
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

      <ServicioDetalleModal
        open={detalleModalOpen}
        onClose={() => setDetalleModalOpen(false)}
        servicio={servicioDetalle}
      />

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

export default ReportesPage
