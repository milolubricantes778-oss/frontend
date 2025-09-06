import api from "./api"

export const vehiculosService = {
  // Obtener todos los vehículos con paginación y filtros
  getAll: async (page = 1, limit = 10, search = "", searchCriteria = "patente") => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })

    if (search) params.append("search", search)
    if (searchCriteria) params.append("searchCriteria", searchCriteria)

    const response = await api.get(`/vehiculos?${params}`)
    return response.data
  },

  // Obtener vehículo por ID
  getById: async (id) => {
    const response = await api.get(`/vehiculos/${id}`)
    return response.data
  },

  // Crear nuevo vehículo
  create: async (vehiculoData) => {
    const response = await api.post("/vehiculos", vehiculoData)
    return response.data
  },

  // Actualizar vehículo
  update: async (id, vehiculoData) => {
    const response = await api.put(`/vehiculos/${id}`, vehiculoData)
    return response.data
  },

  // Eliminar vehículo
  delete: async (id) => {
    const response = await api.delete(`/vehiculos/${id}`)
    return response.data
  },

  // Obtener vehículos por cliente
  getByCliente: async (clienteId) => {
    const response = await api.get(`/vehiculos/cliente/${clienteId}`)
    return response.data
  },

  // Actualizar kilometraje
  updateKilometraje: async (id, kilometraje) => {
    const response = await api.patch(`/vehiculos/${id}/kilometraje`, { kilometraje })
    return response.data
  },
}

export default vehiculosService
