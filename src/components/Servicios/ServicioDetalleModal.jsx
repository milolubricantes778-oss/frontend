"use client"

import { useState, useEffect } from "react"
import { Badge } from "../../components/ui/badge"
import {
  X,
  Wrench,
  User,
  Car,
  Package,
  FileText,
  Calendar,
  DollarSign,
  CreditCard,
  Phone,
  MapPin,
  Gauge,
  CheckCircle,
  XCircle,
  Clock,
  Hash,
} from "lucide-react"

const ServicioDetalleModal = ({ open, onClose, servicio }) => {
  const [activeTab, setActiveTab] = useState("servicio")

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (open) {
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, onClose])

  const formatDate = (dateString) => {
    if (!dateString) return "No disponible"
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount) => {
    if (!amount) return "$0"
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount)
  }

  if (!open || !servicio) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[700px] flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 bg-[#d84315] text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Wrench className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{servicio.numero}</h2>
                <p className="text-white/90 text-sm">
                  {servicio.items?.length > 0
                    ? `${servicio.items.length} tipo${servicio.items.length > 1 ? "s" : ""} de servicio realizados`
                    : "Detalles completos del servicio"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 h-8 w-8 rounded-md flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tabs Navigation - Fixed */}
        <div className="flex-shrink-0 border-b bg-white">
          <div className="grid grid-cols-3 h-14 p-1">
            <button
              onClick={() => setActiveTab("servicio")}
              className={`flex items-center justify-center gap-2 rounded-md transition-colors ${
                activeTab === "servicio" ? "bg-[#d84315] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Wrench className="h-4 w-4" />
              Servicio
            </button>
            <button
              onClick={() => setActiveTab("cliente")}
              className={`flex items-center justify-center gap-2 rounded-md transition-colors ${
                activeTab === "cliente" ? "bg-[#d84315] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <User className="h-4 w-4" />
              Cliente
            </button>
            <button
              onClick={() => setActiveTab("vehiculo")}
              className={`flex items-center justify-center gap-2 rounded-md transition-colors ${
                activeTab === "vehiculo" ? "bg-[#d84315] text-white" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Car className="h-4 w-4" />
              Vehículo
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Servicio Tab */}
            {activeTab === "servicio" && (
              <div className="space-y-6">
                {/* General Information Card */}
                <div className="border-2 border-gray-200 rounded-lg">
                  <div className="bg-gray-50 border-b p-4">
                    <h3 className="flex items-center gap-2 text-[#171717] font-semibold">
                      <Wrench className="h-5 w-5 text-[#d84315]" />
                      Información General del Servicio
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Número de Servicio</span>
                        </div>
                        <p className="font-mono font-semibold text-[#d84315] text-lg">{servicio.numero}</p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Tipos de Servicio</span>
                        </div>
                        <p className="font-semibold text-[#d84315] text-lg">
                          {servicio.items?.length || 0} servicio{(servicio.items?.length || 0) !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Precio de Referencia</span>
                        </div>
                        <p className="font-semibold text-green-600 text-lg">
                          {formatCurrency(servicio.precio_referencia)}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">Fecha de Creación</span>
                        </div>
                        <p className="font-medium text-[#171717]">{formatDate(servicio.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Services Performed */}
                {servicio.items && servicio.items.length > 0 && (
                  <div className="border-2 border-gray-200 rounded-lg">
                    <div className="bg-gray-50 border-b p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-[#171717] font-semibold">
                          <Package className="h-5 w-5 text-[#d84315]" />
                          Servicios Realizados
                        </h3>
                        <Badge className="bg-[#d84315] text-white">
                          {servicio.items.length} tipo{servicio.items.length > 1 ? "s" : ""}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {servicio.items.map((item, index) => (
                          <div
                            key={index}
                            className="border-2 border-[#d84315]/20 rounded-xl p-6 space-y-4 bg-white shadow-sm hover:shadow-md transition-all hover:border-[#d84315]/40"
                          >
                            {/* Service Type Header */}
                            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                              <div>
                                <h4 className="text-lg font-bold text-[#171717] mb-1">
                                  {item.tipo_servicio_nombre || `Servicio ${index + 1}`}
                                </h4>
                                {item.tipo_servicio_descripcion && (
                                  <p className="text-sm text-gray-600">{item.tipo_servicio_descripcion}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[#d84315] border-[#d84315]">
                                  <Package className="h-3 w-3 mr-1" />
                                  {item.productos?.length || 0} productos
                                </Badge>
                              </div>
                            </div>

                            {/* Products Used */}
                            {item.productos && item.productos.length > 0 ? (
                              <div className="space-y-3">
                                <h5 className="font-semibold text-gray-800 flex items-center gap-2">
                                  <Package className="h-4 w-4 text-[#d84315]" />
                                  Productos Utilizados
                                </h5>
                                <div className="space-y-2">
                                  {item.productos.map((producto, prodIndex) => (
                                    <div
                                      key={prodIndex}
                                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-white rounded-full border">
                                          <Package className="h-3 w-3 text-[#d84315]" />
                                        </div>
                                        <span className="font-medium text-[#171717] text-sm">{producto.nombre}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {producto.es_nuestro ? (
                                          <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            Nuestro
                                          </Badge>
                                        ) : (
                                          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                                            <XCircle className="h-3 w-3 mr-1" />
                                            Del Cliente
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 font-medium text-sm">
                                  No se utilizaron productos específicos
                                </p>
                                <p className="text-xs text-gray-400">Este servicio no requirió productos adicionales</p>
                              </div>
                            )}

                            {/* Observations and Notes */}
                            <div className="space-y-3">
                              {item.observaciones && (
                                <div className="space-y-2">
                                  <h5 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                                    <FileText className="h-4 w-4 text-[#d84315]" />
                                    Observaciones
                                  </h5>
                                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                                    <p className="text-gray-700 text-sm leading-relaxed">{item.observaciones}</p>
                                  </div>
                                </div>
                              )}
                              {item.notas && (
                                <div className="space-y-2">
                                  <h5 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-[#d84315]" />
                                    Notas Adicionales
                                  </h5>
                                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg">
                                    <p className="text-gray-700 text-sm leading-relaxed">{item.notas}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Show message if no observations or notes */}
                            {!item.observaciones && !item.notas && (
                              <div className="text-center py-3 bg-gray-50 rounded-lg border">
                                <FileText className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                                <p className="text-gray-500 text-xs">No hay observaciones o notas adicionales</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* General Observations */}
                {servicio.observaciones && (
                  <div className="border-2 border-gray-200 rounded-lg">
                    <div className="bg-gray-50 border-b p-4">
                      <h3 className="flex items-center gap-2 text-[#171717] font-semibold">
                        <FileText className="h-5 w-5 text-[#d84315]" />
                        Observaciones Generales del Servicio
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-[#d84315] p-6 rounded-r-lg">
                        <p className="text-gray-700 leading-relaxed">{servicio.observaciones}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show message if no service items */}
                {(!servicio.items || servicio.items.length === 0) && (
                  <div className="border-2 border-gray-200 rounded-lg">
                    <div className="text-center py-12">
                      <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay servicios registrados</h3>
                      <p className="text-gray-500">Este servicio no tiene tipos de servicios asociados</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cliente Tab */}
            {activeTab === "cliente" && (
              <div className="border-2 border-gray-200 rounded-lg">
                <div className="bg-gray-50 border-b p-4">
                  <h3 className="flex items-center gap-2 text-[#171717] font-semibold">
                    <User className="h-5 w-5 text-[#d84315]" />
                    Información del Cliente
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-sm text-gray-600">Nombre Completo</span>
                      <p className="font-semibold text-[#171717] text-lg">
                        {servicio.cliente_nombre && servicio.cliente_apellido
                          ? `${servicio.cliente_nombre} ${servicio.cliente_apellido}`
                          : "Cliente no encontrado"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">DNI</span>
                      </div>
                      <p className="font-mono font-medium text-[#171717]">
                        {servicio.cliente_dni || "No especificado"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Teléfono</span>
                      </div>
                      <p className="font-medium text-[#171717]">{servicio.cliente_telefono || "No especificado"}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Dirección</span>
                      </div>
                      <p className="font-medium text-[#171717]">{servicio.cliente_direccion || "No especificada"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Vehículo Tab */}
            {activeTab === "vehiculo" && (
              <div className="border-2 border-gray-200 rounded-lg">
                <div className="bg-gray-50 border-b p-4">
                  <h3 className="flex items-center gap-2 text-[#171717] font-semibold">
                    <Car className="h-5 w-5 text-[#d84315]" />
                    Información del Vehículo
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-sm text-gray-600">Patente</span>
                      <p className="font-mono font-semibold text-[#d84315] text-lg">
                        {servicio.patente || "No especificada"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-gray-600">Marca y Modelo</span>
                      <p className="font-semibold text-[#171717] text-lg">
                        {servicio.marca} {servicio.modelo}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <span className="text-sm text-gray-600">Año</span>
                      <p className="font-medium text-[#171717]">{servicio.año || "No especificado"}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Kilometraje</span>
                      </div>
                      <p className="font-medium text-[#171717]">
                        {servicio.kilometraje ? `${servicio.kilometraje.toLocaleString()} km` : "No especificado"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicioDetalleModal
