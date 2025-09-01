"use client"

import { useState, useEffect } from "react"
import { useServicios } from "../../hooks/useServicios.js"
import ServiciosList from "../../components/Servicios/ServiciosList.jsx"
import ServicioDetalleModal from "../../components/Servicios/ServicioDetalleModal.jsx"
import serviciosService from "../../services/serviciosService.js"

const ReportesPage = () => {
  const { servicios, loading, error, pagination, loadServicios, updateServicio, deleteServicio, searchServicios } =
    useServicios()

  const [searchTerm, setSearchTerm] = useState("")
  const [searchCriteria, setSearchCriteria] = useState("numero")
  const [selectedServicio, setSelectedServicio] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [servicioToDelete, setServicioToDelete] = useState(null)
  const [toast, setToast] = useState({ show: false, message: "", type: "success" })
  const [detalleModalOpen, setDetalleModalOpen] = useState(false)
  const [servicioDetalle, setServicioDetalle] = useState(null)
  const [clienteFilter, setClienteFilter] = useState(null)
  const [clienteFilterName, setClienteFilterName] = useState("")
  const [filteredServicios, setFilteredServicios] = useState([])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const clienteId = urlParams.get("cliente")
    const servicioId = urlParams.get("servicio")

    if (clienteId) {
      loadServiciosByCliente(clienteId)
    } else if (servicioId) {
      loadSpecificService(servicioId)
    } else {
      loadServicios()
    }
  }, [])

  useEffect(() => {
    setFilteredServicios(servicios)
  }, [servicios])

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000)
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      if (searchCriteria === "cliente") {
        const filtered = servicios.filter((servicio) =>
          `${servicio.cliente_nombre} ${servicio.cliente_apellido}`.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setFilteredServicios(filtered)
      } else if (searchCriteria === "vehiculo") {
        const filtered = servicios.filter((servicio) =>
          servicio.patente.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setFilteredServicios(filtered)
      } else {
        const filtered = servicios.filter((servicio) =>
          servicio.numero.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        setFilteredServicios(filtered)
      }
    } else {
      setFilteredServicios(servicios)
    }
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setSearchCriteria("numero")
    setClienteFilter(null)
    setClienteFilterName("")
    setFilteredServicios(servicios)

    window.history.replaceState({}, document.title, window.location.pathname)
    loadServicios(1)
  }

  const handleEditServicio = (servicio) => {
    setSelectedServicio(servicio)
  }

  const handleDeleteServicio = (servicio) => {
    setServicioToDelete(servicio)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      await deleteServicio(servicioToDelete.id)
      showToast("Servicio eliminado correctamente", "success")
    } catch (error) {
      showToast("Error al eliminar servicio: " + error.message, "error")
    } finally {
      setDeleteDialogOpen(false)
      setServicioToDelete(null)
    }
  }

  const handlePageChange = (page, newLimit = null) => {
    if (newLimit) {
      loadServicios(1, searchTerm, newLimit)
    } else {
      loadServicios(page, searchTerm)
    }
  }

  const handleViewMore = async (servicio) => {
    try {
      const response = await serviciosService.getServicioById(servicio.id)
      setServicioDetalle(response)
      setDetalleModalOpen(true)
    } catch (error) {
      console.error("Error al cargar detalles del servicio:", error)
      showToast("Error al cargar los detalles del servicio", "error")
    }
  }

  const exportarReporte = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Fecha,Cliente,Vehículo,Servicio,Total\n" +
      filteredServicios
        .map(
          (s) =>
            `${s.created_at},${s.cliente_nombre} ${s.cliente_apellido},${s.patente},${s.numero},${s.precio_referencia}`,
        )
        .join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `reporte_servicios_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const loadServiciosByCliente = async (clienteId) => {
    try {
      const response = await serviciosService.getServiciosByCliente(clienteId)
      const serviciosData = Array.isArray(response) ? response : response.data || []

      setClienteFilter(clienteId)
      if (serviciosData.length > 0) {
        const clienteName = `${serviciosData[0].cliente_nombre} ${serviciosData[0].cliente_apellido}`
        setClienteFilterName(clienteName)
      }

      setFilteredServicios(serviciosData)
    } catch (error) {
      console.error("Error al cargar servicios del cliente:", error)
      showToast("Error al cargar los servicios del cliente", "error")
    }
  }

  const loadSpecificService = async (servicioId) => {
    try {
      const response = await serviciosService.getServicioById(servicioId)
      handleViewMore({ id: servicioId })
    } catch (error) {
      console.error("Error al cargar servicio específico:", error)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Gestión de Servicios</h1>
          <p className="text-gray-600 mt-1">Visualiza y administra el historial de servicios realizados</p>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 text-[#d84315] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h2>
          </div>

          {clienteFilter && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <span className="text-blue-800">
                Mostrando servicios del cliente: <strong>{clienteFilterName}</strong>
              </span>
              <button onClick={handleClearFilters} className="text-[#d84315] hover:text-[#ff5722] font-medium text-sm">
                Limpiar Filtro
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar servicio</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d84315] focus:border-[#d84315] outline-none"
                placeholder="Ingresa término de búsqueda..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar por</label>
              <select
                value={searchCriteria}
                onChange={(e) => setSearchCriteria(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d84315] focus:border-[#d84315] outline-none"
              >
                <option value="numero">Número</option>
                <option value="cliente">Cliente</option>
                <option value="vehiculo">Vehículo (Patente)</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-[#d84315] text-white rounded-lg hover:bg-[#ff5722] transition-colors font-medium"
              >
                Buscar
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Limpiar
              </button>
              <button
                onClick={exportarReporte}
                className="px-4 py-2 border border-[#d84315] text-[#d84315] rounded-lg hover:bg-[#d84315] hover:text-white transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Historial de Servicios ({filteredServicios.length})</h2>
        </div>
        <ServiciosList
          servicios={filteredServicios}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onEdit={handleEditServicio}
          onDelete={handleDeleteServicio}
          onView={handleViewMore}
        />
      </div>

      {/* Delete Confirmation Modal */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmar Eliminación</h3>
            <p className="text-gray-600 mb-2">
              ¿Estás seguro de que deseas eliminar el servicio <strong>#{servicioToDelete?.numero}</strong>?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Esta acción marcará el servicio como inactivo pero conservará su historial.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      <ServicioDetalleModal
        open={detalleModalOpen}
        onClose={() => setDetalleModalOpen(false)}
        servicio={servicioDetalle}
      />

      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default ReportesPage

