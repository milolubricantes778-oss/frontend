import api from "./api.js"

// Obtener reporte de servicios
export const getReporteServicios = async (filtros = {}) => {
  try {
    const params = new URLSearchParams()

    if (filtros.fechaInicio) params.append("fechaInicio", filtros.fechaInicio)
    if (filtros.fechaFin) params.append("fechaFin", filtros.fechaFin)
    if (filtros.clienteId) params.append("clienteId", filtros.clienteId)
    if (filtros.vehiculoId) params.append("vehiculoId", filtros.vehiculoId)
    if (filtros.estado) params.append("estado", filtros.estado)
    if (filtros.estadoPago) params.append("estadoPago", filtros.estadoPago)

    const response = await api.get(`/servicios?${params.toString()}`)
    return response.data
  } catch (error) {
    console.error("Error al obtener reporte de servicios:", error)
    throw error
  }
}

// Obtener estadísticas de servicios
export const getEstadisticasServicios = async (periodo = "mes") => {
  try {
    const servicios = await api.get("/servicios")

    const ahora = new Date()
    let fechaInicio

    switch (periodo) {
      case "dia":
        fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
        break
      case "semana":
        fechaInicio = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "mes":
        fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
        break
      case "año":
        fechaInicio = new Date(ahora.getFullYear(), 0, 1)
        break
      default:
        fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
    }

    const serviciosFiltrados = servicios.data.filter((servicio) => new Date(servicio.created_at) >= fechaInicio)

    const ingresosTotales = serviciosFiltrados.reduce((sum, servicio) => {
      return sum + (Number.parseFloat(servicio.precio_referencia) || 0)
    }, 0)

    return {
      totalServicios: serviciosFiltrados.length,
      serviciosFinalizados: serviciosFiltrados.length, // All services are completed when registered
      serviciosPendientes: 0, // No pending services in new system
      ingresosTotales,
      serviciosPorDia: agruparPorDia(serviciosFiltrados),
      ingresosPorDia: agruparIngresosPorDiaFromServicios(serviciosFiltrados),
    }
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    throw error
  }
}

// Agrupar servicios por día
export const agruparPorDia = (servicios) => {
  const grupos = {}
  servicios.forEach((servicio) => {
    const fecha = new Date(servicio.created_at).toISOString().split("T")[0]
    grupos[fecha] = (grupos[fecha] || 0) + 1
  })
  return grupos
}

// Agrupar ingresos por día desde servicios data
export const agruparIngresosPorDiaFromServicios = (servicios) => {
  const grupos = {}
  servicios.forEach((servicio) => {
    const fecha = new Date(servicio.created_at).toISOString().split("T")[0]
    const precio = Number.parseFloat(servicio.precio_referencia) || 0
    grupos[fecha] = (grupos[fecha] || 0) + precio
  })
  return grupos
}

export default {
  getReporteServicios,
  getEstadisticasServicios,
}
