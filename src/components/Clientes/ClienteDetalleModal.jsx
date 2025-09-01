"use client"

import { useState, useEffect } from "react"
import { X, User, Car, Phone, MapPin, CreditCard, Calendar, Gauge, Loader2 } from "lucide-react"
import vehiculosService from "../../services/vehiculosService"

const ClienteDetalleModal = ({ open, onClose, cliente }) => {
  const [activeTab, setActiveTab] = useState("general")
  const [vehiculos, setVehiculos] = useState([])
  const [loadingVehiculos, setLoadingVehiculos] = useState(false)
  const [errorVehiculos, setErrorVehiculos] = useState(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose()
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.body.style.overflow = "unset"
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open, onClose])

  const handleTabChange = (value) => {
    setActiveTab(value)

    if (value === "vehiculos" && vehiculos.length === 0) {
      loadVehiculos()
    }
  }

  const loadVehiculos = async () => {
    try {
      setLoadingVehiculos(true)
      setErrorVehiculos(null)
      const response = await vehiculosService.getByCliente(cliente.id)
      setVehiculos(response || [])
    } catch (error) {
      console.error("Error al cargar vehículos:", error)
      setErrorVehiculos("Error al cargar los vehículos del cliente")
    } finally {
      setLoadingVehiculos(false)
    }
  }

  useEffect(() => {
    if (!open) {
      setVehiculos([])
      setActiveTab("general")
      setErrorVehiculos(null)
    }
  }, [open])

  const formatDate = (dateString) => {
    if (!dateString) return "No disponible"
    return new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatNumber = (number) => {
    if (!number) return "0"
    return new Intl.NumberFormat("es-AR").format(number)
  }

  if (!cliente || !open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-4xl max-h-[90vh] mx-4 bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
        <div className="bg-[#d84315] text-white p-6 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-white/20 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {cliente.nombre} {cliente.apellido}
              </h2>
              <p className="text-white/90 text-sm">Información completa del cliente</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 h-10 w-10 rounded-lg flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <div className="grid grid-cols-2 mx-6 mt-4 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleTabChange("general")}
              className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === "general" ? "bg-white text-[#d84315] shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <User className="w-4 h-4" />
              General
            </button>
            <button
              onClick={() => handleTabChange("vehiculos")}
              className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === "vehiculos" ? "bg-white text-[#d84315] shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Car className="w-4 h-4" />
              Vehículos {vehiculos.length > 0 && `(${vehiculos.length})`}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[calc(90vh-200px)]">
            {activeTab === "general" && (
              <div className="p-6 space-y-6">
                {/* Estado del Cliente */}
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-lg font-semibold text-[#171717]">Estado del Cliente</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      cliente.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {cliente.activo ? "Activo" : "Inactivo"}
                  </span>
                </div>

                <div className="border-t border-gray-200"></div>

                {/* Información Personal */}
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="flex items-center gap-3 text-[#171717] font-semibold">
                      <div className="p-2 rounded-lg bg-[#d84315]/10 text-[#d84315]">
                        <User className="w-5 h-5" />
                      </div>
                      Información Personal
                    </h3>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Nombre Completo</p>
                      <p className="font-medium">
                        {cliente.nombre} {cliente.apellido}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">DNI</p>
                        <p className="font-medium font-mono">{cliente.dni || "No especificado"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información de Contacto */}
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="flex items-center gap-3 text-[#171717] font-semibold">
                      <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                        <Phone className="w-5 h-5" />
                      </div>
                      Información de Contacto
                    </h3>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Teléfono</p>
                        <p className="font-medium">{cliente.telefono || "No especificado"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Dirección</p>
                        <p className="font-medium">{cliente.direccion || "No especificada"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Información del Sistema */}
                <div className="bg-white border border-gray-200 rounded-lg">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="flex items-center gap-3 text-[#171717] font-semibold">
                      <div className="p-2 rounded-lg bg-green-100 text-green-600">
                        <Calendar className="w-5 h-5" />
                      </div>
                      Información del Sistema
                    </h3>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Fecha de Registro</p>
                      <p className="font-medium">{formatDate(cliente.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Última Actualización</p>
                      <p className="font-medium">{formatDate(cliente.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "vehiculos" && (
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#171717] mb-4">Vehículos del Cliente</h3>

                {loadingVehiculos && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#d84315]" />
                  </div>
                )}

                {errorVehiculos && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800">{errorVehiculos}</p>
                  </div>
                )}

                {!loadingVehiculos && !errorVehiculos && vehiculos.length === 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="p-8 text-center">
                      <Car className="w-12 h-12 text-[#d84315] mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-[#171717] mb-2">Sin Vehículos Registrados</h4>
                      <p className="text-gray-600">Este cliente no tiene vehículos asociados</p>
                    </div>
                  </div>
                )}

                {!loadingVehiculos && vehiculos.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-[#171717]">Vehículo</th>
                            <th className="text-left py-3 px-4 font-semibold text-[#171717]">Patente</th>
                            <th className="text-left py-3 px-4 font-semibold text-[#171717]">Año</th>
                            <th className="text-left py-3 px-4 font-semibold text-[#171717]">Kilometraje</th>
                            <th className="text-left py-3 px-4 font-semibold text-[#171717]">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {vehiculos.map((vehiculo) => (
                            <tr
                              key={vehiculo.id}
                              className="border-b border-gray-100 hover:bg-[#d84315]/5 transition-colors"
                            >
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium">
                                    {vehiculo.marca} {vehiculo.modelo}
                                  </p>
                                  {vehiculo.numero_motor && (
                                    <p className="text-xs text-gray-600">Motor: {vehiculo.numero_motor}</p>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <p className="font-medium font-mono">{vehiculo.patente}</p>
                              </td>
                              <td className="py-3 px-4">
                                <p>{vehiculo.año || "N/A"}</p>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <Gauge className="w-4 h-4 text-gray-600" />
                                  <p>{formatNumber(vehiculo.kilometraje)} km</p>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    vehiculo.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {vehiculo.activo ? "Activo" : "Inactivo"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClienteDetalleModal
