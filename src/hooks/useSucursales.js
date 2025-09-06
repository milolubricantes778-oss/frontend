"use client"

import { useState, useEffect, useCallback } from "react"
import sucursalesService from "../services/sucursalesService"

export const useSucursales = () => {
  const [sucursales, setSucursales] = useState([])
  const [sucursalesActivas, setSucursalesActivas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalPages, setTotalPages] = useState(0)

  const loadSucursales = useCallback(async (params = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await sucursalesService.getAll(params)
      setSucursales(response.data?.sucursales || [])
      setTotalPages(response.data?.pagination?.totalPages || 0)
    } catch (error) {
      console.error("Error loading sucursales:", error)
      setError(error.message || "Error al cargar sucursales")
    } finally {
      setLoading(false)
    }
  }, [])

  const loadSucursalesActivas = useCallback(async () => {
    try {
      const response = await sucursalesService.getActivas()
      setSucursalesActivas(response.data || [])
    } catch (error) {
      console.error("Error loading sucursales activas:", error)
    }
  }, [])

  const createSucursal = useCallback(async (sucursalData) => {
    try {
      setError(null)
      const response = await sucursalesService.create(sucursalData)
      return response
    } catch (error) {
      console.error("Error creating sucursal:", error)
      setError(error.message || "Error al crear sucursal")
      throw error
    }
  }, [])

  const updateSucursal = useCallback(async (id, sucursalData) => {
    try {
      setError(null)
      const response = await sucursalesService.update(id, sucursalData)
      return response
    } catch (error) {
      console.error("Error updating sucursal:", error)
      setError(error.message || "Error al actualizar sucursal")
      throw error
    }
  }, [])

  const deleteSucursal = useCallback(async (id) => {
    try {
      setError(null)
      const response = await sucursalesService.delete(id)
      return response
    } catch (error) {
      console.error("Error deleting sucursal:", error)
      setError(error.message || "Error al eliminar sucursal")
      throw error
    }
  }, [])

  useEffect(() => {
    loadSucursales()
    loadSucursalesActivas()
  }, [loadSucursales, loadSucursalesActivas])

  return {
    sucursales,
    sucursalesActivas,
    loading,
    error,
    totalPages,
    loadSucursales,
    loadSucursalesActivas,
    createSucursal,
    updateSucursal,
    deleteSucursal,
  }
}

export default useSucursales
