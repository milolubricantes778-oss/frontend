"use client"

import { User, Car, Wrench, Phone, ExternalLink, DollarSign, FileText, MessageSquare } from "lucide-react"

const ClienteCard = ({ cliente }) => {
  const handleViewAllServices = () => {
    window.location.href = `/reportes?cliente=${cliente.id}`
  }

  const handleViewServiceDetail = (servicioId) => {
    window.location.href = `/reportes?servicio=${servicioId}&autoOpen=true`
  }

  const vehiculos = cliente.vehiculos || []
  const servicios = cliente.servicios || []

  const sortedServicios = servicios.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  const latestService = sortedServicios.length > 0 ? sortedServicios[0] : null

  const getVehicleForService = (servicio) => {
    return vehiculos.find((v) => v.id === servicio.vehiculo_id) || null
  }

  const getServiceTypesCount = (servicio) => {
    return servicio.items_count || servicio.items?.length || 1
  }

  return (
    <div className="w-full max-w-none hover:shadow-xl transition-all duration-300 border-2 border-[#d84315]/20 shadow-lg bg-gradient-to-br from-white to-[#d84315]/5 rounded-lg">
      <div className="pb-6 bg-gradient-to-r from-[#d84315]/10 to-[#d84315]/5 border-b-2 border-[#d84315]/20 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-[#d84315] to-[#d84315]/80 rounded-xl shadow-md">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {cliente.nombre} {cliente.apellido}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                {cliente.dni && (
                  <span className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>DNI: {cliente.dni}</span>
                  </span>
                )}
                {cliente.telefono && (
                  <span className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{cliente.telefono}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className="bg-white border-[#d84315]/30 text-[#d84315] font-medium px-3 py-1 rounded-full border text-sm">
              {vehiculos.length} vehículo{vehiculos.length !== 1 ? "s" : ""}
            </span>
            <span className="bg-[#d84315]/10 border-[#d84315]/30 text-[#d84315] font-medium px-3 py-1 rounded-full border text-sm">
              {servicios.length} servicio{servicios.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Vehículos Section - Minimalist */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Car className="h-5 w-5 text-[#d84315]" />
            <h4 className="font-semibold text-gray-900">Vehículos</h4>
            <span className="bg-[#d84315]/10 text-[#d84315] px-2 py-1 rounded-full text-xs font-medium">
              {vehiculos.length}
            </span>
          </div>

          {vehiculos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {vehiculos.map((vehiculo, index) => (
                <div
                  key={vehiculo.id || index}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#d84315]/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{vehiculo.patente}</p>
                      <p className="text-sm text-gray-600">
                        {vehiculo.marca} {vehiculo.modelo}
                      </p>
                    </div>
                    {vehiculo.año && (
                      <span className="bg-white border text-[#d84315] px-2 py-1 rounded text-xs">{vehiculo.año}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">No hay vehículos registrados</p>
            </div>
          )}
        </div>

        {/* Último Servicio Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Wrench className="h-5 w-5 text-[#d84315]" />
            <h4 className="font-semibold text-gray-900">Último Servicio</h4>
          </div>

          {servicios.length > 0 && latestService ? (
            <div className="space-y-4">
              <div className="p-5 bg-gradient-to-br from-[#d84315]/10 to-[#d84315]/5 rounded-xl border-2 border-[#d84315]/30 hover:border-[#d84315]/40 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{latestService.numero}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(latestService.created_at).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2 p-3 bg-white/50 rounded-lg border border-[#d84315]/20">
                    <Wrench className="h-4 w-4 text-[#d84315]" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Tipos de Servicio</p>
                      <p className="font-bold text-[#d84315]">
                        {getServiceTypesCount(latestService)} tipo
                        {getServiceTypesCount(latestService) !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {(() => {
                    const vehicle = getVehicleForService(latestService)
                    return vehicle ? (
                      <div className="flex items-center space-x-2 p-3 bg-white/50 rounded-lg border border-[#d84315]/20">
                        <Car className="h-4 w-4 text-[#d84315]" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Vehículo</p>
                          <p className="font-bold text-[#d84315]">{vehicle.patente}</p>
                          <p className="text-xs text-gray-600">
                            {vehicle.marca} {vehicle.modelo}
                          </p>
                        </div>
                      </div>
                    ) : null
                  })()}

                  {latestService.precio_referencia && (
                    <div className="flex items-center space-x-2 p-3 bg-white/50 rounded-lg border border-[#d84315]/20">
                      <DollarSign className="h-4 w-4 text-[#d84315]" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Precio</p>
                        <p className="font-bold text-[#d84315]">
                          ${Number.parseFloat(latestService.precio_referencia).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {(latestService.observaciones || latestService.notas) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {latestService.observaciones && (
                      <div className="p-3 bg-white/50 rounded-lg border border-[#d84315]/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="h-4 w-4 text-[#d84315]" />
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Observaciones</p>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{latestService.observaciones}</p>
                      </div>
                    )}

                    {latestService.notas && (
                      <div className="p-3 bg-white/50 rounded-lg border border-[#d84315]/20">
                        <div className="flex items-center space-x-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-[#d84315]" />
                          <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Notas Internas</p>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{latestService.notas}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => handleViewServiceDetail(latestService.id)}
                    className="bg-[#d84315] hover:bg-[#d84315]/90 text-white px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors"
                  >
                    Ver Detalle
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-[#d84315]/5 rounded-lg border border-[#d84315]/20">
                <div>
                  <p className="font-bold text-gray-900">Historial Completo</p>
                  <p className="text-sm text-gray-600">
                    {servicios.length} servicio{servicios.length !== 1 ? "s" : ""} registrado
                    {servicios.length !== 1 ? "s" : ""} en total
                  </p>
                </div>
                <button
                  onClick={handleViewAllServices}
                  className="bg-[#d84315] hover:bg-[#d84315]/90 text-white px-4 py-2 font-medium rounded-lg flex items-center gap-2 transition-colors"
                >
                  Ver Todos
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Wrench className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No hay servicios registrados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClienteCard
