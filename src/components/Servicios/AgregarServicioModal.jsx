"use client"

import { useState, useEffect } from "react"
import { Plus, Wrench, CheckCircle, Package, X, Search } from "lucide-react"

const AgregarServicioModal = ({ isOpen, onClose, onAddItem, tiposServicios = [] }) => {
  const [currentItem, setCurrentItem] = useState({
    tipoServicioId: null,
    tipoServicioNombre: "",
    observaciones: "",
    notas: "",
    productos: [],
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [filteredTipos, setFilteredTipos] = useState([])
  const [showTiposList, setShowTiposList] = useState(false)
  const [newProducto, setNewProducto] = useState("")

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"

      const handleEscape = (e) => {
        if (e.key === "Escape") {
          handleClose()
        }
      }

      document.addEventListener("keydown", handleEscape)

      return () => {
        document.body.style.overflow = "unset"
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (searchTerm) {
      const filtered = tiposServicios.filter((tipo) => tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredTipos(filtered)
      setShowTiposList(true)
    } else {
      setFilteredTipos([])
      setShowTiposList(false)
    }
  }, [searchTerm, tiposServicios])

  const handleSelectTipoServicio = (tipo) => {
    setCurrentItem((prev) => ({
      ...prev,
      tipoServicioId: tipo.id,
      tipoServicioNombre: tipo.nombre,
    }))
    setSearchTerm(tipo.nombre)
    setFilteredTipos([])
    setShowTiposList(false)
  }

  const handleAddProducto = () => {
    if (newProducto.trim()) {
      setCurrentItem((prev) => ({
        ...prev,
        productos: [
          ...prev.productos,
          {
            id: Date.now(),
            nombre: newProducto.trim(),
            es_nuestro: true,
          },
        ],
      }))
      setNewProducto("")
    }
  }

  const handleRemoveProducto = (productoId) => {
    setCurrentItem((prev) => ({
      ...prev,
      productos: prev.productos.filter((p) => p.id !== productoId),
    }))
  }

  const handleToggleProductoOrigen = (productoId) => {
    setCurrentItem((prev) => ({
      ...prev,
      productos: prev.productos.map((p) => (p.id === productoId ? { ...p, es_nuestro: !p.es_nuestro } : p)),
    }))
  }

  const handleAddItem = () => {
    if (currentItem.tipoServicioId) {
      const newItem = {
        ...currentItem,
        id: Date.now(),
      }

      onAddItem(newItem)
      handleClose()
    }
  }

  const handleClose = () => {
    setCurrentItem({
      tipoServicioId: null,
      tipoServicioNombre: "",
      observaciones: "",
      notas: "",
      productos: [],
    })
    setSearchTerm("")
    setNewProducto("")
    setShowTiposList(false)
    onClose()
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && newProducto.trim()) {
      e.preventDefault()
      handleAddProducto()
    }
  }

  if (!isOpen) return null

  // small inline styles to force GPU/compositing and avoid flicker on scroll
  const gpuStyle = {
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    willChange: "transform, opacity",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[700px] mx-4 flex flex-col overscroll-contain">
        {/* Header */}
        <div className="flex-shrink-0 bg-[#d84315] text-white p-3 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-xl ml-4 font-bold">Agregar Nuevo Servicio</h2>
              </div>
            </div>
            {/* Reemplaza el botón de cerrar por este bloque (sin fondo, moderno y accesible) */}
            <button
              onClick={handleClose}
              aria-label="Cerrar modal"
              className="relative z-10 flex items-center justify-center h-10 w-10 rounded-full text-white bg-transparent hover:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-0 transition-transform duration-200 motion-safe:transform-gpu hover:scale-110 active:scale-95"
            >
              {/* texto solo para lectores de pantalla */}
              <span className="sr-only">Cerrar</span>

              {/* icono blanco con micro-animación, sin fondo */}
              <X className="h-5 w-5 transform transition-transform duration-300 group-hover:-rotate-90" />
            </button>

          </div>
        </div>

        {/* Content */}
        {/* NOTE: removed 'scroll-smooth' (can cause jank) and added -webkit-overflow-scrolling for iOS */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-6"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Tipo de Servicio Section with Search */}
          <div className="space-y-3 relative">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-[#d84315]" style={gpuStyle} />
              <label className="text-sm font-semibold text-[#171717]">Tipo de Servicio *</label>
            </div>
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                style={gpuStyle}
              />
              <input
                type="text"
                placeholder="Buscar tipo de servicio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-10 pr-4 border-2 border-gray-200 rounded-lg focus:border-[#d84315] focus:outline-none transition-colors box-border"
              />
              {showTiposList && filteredTipos.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto overscroll-contain">
                  {filteredTipos.map((tipo) => (
                    <div
                      key={tipo.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => handleSelectTipoServicio(tipo)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#d84315]"></div>
                        <span className="font-medium">{tipo.nombre}</span>
                      </div>
                      {tipo.descripcion && <p className="text-sm text-gray-500 mt-1 ml-4">{tipo.descripcion}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Productos Section */}
          {currentItem.tipoServicioId && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#d84315]" style={gpuStyle} />
                <label className="text-sm font-semibold text-[#171717]">Productos Utilizados</label>
              </div>

              {/* Add Product Input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Ej: Aceite Motul 5W30, Filtro de aceite..."
                  value={newProducto}
                  onChange={(e) => setNewProducto(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#d84315] focus:outline-none transition-colors box-border"
                />
                <button
                  type="button"
                  onClick={handleAddProducto}
                  disabled={!newProducto.trim()}
                  className="bg-[#d84315] hover:bg-[#d84315]/90 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors flex-shrink-0"
                >
                  <Plus className="h-4 w-4" style={gpuStyle} />
                </button>
              </div>

              {/* Products List */}
              {currentItem.productos.length > 0 && (
                <div className="space-y-3">
                  {currentItem.productos.map((producto) => (
                    <div
                      key={producto.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border"
                      style={{ ...gpuStyle }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0 overflow-hidden">
                        <Package className="h-4 w-4 text-gray-500 flex-shrink-0" style={gpuStyle} />
                        <span className="text-sm font-medium truncate">{producto.nombre}</span>
                      </div>

                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 whitespace-nowrap">
                            {producto.es_nuestro ? "Nuestro" : "Del cliente"}
                          </label>

                          {/* Improved toggle: absolute transform values + will-change to avoid jitter */}
                          <button
                            onClick={() => handleToggleProductoOrigen(producto.id)}
                            aria-pressed={producto.es_nuestro}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${producto.es_nuestro ? "bg-[#d84315]" : "bg-gray-300"
                              }`}
                            style={{ padding: 2, ...{ willChange: "transform, background-color" } }}
                          >
                            {/* track knob positioned via transform pixel values to be stable across scroll */}
                            <span
                              className="absolute left-0 top-0 h-5 w-5 rounded-full bg-white shadow-sm"
                              style={{
                                transform: producto.es_nuestro ? "translateX(20px)" : "translateX(2px)",
                                transition: "transform 150ms cubic-bezier(.4,0,.2,1)",
                                willChange: "transform",
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                              }}
                            />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveProducto(producto.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" style={gpuStyle} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Detalles Adicionales */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-[#171717] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                Observaciones
              </label>
              <textarea
                placeholder="Observaciones específicas del cliente o del vehículo..."
                value={currentItem.observaciones}
                onChange={(e) => setCurrentItem((prev) => ({ ...prev, observaciones: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#d84315] focus:outline-none transition-colors resize-none box-border"
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-[#171717] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Notas Internas
              </label>
              <textarea
                placeholder="Notas para el equipo técnico, recordatorios..."
                value={currentItem.notas}
                onChange={(e) => setCurrentItem((prev) => ({ ...prev, notas: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#d84315] focus:outline-none transition-colors resize-none box-border"
                rows={3}
              />
            </div>
          </div>

          {/* Preview Card */}
          
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAddItem}
            disabled={!currentItem.tipoServicioId}
            className="bg-[#d84315] hover:bg-[#d84315]/90 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg shadow-lg transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" style={gpuStyle} />
            Agregar Servicio
          </button>
        </div>
      </div>
    </div>
  )
}

export default AgregarServicioModal
