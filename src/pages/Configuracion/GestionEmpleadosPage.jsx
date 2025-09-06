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
  Person as PersonIcon,
} from "@mui/icons-material"
import useEmpleados from "../../hooks/useEmpleados"
import EmpleadoForm from "../../components/Empleados/EmpleadoForm"

const GestionEmpleadosPage = () => {
  const { empleados, loading, error, totalPages, loadEmpleados, createEmpleado, updateEmpleado, deleteEmpleado } =
    useEmpleados()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [activo, setActivo] = useState("")
  const [openForm, setOpenForm] = useState(false)
  const [selectedEmpleado, setSelectedEmpleado] = useState(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [empleadoToDelete, setEmpleadoToDelete] = useState(null)
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" })

  useEffect(() => {
    const params = {
      page,
      limit: 10,
      search: search.trim(),
      ...(activo !== "" && { activo }),
    }
    loadEmpleados(params)
  }, [page, search, activo, loadEmpleados])

  const handleSearch = () => {
    setPage(1)
    const params = {
      page: 1,
      limit: 10,
      search: search.trim(),
      ...(activo !== "" && { activo }),
    }
    loadEmpleados(params)
  }

  const handleCreateEmpleado = () => {
    setSelectedEmpleado(null)
    setOpenForm(true)
  }

  const handleEditEmpleado = (empleado) => {
    setSelectedEmpleado(empleado)
    setOpenForm(true)
  }

  const handleDeleteEmpleado = (empleado) => {
    setEmpleadoToDelete(empleado)
    setOpenDeleteDialog(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteEmpleado(empleadoToDelete.id)
      setNotification({
        open: true,
        message: "Empleado eliminado exitosamente",
        severity: "success",
      })
      loadEmpleados({ page, limit: 10, search: search.trim(), ...(activo !== "" && { activo }) })
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || "Error al eliminar empleado",
        severity: "error",
      })
    } finally {
      setOpenDeleteDialog(false)
      setEmpleadoToDelete(null)
    }
  }

  const handleFormSubmit = async (empleadoData) => {
    try {
      if (selectedEmpleado) {
        await updateEmpleado(selectedEmpleado.id, empleadoData)
        setNotification({
          open: true,
          message: "Empleado actualizado exitosamente",
          severity: "success",
        })
      } else {
        await createEmpleado(empleadoData)
        setNotification({
          open: true,
          message: "Empleado creado exitosamente",
          severity: "success",
        })
      }
      setOpenForm(false)
      loadEmpleados({ page, limit: 10, search: search.trim(), ...(activo !== "" && { activo }) })
    } catch (error) {
      setNotification({
        open: true,
        message: error.message || "Error al guardar empleado",
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
          Gestión de Empleados
        </Typography>
        <Typography variant="body1" sx={{ color: "textSecondary" }}>
          Administra los empleados del sistema
        </Typography>
      </Box>

      {/* Filtros */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Buscar empleados"
                placeholder="Nombre, apellido o teléfono..."
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
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="true">Activos</MenuItem>
                  <MenuItem value="false">Inactivos</MenuItem>
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
                onClick={handleCreateEmpleado}
                sx={{
                  backgroundColor: "#d84315",
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "#bf360c" },
                }}
              >
                Nuevo Empleado
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
                  <TableCell sx={{ fontWeight: 600, color: "white" }}>Empleado</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "white" }}>Sucursal</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "white" }}>Teléfono</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "white" }}>Cargo</TableCell>
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
                      <TableCell>
                        <Skeleton variant="text" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : empleados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <PersonIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No se encontraron empleados
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  empleados.map((empleado) => (
                    <TableRow key={empleado.id} hover sx={{ "&:hover": { bgcolor: "rgba(216, 67, 21, 0.05)" } }}>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: "#171717" }}>
                          {empleado.nombre} {empleado.apellido}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: "#171717" }}>{empleado.sucursal_nombre || "N/A"}</TableCell>
                      <TableCell sx={{ color: "#171717" }}>{empleado.telefono || "N/A"}</TableCell>
                      <TableCell sx={{ color: "#171717" }}>{empleado.cargo || "N/A"}</TableCell>
                      <TableCell>
                        <Chip
                          label={empleado.activo ? "Activo" : "Inactivo"}
                          color={empleado.activo ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ color: "#171717" }}>{formatDate(empleado.created_at)}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditEmpleado(empleado)}
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
                          onClick={() => handleDeleteEmpleado(empleado)}
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
      <EmpleadoForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        empleado={selectedEmpleado}
      />

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar al empleado{" "}
            <strong>
              {empleadoToDelete?.nombre} {empleadoToDelete?.apellido}
            </strong>
            ?
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

export default GestionEmpleadosPage
