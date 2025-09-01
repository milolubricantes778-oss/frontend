const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
}

class Logger {
  constructor() {
    this.level = import.meta.env.PROD ? LOG_LEVELS.ERROR : LOG_LEVELS.DEBUG
    this.serviceName = "lubricentro-frontend"
  }

  _log(level, message, data = null) {
    if (level > this.level) return

    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level: Object.keys(LOG_LEVELS)[level],
      service: this.serviceName,
      message,
      ...(data && { data }),
    }

    // En desarrollo, usar console para debugging
    if (!import.meta.env.PROD) {
      const method = level === LOG_LEVELS.ERROR ? "error" : level === LOG_LEVELS.WARN ? "warn" : "log"
      console[method](`[${logEntry.level}] ${message}`, data || "")
    }

    // En producción, enviar a servicio de logging (futuro)
    if (import.meta.env.PROD && level <= LOG_LEVELS.WARN) {
      // TODO: Integrar con servicio de logging externo (Sentry, LogRocket, etc.)
      this._sendToExternalService(logEntry)
    }
  }

  _sendToExternalService(logEntry) {
    // Placeholder para integración futura con servicio de logging
    // fetch('/api/logs', { method: 'POST', body: JSON.stringify(logEntry) })
  }

  error(message, data = null) {
    this._log(LOG_LEVELS.ERROR, message, data)
  }

  warn(message, data = null) {
    this._log(LOG_LEVELS.WARN, message, data)
  }

  info(message, data = null) {
    this._log(LOG_LEVELS.INFO, message, data)
  }

  debug(message, data = null) {
    this._log(LOG_LEVELS.DEBUG, message, data)
  }
}

export const logger = new Logger()
export default logger
