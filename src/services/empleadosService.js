import api from "./api"

const empleadosService = {
  // Obtener todos los empleados con paginación y filtros
  async getAll(params = {}) {
    const response = await api.get("/empleados", { params })
    return response
  },

  // Obtener empleados activos (para selects)
  async getActivos() {
    const response = await api.get("/empleados/activos")
    return response
  },

  async getBySucursal(sucursalId) {
    const response = await api.get(`/empleados/sucursal/${sucursalId}`)
    return response
  },

  // Obtener empleado por ID
  async getById(id) {
    const response = await api.get(`/empleados/${id}`)
    return response
  },

  // Crear nuevo empleado
  async create(empleadoData) {
    const response = await api.post("/empleados", empleadoData)
    return response
  },

  // Actualizar empleado
  async update(id, empleadoData) {
    const response = await api.put(`/empleados/${id}`, empleadoData)
    return response
  },

  // Eliminar empleado (soft delete)
  async delete(id) {
    const response = await api.delete(`/empleados/${id}`)
    return response
  },
}

export default empleadosService
