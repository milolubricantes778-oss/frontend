"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Pagination,
  CircularProgress,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
} from "@mui/icons-material"
import { useUsuarios } from "../../hooks/useUsuarios"
import UsuarioForm from "../../components/Usuarios/UsuarioForm"

const GestionUsuariosPage = () => {
  const {
    usuarios,
    loading,
    error,
    totalPages,
    currentPage,
    loadUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    changePage,
    clearError,
  } = useUsuarios()

  // Estados locales
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [formLoading, setFormLoading] = useState(false)

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsuarios()
  }, [loadUsuarios])

  // Aplicar filtros
  const handleSearch = () => {
    const filters = {}
    if (searchTerm) filters.search = searchTerm
    if (roleFilter) filters.rol = roleFilter
    if (statusFilter) filters.activo = statusFilter === "activo"

    loadUsuarios(filters)
  }

  // Limpiar filtros
  const handleClearFilters = () => {
    setSearchTerm("")
    setRoleFilter("")
    setStatusFilter("")
    loadUsuarios()
  }

  // Abrir modal para crear usuario
  const handleCreate = () => {
    setEditingUser(null)
    setModalOpen(true)
  }

  // Abrir modal para editar usuario
  const handleEdit = (usuario) => {
    setEditingUser(usuario)
    setModalOpen(true)
  }

  // Cerrar modal
  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingUser(null)
  }

  const handleSave = async (formData) => {
    setFormLoading(true)
    try {
      if (editingUser) {
        // Actualizar usuario existente
        await updateUsuario(editingUser.id, formData)
        setSnackbar({
          open: true,
          message: "Usuario actualizado correctamente",
          severity: "success",
        })
      } else {
        // Crear nuevo usuario
        await createUsuario(formData)
        setSnackbar({
          open: true,
          message: "Usuario creado correctamente",
          severity: "success",
        })
      }
      handleCloseModal()
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Error al guardar usuario",
        severity: "error",
      })
    } finally {
      setFormLoading(false)
    }
  }

  // Eliminar usuario
  const handleDelete = async (usuario) => {
    if (window.confirm(`¿Está seguro de eliminar al usuario ${usuario.nombre}?`)) {
      try {
        await deleteUsuario(usuario.id)
        setSnackbar({
          open: true,
          message: "Usuario eliminado correctamente",
          severity: "success",
        })
      } catch (err) {
        setSnackbar({
          open: true,
          message: err.message || "Error al eliminar usuario",
          severity: "error",
        })
      }
    }
  }

  // Cambiar página
  const handlePageChange = (event, page) => {
    changePage(page)
  }

  // Cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
    clearError()
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "#171717", mb: 1 }}>
          Gestión de Usuarios
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Administra los usuarios del sistema y sus permisos
        </Typography>
      </Box>

      {/* Filtros */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Buscar usuarios"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nombre o email..."
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Rol"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                  <MenuItem value="empleado">Empleado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Estado"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="activo">Activo</MenuItem>
                  <MenuItem value="inactivo">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                sx={{
                  backgroundColor: "#d84315",
                  "&:hover": { backgroundColor: "#bf360c" },
                  borderRadius: 2,
                  mr: 1,
                }}
              >
                Buscar
              </Button>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                sx={{
                  borderColor: "#d84315",
                  color: "#d84315",
                  "&:hover": { borderColor: "#bf360c", backgroundColor: "rgba(216, 67, 21, 0.04)" },
                  borderRadius: 2,
                }}
              >
                Limpiar
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreate}
                fullWidth
                sx={{
                  backgroundColor: "#d84315",
                  "&:hover": { backgroundColor: "#bf360c" },
                  borderRadius: 2,
                }}
              >
                Nuevo Usuario
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabla de usuarios */}
      <Card elevation={2}>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#d84315" }}>
                      <TableCell sx={{ fontWeight: "bold", color: "white" }}>Usuario</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "white" }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "white" }}>Rol</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "white" }}>Estado</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "white" }}>Último Login</TableCell>
                      <TableCell sx={{ fontWeight: "bold", color: "white" }}>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usuarios.map((usuario) => (
                      <TableRow key={usuario.id} hover sx={{ "&:hover": { bgcolor: "rgba(23, 23, 23, 0.1)" } }}>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <PersonIcon sx={{ mr: 1, color: "#d84315" }} />
                            <Typography sx={{ color: "#171717" }}>
                              {usuario.nombre} {usuario.apellido}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ color: "#171717" }}>{usuario.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={usuario.rol === "admin" ? "Administrador" : "Empleado"}
                            color={usuario.rol === "admin" ? "primary" : "default"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={usuario.activo ? "Activo" : "Inactivo"}
                            color={usuario.activo ? "success" : "error"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ color: "#171717" }}>
                          {usuario.ultimo_login ? new Date(usuario.ultimo_login).toLocaleDateString("es-AR") : "Nunca"}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Editar">
                            <IconButton
                              onClick={() => handleEdit(usuario)}
                              sx={{
                                color: "#171717",
                                "&:hover": { bgcolor: "rgba(23, 23, 23, 0.1)" },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              onClick={() => handleDelete(usuario)}
                              sx={{
                                color: "#f44336",
                                "&:hover": { bgcolor: "rgba(244, 67, 54, 0.1)" },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Paginación */}
              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={2}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{
                      "& .MuiPaginationItem-root.Mui-selected": {
                        backgroundColor: "#d84315",
                        "&:hover": { backgroundColor: "#bf360c" },
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <UsuarioForm
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSave}
        usuario={editingUser}
        loading={formLoading}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open || !!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={error ? "error" : snackbar.severity} sx={{ width: "100%" }}>
          {error || snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default GestionUsuariosPage
