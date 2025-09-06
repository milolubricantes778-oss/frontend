"use client"

import { useState, useEffect, useCallback } from "react"
import empleadosService from "../services/empleadosService"

export const useEmpleados = () => {
  const [empleados, setEmpleados] = useState([])
  const [empleadosActivos, setEmpleadosActivos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalPages, setTotalPages] = useState(0)

  const loadEmpleados = useCallback(async (params = {}) => {
    try {
      setLoading(true)
      setError(null)
      const response = await empleadosService.getAll(params)
      setEmpleados(response.data?.empleados || [])
      setTotalPages(response.data?.pagination?.totalPages || 0)
    } catch (error) {
      console.error("Error loading empleados:", error)
      setError(error.message || "Error al cargar empleados")
    } finally {
      setLoading(false)
    }
  }, [])

  const loadEmpleadosActivos = useCallback(async () => {
    try {
      const response = await empleadosService.getActivos()
      setEmpleadosActivos(response.data || [])
    } catch (error) {
      console.error("Error loading empleados activos:", error)
    }
  }, [])

  const loadEmpleadosBySucursal = useCallback(async (sucursalId) => {
    try {
      const response = await empleadosService.getBySucursal(sucursalId)
      setEmpleadosActivos(response.data || [])
    } catch (error) {
      console.error("Error loading empleados by sucursal:", error)
    }
  }, [])

  const createEmpleado = useCallback(async (empleadoData) => {
    try {
      setError(null)
      const response = await empleadosService.create(empleadoData)
      return response
    } catch (error) {
      console.error("Error creating empleado:", error)
      setError(error.message || "Error al crear empleado")
      throw error
    }
  }, [])

  const updateEmpleado = useCallback(async (id, empleadoData) => {
    try {
      setError(null)
      const response = await empleadosService.update(id, empleadoData)
      return response
    } catch (error) {
      console.error("Error updating empleado:", error)
      setError(error.message || "Error al actualizar empleado")
      throw error
    }
  }, [])

  const deleteEmpleado = useCallback(async (id) => {
    try {
      setError(null)
      const response = await empleadosService.delete(id)
      return response
    } catch (error) {
      console.error("Error deleting empleado:", error)
      setError(error.message || "Error al eliminar empleado")
      throw error
    }
  }, [])

  useEffect(() => {
    loadEmpleados()
    loadEmpleadosActivos()
  }, [loadEmpleados, loadEmpleadosActivos])

  return {
    empleados,
    empleadosActivos,
    loading,
    error,
    totalPages,
    loadEmpleados,
    loadEmpleadosActivos,
    loadEmpleadosBySucursal,
    createEmpleado,
    updateEmpleado,
    deleteEmpleado,
  }
}

export default useEmpleados
