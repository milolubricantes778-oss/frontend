import api from "./api"

export const usersService = {
  async getAll(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const url = queryParams ? `/users?${queryParams}` : "/users"
    const response = await api.get(url)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Error al obtener usuarios")
  },

  async getById(id) {
    const response = await api.get(`/users/${id}`)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Error al obtener usuario")
  },

  async create(userData) {
    const response = await api.post("/users", userData)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Error al crear usuario")
  },

  async update(id, userData) {
    const response = await api.put(`/users/${id}`, userData)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Error al actualizar usuario")
  },

  async delete(id) {
    const response = await api.delete(`/users/${id}`)

    if (response.success) {
      return response
    }

    throw new Error(response.message || "Error al eliminar usuario")
  },

  // Función para registrar usuario (desde auth)
  async register(userData) {
    const response = await api.post("/auth/register", userData)

    if (response.success && response.data) {
      return response.data
    }

    throw new Error(response.message || "Error al registrar usuario")
  },
}

export default usersService
