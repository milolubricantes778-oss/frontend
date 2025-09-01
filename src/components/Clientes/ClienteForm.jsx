"use client"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useEffect } from "react"
import { X, User, Phone, MapPin } from "lucide-react"

const clienteSchema = yup.object({
  nombre: yup
    .string()
    .required("El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  apellido: yup
    .string()
    .required("El apellido es obligatorio")
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres"),
  dni: yup
    .string()
    .nullable()
    .matches(/^\d{7,8}$/, "El DNI debe tener 7 u 8 dígitos"),
  telefono: yup.string().nullable(),
  direccion: yup.string().nullable().min(5, "La dirección debe tener al menos 5 caracteres"),
})

const ClienteForm = ({ open, onClose, onSubmit, cliente = null, loading = false }) => {
  const isEditing = Boolean(cliente)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(clienteSchema),
    defaultValues: {
      nombre: cliente?.nombre || "",
      apellido: cliente?.apellido || "",
      dni: cliente?.dni || "",
      telefono: cliente?.telefono || "",
      direccion: cliente?.direccion || "",
    },
  })

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  const handleFormSubmit = (data) => {
    onSubmit(data)
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      handleClose()
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleClose}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#d84315] text-white p-6 rounded-t-xl flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-white bg-opacity-20 flex items-center justify-center">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">{isEditing ? "Editar Cliente" : "Nuevo Cliente"}</h2>
              <p className="text-sm opacity-90">
                {isEditing
                  ? "Modifica la información del cliente existente"
                  : "Completa los datos para registrar un nuevo cliente"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#d84315] scrollbar-track-gray-100">
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-orange-100 text-[#d84315]">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Información Personal</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                  <input
                    {...register("nombre")}
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d84315] focus:border-[#d84315] transition-colors ${
                      errors.nombre ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Ingresa el nombre"
                  />
                  {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellido *</label>
                  <input
                    {...register("apellido")}
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d84315] focus:border-[#d84315] transition-colors ${
                      errors.apellido ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Ingresa el apellido"
                  />
                  {errors.apellido && <p className="mt-1 text-sm text-red-600">{errors.apellido.message}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">DNI</label>
                  <input
                    {...register("dni")}
                    type="text"
                    maxLength={8}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d84315] focus:border-[#d84315] transition-colors ${
                      errors.dni ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Ej: 12345678"
                  />
                  {errors.dni && <p className="mt-1 text-sm text-red-600">{errors.dni.message}</p>}
                </div>
              </div>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Información de Contacto</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                <input
                  {...register("telefono")}
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d84315] focus:border-[#d84315] transition-colors ${
                    errors.telefono ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ej: 11-1234-5678"
                />
                {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono.message}</p>}
              </div>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-green-100 text-green-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Dirección</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                <textarea
                  {...register("direccion")}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d84315] focus:border-[#d84315] transition-colors resize-none ${
                    errors.direccion ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Calle, número, piso, departamento"
                />
                {errors.direccion && <p className="mt-1 text-sm text-red-600">{errors.direccion.message}</p>}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#d84315] text-white rounded-lg hover:bg-[#c13711] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg"
            >
              {loading ? "Guardando..." : isEditing ? "Actualizar Cliente" : "Crear Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClienteForm
