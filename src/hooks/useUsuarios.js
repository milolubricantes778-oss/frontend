"use client"

import { useState, useCallback } from "react"
import usuariosService from "../services/usuariosService"

export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  // Cargar usuarios con filtros
  const loadUsuarios = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true)
        setError(null)

        const params = {
          page: currentPage,
          limit: 10,
          ...filters,
        }

        const response = await usuariosService.getUsuarios(params)
        setUsuarios(response.data?.users || [])
        setTotalPages(response.data?.pagination?.totalPages || 0)
      } catch (err) {
        setError(err.message || "Error al cargar usuarios")
        console.error("Error loading usuarios:", err)
      } finally {
        setLoading(false)
      }
    },
    [currentPage],
  )

  // Crear usuario
  const createUsuario = async (userData) => {
    try {
      setLoading(true)
      const response = await usuariosService.createUsuario(userData)
      await loadUsuarios() // Recargar lista
      return response
    } catch (err) {
      setError(err.message || "Error al crear usuario")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Actualizar usuario
  const updateUsuario = async (id, userData) => {
    try {
      setLoading(true)
      const response = await usuariosService.updateUsuario(id, userData)
      await loadUsuarios() // Recargar lista
      return response
    } catch (err) {
      setError(err.message || "Error al actualizar usuario")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Eliminar usuario
  const deleteUsuario = async (id) => {
    try {
      setLoading(true)
      await usuariosService.deleteUsuario(id)
      await loadUsuarios() // Recargar lista
    } catch (err) {
      setError(err.message || "Error al eliminar usuario")
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Cambiar página
  const changePage = (page) => {
    setCurrentPage(page)
  }

  // Limpiar error
  const clearError = () => {
    setError(null)
  }

  return {
    usuarios,
    loading,
    error,
    totalPages,
    currentPage,
    loadUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    changePage,
    clearError,
  }
}
