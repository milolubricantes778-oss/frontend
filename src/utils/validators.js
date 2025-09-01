// Validadores personalizados para yup

import * as yup from "yup"

export const dniValidator = (value) => {
  if (!value) return false
  const cleaned = value.toString().replace(/\D/g, "")
  return cleaned.length >= 7 && cleaned.length <= 8
}

export const phoneValidator = (value) => {
  if (!value) return false
  const cleaned = value.replace(/\D/g, "")
  return cleaned.length >= 10
}

export const patenteValidator = (value) => {
  if (!value) return false
  // Solo verificamos que tenga al menos 3 caracteres
  return value.trim().length >= 3
}

// Validador para CUIT/CUIL argentino
export const cuitValidator = (value) => {
  if (!value) return false
  const cleaned = value.replace(/\D/g, "")
  if (cleaned.length !== 11) return false

  // Algoritmo de validación CUIT
  const multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
  let sum = 0

  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(cleaned[i]) * multipliers[i]
  }

  const remainder = sum % 11
  const checkDigit = remainder < 2 ? remainder : 11 - remainder

  return Number.parseInt(cleaned[10]) === checkDigit
}

// Validador para email
export const emailValidator = (value) => {
  if (!value) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

// Validador para contraseñas seguras
export const passwordValidator = (value) => {
  if (!value) return false
  // Al menos 8 caracteres, una mayúscula, una minúscula y un número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(value)
}

// Esquemas de validación con Yup
export const clienteSchema = yup.object({
  nombre: yup
    .string()
    .required("El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  email: yup.string().email("Ingrese un email válido").required("El email es requerido"),
  telefono: yup
    .string()
    .required("El teléfono es requerido")
    .test("phone", "Ingrese un teléfono válido", phoneValidator),
  dni: yup.string().required("El DNI es requerido").test("dni", "Ingrese un DNI válido", dniValidator),
  direccion: yup
    .string()
    .required("La dirección es requerida")
    .max(200, "La dirección no puede exceder 200 caracteres"),
})

export const vehiculoSchema = yup.object({
  patente: yup
    .string()
    .required("La patente es requerida")
    .min(3, "La patente debe tener al menos 3 caracteres")
    .max(10, "La patente no puede exceder 10 caracteres"),
  marca: yup.string().required("La marca es requerida").max(50, "La marca no puede exceder 50 caracteres"),
  modelo: yup.string().required("El modelo es requerido").max(50, "El modelo no puede exceder 50 caracteres"),
  año: yup
    .number()
    .required("El año es requerido")
    .min(1900, "El año debe ser mayor a 1900")
    .max(new Date().getFullYear() + 1, "El año no puede ser futuro"),
  kilometraje: yup
    .number()
    .min(0, "El kilometraje no puede ser negativo")
    .max(999999, "El kilometraje no puede exceder 999,999 km"),
})

export const servicioSchema = yup.object({
  descripcion: yup
    .string()
    .required("La descripción es requerida")
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres"),
  precio: yup
    .number()
    .required("El precio es requerido")
    .min(0, "El precio no puede ser negativo")
    .max(999999, "El precio no puede exceder $999,999"),
  fecha_programada: yup
    .date()
    .required("La fecha programada es requerida")
    .min(new Date(), "La fecha no puede ser en el pasado"),
})

export const userSchema = yup.object({
  nombre: yup
    .string()
    .required("El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  email: yup.string().email("Ingrese un email válido").required("El email es requerido"),
  password: yup
    .string()
    .required("La contraseña es requerida")
    .test(
      "password",
      "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número",
      passwordValidator,
    ),
  rol: yup.string().required("El rol es requerido").oneOf(["admin", "empleado"], "Rol inválido"),
})
