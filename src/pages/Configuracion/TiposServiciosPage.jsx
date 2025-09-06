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
  Card,
  CardContent,
  Snackbar,
  Alert,
  Avatar,
  InputAdornment,
  Divider,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Build as BuildIcon,
  Title as TitleIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material"
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
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  })

  useEffect(() => {
    loadTiposServicios()
  }, [])

  useEffect(() => {
    if (pagination.currentPage > 1) {
      loadTiposServicios()
    }
  }, [pagination.currentPage])

  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    })
  }

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
        showNotification("Tipo de servicio actualizado exitosamente")
      } else {
        await createTipoServicio(formData)
        showNotification("Tipo de servicio creado exitosamente")
      }
      handleCloseDialog()
    } catch (error) {
      showNotification("Error al procesar la solicitud", "error")
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
        showNotification("Tipo de servicio eliminado exitosamente")
      } catch (error) {
        showNotification("Error al eliminar el tipo de servicio", "error")
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
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "#171717" }}>
            Tipos de Servicios
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            Gestiona los tipos de servicios disponibles en tu lubricentro
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            bgcolor: "#d84315",
            "&:hover": { bgcolor: "#bf360c" },
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Nuevo Tipo de Servicio
        </Button>
      </Box>

      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <TextField
              fullWidth
              placeholder="Buscar tipos de servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              sx={{
                minWidth: 120,
                bgcolor: "#d84315",
                "&:hover": { bgcolor: "#bf360c" },
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Buscar
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#d84315" }}>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>Descripción</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white" }}>Estado</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "center", color: "white" }}>Acciones</TableCell>
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
                  <TableRow key={tipoServicio.id} hover sx={{ "&:hover": { bgcolor: "rgba(216, 67, 21, 0.05)" } }}>
                    <TableCell sx={{ fontWeight: "medium", color: "#171717" }}>{tipoServicio.nombre}</TableCell>
                    <TableCell sx={{ color: "#171717" }}>{tipoServicio.descripcion || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={tipoServicio.activo ? "Activo" : "Inactivo"}
                        color={tipoServicio.activo ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => handleOpenDialog(tipoServicio)}
                          size="small"
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
                          onClick={() => handleDeleteClick(tipoServicio)}
                          size="small"
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
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #d84315 0%, #bf360c 100%)",
            color: "white",
            p: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.2)",
              width: 56,
              height: 56,
            }}
          >
            <BuildIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
              {editingTipoServicio ? "Editar Tipo de Servicio" : "Nuevo Tipo de Servicio"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {editingTipoServicio
                ? "Modifica la información del tipo de servicio"
                : "Crea un nuevo tipo de servicio para tu lubricentro"}
            </Typography>
          </Box>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Nombre del Tipo de Servicio"
              value={formData.nombre}
              onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon sx={{ color: "#d84315" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#d84315",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#d84315",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#d84315",
                },
              }}
            />

            <TextField
              fullWidth
              label="Descripción (Opcional)"
              value={formData.descripcion}
              onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
              margin="normal"
              multiline
              rows={3}
              placeholder="Describe brevemente este tipo de servicio..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1 }}>
                    <DescriptionIcon sx={{ color: "#d84315" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#d84315",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#d84315",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#d84315",
                },
              }}
            />
          </Box>
        </DialogContent>

        <Divider />
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              color: "#666",
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.nombre.trim()}
            sx={{
              bgcolor: "#d84315",
              "&:hover": {
                bgcolor: "#bf360c",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(216, 67, 21, 0.3)",
              },
              "&:disabled": {
                bgcolor: "#ccc",
              },
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              transition: "all 0.2s ease-in-out",
            }}
          >
            {editingTipoServicio ? "Actualizar Tipo" : "Crear Tipo"}
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
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: "none" }}>
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default TiposServiciosPage
