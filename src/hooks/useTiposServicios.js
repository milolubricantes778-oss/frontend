"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import tiposServiciosService from "../services/tiposServiciosService"
import { useToast } from "./useToast"
import { useErrorHandler } from "./useErrorHandler"

export const useTiposServicios = () => {
  const [tiposServicios, setTiposServicios] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 50,
  })

  const { showToast } = useToast()
  const { handleError } = useErrorHandler()

  // referencia para evitar llamadas simultáneas
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
    } else if (result && (Array.isArray(result.items) || Array.isArray(result.tiposServicios))) {
      data = result.items ?? result.tiposServicios
      currentPage = result.page ?? result.currentPage ?? currentPage
      total = result.total ?? data.length
      totalPages = result.totalPages ?? Math.max(1, Math.ceil(total / limit))
    } else {
      // fallback: intentar extraer cualquier array
      const maybeArray = result?.data ?? result?.items ?? result?.tiposServicios
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

  const loadTiposServicios = useCallback(
    async (page = 1, search = "", limit = null) => {
      const actualLimit = limit || pagination.limit
      setLoading(true)
      setError(null)

      try {
        // cancelar petición anterior si aplica
        if (activeRequestRef.current?.cancel) {
          try {
            activeRequestRef.current.cancel()
          } catch (e) {}
        }

        const result = await tiposServiciosService.getTiposServicios({
          page,
          limit: actualLimit,
          search,
        })

        const normalized = normalizeResult(result, page, actualLimit)

        setTiposServicios(normalized.data)
        setPagination({
          currentPage: normalized.currentPage,
          totalPages: normalized.totalPages,
          total: normalized.total,
          limit: normalized.limit,
        })
      } catch (err) {
        console.error("❌ Error al cargar tipos de servicios:", err)
        setError(err?.message ?? "Error al cargar tipos de servicios")
        setTiposServicios([])
      } finally {
        setLoading(false)
      }
    },
    [pagination.limit],
  )

  const createTipoServicio = async (tipoServicioData) => {
    setLoading(true)
    setError(null)

    try {
      const newTipoServicio = await tiposServiciosService.createTipoServicio(tipoServicioData)
      await loadTiposServicios(pagination.currentPage || 1, "", pagination.limit) // Recargar lista
      showToast("Tipo de servicio creado exitosamente", "success")
      return newTipoServicio
    } catch (err) {
      setError(err.message)
      handleError(err, "Error al crear tipo de servicio")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTipoServicio = async (id, tipoServicioData) => {
    setLoading(true)
    setError(null)

    try {
      const updatedTipoServicio = await tiposServiciosService.updateTipoServicio(id, tipoServicioData)
      await loadTiposServicios(pagination.currentPage || 1, "", pagination.limit) // Recargar lista
      showToast("Tipo de servicio actualizado exitosamente", "success")
      return updatedTipoServicio
    } catch (err) {
      setError(err.message)
      handleError(err, "Error al actualizar tipo de servicio")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteTipoServicio = async (id) => {
    setLoading(true)
    setError(null)

    try {
      await tiposServiciosService.deleteTipoServicio(id)
      await loadTiposServicios(pagination.currentPage || 1, "", pagination.limit) // Recargar lista
      showToast("Tipo de servicio eliminado exitosamente", "success")
    } catch (err) {
      setError(err.message)
      handleError(err, "Error al eliminar tipo de servicio")
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTiposServicios()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // carga inicial

  return {
    tiposServicios,
    loading,
    error,
    pagination,
    loadTiposServicios,
    createTipoServicio,
    updateTipoServicio,
    deleteTipoServicio,
    setPagination,
  }
}
