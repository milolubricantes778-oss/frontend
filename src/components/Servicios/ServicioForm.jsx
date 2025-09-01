"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { Separator } from "../../components/ui/separator"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { toast } from "../../hooks/use-toast"
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
  X,
  Keyboard,
} from "lucide-react"
import { useClientes } from "../../hooks/useClientes"
import { useVehiculos } from "../../hooks/useVehiculos"
import { useTiposServicios } from "../../hooks/useTiposServicios"
import { useServicios } from "../../hooks/useServicios"

const steps = [
  { id: 0, title: "Cliente", icon: User },
  { id: 1, title: "Vehículo", icon: Car },
  { id: 2, title: "Servicios", icon: Wrench },
  { id: 3, title: "Confirmación", icon: FileText },
]

const ServicioForm = ({ open, onClose, servicio = null }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({
    clienteId: null,
    vehiculoId: null,
    descripcion: "",
    observaciones: "",
    precioReferencia: 0,
    items: [],
  })

  const { clientes, loadClientes } = useClientes()
  const { vehiculos, loadVehiculos } = useVehiculos()
  const { tiposServicios, loadTiposServicios } = useTiposServicios()
  const { createServicio, updateServicio, loading } = useServicios()

  const [selectedCliente, setSelectedCliente] = useState(null)
  const [selectedVehiculo, setSelectedVehiculo] = useState(null)
  const [clienteSearch, setClienteSearch] = useState("")
  const [showItemDialog, setShowItemDialog] = useState(false)
  const [currentItem, setCurrentItem] = useState({
    tipoServicioId: null,
    descripcion: "",
    observaciones: "",
    notas: "",
  })
  const [showShortcuts, setShowShortcuts] = useState(false)

  useEffect(() => {
    if (!open) return

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
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeStep, open])

  useEffect(() => {
    if (open) {
      loadClientes()
      loadTiposServicios()
      if (servicio) {
        setFormData({
          clienteId: servicio.cliente_id,
          vehiculoId: servicio.vehiculo_id,
          descripcion: servicio.descripcion,
          observaciones: servicio.observaciones || "",
          precioReferencia: servicio.precio_referencia || 0,
          items: servicio.items || [],
        })
        setActiveStep(3)
      } else {
        setActiveStep(0)
        setFormData({
          clienteId: null,
          vehiculoId: null,
          descripcion: "",
          observaciones: "",
          precioReferencia: 0,
          items: [],
        })
        setSelectedCliente(null)
        setSelectedVehiculo(null)
        setClienteSearch("")
      }
    }
  }, [open, servicio])

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

  const handleAddItem = () => {
    if (currentItem.tipoServicioId && currentItem.descripcion) {
      const tipoServicio = tiposServicios?.find((ts) => ts.id === currentItem.tipoServicioId)
      const newItem = {
        ...currentItem,
        tipoServicioNombre: tipoServicio?.nombre || "",
        id: Date.now(),
      }

      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, newItem],
      }))

      setCurrentItem({
        tipoServicioId: null,
        descripcion: "",
        observaciones: "",
        notas: "",
      })
      setShowItemDialog(false)
      toast({
        title: "Servicio agregado",
        description: "El servicio se agregó correctamente a la lista.",
      })
    }
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
        descripcion: formData.descripcion,
        observaciones: formData.observaciones,
        precio_referencia: formData.precioReferencia,
        items: formData.items.map((item) => ({
          tipo_servicio_id: item.tipoServicioId,
          descripcion: item.descripcion,
          observaciones: item.observaciones,
          notas: item.notas,
        })),
      }

      if (servicio) {
        await updateServicio(servicio.id, submitData)
        toast({
          title: "¡Servicio actualizado!",
          description: "El servicio ha sido actualizado correctamente.",
        })
      } else {
        await createServicio(submitData)
        toast({
          title: "¡Servicio creado exitosamente!",
          description: "El servicio ha sido registrado en el sistema.",
        })
      }
      onClose()
    } catch (error) {
      toast({
        title: "Error al guardar servicio",
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
        return formData.descripcion.trim() !== ""
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
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[#d84315]/10">
                <User className="h-5 w-5 text-[#d84315]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#171717]">Seleccionar Cliente</h3>
                <p className="text-sm text-muted-foreground">Busca y selecciona el cliente</p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cliente por nombre, apellido o DNI..."
                value={clienteSearch}
                onChange={(e) => setClienteSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid gap-2 max-h-64 overflow-y-auto">
              {filteredClientes.map((cliente) => (
                <Card
                  key={cliente.id}
                  className={`cursor-pointer transition-all hover:shadow-sm ${
                    selectedCliente?.id === cliente.id ? "border-[#d84315] bg-[#d84315]/5" : "hover:border-[#d84315]/50"
                  }`}
                  onClick={() => handleClienteSelect(cliente)}
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-[#171717] text-sm">
                          {cliente.nombre} {cliente.apellido}
                        </h4>
                        <p className="text-xs text-muted-foreground">DNI: {cliente.dni || "No especificado"}</p>
                        <p className="text-xs text-muted-foreground">Tel: {cliente.telefono || "No especificado"}</p>
                      </div>
                      {selectedCliente?.id === cliente.id && <CheckCircle className="h-4 w-4 text-[#d84315]" />}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[#d84315]/10">
                <Car className="h-5 w-5 text-[#d84315]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#171717]">Seleccionar Vehículo</h3>
                <p className="text-sm text-muted-foreground">Elige el vehículo que recibirá el servicio</p>
              </div>
            </div>

            {vehiculos.length === 0 ? (
              <Alert>
                <AlertDescription>El cliente seleccionado no tiene vehículos registrados.</AlertDescription>
              </Alert>
            ) : (
              <div className="grid gap-2 max-h-64 overflow-y-auto">
                {vehiculos.map((vehiculo) => (
                  <Card
                    key={vehiculo.id}
                    className={`cursor-pointer transition-all hover:shadow-sm ${
                      selectedVehiculo?.id === vehiculo.id
                        ? "border-[#d84315] bg-[#d84315]/5"
                        : "hover:border-[#d84315]/50"
                    }`}
                    onClick={() => handleVehiculoSelect(vehiculo)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-[#d84315] text-sm">{vehiculo.patente}</h4>
                          <p className="text-[#171717] font-medium text-sm">
                            {vehiculo.marca} {vehiculo.modelo}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Año: {vehiculo.año} | Km: {vehiculo.kilometraje?.toLocaleString()}
                          </p>
                        </div>
                        {selectedVehiculo?.id === vehiculo.id && <CheckCircle className="h-4 w-4 text-[#d84315]" />}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#d84315]/10">
                  <Wrench className="h-5 w-5 text-[#d84315]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#171717]">Elegir Servicios</h3>
                  <p className="text-sm text-muted-foreground">Agrega los servicios a realizar</p>
                </div>
              </div>
              <Button onClick={() => setShowItemDialog(true)} className="bg-[#d84315] hover:bg-[#d84315]/90" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {formData.items.map((item) => (
                <Card key={item.id} className="border">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-[#171717] text-sm">{item.tipoServicioNombre}</h4>
                        <p className="text-xs text-muted-foreground mb-1">{item.descripcion}</p>
                        <div className="flex gap-1 flex-wrap">
                          {item.observaciones && (
                            <Badge variant="secondary" className="text-xs px-2 py-0">
                              Obs: {item.observaciones}
                            </Badge>
                          )}
                          {item.notas && (
                            <Badge variant="outline" className="text-xs px-2 py-0">
                              Notas: {item.notas}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-[#d84315]/10">
                <FileText className="h-5 w-5 text-[#d84315]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#171717]">Detalles y Confirmación</h3>
                <p className="text-sm text-muted-foreground">Completa los detalles finales</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="descripcion" className="text-sm">
                  Descripción del Servicio *
                </Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe el servicio a realizar..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="observaciones" className="text-sm">
                    Observaciones
                  </Label>
                  <Textarea
                    id="observaciones"
                    placeholder="Observaciones adicionales..."
                    value={formData.observaciones}
                    onChange={(e) => setFormData((prev) => ({ ...prev, observaciones: e.target.value }))}
                    className="mt-1"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="precio" className="text-sm">
                    Precio de Referencia
                  </Label>
                  <div className="relative mt-1">
                    <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                    <Input
                      id="precio"
                      type="number"
                      placeholder="0"
                      value={formData.precioReferencia}
                      onChange={(e) => setFormData((prev) => ({ ...prev, precioReferencia: Number(e.target.value) }))}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>

              <Card className="bg-gradient-to-r from-[#d84315]/5 to-[#d84315]/10 border-[#d84315]/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-[#d84315] text-sm">Resumen del Servicio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs">
                        <span className="font-medium text-[#171717]">Cliente:</span> {selectedCliente?.nombre}{" "}
                        {selectedCliente?.apellido}
                      </p>
                      <p className="text-xs">
                        <span className="font-medium text-[#171717]">DNI:</span>{" "}
                        {selectedCliente?.dni || "No especificado"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs">
                        <span className="font-medium text-[#171717]">Vehículo:</span> {selectedVehiculo?.patente}
                      </p>
                      <p className="text-xs">
                        <span className="font-medium text-[#171717]">Modelo:</span> {selectedVehiculo?.marca}{" "}
                        {selectedVehiculo?.modelo}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs">
                      <span className="font-medium text-[#171717]">Servicios:</span> {formData.items.length} item(s)
                    </p>
                    {formData.precioReferencia > 0 && (
                      <p className="text-xs font-medium text-[#d84315]">
                        Precio de Referencia: ${formData.precioReferencia.toLocaleString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-[#171717]">
                {servicio ? "Editar Servicio" : "Nuevo Servicio"}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShortcuts(true)}
                className="text-xs text-muted-foreground"
              >
                <Keyboard className="h-3 w-3 mr-1" />
                Atajos
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-shrink-0 space-y-3">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = index === activeStep
                const isCompleted = index < activeStep

                return (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        isCompleted
                          ? "bg-[#d84315] border-[#d84315] text-white"
                          : isActive
                            ? "border-[#d84315] text-[#d84315] bg-[#d84315]/10"
                            : "border-gray-300 text-gray-400"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <span
                      className={`ml-2 text-xs font-medium ${
                        isActive ? "text-[#d84315]" : isCompleted ? "text-[#171717]" : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </span>
                    {index < steps.length - 1 && <Separator className="w-8 mx-3" />}
                  </div>
                )
              })}
            </div>
            <Progress value={(activeStep / (steps.length - 1)) * 100} className="h-1" />
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto py-2">{renderStepContent()}</div>

          <DialogFooter className="flex-shrink-0 flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} size="sm">
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
              {activeStep > 0 && (
                <Button variant="outline" onClick={handleBack} size="sm">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Atrás
                </Button>
              )}
            </div>

            {activeStep < steps.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-[#d84315] hover:bg-[#d84315]/90"
                size="sm"
              >
                Siguiente
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className="bg-[#d84315] hover:bg-[#d84315]/90"
                size="sm"
              >
                {loading ? "Guardando..." : servicio ? "Actualizar" : "Crear"} Servicio
                <CheckCircle className="h-4 w-4 ml-1" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#d84315]" />
              Agregar Servicio
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tipoServicio">Tipo de Servicio *</Label>
              <Select
                value={currentItem.tipoServicioId?.toString() || ""}
                onValueChange={(value) =>
                  setCurrentItem((prev) => ({ ...prev, tipoServicioId: Number.parseInt(value) }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleccionar tipo de servicio" />
                </SelectTrigger>
                <SelectContent>
                  {tiposServicios?.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="itemDescripcion">Descripción *</Label>
              <Input
                id="itemDescripcion"
                placeholder="Descripción del servicio"
                value={currentItem.descripcion}
                onChange={(e) => setCurrentItem((prev) => ({ ...prev, descripcion: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="itemObservaciones">Observaciones</Label>
                <Textarea
                  id="itemObservaciones"
                  placeholder="Observaciones..."
                  value={currentItem.observaciones}
                  onChange={(e) => setCurrentItem((prev) => ({ ...prev, observaciones: e.target.value }))}
                  className="mt-1"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="itemNotas">Notas</Label>
                <Textarea
                  id="itemNotas"
                  placeholder="Notas internas..."
                  value={currentItem.notas}
                  onChange={(e) => setCurrentItem((prev) => ({ ...prev, notas: e.target.value }))}
                  className="mt-1"
                  rows={2}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowItemDialog(false)} size="sm">
              Cancelar
            </Button>
            <Button
              onClick={handleAddItem}
              disabled={!currentItem.tipoServicioId || !currentItem.descripcion.trim()}
              className="bg-[#d84315] hover:bg-[#d84315]/90"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Atajos de Teclado
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Siguiente paso</span>
              <Badge variant="outline">Ctrl + →</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Paso anterior</span>
              <Badge variant="outline">Ctrl + ←</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Crear/Actualizar servicio</span>
              <Badge variant="outline">Ctrl + Enter</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Cerrar modal</span>
              <Badge variant="outline">Escape</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Ver atajos</span>
              <Badge variant="outline">Ctrl + /</Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServicioForm
