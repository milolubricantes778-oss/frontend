"use client"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Avatar,
} from "@mui/material"
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
} from "@mui/icons-material"

const clienteSchema = yup.object({
  nombre: yup
    .string()
    .required("El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  apellido: yup
    .string()
    .required("El apellido es obligatorio")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres"),
  telefono: yup.string().nullable(),
})

const ClienteForm = ({ open, onClose, onSubmit, cliente = null, loading = false }) => {
  const isEditing = Boolean(cliente)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(clienteSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      dni: "",
      telefono: "",
      direccion: "",
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        nombre: cliente?.nombre || "",
        apellido: cliente?.apellido || "",
        dni: cliente?.dni || "",
        telefono: cliente?.telefono || "",
        direccion: cliente?.direccion || "",
      })
    }
  }, [open, cliente, reset])

  const handleFormSubmit = (data) => {
    onSubmit(data)
  }

  const handleClose = () => {
    reset({
      nombre: "",
      apellido: "",
      dni: "",
      telefono: "",
      direccion: "",
    })
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "85vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#d84315",
          color: "white",
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              width: 48,
              height: 48,
            }}
          >
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", mb: 0.5 }}>
              {isEditing ? "Editar Cliente" : "Nuevo Cliente"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {isEditing
                ? "Modifica la información del cliente existente"
                : "Completa los datos para registrar un nuevo cliente"}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color: "white",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
          <Grid container spacing={3}>
            {/* Información Personal */}
            <Grid item xs={12}>
              <Card sx={{ elevation: 2, borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Avatar
                      sx={{
                        backgroundColor: "#fff3e0",
                        color: "#d84315",
                        width: 40,
                        height: 40,
                      }}
                    >
                      <PersonIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#171717" }}>
                      Información Personal
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        {...register("nombre")}
                        label="Nombre *"
                        fullWidth
                        error={!!errors.nombre}
                        helperText={errors.nombre?.message}
                        placeholder="Ingresa el nombre"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&.Mui-focused fieldset": {
                              borderColor: "#d84315",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#d84315",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        {...register("apellido")}
                        label="Apellido *"
                        fullWidth
                        error={!!errors.apellido}
                        helperText={errors.apellido?.message}
                        placeholder="Ingresa el apellido"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&.Mui-focused fieldset": {
                              borderColor: "#d84315",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#d84315",
                          },
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        {...register("dni")}
                        label="DNI"
                        fullWidth
                        error={!!errors.dni}
                        helperText={errors.dni?.message}
                        placeholder="Ej: 12345678"
                        inputProps={{ maxLength: 8 }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&.Mui-focused fieldset": {
                              borderColor: "#d84315",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#d84315",
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Información de Contacto */}
            <Grid item xs={12}>
              <Card sx={{ elevation: 2, borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Avatar
                      sx={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        width: 40,
                        height: 40,
                      }}
                    >
                      <PhoneIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#171717" }}>
                      Información de Contacto
                    </Typography>
                  </Box>

                  <TextField
                    {...register("telefono")}
                    label="Teléfono"
                    fullWidth
                    error={!!errors.telefono}
                    helperText={errors.telefono?.message}
                    placeholder="Ej: 11-1234-5678"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&.Mui-focused fieldset": {
                          borderColor: "#d84315",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#d84315",
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* Dirección */}
            <Grid item xs={12}>
              <Card sx={{ elevation: 2, borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                    <Avatar
                      sx={{
                        backgroundColor: "#e8f5e8",
                        color: "#4caf50",
                        width: 40,
                        height: 40,
                      }}
                    >
                      <LocationOnIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#171717" }}>
                      Dirección
                    </Typography>
                  </Box>

                  <TextField
                    {...register("direccion")}
                    label="Dirección"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.direccion}
                    helperText={errors.direccion?.message}
                    placeholder="Calle, número, piso, departamento"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&.Mui-focused fieldset": {
                          borderColor: "#d84315",
                        },
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "#d84315",
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          backgroundColor: "#f5f5f5",
          borderTop: "1px solid #e0e0e0",
          gap: 2,
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: "#d0d0d0",
            color: "#666",
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#f5f5f5",
              borderColor: "#bbb",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: "#d84315",
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(216, 67, 21, 0.3)",
            "&:hover": {
              backgroundColor: "#c13711",
            },
            "&:disabled": {
              opacity: 0.5,
            },
          }}
        >
          {loading ? "Guardando..." : isEditing ? "Actualizar Cliente" : "Crear Cliente"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ClienteForm
