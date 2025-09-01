import api from "./api.js"

export const clientesService = {
  // Obtener todos los clientes con paginación y filtros
  getClientes: async (page = 1, limit = 10, search = "") => {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
    })

    const response = await api.get(`/clientes?${params}`)
    return response.data
  },

  // Obtener cliente por ID
  getClienteById: async (id) => {
    const response = await api.get(`/clientes/${id}`)
    return response.data
  },

  // Crear nuevo cliente
  createCliente: async (clienteData) => {
    const response = await api.post("/clientes", clienteData)
    return response.data
  },

  // Actualizar cliente
  updateCliente: async (id, clienteData) => {
    const response = await api.put(`/clientes/${id}`, clienteData)
    return response.data
  },

  // Eliminar cliente (soft delete)
  deleteCliente: async (id) => {
    const response = await api.delete(`/clientes/${id}`)
    return response.data
  },

  // Buscar clientes por DNI, nombre o apellido
  searchClientes: async (searchTerm) => {
    const response = await api.get(`/clientes?search=${searchTerm}`)
    return response.data.data || []
  },

  getAll: async (page = 1, limit = 10, search = "") => {
    const params = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
    })

    const response = await api.get(`/clientes?${params}`)
    return response.data
  },
}

export default clientesService
