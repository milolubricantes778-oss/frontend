"use client"

import ClienteCard from "./ClienteCard"
import VehiculoCard from "./VehiculoCard"
import { Card, CardContent } from "../ui/card"
import { Search } from "lucide-react"

const SearchResults = ({ results, loading, searchTerm, searchMode }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse w-full">
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="h-24 bg-gray-200 rounded"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!searchTerm) {
    return (
      <div className="text-center py-12">
        <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Buscar clientes o vehículos</h3>
        <p className="text-gray-500">Utiliza el buscador para encontrar información de clientes y sus vehículos</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
        <p className="text-gray-500">
          No hay resultados para "{searchTerm}" en {searchMode === "cliente" ? "clientes" : "patentes"}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Resultados de búsqueda</h2>
        <span className="text-sm text-gray-500">
          {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-6">
        {results.map((item) =>
          searchMode === "patente" ? (
            <VehiculoCard key={item.id} vehiculo={item} />
          ) : (
            <ClienteCard key={item.id} cliente={item} />
          ),
        )}
      </div>
    </div>
  )
}

export default SearchResults
