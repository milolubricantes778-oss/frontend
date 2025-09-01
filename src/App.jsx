"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import Layout from "./components/Layout/Layout"
import LoginPage from "./pages/Auth/LoginPage"
import DashboardPage from "./pages/Dashboard/DashboardPage"
import ClientesPage from "./pages/Clientes/ClientesPage"
import VehiculosPage from "./pages/Vehiculos/VehiculosPage"
import ProtectedRoute from "./components/Auth/ProtectedRoute"
import UsersManagementPage from "./pages/Auth/UsersManagementPage"
import ServiciosPage from "./pages/Servicios/ServiciosPage"
import ConfiguracionPage from "./pages/Configuracion/ConfiguracionPage"
import TiposServiciosPage from "./pages/Configuracion/TiposServiciosPage"
import ReportesPage from "./pages/Reportes/ReportesPage"
import LoadingSpinner from "./components/Common/LoadingSpinner"
import ToastContainer from "./components/Common/ToastContainer"

function App() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Cargando aplicación..." />
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="vehiculos" element={<VehiculosPage />} />
          <Route path="servicios" element={<ServiciosPage />} />
          <Route path="reportes" element={<ReportesPage />} />

          {/* Configuración */}
          <Route path="configuracion" element={<ConfiguracionPage />} />
          <Route path="configuracion/tipos-servicios" element={<TiposServiciosPage />} />
          <Route
            path="configuracion/usuarios"
            element={
              <ProtectedRoute requiredRole="admin">
                <UsersManagementPage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <ToastContainer />
    </>
  )
}

export default App
