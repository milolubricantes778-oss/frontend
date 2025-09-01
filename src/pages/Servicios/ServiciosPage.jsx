"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import AgregarServicioModal from "@/components/Servicios/AgregarServicioModal"
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
} from "lucide-react"
import { useClientes } from "@/hooks/useClientes"
import { useVehiculos } from "@/hooks/useVehiculos"
import { useTiposServicios } from "@/hooks/useTiposServicios"
import { useServicios } from "@/hooks/useServicios"

const steps = [
  { id: 0, title: "Cliente", icon: User },
  { id: 1, title: "Vehículo", icon: Car },
  { id: 2, title: "Servicios", icon: Wrench },
  { id: 3, title: "Confirmación", icon: FileText },
]

const ServiciosPage = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({
    clienteId: null,
    vehiculoId: null,
    observaciones: "",
    precioReferencia: 0,
    items: [],
  })

  const { clientes, loadClientes } = useClientes()
  const { vehiculos, loadVehiculos } = useVehiculos()
  const { tiposServicios, loadTiposServicios } = useTiposServicios()
  const { createServicio, loading } = useServicios()

  const [selectedCliente, setSelectedCliente] = useState(null)
  const [selectedVehiculo, setSelectedVehiculo] = useState(null)
  const [clienteSearch, setClienteSearch] = useState("")
  const [showItemDialog, setShowItemDialog] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "ArrowRight":
            e.preventDefault()
            if (activeStep < 3 && canProceed()) handleNext()
            break
          case "ArrowLeft":
            e.preventDefault()
            if (activeStep > 0) handleBack()
            break
          case "Enter":
            e.preventDefault()
            if (activeStep === 3 && canProceed()) handleSubmit()
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
  }, [activeStep])

  useEffect(() => {
    loadClientes()
    loadTiposServicios()
  }, [])

  useEffect(() => {
    if (formData.clienteId) {
      loadVehiculos(1, 10, "", formData.clienteId)
    }
  }, [formData.clienteId])

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, 3))
  }

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }

  const handleReset = () => {
    setActiveStep(0)
    setFormData({
      clienteId: null,
      vehiculoId: null,
      observaciones: "",
      precioReferencia: 0,
      items: [],
    })
    setSelectedCliente(null)
    setSelectedVehiculo(null)
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

  const handleAddItem = (newItem) => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }))

    toast({
      title: "Servicio agregado",
      description: "El servicio se agregó correctamente a la lista.",
    })
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
      toast({
        title: "¡Servicio creado exitosamente!",
        description: "El servicio ha sido registrado en el sistema.",
      })
      setActiveStep(4)
    } catch (error) {
      toast({
        title: "Error al crear servicio",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return formData.clienteId !== null
      case 1:
        return formData.vehiculoId !== null
      case 2:
        return formData.items.length > 0
      case 3:
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
          <div className="flex flex-col h-full">
            <div className="flex-shrink-0 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#d84315]" />
                  <h2 className="text-lg font-semibold text-[#171717]">Seleccionar Cliente</h2>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    size="sm"
                    className="h-8 px-3 text-sm border border-gray-300 hover:border-[#d84315] hover:text-[#d84315] rounded-lg bg-transparent"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Atrás
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="bg-[#d84315] hover:bg-[#d84315]/90 h-8 px-3 text-sm rounded-lg"
                    size="sm"
                  >
                    Siguiente
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente..."
                  value={clienteSearch}
                  onChange={(e) => setClienteSearch(e.target.value)}
                  className="pl-10 h-10 border border-gray-300 focus:border-[#d84315] rounded-lg"
                />
              </div>
            </div>

            <div className="flex-1 min-h-0">
              {clienteSearch.trim() && (
                <div className="h-full overflow-y-auto pr-2 space-y-2">
                  {filteredClientes.length > 0 ? (
                    filteredClientes.map((cliente) => (
                      <div
                        key={cliente.id}
                        className={`cursor-pointer p-3 rounded-lg border transition-colors ${
                          selectedCliente?.id === cliente.id
                            ? "border-[#d84315] bg-[#d84315]/5"
                            : "border-gray-200 hover:border-[#d84315]/50 hover:bg-gray-50"
                        }`}
                        onClick={() => handleClienteSelect(cliente)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium text-[#171717]">
                              {cliente.nombre} {cliente.apellido}
                            </h3>
                            <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                              <span>DNI: {cliente.dni || "N/A"}</span>
                              <span>Tel: {cliente.telefono || "N/A"}</span>
                            </div>
                          </div>
                          {selectedCliente?.id === cliente.id && <CheckCircle className="h-4 w-4 text-[#d84315]" />}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center py-8">
                        <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No se encontraron clientes</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!clienteSearch.trim() && selectedCliente && (
                <div className="flex items-center justify-center h-full">
                  <div className="p-4 border border-[#d84315] bg-[#d84315]/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-[#d84315]" />
                      <span className="font-medium text-[#171717]">Cliente seleccionado</span>
                    </div>
                    <p className="text-sm">
                      {selectedCliente.nombre} {selectedCliente.apellido}
                    </p>
                    <p className="text-xs text-muted-foreground">DNI: {selectedCliente.dni || "No especificado"}</p>
                  </div>
                </div>
              )}

              {!clienteSearch.trim() && !selectedCliente && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center py-8">
                    <Search className="h-8 w-8 text-[#d84315] mx-auto mb-2" />
                    <p className="text-sm text-[#d84315] font-medium">Buscar Cliente</p>
                    <p className="text-xs text-muted-foreground">Escribe para encontrar un cliente</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="flex flex-col h-full">
            <div className="flex-shrink-0 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-[#d84315]" />
                  <h2 className="text-lg font-semibold text-[#171717]">Seleccionar Vehículo</h2>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    size="sm"
                    className="h-8 px-3 text-sm border border-gray-300 hover:border-[#d84315] hover:text-[#d84315] rounded-lg bg-transparent"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Atrás
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="bg-[#d84315] hover:bg-[#d84315]/90 h-8 px-3 text-sm rounded-lg"
                    size="sm"
                  >
                    Siguiente
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              {vehiculos.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center py-8">
                    <Car className="h-8 w-8 text-[#d84315] mx-auto mb-2" />
                    <p className="text-sm text-[#d84315] font-medium">Sin Vehículos</p>
                    <p className="text-xs text-muted-foreground">El cliente no tiene vehículos registrados</p>
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-y-auto pr-2 space-y-2">
                  {vehiculos.map((vehiculo) => (
                    <div
                      key={vehiculo.id}
                      className={`cursor-pointer p-3 rounded-lg border transition-colors ${
                        selectedVehiculo?.id === vehiculo.id
                          ? "border-[#d84315] bg-[#d84315]/5"
                          : "border-gray-200 hover:border-[#d84315]/50 hover:bg-gray-50"
                      }`}
                      onClick={() => handleVehiculoSelect(vehiculo)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-[#171717]">{vehiculo.patente}</h3>
                          <p className="text-sm text-muted-foreground">
                            {vehiculo.marca} {vehiculo.modelo}
                          </p>
                          <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                            <span>Año: {vehiculo.año}</span>
                            <span>Km: {vehiculo.kilometraje?.toLocaleString()}</span>
                          </div>
                        </div>
                        {selectedVehiculo?.id === vehiculo.id && <CheckCircle className="h-4 w-4 text-[#d84315]" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="flex flex-col h-full">
            <div className="flex-shrink-0 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-[#d84315]" />
                  <h2 className="text-lg font-semibold text-[#171717]">Elegir Servicios</h2>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    size="sm"
                    className="h-8 px-3 text-sm border border-gray-300 hover:border-[#d84315] hover:text-[#d84315] rounded-lg bg-transparent"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Atrás
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="bg-[#d84315] hover:bg-[#d84315]/90 h-8 px-3 text-sm rounded-lg"
                    size="sm"
                  >
                    Siguiente
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>

              <Button
                onClick={() => setShowItemDialog(true)}
                className="bg-[#d84315] hover:bg-[#d84315]/90 h-10 text-sm px-4 rounded-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Servicio
              </Button>
            </div>

            <div className="flex-1 min-h-0">
              <div className="h-full overflow-y-auto pr-2">
                {formData.items.length > 0 ? (
                  <div className="space-y-2">
                    {formData.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 border border-gray-200 rounded-lg hover:border-[#d84315]/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 space-y-1">
                            <h3 className="font-medium text-[#171717]">{item.tipoServicioNombre}</h3>
                            <p className="text-sm text-muted-foreground">{item.descripcion}</p>
                            <div className="flex gap-2 flex-wrap">
                              {item.observaciones && (
                                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                                  Obs: {item.observaciones}
                                </Badge>
                              )}
                              {item.notas && (
                                <Badge variant="outline" className="text-xs px-2 py-0.5">
                                  Notas: {item.notas}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-lg ml-3"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center py-8">
                      <Wrench className="h-8 w-8 text-[#d84315] mx-auto mb-2" />
                      <p className="text-sm text-[#d84315] font-medium">Sin Servicios</p>
                      <p className="text-xs text-muted-foreground">Haz clic en "Agregar Servicio" para comenzar</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="flex flex-col h-full">
            <div className="flex-shrink-0 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#d84315]" />
                  <h2 className="text-lg font-semibold text-[#171717]">Detalles y Confirmación</h2>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    size="sm"
                    className="h-8 px-3 text-sm border border-gray-300 hover:border-[#d84315] hover:text-[#d84315] rounded-lg bg-transparent"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Atrás
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed() || loading}
                    className="bg-[#d84315] hover:bg-[#d84315]/90 h-8 px-3 text-sm rounded-lg"
                    size="sm"
                  >
                    {loading ? "Creando..." : "Crear Servicio"}
                    <CheckCircle className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="observaciones" className="text-sm font-medium">
                    Observaciones Generales
                  </Label>
                  <Textarea
                    id="observaciones"
                    placeholder="Observaciones adicionales..."
                    value={formData.observaciones}
                    onChange={(e) => setFormData((prev) => ({ ...prev, observaciones: e.target.value }))}
                    className="h-20 border border-gray-300 focus:border-[#d84315] rounded-lg text-sm"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="precio" className="text-sm font-medium">
                    Precio de Referencia
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-muted-foreground text-sm">$</span>
                    <Input
                      id="precio"
                      type="number"
                      placeholder="0"
                      value={formData.precioReferencia}
                      onChange={(e) => setFormData((prev) => ({ ...prev, precioReferencia: Number(e.target.value) }))}
                      className="pl-8 h-10 border border-gray-300 focus:border-[#d84315] rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border border-[#d84315] bg-[#d84315]/5 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-4 w-4 text-[#d84315]" />
                  <h3 className="font-medium text-[#171717]">Resumen del Servicio</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-3 w-3 text-[#d84315]" />
                      <span className="font-medium">Cliente:</span>
                    </div>
                    <p className="ml-5">
                      {selectedCliente?.nombre} {selectedCliente?.apellido}
                    </p>
                    <p className="text-xs text-muted-foreground ml-5">
                      DNI: {selectedCliente?.dni || "No especificado"}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Car className="h-3 w-3 text-[#d84315]" />
                      <span className="font-medium">Vehículo:</span>
                    </div>
                    <p className="ml-5">{selectedVehiculo?.patente}</p>
                    <p className="text-xs text-muted-foreground ml-5">
                      {selectedVehiculo?.marca} {selectedVehiculo?.modelo}
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[#d84315]/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Wrench className="h-3 w-3 text-[#d84315]" />
                    <span className="font-medium text-sm">Servicios:</span>
                    <Badge variant="secondary" className="text-xs">
                      {formData.items.length} item(s)
                    </Badge>
                  </div>
                  {formData.precioReferencia > 0 && (
                    <p className="text-sm font-medium text-[#d84315] ml-5">
                      Precio de Referencia: ${formData.precioReferencia.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="flex items-center justify-center h-full -mt-20">
            <div className="border border-green-200 bg-green-50 rounded-lg p-6 text-center max-w-md w-full">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-[#171717]">¡Servicio Creado!</h2>
                  <p className="text-sm text-muted-foreground">El servicio ha sido registrado correctamente</p>
                </div>
                <Button
                  onClick={handleReset}
                  className="bg-[#d84315] hover:bg-[#d84315]/90 h-9 text-sm px-4 rounded-lg mt-2"
                >
                  Crear Otro Servicio
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden -mt-5">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white border-b-2 border-[#d84315]/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-3xl font-bold text-[#171717] -mb-7 -mt-2">Crear Nuevo Servicio</h1>
          </div>

          {/* Progress Steps - Only show when not in success state */}
          {activeStep < 4 && (
            <Card className="border-2 border-[#d84315]/20 shadow-lg rounded-xl bg-white">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  {steps.map((step, index) => {
                    const Icon = step.icon
                    const isActive = index === activeStep
                    const isCompleted = index < activeStep

                    return (
                      <div key={step.id} className="flex items-center">
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full border-3 transition-all duration-200 ${
                            isCompleted
                              ? "bg-[#d84315] border-[#d84315] text-white shadow-lg"
                              : isActive
                                ? "border-[#d84315] text-[#d84315] bg-[#d84315]/10 shadow-md"
                                : "border-gray-300 text-gray-400"
                          }`}
                        >
                          {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                        </div>
                        <span
                          className={`ml-3 text-sm font-semibold transition-colors duration-200 ${
                            isActive ? "text-[#d84315]" : isCompleted ? "text-[#171717]" : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </span>
                        {index < steps.length - 1 && <Separator className="w-12 mx-6" />}
                      </div>
                    )
                  })}
                </div>
                <Progress
                  value={(activeStep / (steps.length - 1)) * 100}
                  className="h-2 bg-gray-200 rounded-full overflow-hidden"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 py-5 h-full">{renderStepContent()}</div>
      </div>

      {/* Modals */}
      <AgregarServicioModal
        isOpen={showItemDialog}
        onClose={() => setShowItemDialog(false)}
        onAddItem={handleAddItem}
        tiposServicios={tiposServicios}
      />

      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <Keyboard className="h-6 w-6" />
              Atajos de Teclado
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-base">Siguiente paso</span>
              <Badge variant="outline" className="text-sm px-3 py-1">
                Ctrl + →
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base">Paso anterior</span>
              <Badge variant="outline" className="text-sm px-3 py-1">
                Ctrl + ←
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base">Crear servicio</span>
              <Badge variant="outline" className="text-sm px-3 py-1">
                Ctrl + Enter
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base">Ver atajos</span>
              <Badge variant="outline" className="text-sm px-3 py-1">
                Ctrl + /
              </Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ServiciosPage
