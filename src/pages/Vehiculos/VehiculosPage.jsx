"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from "@mui/material"
import { Add as AddIcon, Search as SearchIcon } from "@mui/icons-material"
import { useVehiculos } from "../../hooks/useVehiculos"
import clientesService from "../../services/clientesService"
import VehiculoForm from "../../components/Vehiculos/VehiculoForm"
import VehiculosList from "../../components/Vehiculos/VehiculosList"
import logger from "../../utils/logger"

const VehiculosPage = () => {
  const {
    vehiculos,
    loading,
    error,
    pagination,
    loadVehiculos,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,
    changePage,
    changeRowsPerPage,
  } = useVehiculos()

  const [formOpen, setFormOpen] = useState(false)
  const [selectedVehiculo, setSelectedVehiculo] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchCriteria, setSearchCriteria] = useState("patente")
  const [clientes, setClientes] = useState([])
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

  // Cargar datos iniciales
  useEffect(() => {
    loadVehiculos()
    if (searchCriteria === "cliente") {
      loadClientes()
    }
  }, [searchCriteria]) // Empty dependency array to run only on mount

  // Cargar clientes para el filtro
  const loadClientes = async () => {
    try {
      const result = await clientesService.getClientes(1, 1000)
      if (result && result.data && Array.isArray(result.data)) {
        setClientes(result.data.filter((c) => c.activo))
      } else {
        setClientes([])
      }
    } catch (error) {
      logger.error("Error al cargar clientes", error)
      setClientes([])
    }
  }

  // Buscar vehículos
  const handleSearch = () => {
    loadVehiculos(1, pagination.limit, searchTerm, searchCriteria)
  }

  // Limpiar filtros
  const handleClearFilters = () => {
    setSearchTerm("")
    setSearchCriteria("patente")
    loadVehiculos(1, pagination.limit, "", "patente")
  }

  // Abrir formulario para nuevo vehículo
  const handleNewVehiculo = () => {
    setSelectedVehiculo(null)
    setFormOpen(true)
  }

  // Abrir formulario para editar vehículo
  const handleEditVehiculo = (vehiculo) => {
    setSelectedVehiculo(vehiculo)
    setFormOpen(true)
  }

  // Cerrar formulario
  const handleCloseForm = () => {
    setFormOpen(false)
    setSelectedVehiculo(null)
  }

  // Guardar vehículo
  const handleSaveVehiculo = async (vehiculoData) => {
    try {
      logger.debug("Guardando vehículo", vehiculoData)
      let result
      if (selectedVehiculo) {
        result = await updateVehiculo(selectedVehiculo.id, vehiculoData)
      } else {
        result = await createVehiculo(vehiculoData)
      }

      logger.debug("Resultado de guardar vehículo", result)
      if (result.success) {
        setSnackbar({
          open: true,
          message: selectedVehiculo ? "Vehículo actualizado correctamente" : "Vehículo creado correctamente",
          severity: "success",
        })
        handleCloseForm()
        setTimeout(() => {
          loadVehiculos(pagination.currentPage, pagination.limit, searchTerm, searchCriteria)
        }, 500)
      } else {
        setSnackbar({
          open: true,
          message: result.error || "Error al guardar el vehículo",
          severity: "error",
        })
      }
    } catch (error) {
      logger.error("Error en handleSaveVehiculo", error)
      setSnackbar({
        open: true,
        message: "Error al guardar el vehículo",
        severity: "error",
      })
    }
  }

  // Eliminar vehículo
  const handleDeleteVehiculo = async (id) => {
    try {
      const result = await deleteVehiculo(id)
      if (result.success) {
        setSnackbar({
          open: true,
          message: "Vehículo eliminado correctamente",
          severity: "success",
        })
      } else {
        setSnackbar({
          open: true,
          message: result.error || "Error al eliminar el vehículo",
          severity: "error",
        })
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al eliminar el vehículo",
        severity: "error",
      })
    }
  }

  // Cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  const getSearchPlaceholder = () => {
    switch (searchCriteria) {
      case "patente":
        return "Buscar por patente..."
      case "marca_modelo":
        return "Buscar por marca o modelo..."
      case "cliente":
        return "Buscar por nombre del cliente..."
      default:
        return "Buscar..."
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "#171717" }}>
            Gestión de Vehículos
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Administra los vehículos de tus clientes
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewVehiculo}
          sx={{
            bgcolor: "#d84315",
            "&:hover": { bgcolor: "#ff5722" },
            minWidth: "200px",
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(216, 67, 21, 0.3)",
          }}
        >
          Nuevo Vehículo
        </Button>
      </Box>

      {/* Filtros */}
      <Card elevation={2} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filtros de Búsqueda
          </Typography>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Buscar por</InputLabel>
                <Select
                  value={searchCriteria}
                  label="Buscar por"
                  onChange={(e) => {
                    setSearchCriteria(e.target.value)
                    setSearchTerm("")
                  }}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="patente">Patente</MenuItem>
                  <MenuItem value="marca_modelo">Marca y Modelo</MenuItem>
                  <MenuItem value="cliente">Cliente</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={5}>
              <TextField
                fullWidth
                label={getSearchPlaceholder()}
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

      {/* Mensaje de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Lista de vehículos */}
      <VehiculosList
        vehiculos={vehiculos}
        loading={loading}
        pagination={pagination}
        onEdit={handleEditVehiculo}
        onDelete={handleDeleteVehiculo}
        onPageChange={changePage}
        onRowsPerPageChange={changeRowsPerPage}
      />

      {/* Formulario de vehículo */}
      <VehiculoForm
        open={formOpen}
        onClose={handleCloseForm}
        vehiculo={selectedVehiculo}
        onSubmit={handleSaveVehiculo}
        loading={loading}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default VehiculosPage
