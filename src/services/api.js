import axios from "axios"
import secureStorage from "../utils/secureStorage"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = secureStorage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => {
    // El backend ahora siempre devuelve { success, data, message, pagination? }
    return response.data
  },
  (error) => {
    // Manejo mejorado de errores con respuestas estandarizadas
    if (error.response?.status === 401) {
      secureStorage.clearAll()
      window.location.href = "/login"
      return Promise.reject(new Error("Sesión expirada"))
    }

    // El backend ahora devuelve errores en formato estándar
    const errorData = error.response?.data
    if (errorData && !errorData.success) {
      return Promise.reject(new Error(errorData.message || "Error del servidor"))
    }

    const message = error.response?.data?.message || error.message || "Error desconocido"
    return Promise.reject(new Error(message))
  },
)

export default api
