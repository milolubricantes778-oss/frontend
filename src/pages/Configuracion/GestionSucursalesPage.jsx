"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Pagination,
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
} from "@mui/icons-material"
import useSucursales from "../../hooks/useSucursales"
import SucursalForm from "../../components/Sucursales/SucursalForm"

const GestionSucursalesPage = () => {
  const { sucursales, loading, error, totalPages, loadSucursales, createSucursal, updateSucursal, deleteSucursal } =
    useSucursales()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [activo, setActivo] = useState("")
  const [openForm, setOpenForm] = useState(false)
  const [selectedSucursal, setSelectedSucursal] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [sucursalToDelete, setSucursalToDelete] = useState(null)
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" })

  useEffect(() => {
    const params = {
      page,
      limit: 10,
      search: search.trim(),
      ...(activo !== "" && { activo }),
    }
    loadSucursales(params)
  }, [page, search, activo, loadSucursales])

  const handleSearch = () => {
    setPage(1)
    const params = {
      page: 1,
      limit: 10,
      search: search.trim(),
      ...(activo !== "" && { activo }),
    }
    loadSucursales(params)
  }

  const handleCreateSucursal = () => {
    setSelectedSucursal(null)
    setOpenForm(true)
  }

  const handleEditSucursal = (sucursal) => {
    setSelectedSucursal(sucursal)
    setOpenForm(true)
  }

  const handleDeleteSucursal = (sucursal) => {
    setSucursalToDelete(sucursal)
    setOpenDeleteDialog(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteSucursal(sucursalToDelete.id)
      setNotification({
        open: true,
        message: "Sucursal eliminada exitosamente",
        severity: "success",
      })
      loadSucursales({ page, limit: 10, search: search.trim(), ...(activo !== "" && { activo }) })
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || "Error al eliminar sucursal",
        severity: "error",
      })
    } finally {
      setOpenDeleteDialog(false)
      setSucursalToDelete(null)
    }
  }

  const handleFormSubmit = async (sucursalData) => {
    try {
      if (selectedSucursal) {
        await updateSucursal(selectedSucursal.id, sucursalData)
        setNotification({
          open: true,
          message: "Sucursal actualizada exitosamente",
          severity: "success",
        })
      } else {
        await createSucursal(sucursalData)
        setNotification({
          open: true,
          message: "Sucursal creada exitosamente",
          severity: "success",
        })
      }
      setOpenForm(false)
      loadSucursales({ page, limit: 10, search: search.trim(), ...(activo !== "" && { activo }) })
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || "Error al guardar sucursal",
        severity: "error",
      })
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("es-AR")
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: "#171717", fontWeight: 600, mb: 1 }}>
          Gestión de Sucursales
        </Typography>
        <Typography variant="body1" sx={{ color: "textSecondary" }}>
          Administra las sucursales del sistema
        </Typography>
      </Box>

      {/* Filtros */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Buscar sucursales"
                placeholder="Nombre o ubicación..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: "action.active", mr: 1 }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": { borderColor: "#d84315" },
                    "&.Mui-focused fieldset": { borderColor: "#d84315" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={activo}
                  label="Estado"
                  onChange={(e) => setActivo(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d84315" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#d84315" },
                  }}
                >
                  <MenuItem value="">Todas</MenuItem>
                  <MenuItem value="true">Activas</MenuItem>
                  <MenuItem value="false">Inactivas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                onClick={handleSearch}
                sx={{
                  borderColor: "#d84315",
                  color: "#d84315",
                  borderRadius: 2,
                  "&:hover": { borderColor: "#bf360c", backgroundColor: "rgba(216, 67, 21, 0.04)" },
                }}
              >
                Buscar
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateSucursal}
                sx={{
                  backgroundColor: "#d84315",
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "#bf360c" },
                }}
              >
                Nueva Sucursal
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card elevation={2}>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#d84315" }}>
                  <TableCell sx={{ fontWeight: 600, color: "white" }}>Nombre</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "white" }}>Ubicación</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "white" }}>Empleados</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "white" }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "white" }}>Fecha Registro</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "white" }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton variant="text" />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" />
                      </TableCell>
                      <TableCell>
                        <Skeleton variant="text" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : sucursales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <BusinessIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No se encontraron sucursales
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  sucursales.map((sucursal) => (
                    <TableRow key={sucursal.id} hover sx={{ "&:hover": { bgcolor: "rgba(216, 67, 21, 0.05)" } }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: "#171717" }}>
                          {sucursal.nombre}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: "#171717" }}>{sucursal.ubicacion || "N/A"}</TableCell>
                      <TableCell>
                        <Chip label={sucursal.total_empleados || 0} color="primary" size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={sucursal.activo ? "Activa" : "Inactiva"}
                          color={sucursal.activo ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ color: "#171717" }}>{formatDate(sucursal.created_at)}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditSucursal(sucursal)}
                          sx={{
                            color: "#171717",
                            mr: 1,
                            "&:hover": { bgcolor: "rgba(23, 23, 23, 0.1)" },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteSucursal(sucursal)}
                          sx={{
                            color: "#f44336",
                            "&:hover": { bgcolor: "rgba(244, 67, 54, 0.1)" },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginación */}
          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(e, newPage) => setPage(newPage)}
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    "&.Mui-selected": {
                      backgroundColor: "#d84315",
                      "&:hover": { backgroundColor: "#bf360c" },
                    },
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Modal de formulario */}
      <SucursalForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        sucursal={selectedSucursal}
      />

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar la sucursal <strong>{sucursalToDelete?.nombre}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notificaciones */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default GestionSucursalesPage
