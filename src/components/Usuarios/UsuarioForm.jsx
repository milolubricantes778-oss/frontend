"use client"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useEffect } from "react"
import { X, User, Mail, Shield } from "lucide-react"

const usuarioSchema = yup.object({
  nombre: yup
    .string()
    .required("El nombre es obligatorio")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  email: yup.string().required("El email es obligatorio").email("Debe ser un email válido"),
  password: yup.string().when("$isEditing", {
    is: false,
    then: (schema) =>
      schema.required("La contraseña es obligatoria").min(6, "La contraseña debe tener al menos 6 caracteres"),
    otherwise: (schema) => schema.min(6, "La contraseña debe tener al menos 6 caracteres"),
  }),
  rol: yup.string().required("El rol es obligatorio").oneOf(["ADMIN", "EMPLEADO"], "Rol inválido"),
})

const UsuarioForm = ({ open, onClose, onSubmit, usuario = null, loading = false }) => {
  const isEditing = Boolean(usuario)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(usuarioSchema),
    context: { isEditing },
    defaultValues: {
      nombre: usuario?.nombre || "",
      email: usuario?.email || "",
      password: "",
      rol: usuario?.rol || "EMPLEADO",
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

  useEffect(() => {
    if (usuario) {
      reset({
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        password: "",
        rol: usuario.rol || "EMPLEADO",
      })
    } else {
      reset({
        nombre: "",
        email: "",
        password: "",
        rol: "EMPLEADO",
      })
    }
  }, [usuario, reset])

  const handleFormSubmit = (data) => {
    // Si estamos editando y no se proporcionó contraseña, no la incluimos
    if (isEditing && !data.password) {
      delete data.password
    }

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
              <h2 className="text-xl font-bold text-white mb-1">{isEditing ? "Editar Usuario" : "Nuevo Usuario"}</h2>
              <p className="text-sm opacity-90">
                {isEditing
                  ? "Modifica la información del usuario existente"
                  : "Completa los datos para registrar un nuevo usuario"}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                <input
                  {...register("nombre")}
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d84315] focus:border-[#d84315] transition-colors ${
                    errors.nombre ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ingresa el nombre completo"
                />
                {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
              </div>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Credenciales de Acceso</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    {...register("email")}
                    type="email"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d84315] focus:border-[#d84315] transition-colors ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="usuario@ejemplo.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña {isEditing ? "(dejar vacío para mantener actual)" : "*"}
                  </label>
                  <input
                    {...register("password")}
                    type="password"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d84315] focus:border-[#d84315] transition-colors ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={isEditing ? "Nueva contraseña (opcional)" : "Contraseña"}
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
                </div>
              </div>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Permisos</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rol *</label>
                <select
                  {...register("rol")}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#d84315] focus:border-[#d84315] transition-colors ${
                    errors.rol ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="EMPLEADO">Empleado</option>
                  <option value="ADMIN">Administrador</option>
                </select>
                {errors.rol && <p className="mt-1 text-sm text-red-600">{errors.rol.message}</p>}
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
              {loading ? "Guardando..." : isEditing ? "Actualizar Usuario" : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UsuarioForm
