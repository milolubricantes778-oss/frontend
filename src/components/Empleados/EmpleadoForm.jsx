"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  IconButton,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { Close as CloseIcon, Person as PersonIcon } from "@mui/icons-material"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useSucursales } from "../../hooks/useSucursales"

const schema = yup.object({
  nombre: yup
    .string()
    .required("El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  apellido: yup
    .string()
    .required("El apellido es requerido")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido no puede tener más de 100 caracteres"),
  telefono: yup.string().nullable(),
  cargo: yup.string().nullable(),
  sucursal_id: yup.number().required("La sucursal es requerida").min(1, "Debe seleccionar una sucursal"),
  activo: yup.boolean(),
})

const EmpleadoForm = ({ open, onClose, onSubmit, empleado }) => {
  const [loading, setLoading] = useState(false)
  const { sucursalesActivas, loadSucursalesActivas } = useSucursales()
  const isEditing = Boolean(empleado)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      apellido: "",
      telefono: "",
      cargo: "",
      sucursal_id: "",
      activo: true,
    },
  })

  const activo = watch("activo")

  useEffect(() => {
    if (open) {
      loadSucursalesActivas()
    }
  }, [open, loadSucursalesActivas])

  useEffect(() => {
    if (empleado) {
      setValue("nombre", empleado.nombre || "")
      setValue("apellido", empleado.apellido || "")
      setValue("telefono", empleado.telefono || "")
      setValue("cargo", empleado.cargo || "")
      setValue("sucursal_id", empleado.sucursal_id || "")
      setValue("activo", empleado.activo ?? true)
    } else {
      reset({
        nombre: "",
        apellido: "",
        telefono: "",
        cargo: "",
        sucursal_id: "",
        activo: true,
      })
    }
  }, [empleado, setValue, reset])

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true)
      const cleanData = {
        ...data,
        telefono: data.telefono?.trim() || null,
        cargo: data.cargo?.trim() || null,
      }
      await onSubmit(cleanData)
      handleClose()
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
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
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #d84315 0%, #bf360c 100%)",
          color: "white",
          p: 3,
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <PersonIcon sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              {isEditing ? "Editar Empleado" : "Nuevo Empleado"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {isEditing ? "Modifica la información del empleado" : "Completa los datos del nuevo empleado"}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "white",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Información Personal */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 2,
                  border: "1px solid #e9ecef",
                }}
              >
                <Typography variant="h6" sx={{ color: "#d84315", fontWeight: 600, mb: 2 }}>
                  Información Personal
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombre *"
                      {...register("nombre")}
                      error={!!errors.nombre}
                      helperText={errors.nombre?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover fieldset": { borderColor: "#d84315" },
                          "&.Mui-focused fieldset": { borderColor: "#d84315" },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Apellido *"
                      {...register("apellido")}
                      error={!!errors.apellido}
                      helperText={errors.apellido?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover fieldset": { borderColor: "#d84315" },
                          "&.Mui-focused fieldset": { borderColor: "#d84315" },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Información de Contacto */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 2,
                  border: "1px solid #e9ecef",
                }}
              >
                <Typography variant="h6" sx={{ color: "#d84315", fontWeight: 600, mb: 2 }}>
                  Información de Contacto
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Teléfono"
                      {...register("telefono")}
                      error={!!errors.telefono}
                      helperText={errors.telefono?.message}
                      placeholder="+54 11 1234-5678"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover fieldset": { borderColor: "#d84315" },
                          "&.Mui-focused fieldset": { borderColor: "#d84315" },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Información Laboral */}
            <Grid item xs={12}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#f8f9fa",
                  borderRadius: 2,
                  border: "1px solid #e9ecef",
                }}
              >
                <Typography variant="h6" sx={{ color: "#d84315", fontWeight: 600, mb: 2 }}>
                  Información Laboral
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="sucursal_id"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          error={!!errors.sucursal_id}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                              "&:hover fieldset": { borderColor: "#d84315" },
                              "&.Mui-focused fieldset": { borderColor: "#d84315" },
                            },
                          }}
                        >
                          <InputLabel>Sucursal *</InputLabel>
                          <Select {...field} label="Sucursal *">
                            {sucursalesActivas.map((sucursal) => (
                              <MenuItem key={sucursal.id} value={sucursal.id}>
                                {sucursal.nombre}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.sucursal_id && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                              {errors.sucursal_id.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Cargo"
                      {...register("cargo")}
                      error={!!errors.cargo}
                      helperText={errors.cargo?.message}
                      placeholder="Ej: Mecánico, Técnico, Supervisor..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&:hover fieldset": { borderColor: "#d84315" },
                          "&.Mui-focused fieldset": { borderColor: "#d84315" },
                        },
                      }}
                    />
                  </Grid>
                  {isEditing && (
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={activo}
                            onChange={(e) => setValue("activo", e.target.checked)}
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#d84315",
                                "&:hover": { backgroundColor: "rgba(216, 67, 21, 0.04)" },
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#d84315",
                              },
                            }}
                          />
                        }
                        label={activo ? "Activo" : "Inactivo"}
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, backgroundColor: "#f8f9fa" }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderColor: "#6c757d",
              color: "#6c757d",
              borderRadius: 2,
              "&:hover": { borderColor: "#5a6268", backgroundColor: "rgba(108, 117, 125, 0.04)" },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: "#d84315",
              borderRadius: 2,
              px: 4,
              "&:hover": { backgroundColor: "#bf360c" },
              "&:disabled": { backgroundColor: "#ccc" },
            }}
          >
            {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EmpleadoForm
