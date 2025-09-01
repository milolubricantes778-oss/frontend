"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { usersService } from "../../services/usersService"
import RoleGuard from "../../components/Auth/RoleGuard"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material"
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const userSchema = yup.object({
  nombre: yup.string().required("El nombre es requerido"),
  email: yup.string().email("Email inválido").required("El email es requerido"),
  password: yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .when("isEditing", {
      is: false,
      then: (schema) => schema.required("La contraseña es requerida"),
      otherwise: (schema) => schema.notRequired(),
    }),
  role: yup.string().oneOf(["admin", "empleado"], "Rol inválido").required("El rol es requerido"),
  activo: yup.boolean(),
})

const UsersManagementPage = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(userSchema),
    defaultValues: {
      nombre: "",
      email: "",
      password: "",
      role: "empleado",
      activo: true,
    },
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await usersService.getAll()
      setUsers(data)
    } catch{
      setError("Error al cargar usuarios")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (user = null) => {
    setEditingUser(user)
    if (user) {
      setValue("nombre", user.nombre)
      setValue("email", user.email)
      setValue("role", user.role)
      setValue("activo", user.activo)
      setValue("isEditing", true)
    } else {
      reset({
        nombre: "",
        email: "",
        password: "",
        role: "empleado",
        activo: true,
        isEditing: false,
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingUser(null)
    reset()
  }

  const onSubmit = async (data) => {
    try {
      if (editingUser) {
        await usersService.update(editingUser.id, data)
      } else {
        await usersService.create(data)
      }
      await loadUsers()
      handleCloseDialog()
    } catch (error) {
      setError(error.message || "Error al guardar usuario")
    }
  }

  const handleDelete = async (userId) => {
    if (userId === currentUser.id) {
      setError("No puedes eliminar tu propio usuario")
      return
    }

    if (window.confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await usersService.delete(userId)
        await loadUsers()
      } catch {
        setError("Error al eliminar usuario")
      }
    }
  }

  const getRoleColor = (role) => {
    return role === "admin" ? "error" : "primary"
  }

  const getRoleLabel = (role) => {
    return role === "admin" ? "Administrador" : "Empleado"
  }

  return (
    <RoleGuard requiredRole="admin">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ color: "#CC7A3F" }}>
            Gestión de Usuarios
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: "#CC7A3F",
              "&:hover": { backgroundColor: "#B8692F" },
            }}
          >
            Nuevo Usuario
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha Creación</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.nombre}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip label={getRoleLabel(user.role)} color={getRoleColor(user.role)} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.activo ? "Activo" : "Inactivo"}
                          color={user.activo ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString("es-AR")}</TableCell>
                      <TableCell align="center">
                        <IconButton onClick={() => handleOpenDialog(user)} color="primary">
                          <EditIcon />
                        </IconButton>
                        {user.id !== currentUser.id && (
                          <IconButton onClick={() => handleDelete(user.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Dialog para crear/editar usuario */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                <TextField
                  {...register("nombre")}
                  label="Nombre Completo"
                  fullWidth
                  error={!!errors.nombre}
                  helperText={errors.nombre?.message}
                />

                <TextField
                  {...register("email")}
                  label="Email"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />

                {!editingUser && (
                  <TextField
                    {...register("password")}
                    label="Contraseña"
                    type="password"
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}

                <FormControl fullWidth error={!!errors.role}>
                  <InputLabel>Rol</InputLabel>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Rol">
                        <MenuItem value="empleado">Empleado</MenuItem>
                        <MenuItem value="admin">Administrador</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>

                <Controller
                  name="activo"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel control={<Switch {...field} checked={field.value} />} label="Usuario Activo" />
                  )}
                />
              </Box>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancelar</Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#CC7A3F",
                  "&:hover": { backgroundColor: "#B8692F" },
                }}
              >
                {editingUser ? "Actualizar" : "Crear"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    </RoleGuard>
  )
}

export default UsersManagementPage
