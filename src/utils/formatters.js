// Utilidades para formateo de datos

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (date) => {
  if (!date) return ""
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

export const formatDateTime = (date) => {
  if (!date) return ""
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export const formatPhone = (phone) => {
  if (!phone) return ""
  // Formato argentino: +54 11 1234-5678
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

export const formatDNI = (dni) => {
  if (!dni) return ""
  // Formato: 12.345.678
  const cleaned = dni.toString().replace(/\D/g, "")
  return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}
