"use client"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Avatar,
  IconButton,
  Autocomplete,
  CircularProgress,
} from "@mui/material"
import { Close, DirectionsCar, Person } from "@mui/icons-material"
import { NumericFormat } from "react-number-format"
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
  const [selectedCliente, setSelectedCliente] = useState(null)
  const isEditing = Boolean(vehiculo)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
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
      const cliente = clientes.find((c) => c.id === vehiculo.cliente_id)
      if (cliente) {
        setSelectedCliente(cliente)
      }
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
      setSelectedCliente(null)
    }
  }, [vehiculo, reset, clientes])

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
    setSelectedCliente(null)
    onClose()
  }

  const handleClienteChange = (event, newValue) => {
    setSelectedCliente(newValue)
    setValue("clienteId", newValue ? newValue.id : "")
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          height: "90vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          bgcolor: "#d84315",
          color: "white",
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)" }}>
            <DirectionsCar />
          </Avatar>
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: "bold", mb: 0.5 }}>
              {isEditing ? "Editar Vehículo" : "Nuevo Vehículo"}
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)" }}>
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
            bgcolor: "rgba(255,255,255,0.1)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
          }}
        >
          <Close />
        </IconButton>
      </Box>

      <DialogContent sx={{ flex: 1, overflow: "auto", p: 0 }}>
        <Box
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 3,
              pb: 0,
            }}
          >
            <Box
              sx={{
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: 2,
                p: 3,
                mb: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: "#d84315" }}>
                  <Person />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: "semibold", color: "grey.900" }}>
                  Cliente
                </Typography>
              </Box>

              <Autocomplete
                options={clientes}
                getOptionLabel={(option) => `${option.nombre} ${option.apellido} - ${option.dni}`}
                value={selectedCliente}
                onChange={handleClienteChange}
                loading={loadingClientes}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cliente *"
                    placeholder="Buscar cliente..."
                    error={!!errors.clienteId}
                    helperText={errors.clienteId?.message}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingClientes ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#d84315" },
                        "&.Mui-focused fieldset": { borderColor: "#d84315" },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#d84315" },
                    }}
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
            </Box>

            <Box
              sx={{
                bgcolor: "grey.50",
                border: "1px solid",
                borderColor: "grey.200",
                borderRadius: 2,
                p: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: "#1976d2" }}>
                  <DirectionsCar />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: "semibold", color: "grey.900" }}>
                  Datos del Vehículo
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    {...register("patente")}
                    label="Patente *"
                    placeholder="ABC123"
                    fullWidth
                    error={!!errors.patente}
                    helperText={errors.patente?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#d84315" },
                        "&.Mui-focused fieldset": { borderColor: "#d84315" },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#d84315" },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    {...register("marca")}
                    label="Marca *"
                    placeholder="Toyota"
                    fullWidth
                    error={!!errors.marca}
                    helperText={errors.marca?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#d84315" },
                        "&.Mui-focused fieldset": { borderColor: "#d84315" },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#d84315" },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    {...register("modelo")}
                    label="Modelo *"
                    placeholder="Corolla"
                    fullWidth
                    error={!!errors.modelo}
                    helperText={errors.modelo?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#d84315" },
                        "&.Mui-focused fieldset": { borderColor: "#d84315" },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#d84315" },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    {...register("año")}
                    label="Año *"
                    type="number"
                    placeholder="2020"
                    fullWidth
                    error={!!errors.año}
                    helperText={errors.año?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#d84315" },
                        "&.Mui-focused fieldset": { borderColor: "#d84315" },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#d84315" },
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="kilometraje"
                    control={control}
                    render={({ field: { onChange, value, ...field } }) => (
                      <NumericFormat
                        {...field}
                        value={value}
                        onValueChange={(values) => {
                          onChange(values.floatValue || 0)
                        }}
                        customInput={TextField}
                        thousandSeparator="."
                        decimalSeparator=","
                        suffix=" km"
                        allowNegative={false}
                        label="Kilometraje *"
                        placeholder="50.000 km"
                        fullWidth
                        error={!!errors.kilometraje}
                        helperText={errors.kilometraje?.message}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": { borderColor: "#d84315" },
                            "&.Mui-focused fieldset": { borderColor: "#d84315" },
                          },
                          "& .MuiInputLabel-root.Mui-focused": { color: "#d84315" },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    {...register("observaciones")}
                    label="Observaciones"
                    placeholder="Observaciones adicionales sobre el vehículo..."
                    multiline
                    rows={3}
                    fullWidth
                    error={!!errors.observaciones}
                    helperText={errors.observaciones?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#d84315" },
                        "&.Mui-focused fieldset": { borderColor: "#d84315" },
                      },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#d84315" },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Box
            sx={{
              borderTop: "1px solid",
              borderColor: "grey.200",
              bgcolor: "grey.50",
              p: 3,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              flexShrink: 0,
            }}
          >
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                borderColor: "grey.300",
                color: "grey.700",
                "&:hover": {
                  borderColor: "grey.400",
                  bgcolor: "grey.50",
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: "#d84315",
                "&:hover": { bgcolor: "#bf360c" },
                "&:disabled": { opacity: 0.5 },
              }}
            >
              {loading ? "Guardando..." : isEditing ? "Actualizar Vehículo" : "Crear Vehículo"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default VehiculoForm
