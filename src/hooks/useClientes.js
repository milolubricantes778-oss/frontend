"use client"

import { useState, useCallback } from "react"
import { clientesService } from "../services/clientesService.js"
import { useStandardizedErrorHandler } from "../utils/standardizedErrorHandler"
import { useToast } from "./useToast"

export const useClientes = () => {
  const [clientes, setClientes] = useState([])
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
    searchBy: "",
  })

  const { showToast } = useToast()
  const errorHandler = useStandardizedErrorHandler(showToast)

  const loadClientes = useCallback(
    async (page = 1, limit = 10, search = "", searchBy = "") => {
      setLoading(true)
      setError(null)
      setCurrentFilters({ search, searchBy })
      try {
        const response = await clientesService.getClientes(page, limit, search, searchBy)

        if (!response) {
          setClientes([])
          return
        }

        const clientesData = response.data || response || []

        setClientes(clientesData)
        setPagination({
          total: response.total || 0,
          totalPages: response.totalPages || 1,
          currentPage: response.currentPage || page,
          limit: Number(limit),
        })
      } catch (err) {
        const { userMessage } = errorHandler.handleApiError(err, "cargar clientes")
        setError(userMessage)
        setClientes([])
      } finally {
        setLoading(false)
      }
    },
    [errorHandler],
  )

  const fetchClientes = useCallback(
    async (params = {}) => {
      const { search = "", limit = 10, page = 1, searchBy = "" } = params

      try {
        const result = await clientesService.getClientes(page, limit, search, searchBy)
        return result
      } catch (err) {
        const { userMessage } = errorHandler.handleApiError(err, "buscar clientes")
        throw new Error(userMessage)
      }
    },
    [errorHandler],
  )

  const createCliente = useCallback(
    async (clienteData) => {
      setLoading(true)
      setError(null)
      try {
        const newCliente = await clientesService.createCliente(clienteData)

        errorHandler.handleSuccess("Cliente creado exitosamente", "crear cliente")

        await loadClientes(pagination.currentPage, pagination.limit, currentFilters.search, currentFilters.searchBy)

        return { success: true, data: newCliente }
      } catch (err) {
        const { userMessage } = errorHandler.handleApiError(err, "crear cliente")
        setError(userMessage)
        return { success: false, error: userMessage }
      } finally {
        setLoading(false)
      }
    },
    [loadClientes, pagination.currentPage, pagination.limit, currentFilters, errorHandler],
  )

  const updateCliente = useCallback(
    async (id, clienteData) => {
      setLoading(true)
      setError(null)
      try {
        const updatedCliente = await clientesService.updateCliente(id, clienteData)

        errorHandler.handleSuccess("Cliente actualizado exitosamente", "actualizar cliente")

        setClientes((prev) => prev.map((cliente) => (cliente.id === id ? updatedCliente : cliente)))
        return { success: true, data: updatedCliente }
      } catch (err) {
        const { userMessage } = errorHandler.handleApiError(err, "actualizar cliente")
        setError(userMessage)
        return { success: false, error: userMessage }
      } finally {
        setLoading(false)
      }
    },
    [errorHandler],
  )

  const deleteCliente = useCallback(
    async (id) => {
      setLoading(true)
      setError(null)
      try {
        await clientesService.deleteCliente(id)
        errorHandler.handleSuccess("Cliente eliminado exitosamente", "eliminar cliente")

        setClientes((prev) => prev.filter((cliente) => cliente.id !== id))
        return { success: true }
      } catch (err) {
        const { userMessage } = errorHandler.handleApiError(err, "eliminar cliente")
  
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
      loadClientes(newPage, pagination.limit, currentFilters.search, currentFilters.searchBy)
    },
    [loadClientes, pagination.limit, currentFilters],
  )

  const changeRowsPerPage = useCallback(
    (newLimit) => {
      loadClientes(1, newLimit, currentFilters.search, currentFilters.searchBy)
    },
    [loadClientes, currentFilters],
  )

  return {
    clientes,
    loading,
    error,
    pagination,
    loadClientes,
    fetchClientes,
    createCliente,
    updateCliente,
    deleteCliente,
    changePage,
    changeRowsPerPage,
  }
}
