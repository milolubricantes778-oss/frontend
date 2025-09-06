import api from "./api"

const usuariosService = {
  // Obtener todos los usuarios con filtros
  getUsuarios: async (params = {}) => {
    const response = await api.get("/users", { params })
    return response
  },

  // Obtener usuario por ID
  getUsuarioById: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response
  },

  // Crear nuevo usuario
  createUsuario: async (userData) => {
    const response = await api.post("/users", userData)
    return response
  },

  // Actualizar usuario
  updateUsuario: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData)
    return response
  },

  // Eliminar usuario (soft delete)
  deleteUsuario: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response
  },
}

export default usuariosService
