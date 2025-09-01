"use client"

import { Car, User, Calendar, DollarSign, FileText, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"

const VehiculoCard = ({ vehiculo }) => {
  const navigate = useNavigate()

  const handleVerTodosServicios = () => {
    navigate(`/reportes?vehiculo=${vehiculo.patente}`)
  }

  const handleVerDetalleServicio = (servicio) => {
    navigate(`/reportes?servicio=${servicio.id}&autoOpen=true`)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="w-full border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <div className="p-8">
        {/* Header del Vehículo */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-[#d84315] to-[#bf360c] rounded-full">
              <Car className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{vehiculo.patente}</h3>
              <p className="text-lg text-gray-600">
                {vehiculo.marca} {vehiculo.modelo} {vehiculo.año}
              </p>
              {vehiculo.kilometraje && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                  {vehiculo.kilometraje.toLocaleString()} km
                </span>
              )}
            </div>
          </div>
          <div className="text-right bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-xs text-gray-500 uppercase tracking-wide">Propietario</span>
            </div>
            <p className="font-semibold text-gray-900 text-sm">{vehiculo.cliente_nombre}</p>
            {vehiculo.cliente_dni && <p className="text-xs text-gray-600">DNI: {vehiculo.cliente_dni}</p>}
          </div>
        </div>

        <div className="space-y-6">
          {/* Servicios del Vehículo */}
          <div className="bg-gradient-to-br from-[#d84315]/5 to-[#d84315]/10 border border-[#d84315]/20 rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#d84315] rounded-full">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-[#d84315]">Historial de Servicios</h4>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-lg font-medium bg-[#d84315] text-white">
                  {vehiculo.servicios?.length || 0} servicio{(vehiculo.servicios?.length || 0) !== 1 ? "s" : ""}
                </span>
              </div>

              {vehiculo.servicios && vehiculo.servicios.length > 0 ? (
                <div className="space-y-4">
                  {/* Mostrar hasta 3 servicios más recientes */}
                  {vehiculo.servicios.slice(0, 3).map((servicio, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-[#d84315]/20 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-[#d84315] text-white">
                          {servicio.numero}
                        </span>
                        <span className="text-xs font-medium text-[#d84315] uppercase tracking-wide">
                          {index === 0 ? "Más Reciente" : `Servicio ${index + 1}`}
                        </span>
                      </div>
                      <p className="text-gray-800 font-medium mb-3">{servicio.descripcion}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(servicio.created_at)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-bold text-green-600 text-lg">
                            {formatCurrency(servicio.precio_referencia)}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleVerDetalleServicio(servicio)}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-[#d84315] bg-[#d84315]/10 hover:bg-[#d84315]/20 rounded-lg transition-colors duration-200"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalle
                        </button>
                      </div>
                    </div>
                  ))}

                  {vehiculo.servicios.length > 3 && (
                    <div className="text-center py-2">
                      <p className="text-sm text-[#d84315] font-medium">
                        + {vehiculo.servicios.length - 3} servicio{vehiculo.servicios.length - 3 !== 1 ? "s" : ""} más
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-lg">No hay servicios registrados para este vehículo</p>
                </div>
              )}
            </div>
          </div>

          {/* Botón Ver Todos los Servicios */}
          <div className="flex justify-center">
            <button
              onClick={handleVerTodosServicios}
              className="bg-[#d84315] hover:bg-[#bf360c] text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-200"
            >
              Ver Historial Completo del Vehículo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehiculoCard
