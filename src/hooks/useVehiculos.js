"use client"

import { useState, useCallback } from "react"
import { vehiculosService } from "../services/vehiculosService"
import { useStandardizedErrorHandler } from "../utils/StandardizedErrorHandler"
import { useToast } from "./useToast"

export const useVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
  })
  const [currentFilters, setCurrentFilters] = useState({
    search: "",
    searchCriteria: "patente",
  })

  const { showToast } = useToast()
  const errorHandler = useStandardizedErrorHandler(showToast)

  const loadVehiculos = useCallback(
    async (page = 1, limit = 10, search = "", searchCriteria = "patente") => {
      setLoading(true)
      setError(null)
      setCurrentFilters({ search, searchCriteria })
      try {
        const response = await vehiculosService.getAll(page, limit, search, searchCriteria)

        if (!response) {
          setVehiculos([])
          return
        }

        const vehiculosData = response.data || response || []

        setVehiculos(vehiculosData)
        setPagination({
          total: response.total || 0,
          totalPages: response.totalPages || 1,
          currentPage: response.currentPage || page,
          limit: Number(limit),
        })
      } catch (err) {
        const { userMessage } = errorHandler.handleApiError(err, "cargar vehículos")
        setError(userMessage)
        setVehiculos([])
      } finally {
        setLoading(false)
      }
    },
    [errorHandler],
  )

  const loadVehiculosByCliente = useCallback(
    async (clienteId) => {
      setLoading(true)
      setError(null)
      try {
        const response = await vehiculosService.getByCliente(clienteId)

        if (!response) {
          setVehiculos([])
          return
        }

        const vehiculosData = response.data || response || []
        setVehiculos(vehiculosData)

        // Reset pagination for client-specific view
        setPagination({
          total: vehiculosData.length,
          totalPages: 1,
          currentPage: 1,
          limit: vehiculosData.length,
        })
      } catch (err) {
        const { userMessage } = errorHandler.handleApiError(err, "cargar vehículos del cliente")
        setError(userMessage)
        setVehiculos([])
      } finally {
        setLoading(false)
      }
    },
    [errorHandler],
  )

  const createVehiculo = useCallback(
    async (vehiculoData) => {
      setLoading(true)
      setError(null)
      try {
        const newVehiculo = await vehiculosService.create(vehiculoData)

        errorHandler.handleSuccess("Vehículo creado exitosamente", "crear vehículo")

        await loadVehiculos(
          pagination.currentPage,
          pagination.limit,
          currentFilters.search,
          currentFilters.searchCriteria,
        )

        return { success: true, data: newVehiculo }
      } catch (err) {
        const { userMessage } = errorHandler.handleApiError(err, "crear vehículo")
        setError(userMessage)
        return { success: false, error: userMessage }
      } finally {
        setLoading(false)
      }
    },
    [loadVehiculos, pagination.currentPage, pagination.limit, currentFilters, errorHandler],
  )

  const updateVehiculo = useCallback(
    async (id, vehiculoData) => {
      setLoading(true)
      setError(null)
      try {
        const updatedVehiculo = await vehiculosService.update(id, vehiculoData)

        errorHandler.handleSuccess("Vehículo actualizado exitosamente", "actualizar vehículo")

        setVehiculos((prev) => prev.map((vehiculo) => (vehiculo.id === id ? updatedVehiculo : vehiculo)))
        return { success: true, data: updatedVehiculo }
      } catch (err) {
        const { userMessage } = errorHandler.handleApiError(err, "actualizar vehículo")
        setError(userMessage)
        return { success: false, error: userMessage }
      } finally {
        setLoading(false)
      }
    },
    [errorHandler],
  )

  const deleteVehiculo = useCallback(
    async (id) => {
      setLoading(true)
      setError(null)
      try {
        await vehiculosService.delete(id)

        errorHandler.handleSuccess("Vehículo eliminado exitosamente", "eliminar vehículo")

        setVehiculos((prev) => prev.filter((vehiculo) => vehiculo.id !== id))
        return { success: true }
      } catch (err) {
        const { userMessage } = errorHandler.handleApiError(err, "eliminar vehículo")
        setError(userMessage)
        return { success: false, error: userMessage }
      } finally {
        setLoading(false)
      }
    },
    [errorHandler],
  )

  const changePage = useCallback(
    (newPage) => {
      loadVehiculos(newPage, pagination.limit, currentFilters.search, currentFilters.searchCriteria)
    },
    [loadVehiculos, pagination.limit, currentFilters],
  )

  const changeRowsPerPage = useCallback(
    (newLimit) => {
      loadVehiculos(1, newLimit, currentFilters.search, currentFilters.searchCriteria)
    },
    [loadVehiculos, currentFilters],
  )

  const fetchVehiculos = useCallback(
    async (params = {}) => {
      const { search = "", limit = 10, page = 1, searchCriteria = "patente" } = params

      try {
        const result = await vehiculosService.getAll(page, limit, search, searchCriteria)
        return result
      } catch (err) {
        const { userMessage } = errorHandler.handleApiError(err, "buscar vehículos")
        throw new Error(userMessage)
      }
    },
    [errorHandler],
  )

  return {
    vehiculos,
    loading,
    error,
    pagination,
    loadVehiculos,
    loadVehiculosByCliente, // Exportando nueva función
    fetchVehiculos,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,
    changePage,
    changeRowsPerPage,
  }
}

export const useVehiculoStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
    porMarca: {},
  })

  return { stats }
}
