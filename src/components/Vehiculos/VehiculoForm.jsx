"use client"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  IconButton,
  Paper,
  Autocomplete,
} from "@mui/material"
import { Close as CloseIcon, DirectionsCar as CarIcon, Person as PersonIcon } from "@mui/icons-material"
import { clientesService } from "../../services/clientesService"
import logger from "../../utils/logger"

const vehiculoSchema = yup.object({
  clienteId: yup.string().required("El cliente es obligatorio"),
  patente: yup
    .string()
    .required("La patente es obligatoria")
    .min(3, "La patente debe tener al menos 3 caracteres")
    .max(10, "La patente no puede exceder 10 caracteres"),
  marca: yup.string().required("La marca es obligatoria"),
  modelo: yup.string().required("El modelo es obligatorio"),
  año: yup
    .number()
    .required("El año es obligatorio")
    .min(1900, "Año mínimo: 1900")
    .max(new Date().getFullYear() + 1, "Año máximo: " + (new Date().getFullYear() + 1)),
  kilometraje: yup.number().required("El kilometraje es obligatorio").min(0, "El kilometraje no puede ser negativo"),
  observaciones: yup.string(),
})

const VehiculoForm = ({ open, onClose, onSubmit, vehiculo = null, loading = false }) => {
  const [clientes, setClientes] = useState([])
  const [loadingClientes, setLoadingClientes] = useState(false)
  const isEditing = Boolean(vehiculo)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(vehiculoSchema),
    defaultValues: {
      clienteId: vehiculo?.cliente_id || "",
      patente: vehiculo?.patente || "",
      marca: vehiculo?.marca || "",
      modelo: vehiculo?.modelo || "",
      año: vehiculo?.año || new Date().getFullYear(),
      kilometraje: vehiculo?.kilometraje || 0,
      observaciones: vehiculo?.observaciones || "",
    },
  })

  // Cargar clientes
  useEffect(() => {
    const loadClientes = async () => {
      setLoadingClientes(true)
      try {
        logger.debug("Cargando clientes para formulario de vehículos")
        const result = await clientesService.getAll(1, 1000)
        logger.debug("Respuesta del servicio de clientes", result)

        let clientesData = []
        if (Array.isArray(result)) {
          clientesData = result
        } else if (result && result.data && Array.isArray(result.data)) {
          clientesData = result.data
        }

        const clientesActivos = clientesData.filter((c) => c.activo)
        logger.debug("Clientes activos encontrados", { count: clientesActivos.length })
        setClientes(clientesActivos)
      } catch (error) {
        logger.error("Error al cargar clientes", error)
        setClientes([])
      } finally {
        setLoadingClientes(false)
      }
    }

    if (open) {
      loadClientes()
    }
  }, [open])

  useEffect(() => {
    if (vehiculo) {
      reset({
        clienteId: vehiculo.cliente_id || "",
        patente: vehiculo.patente || "",
        marca: vehiculo.marca || "",
        modelo: vehiculo.modelo || "",
        año: vehiculo.año || new Date().getFullYear(),
        kilometraje: vehiculo.kilometraje || 0,
        observaciones: vehiculo.observaciones || "",
      })
    } else {
      reset({
        clienteId: "",
        patente: "",
        marca: "",
        modelo: "",
        año: new Date().getFullYear(),
        kilometraje: 0,
        observaciones: "",
      })
    }
  }, [vehiculo, reset])

  const handleFormSubmit = (data) => {
    logger.debug("Datos del formulario antes de enviar", data)

    const transformedData = {
      clienteId: data.clienteId,
      patente: data.patente.toUpperCase(),
      marca: data.marca,
      modelo: data.modelo,
      año: Number.parseInt(data.año),
      kilometraje: Number.parseInt(data.kilometraje),
      observaciones: data.observaciones || "",
    }

    logger.debug("Datos transformados para enviar", transformedData)
    onSubmit(transformedData)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const selectedCliente = clientes.find((c) => c.id === watch("clienteId"))

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header Fijo */}
      <Box
        sx={{
          background: "primary.main",
          color: "primary.contrastText",
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "12px 12px 0 0",
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CarIcon />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5, color: "white" }}>
              {isEditing ? "Editar Vehículo" : "Nuevo Vehículo"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {isEditing
                ? "Modifica la información del vehículo existente"
                : "Completa los datos para registrar un nuevo vehículo"}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{
            color: "white",
            bgcolor: "rgba(255, 255, 255, 0.1)",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Contenido Scrolleable */}
      <Box
        component="form"
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        <DialogContent
          sx={{
            flex: 1,
            overflow: "auto",
            p: 0,
          }}
        >
          <Box sx={{ p: 3 }}>
            {/* Sección Cliente */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.default",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                  }}
                >
                  <PersonIcon />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Cliente
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Autocomplete
                    options={clientes}
                    getOptionLabel={(option) => `${option.nombre} ${option.apellido} - ${option.dni}`}
                    value={selectedCliente}
                    onChange={(event, newValue) => {
                      setValue("clienteId", newValue ? newValue.id : "")
                    }}
                    loading={loadingClientes}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Cliente *"
                        error={!!errors.clienteId}
                        helperText={errors.clienteId?.message}
                        placeholder="Buscar cliente..."
                      />
                    )}
                    renderOption={(props, option) => (
                      <Box component="li" {...props}>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                            {option.nombre} {option.apellido}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            DNI: {option.dni} | Tel: {option.telefono}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    noOptionsText="No se encontraron clientes"
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Sección Vehículo */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.default",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    bgcolor: "secondary.main",
                    color: "secondary.contrastText",
                  }}
                >
                  <CarIcon />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Datos del Vehículo
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Patente *"
                    {...register("patente")}
                    error={!!errors.patente}
                    helperText={errors.patente?.message}
                    placeholder="ABC123"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Marca *"
                    {...register("marca")}
                    error={!!errors.marca}
                    helperText={errors.marca?.message}
                    placeholder="Toyota"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Modelo *"
                    {...register("modelo")}
                    error={!!errors.modelo}
                    helperText={errors.modelo?.message}
                    placeholder="Corolla"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Año *"
                    type="number"
                    {...register("año")}
                    error={!!errors.año}
                    helperText={errors.año?.message}
                    placeholder="2020"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Kilometraje *"
                    type="number"
                    {...register("kilometraje")}
                    error={!!errors.kilometraje}
                    helperText={errors.kilometraje?.message}
                    placeholder="50000"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Observaciones"
                    multiline
                    rows={3}
                    {...register("observaciones")}
                    error={!!errors.observaciones}
                    helperText={errors.observaciones?.message}
                    placeholder="Observaciones adicionales sobre el vehículo..."
                  />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </DialogContent>

        {/* Footer Fijo */}
        <Box
          sx={{
            p: 3,
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "background.default",
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            flexShrink: 0,
          }}
        >
          <Button onClick={handleClose} variant="outlined" size="large" sx={{ px: 4 }}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ px: 4 }}>
            {loading ? "Guardando..." : isEditing ? "Actualizar Vehículo" : "Crear Vehículo"}
          </Button>
        </Box>
      </Box>
    </Dialog>
  )
}

export default VehiculoForm
