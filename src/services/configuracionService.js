import api from "./api"

export const configuracionService = {
  async getConfiguracion() {
    try {
      const response = await api.get("/configuracion")
      if (response.success) {
        return response.data
      }
      throw new Error(response.message || "Error al obtener configuración")
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  },

  async updateConfiguracion(data) {
    try {
      const response = await api.put("/configuracion", data)
      if (response.success) {
        return response.data
      }
      throw new Error(response.message || "Error al actualizar configuración")
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  },

  async resetConfiguracion() {
    try {
      const response = await api.post("/configuracion/reset")
      if (response.success) {
        return response.data
      }
      throw new Error(response.message || "Error al resetear configuración")
    } catch (error) {
      throw new Error(error.message || "Error de conexión")
    }
  },
}

export default configuracionService
