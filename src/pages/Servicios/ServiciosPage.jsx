"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Snackbar,
  Alert,
  InputAdornment,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material"
import {
  User,
  Car,
  Wrench,
  FileText,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Search,
  Keyboard,
  X,
  Building2,
} from "lucide-react"
import AgregarServicioModal from "../../components/Servicios/AgregarServicioModal"
import { useClientes } from "../../hooks/useClientes"
import { useVehiculos } from "../../hooks/useVehiculos"
import { useTiposServicios } from "../../hooks/useTiposServicios"
import { useServicios } from "../../hooks/useServicios"
import useEmpleados from "../../hooks/useEmpleados"
import useSucursales from "../../hooks/useSucursales"

const steps = [
  { id: 0, title: "Cliente", icon: User },
  { id: 1, title: "Vehículo", icon: Car },
  { id: 2, title: "Sucursal y Empleados", icon: Building2 },
  { id: 3, title: "Servicios", icon: Wrench },
  { id: 4, title: "Confirmación", icon: FileText },
]

const ServiciosPage = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({
    clienteId: null,
    vehiculoId: null,
    sucursalId: null,
    empleados: [],
    observaciones: "",
    precioReferencia: 0,
    items: [],
  })

  const { clientes, loadClientes } = useClientes()
  const { vehiculos, loadVehiculos, loadVehiculosByCliente } = useVehiculos() // Agregando loadVehiculosByCliente
  const { tiposServicios, loadTiposServicios } = useTiposServicios()
  const { createServicio, loading } = useServicios()
  const { empleadosActivos, loadEmpleadosActivos, loadEmpleadosBySucursal } = useEmpleados()
  const { sucursalesActivas, loadSucursalesActivas } = useSucursales()

  const [selectedCliente, setSelectedCliente] = useState(null)
  const [selectedVehiculo, setSelectedVehiculo] = useState(null)
  const [selectedSucursal, setSelectedSucursal] = useState(null)
  const [clienteSearch, setClienteSearch] = useState("")
  const [showItemDialog, setShowItemDialog] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {
        // Only proceed if we're not in the final step and can proceed
        if (activeStep < 4 && canProceed()) {
          e.preventDefault()
          handleNext()
        }
        return
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "ArrowRight":
            e.preventDefault()
            if (activeStep < 4 && canProceed()) handleNext()
            break
          case "ArrowLeft":
            e.preventDefault()
            if (activeStep > 0) handleBack()
            break
          case "Enter":
            e.preventDefault()
            if (activeStep === 4 && canProceed()) handleSubmit()
            break
          case "/":
            e.preventDefault()
            setShowShortcuts(true)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeStep, formData]) // Added formData as dependency to re-register event listener when form data changes

  useEffect(() => {
    loadClientes()
    loadTiposServicios()
    loadSucursalesActivas()
  }, [])

  useEffect(() => {
    if (formData.clienteId) {
      loadVehiculosByCliente(formData.clienteId) // Usando función específica para cargar vehículos por cliente
    }
  }, [formData.clienteId]) // Removiendo loadVehiculosByCliente del array de dependencias para evitar bucle infinito

  useEffect(() => {
    if (formData.sucursalId) {
      loadEmpleadosBySucursal(formData.sucursalId)
      setFormData((prev) => ({
        ...prev,
        empleados: [],
      }))
    }
  }, [formData.sucursalId, loadEmpleadosBySucursal])

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, 4))
  }

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }

  const handleReset = () => {
    setActiveStep(0)
    setFormData({
      clienteId: null,
      vehiculoId: null,
      sucursalId: null,
      empleados: [],
      observaciones: "",
      precioReferencia: 0,
      items: [],
    })
    setSelectedCliente(null)
    setSelectedVehiculo(null)
    setSelectedSucursal(null)
    setClienteSearch("")
  }

  const handleClienteSelect = (cliente) => {
    setSelectedCliente(cliente)
    setFormData((prev) => ({
      ...prev,
      clienteId: cliente?.id || null,
      vehiculoId: null,
    }))
    setSelectedVehiculo(null)
  }

  const handleVehiculoSelect = (vehiculo) => {
    setSelectedVehiculo(vehiculo)
    setFormData((prev) => ({
      ...prev,
      vehiculoId: vehiculo?.id || null,
    }))
  }

  const handleSucursalSelect = (sucursalId) => {
    const sucursal = sucursalesActivas.find((s) => s.id === sucursalId)
    setSelectedSucursal(sucursal)
    setFormData((prev) => ({
      ...prev,
      sucursalId: sucursalId,
      empleados: [],
    }))
  }

  const handleEmpleadosChange = (empleadosIds) => {
    setFormData((prev) => ({
      ...prev,
      empleados: empleadosIds,
    }))
  }

  const handleAddItem = (newItem) => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))
    showSnackbar("El servicio se agregó correctamente a la lista.")
  }

  const handleRemoveItem = (itemId) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }))
  }

  const handleSubmit = async () => {
    try {
      const submitData = {
        cliente_id: formData.clienteId,
        vehiculo_id: formData.vehiculoId,
        sucursal_id: formData.sucursalId,
        empleados: formData.empleados,
        observaciones: formData.observaciones,
        precio_referencia: formData.precioReferencia,
        items: formData.items.map((item) => ({
          tipo_servicio_id: item.tipoServicioId,
          observaciones: item.observaciones,
          notas: item.notas,
          productos: item.productos || [],
        })),
      }

      await createServicio(submitData)
      showSnackbar("¡Servicio creado exitosamente!")
      setActiveStep(5)
    } catch (error) {
      showSnackbar(error.message, "error")
    }
  }

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return formData.clienteId !== null
      case 1:
        return formData.vehiculoId !== null
      case 2:
        return formData.sucursalId !== null
      case 3:
        return formData.items.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  const filteredClientes = clientes.filter((cliente) =>
    `${cliente.nombre} ${cliente.apellido} ${cliente.dni}`.toLowerCase().includes(clienteSearch.toLowerCase()),
  )

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Card elevation={2} sx={{ height: 400, display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ p: 3, pb: 2, borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: "#d84315", color: "white" }}>
                  <User size={16} />
                </Box>
                <Typography variant="h6" sx={{ color: "#171717", fontWeight: 600 }}>
                  Seleccionar Cliente
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                Busca y selecciona el cliente para quien realizarás el servicio
              </Typography>
            </CardContent>
            <CardContent sx={{ p: 3, flex: 1, overflow: "auto" }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar cliente por nombre, apellido o DNI..."
                value={clienteSearch}
                onChange={(e) => setClienteSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={16} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": { borderColor: "#d84315" },
                    "&.Mui-focused fieldset": { borderColor: "#d84315" },
                  },
                }}
              />

              {clienteSearch.trim() && (
                <Box
                  sx={{
                    maxHeight: 240,
                    overflow: "auto",
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    p: 1,
                    bgcolor: "#fafafa",
                  }}
                >
                  {filteredClientes.length > 0 ? (
                    <Grid container spacing={1}>
                      {filteredClientes.map((cliente) => (
                        <Grid item xs={12} key={cliente.id}>
                          <Card
                            elevation={selectedCliente?.id === cliente.id ? 2 : 0}
                            sx={{
                              cursor: "pointer",
                              border: selectedCliente?.id === cliente.id ? "2px solid #d84315" : "1px solid #e0e0e0",
                              bgcolor: selectedCliente?.id === cliente.id ? "#d84315" + "08" : "white",
                              "&:hover": { borderColor: "#d84315", bgcolor: "#f5f5f5" },
                              transition: "all 0.2s",
                            }}
                            onClick={() => handleClienteSelect(cliente)}
                          >
                            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Box>
                                  <Typography variant="subtitle2" sx={{ color: "#171717", fontWeight: 600 }}>
                                    {cliente.nombre} {cliente.apellido}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                                    DNI: {cliente.dni || "No especificado"}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                    Tel: {cliente.telefono || "No especificado"}
                                  </Typography>
                                </Box>
                                {selectedCliente?.id === cliente.id && <CheckCircle size={16} color="#d84315" />}
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Typography variant="body2" sx={{ textAlign: "center", py: 2, color: "text.secondary" }}>
                      No se encontraron clientes con ese criterio
                    </Typography>
                  )}
                </Box>
              )}

              {!clienteSearch.trim() && selectedCliente && (
                <Card elevation={1} sx={{ border: "2px solid #d84315", bgcolor: "#d84315" + "08" }}>
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: "#171717", fontWeight: 600 }}>
                          {selectedCliente.nombre} {selectedCliente.apellido}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                          DNI: {selectedCliente.dni || "No especificado"}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          Tel: {selectedCliente.telefono || "No especificado"}
                        </Typography>
                      </Box>
                      <CheckCircle size={16} color="#d84315" />
                    </Box>
                  </CardContent>
                </Card>
              )}

              {!clienteSearch.trim() && !selectedCliente && (
                <Box
                  sx={{
                    textAlign: "center",
                    py: 4,
                    border: "2px dashed #d84315",
                    borderRadius: 2,
                    bgcolor: "#d84315" + "08",
                  }}
                >
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    Escribe en el buscador para encontrar un cliente
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        )

      case 1:
        return (
          <Card elevation={2} sx={{ height: 400, display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ p: 3, pb: 2, borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: "#d84315", color: "white" }}>
                  <Car size={16} />
                </Box>
                <Typography variant="h6" sx={{ color: "#171717", fontWeight: 600 }}>
                  Seleccionar Vehículo
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                Elige el vehículo del cliente que recibirá el servicio
              </Typography>
            </CardContent>
            <CardContent sx={{ p: 3, flex: 1, overflow: "auto" }}>
              {vehiculos.length === 0 ? (
                <Card elevation={0} sx={{ border: "1px solid #d84315", bgcolor: "#d84315" + "08", p: 2 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    El cliente seleccionado no tiene vehículos registrados.
                  </Typography>
                </Card>
              ) : (
                <Grid container spacing={2}>
                  {vehiculos.map((vehiculo) => (
                    <Grid item xs={12} sm={6} md={4} key={vehiculo.id}>
                      <Card
                        elevation={selectedVehiculo?.id === vehiculo.id ? 2 : 0}
                        sx={{
                          cursor: "pointer",
                          border: selectedVehiculo?.id === vehiculo.id ? "2px solid #d84315" : "1px solid #e0e0e0",
                          bgcolor: selectedVehiculo?.id === vehiculo.id ? "#d84315" + "08" : "white",
                          "&:hover": { borderColor: "#d84315", bgcolor: "#f5f5f5" },
                          transition: "all 0.2s",
                        }}
                        onClick={() => handleVehiculoSelect(vehiculo)}
                      >
                        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <Box>
                              <Typography
                                variant="subtitle1"
                                sx={{ color: "#d84315", fontWeight: 700, fontSize: "0.875rem" }}
                              >
                                {vehiculo.patente}
                              </Typography>
                              <Typography
                                variant="subtitle2"
                                sx={{ color: "#171717", fontWeight: 600, fontSize: "0.75rem" }}
                              >
                                {vehiculo.marca} {vehiculo.modelo}
                              </Typography>
                              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                Año: {vehiculo.año} | Km: {vehiculo.kilometraje?.toLocaleString()}
                              </Typography>
                            </Box>
                            {selectedVehiculo?.id === vehiculo.id && <CheckCircle size={16} color="#d84315" />}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card elevation={2} sx={{ height: 400, display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ p: 3, pb: 2, borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: "#d84315", color: "white" }}>
                  <Building2 size={16} />
                </Box>
                <Typography variant="h6" sx={{ color: "#171717", fontWeight: 600 }}>
                  Sucursal y Empleados
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                Selecciona la sucursal donde se realizará el servicio y los empleados asignados
              </Typography>
            </CardContent>
            <CardContent sx={{ p: 3, flex: 1, overflow: "auto" }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Sucursal *</InputLabel>
                    <Select
                      value={formData.sucursalId || ""}
                      label="Sucursal *"
                      onChange={(e) => handleSucursalSelect(e.target.value)}
                      sx={{
                        borderRadius: 2,
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d84315" },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#d84315" },
                      }}
                    >
                      {sucursalesActivas.map((sucursal) => (
                        <MenuItem key={sucursal.id} value={sucursal.id}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {sucursal.nombre}
                            </Typography>
                            {sucursal.direccion && (
                              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                {sucursal.direccion}
                              </Typography>
                            )}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Empleados Asignados</InputLabel>
                    <Select
                      multiple
                      value={formData.empleados}
                      label="Empleados Asignados"
                      onChange={(e) => handleEmpleadosChange(e.target.value)}
                      disabled={!formData.sucursalId}
                      renderValue={(selected) => (
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {selected.map((empleadoId) => {
                            const empleado = empleadosActivos.find((e) => e.id === empleadoId)
                            return (
                              <Chip
                                key={empleadoId}
                                label={`${empleado?.nombre} ${empleado?.apellido}`}
                                size="small"
                                sx={{ bgcolor: "#d84315", color: "white" }}
                              />
                            )
                          })}
                        </Box>
                      )}
                      sx={{
                        borderRadius: 2,
                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#d84315" },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#d84315" },
                      }}
                    >
                      {empleadosActivos.map((empleado) => (
                        <MenuItem key={empleado.id} value={empleado.id}>
                          <Checkbox
                            checked={formData.empleados.includes(empleado.id)}
                            sx={{
                              color: "#d84315",
                              "&.Mui-checked": { color: "#d84315" },
                            }}
                          />
                          <ListItemText
                            primary={`${empleado.nombre} ${empleado.apellido}`}
                            secondary={empleado.cargo}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {selectedSucursal && (
                <Card elevation={1} sx={{ border: "2px solid #d84315", bgcolor: "#d84315" + "08", mt: 3 }}>
                  <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                      <Building2 size={16} color="#d84315" />
                      <Typography variant="subtitle2" sx={{ color: "#171717", fontWeight: 600 }}>
                        Sucursal Seleccionada
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {selectedSucursal.nombre}
                    </Typography>
                    {selectedSucursal.direccion && (
                      <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                        {selectedSucursal.direccion}
                      </Typography>
                    )}
                    {selectedSucursal.telefono && (
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        Tel: {selectedSucursal.telefono}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card elevation={2} sx={{ height: 400, display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ p: 3, pb: 2, borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: "#d84315", color: "white" }}>
                  <Wrench size={16} />
                </Box>
                <Typography variant="h6" sx={{ color: "#171717", fontWeight: 600 }}>
                  Elegir Servicios
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                Agrega los servicios que realizarás en este vehículo
              </Typography>
            </CardContent>
            <CardContent sx={{ p: 3, flex: 1, overflow: "auto" }}>
              <Button
                variant="contained"
                startIcon={<Plus size={16} />}
                onClick={() => setShowItemDialog(true)}
                sx={{
                  bgcolor: "#d84315",
                  "&:hover": { bgcolor: "#d84315" + "dd" },
                  mb: 2,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Agregar Servicio
              </Button>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {formData.items.length > 0 ? (
                  formData.items.map((item) => (
                    <Card key={item.id} elevation={1} sx={{ border: "1px solid #e0e0e0" }}>
                      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ color: "#171717", fontWeight: 600, mb: 0.5 }}>
                              {item.tipoServicioNombre}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mb: 1 }}>
                              {item.descripcion}
                            </Typography>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                              {item.observaciones && (
                                <Chip
                                  label={`Obs: ${item.observaciones}`}
                                  size="small"
                                  variant="filled"
                                  sx={{ bgcolor: "#f5f5f5", color: "#171717", fontSize: "0.7rem" }}
                                />
                              )}
                              {item.notas && (
                                <Chip
                                  label={`Notas: ${item.notas}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ borderColor: "#e0e0e0", color: "#171717", fontSize: "0.7rem" }}
                                />
                              )}
                            </Box>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveItem(item.id)}
                            sx={{ color: "#f44336", "&:hover": { bgcolor: "#f44336" + "10" } }}
                          >
                            <Trash2 size={14} />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ textAlign: "center", py: 3, color: "text.secondary" }}>
                    No hay servicios agregados aún
                  </Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card elevation={2} sx={{ height: 400, display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ p: 3, pb: 2, borderBottom: "1px solid #f0f0f0", flexShrink: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: "#d84315", color: "white" }}>
                  <FileText size={16} />
                </Box>
                <Typography variant="h6" sx={{ color: "#171717", fontWeight: 600 }}>
                  Detalles y Confirmación
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.75rem" }}>
                Completa los detalles finales del servicio
              </Typography>
            </CardContent>
            <CardContent sx={{ p: 3, flex: 1, overflow: "auto" }}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" sx={{ color: "#171717", fontWeight: 600, display: "block", mb: 1 }}>
                    Observaciones Generales
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                    placeholder="Observaciones adicionales..."
                    value={formData.observaciones}
                    onChange={(e) => setFormData((prev) => ({ ...prev, observaciones: e.target.value }))}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#d84315" },
                        "&.Mui-focused fieldset": { borderColor: "#d84315" },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" sx={{ color: "#171717", fontWeight: 600, display: "block", mb: 1 }}>
                    Precio de Referencia
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    placeholder="0"
                    value={formData.precioReferencia}
                    onChange={(e) => setFormData((prev) => ({ ...prev, precioReferencia: Number(e.target.value) }))}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#d84315" },
                        "&.Mui-focused fieldset": { borderColor: "#d84315" },
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Card elevation={0} sx={{ border: "1px solid #d84315", bgcolor: "#d84315" + "08", p: 2 }}>
                <Typography variant="subtitle2" sx={{ color: "#d84315", fontWeight: 600, mb: 2 }}>
                  Resumen del Servicio
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" sx={{ display: "block" }}>
                      <strong>Cliente:</strong> {selectedCliente?.nombre} {selectedCliente?.apellido}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block" }}>
                      <strong>DNI:</strong> {selectedCliente?.dni || "No especificado"}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block" }}>
                      <strong>Vehículo:</strong> {selectedVehiculo?.patente}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block" }}>
                      <strong>Modelo:</strong> {selectedVehiculo?.marca} {selectedVehiculo?.modelo}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" sx={{ display: "block" }}>
                      <strong>Sucursal:</strong> {selectedSucursal?.nombre}
                    </Typography>
                    <Typography variant="caption" sx={{ display: "block" }}>
                      <strong>Empleados:</strong>{" "}
                      {formData.empleados.length > 0
                        ? formData.empleados
                            .map((empId) => {
                              const emp = empleadosActivos.find((e) => e.id === empId)
                              return `${emp?.nombre} ${emp?.apellido}`
                            })
                            .join(", ")
                        : "Ninguno asignado"}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1, borderColor: "#d84315" + "30" }} />
                <Typography variant="caption" sx={{ display: "block" }}>
                  <strong>Servicios:</strong> {formData.items.length} item(s)
                </Typography>
                {formData.precioReferencia > 0 && (
                  <Typography variant="caption" sx={{ display: "block", color: "#d84315", fontWeight: 600 }}>
                    Precio de Referencia: ${formData.precioReferencia.toLocaleString()}
                  </Typography>
                )}
              </Card>
            </CardContent>
          </Card>
        )

      case 5:
        return (
          <Card elevation={2} sx={{ textAlign: "center", p: 4 }}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <Box sx={{ p: 2, borderRadius: "50%", bgcolor: "#4caf50" + "20" }}>
                <CheckCircle size={48} color="#4caf50" />
              </Box>
              <Typography variant="h4" sx={{ color: "#171717", fontWeight: 700 }}>
                ¡Servicio Creado Exitosamente!
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: 400 }}>
                El servicio ha sido registrado correctamente en el sistema
              </Typography>
              <Button
                variant="contained"
                onClick={handleReset}
                sx={{
                  bgcolor: "#d84315",
                  "&:hover": { bgcolor: "#d84315" + "dd" },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  mt: 1,
                }}
              >
                Crear Otro Servicio
              </Button>
            </Box>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: "#171717", fontWeight: 700, mt: -3, mb: -3, textAlign: "center" }}>
          Crear Nuevo Servicio
        </Typography>
      </Box>

      {activeStep < 5 && (
        <Card elevation={2} sx={{ mb: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <Step key={step.id}>
                    <StepLabel
                      StepIconComponent={() => (
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "2px solid",
                            borderColor: index <= activeStep ? "#d84315" : "#e0e0e0",
                            bgcolor: index < activeStep ? "#d84315" : index === activeStep ? "#d84315" + "10" : "white",
                            color: index < activeStep ? "white" : index === activeStep ? "#d84315" : "#9e9e9e",
                          }}
                        >
                          {index < activeStep ? <CheckCircle size={16} /> : <Icon size={16} />}
                        </Box>
                      )}
                      sx={{
                        "& .MuiStepLabel-label": {
                          color: index <= activeStep ? "#d84315" : "#9e9e9e",
                          fontWeight: index === activeStep ? 600 : 400,
                        },
                      }}
                    >
                      {step.title}
                    </StepLabel>
                  </Step>
                )
              })}
            </Stepper>
          </CardContent>
        </Card>
      )}

      <Box sx={{ mb: 3 }}>{renderStepContent()}</Box>

      {activeStep < 5 && (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            startIcon={<ArrowLeft size={16} />}
            onClick={handleBack}
            disabled={activeStep === 0}
            sx={{
              borderColor: "#e0e0e0",
              color: "#171717",
              "&:hover": { borderColor: "#d84315", color: "#d84315" },
              borderRadius: 2,
              textTransform: "none",
            }}
          >
            Atrás
          </Button>

          {activeStep < steps.length - 1 ? (
            <Button
              variant="contained"
              endIcon={<ArrowRight size={16} />}
              onClick={handleNext}
              disabled={!canProceed()}
              sx={{
                bgcolor: "#d84315",
                "&:hover": { bgcolor: "#d84315" + "dd" },
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              variant="contained"
              endIcon={<CheckCircle size={16} />}
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
              sx={{
                bgcolor: "#d84315",
                "&:hover": { bgcolor: "#d84315" + "dd" },
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {loading ? "Creando..." : "Crear Servicio"}
            </Button>
          )}
        </Box>
      )}

      <AgregarServicioModal
        isOpen={showItemDialog}
        onClose={() => setShowItemDialog(false)}
        onAddItem={handleAddItem}
        tiposServicios={tiposServicios}
      />

      <Dialog open={showShortcuts} onClose={() => setShowShortcuts(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, pb: 1 }}>
          <Keyboard size={20} />
          Atajos de Teclado
          <IconButton onClick={() => setShowShortcuts(false)} sx={{ position: "absolute", right: 8, top: 8 }}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2">Avanzar paso (si es válido)</Typography>
              <Chip label="Enter" variant="outlined" size="small" />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2">Siguiente paso</Typography>
              <Chip label="Ctrl + →" variant="outlined" size="small" />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2">Paso anterior</Typography>
              <Chip label="Ctrl + ←" variant="outlined" size="small" />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2">Crear servicio</Typography>
              <Chip label="Ctrl + Enter" variant="outlined" size="small" />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="body2">Ver atajos</Typography>
              <Chip label="Ctrl + /" variant="outlined" size="small" />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ServiciosPage
