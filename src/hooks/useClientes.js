"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { clientesService } from "../services/clientesService.js"
import { useStandardizedErrorHandler } from "../utils/standardizedErrorHandler"
import { useToast } from "./useToast"

export const useClientes = () => {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  })

  const { showToast } = useToast()
  const errorHandler = useStandardizedErrorHandler(showToast)

  const activeRequestRef = useRef(null)

  const normalizeResult = (result, requestedPage, requestedLimit) => {
    let data = []
    let currentPage = requestedPage ?? 1
    let totalPages = 1
    let total = 0
    const limit = requestedLimit ?? pagination.limit

    if (Array.isArray(result)) {
      data = result
      total = result.length
      totalPages = Math.max(1, Math.ceil(total / limit))
    } else if (result && Array.isArray(result.data)) {
      data = result.data
      currentPage = result.currentPage ?? result.page ?? currentPage
      totalPages =
        result.totalPages ??
        result.total_pages ??
        result.pagination?.totalPages ??
        Math.max(1, Math.ceil((result.total ?? data.length) / limit))
      total = result.total ?? result.totalItems ?? result.pagination?.total ?? data.length
    } else if (result && (Array.isArray(result.items) || Array.isArray(result.clients))) {
      data = result.items ?? result.clients
      currentPage = result.page ?? result.currentPage ?? currentPage
      total = result.total ?? data.length
      totalPages = result.totalPages ?? Math.max(1, Math.ceil(total / limit))
    } else {
      const maybeArray = result?.data ?? result?.items ?? result?.clients
      if (Array.isArray(maybeArray)) {
        data = maybeArray
        total = data.length
        totalPages = Math.max(1, Math.ceil(total / limit))
      } else {
        data = []
        total = 0
        totalPages = 1
      }
    }

    return { data, currentPage, totalPages, total, limit }
  }

  const loadClientes = useCallback(
    async (page = 1, search = "", limit = null) => {
      const actualLimit = limit || pagination.limit
      setLoading(true)
      setError(null)

      try {
        if (activeRequestRef.current?.cancel) {
          try {
            activeRequestRef.current.cancel()
          } catch (e) {}
        }

        const result = await clientesService.getClientes(page, actualLimit, search)

        const normalized = normalizeResult(result, page, actualLimit)

        setClientes(normalized.data)
        setPagination({
          currentPage: normalized.currentPage,
          totalPages: normalized.totalPages,
          total: normalized.total,
          limit: normalized.limit,
        })
      } catch (err) {
        const { userMessage } = errorHandler.handleApiError(err, "cargar clientes")
        setError(userMessage)
        setClientes([])
      } finally {
        setLoading(false)
      }
    },
    [pagination.limit, errorHandler],
  )

  const fetchClientes = useCallback(
    async (params = {}) => {
      const { search = "", limit = 10, page = 1 } = params

      try {
        const result = await clientesService.getClientes(page, limit, search)
        return result
      } catch (err) {
        const { userMessage } = errorHandler.handleApiError(err, "buscar clientes")
        throw new Error(userMessage)
      }
    },
    [errorHandler],
  )

  const createCliente = async (clienteData) => {
    setLoading(true)
    setError(null)

    try {
      const newCliente = await clientesService.createCliente(clienteData)
      errorHandler.handleSuccess("Cliente creado exitosamente", "crear cliente")
      await loadClientes(pagination.currentPage || 1, "", pagination.limit)
      return newCliente
    } catch (err) {
      const { userMessage } = errorHandler.handleApiError(err, "crear cliente")
      setError(userMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateCliente = async (id, clienteData) => {
    setLoading(true)
    setError(null)

    try {
      const updatedCliente = await clientesService.updateCliente(id, clienteData)
      errorHandler.handleSuccess("Cliente actualizado exitosamente", "actualizar cliente")
      await loadClientes(pagination.currentPage || 1, "", pagination.limit)
      return updatedCliente
    } catch (err) {
      const { userMessage } = errorHandler.handleApiError(err, "actualizar cliente")
      setError(userMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteCliente = async (id) => {
    setLoading(true)
    setError(null)

    try {
      await clientesService.deleteCliente(id)
      errorHandler.handleSuccess("Cliente eliminado exitosamente", "eliminar cliente")
      await loadClientes(pagination.currentPage || 1, "", pagination.limit)
    } catch (err) {
      const { userMessage } = errorHandler.handleApiError(err, "eliminar cliente")
      setError(userMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const searchClientes = async (searchTerm) => {
    if (!searchTerm.trim()) {
      await loadClientes(1, "")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const results = await clientesService.searchClientes(searchTerm)
      const data = Array.isArray(results) ? results : (results?.data ?? results?.items ?? [])
      setClientes(data)
      setPagination((prev) => ({ ...prev, currentPage: 1, totalPages: 1, total: data.length }))
    } catch (err) {
      const { userMessage } = errorHandler.handleApiError(err, "buscar clientes")
      setError(userMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClientes()
  }, []) // carga inicial

  return {
    clientes,
    loading,
    error,
    pagination,
    loadClientes,
    fetchClientes, // Export new method
    createCliente,
    updateCliente,
    deleteCliente,
    searchClientes,
  }
}
