"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useSearchParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { useToast } from "../../hooks/useToast"
import { useErrorHandler } from "../../hooks/useErrorHandler"
import { useAuth } from "../../contexts/AuthContext"
import ErrorMessage from "../../components/Common/ErrorMessage"
import LoadingSpinner from "../../components/Common/LoadingSpinner"
import configuracionService from "../../services/configuracionService"
import { Settings, Building, User, Save, Mail, Phone, MapPin, FileText, Lock } from "lucide-react"

const businessSchema = yup.object({
  nombreNegocio: yup.string().required("El nombre del negocio es requerido"),
  direccion: yup.string().required("La dirección es requerida"),
  telefono: yup.string().required("El teléfono es requerido"),
  email: yup.string().email("Email inválido").required("El email es requerido"),
  cuit: yup.string().matches(/^\d{2}-\d{8}-\d{1}$/, "CUIT inválido (formato: XX-XXXXXXXX-X)"),
})

const ConfiguracionPage = () => {
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const { error, handleError, clearError } = useErrorHandler(toast)
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "business")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(businessSchema),
    defaultValues: {
      nombreNegocio: "Milo Lubricantes",
      direccion: "",
      telefono: "",
      email: "",
      cuit: "",
    },
  })

  useEffect(() => {
    cargarConfiguracion()
  }, [])

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && (tab === "business" || tab === "profile")) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const cargarConfiguracion = async () => {
    try {
      setInitialLoading(true)
      const config = await configuracionService.getConfiguracion()
      if (config) {
        Object.keys(config).forEach((key) => {
          setValue(key, config[key])
        })
      }
    } catch (error) {
      handleError(error)
    } finally {
      setInitialLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      clearError()
      await configuracionService.updateConfiguracion(data)
      toast.success("Configuración guardada", "Los cambios se han guardado exitosamente")
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <LoadingSpinner size="lg" text="Cargando configuración..." />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-[#d84315]/10 rounded-lg">
          <Settings className="h-6 w-6 text-[#d84315]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
          <p className="text-sm text-gray-500">Gestiona la información del negocio y tu perfil</p>
        </div>
      </div>

      <ErrorMessage message={error} onClose={clearError} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="business" className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span>Información del Negocio</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Mi Perfil</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="business" className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-[#d84315]" />
                  <span>Datos del Negocio</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombreNegocio" className="flex items-center space-x-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span>Nombre del Negocio</span>
                    </Label>
                    <Input
                      id="nombreNegocio"
                      {...register("nombreNegocio")}
                      className={errors.nombreNegocio ? "border-red-500" : ""}
                    />
                    {errors.nombreNegocio && <p className="text-red-500 text-sm">{errors.nombreNegocio.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cuit" className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span>CUIT</span>
                    </Label>
                    <Input
                      id="cuit"
                      placeholder="XX-XXXXXXXX-X"
                      {...register("cuit")}
                      className={errors.cuit ? "border-red-500" : ""}
                    />
                    {errors.cuit && <p className="text-red-500 text-sm">{errors.cuit.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion" className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>Dirección</span>
                  </Label>
                  <Input
                    id="direccion"
                    {...register("direccion")}
                    className={errors.direccion ? "border-red-500" : ""}
                  />
                  {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>Teléfono</span>
                    </Label>
                    <Input
                      id="telefono"
                      {...register("telefono")}
                      className={errors.telefono ? "border-red-500" : ""}
                    />
                    {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>Email</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => reset()} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-[#d84315] hover:bg-[#d84315]/90">
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Guardando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </div>
                )}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-[#d84315]" />
                <span>Mi Perfil</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>Nombre</span>
                  </Label>
                  <Input value={user?.nombre || ""} disabled className="bg-gray-50" />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>Email</span>
                  </Label>
                  <Input value={user?.email || ""} disabled className="bg-gray-50" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span>Rol</span>
                  </Label>
                  <Input
                    value={user?.role === "admin" ? "Administrador" : "Empleado"}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>Usuario</span>
                  </Label>
                  <Input value={user?.usuario || ""} disabled className="bg-gray-50" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-4">
                  Para modificar tu información personal, contacta al administrador del sistema.
                </p>
                <div className="flex space-x-4">
                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                    <Lock className="h-4 w-4" />
                    <span>Cambiar Contraseña</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ConfiguracionPage
