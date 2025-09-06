import api from "./api"

const sucursalesService = {
  // Obtener todas las sucursales con paginación y filtros
  async getAll(params = {}) {
    const response = await api.get("/sucursales", { params })
    return response
  },

  // Obtener sucursales activas (para selects)
  async getActivas() {
    const response = await api.get("/sucursales/activas")
    return response
  },

  // Obtener sucursal por ID
  async getById(id) {
    const response = await api.get(`/sucursales/${id}`)
    return response
  },

  // Crear nueva sucursal
  async create(sucursalData) {
    const response = await api.post("/sucursales", sucursalData)
    return response
  },

  // Actualizar sucursal
  async update(id, sucursalData) {
    const response = await api.put(`/sucursales/${id}`, sucursalData)
    return response
  },

  // Eliminar sucursal (soft delete)
  async delete(id) {
    const response = await api.delete(`/sucursales/${id}`)
    return response
  },
}

export default sucursalesService
