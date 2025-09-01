"use client"

import { useState, useCallback, useRef } from "react"
import serviciosService from "../services/serviciosService.js"
import { useStandardizedErrorHandler } from "../utils/standardizedErrorHandler"
import { useToast } from "./useToast"

export const useServicios = () => {
  const [servicios, setServicios] = useState([])
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
    } else if (result && (Array.isArray(result.items) || Array.isArray(result.servicios))) {
      data = result.items ?? result.servicios
      currentPage = result.page ?? result.currentPage ?? currentPage
      total = result.total ?? data.length
      totalPages = result.totalPages ?? Math.max(1, Math.ceil(total / limit))
    } else {
      const maybeArray = result?.data ?? result?.items ?? result?.servicios
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

  const loadServicios = useCallback(
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

        const result = await serviciosService.getServicios({
          page,
          limit: actualLimit,
          search,
        })

        const normalized = normalizeResult(result, page, actualLimit)

        setServicios(normalized.data)
        setPagination({
          currentPage: normalized.currentPage,
          totalPages: normalized.totalPages,
          total: normalized.total,
          limit: normalized.limit,
        })
      } catch (err) {
        const { userMessage } = errorHandler.handleApiError(err, "cargar servicios")
        setError(userMessage)
        setServicios([])
      } finally {
        setLoading(false)
      }
    },
    [pagination.limit, errorHandler],
  )

  const createServicio = async (servicioData) => {
    setLoading(true)
    setError(null)

    try {
      const newServicio = await serviciosService.createServicio(servicioData)
      errorHandler.handleSuccess("Servicio creado exitosamente", "crear servicio")
      await loadServicios(pagination.currentPage || 1, "", pagination.limit)
      return newServicio
    } catch (err) {
      const { userMessage } = errorHandler.handleApiError(err, "crear servicio")
      setError(userMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateServicio = async (id, servicioData) => {
    setLoading(true)
    setError(null)

    try {
      const updatedServicio = await serviciosService.updateServicio(id, servicioData)
      errorHandler.handleSuccess("Servicio actualizado exitosamente", "actualizar servicio")
      await loadServicios(pagination.currentPage || 1, "", pagination.limit)
      return updatedServicio
    } catch (err) {
      const { userMessage } = errorHandler.handleApiError(err, "actualizar servicio")
      setError(userMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteServicio = async (id) => {
    setLoading(true)
    setError(null)

    try {
      await serviciosService.deleteServicio(id)
      errorHandler.handleSuccess("Servicio eliminado exitosamente", "eliminar servicio")
      await loadServicios(pagination.currentPage || 1, "", pagination.limit)
    } catch (err) {
      const { userMessage } = errorHandler.handleApiError(err, "eliminar servicio")
      setError(userMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const searchServicios = async (searchTerm) => {
    if (!searchTerm.trim()) {
      await loadServicios(1, "")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const results = await serviciosService.searchServicios(searchTerm)
      const data = Array.isArray(results) ? results : (results?.data ?? results?.items ?? [])
      setServicios(data)
      setPagination((prev) => ({ ...prev, currentPage: 1, totalPages: 1, total: data.length }))
    } catch (err) {
      const { userMessage } = errorHandler.handleApiError(err, "buscar servicios")
      setError(userMessage)
    } finally {
      setLoading(false)
    }
  }

  // The initial load is now handled by components that use this hook

  return {
    servicios,
    loading,
    error,
    pagination,
    loadServicios,
    createServicio,
    updateServicio,
    deleteServicio,
    searchServicios,
  }
}
