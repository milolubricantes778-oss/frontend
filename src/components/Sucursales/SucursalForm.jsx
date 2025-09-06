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
} from "@mui/material"
import { Close as CloseIcon, Business as BusinessIcon } from "@mui/icons-material"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

const schema = yup.object({
  nombre: yup
    .string()
    .required("El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  ubicacion: yup.string().nullable(),
  activo: yup.boolean(),
})

const SucursalForm = ({ open, onClose, onSubmit, sucursal }) => {
  const [loading, setLoading] = useState(false)
  const isEditing = Boolean(sucursal)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      ubicacion: "",
      activo: true,
    },
  })

  const activo = watch("activo")

  useEffect(() => {
    if (sucursal) {
      setValue("nombre", sucursal.nombre || "")
      setValue("ubicacion", sucursal.ubicacion || "")
      setValue("activo", sucursal.activo ?? true)
    } else {
      reset({
        nombre: "",
        ubicacion: "",
        activo: true,
      })
    }
  }, [sucursal, setValue, reset])

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true)
      const cleanData = {
        ...data,
        ubicacion: data.ubicacion?.trim() || null,
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
          <BusinessIcon sx={{ fontSize: 28 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              {isEditing ? "Editar Sucursal" : "Nueva Sucursal"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {isEditing ? "Modifica la información de la sucursal" : "Completa los datos de la nueva sucursal"}
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
            {/* Información General */}
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
                  Información General
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={isEditing ? 8 : 12}>
                    <TextField
                      fullWidth
                      label="Nombre de la Sucursal *"
                      {...register("nombre")}
                      error={!!errors.nombre}
                      helperText={errors.nombre?.message}
                      placeholder="Ej: Sucursal Centro, Sucursal Norte..."
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
                    <Grid item xs={12} md={4}>
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
                        label={activo ? "Activa" : "Inactiva"}
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Grid>

            {/* Ubicación */}
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
                  Ubicación
                </Typography>
                <TextField
                  fullWidth
                  label="Ubicación"
                  multiline
                  rows={2}
                  {...register("ubicacion")}
                  error={!!errors.ubicacion}
                  helperText={errors.ubicacion?.message}
                  placeholder="Ubicación completa de la sucursal..."
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": { borderColor: "#d84315" },
                      "&.Mui-focused fieldset": { borderColor: "#d84315" },
                    },
                  }}
                />
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

export default SucursalForm
