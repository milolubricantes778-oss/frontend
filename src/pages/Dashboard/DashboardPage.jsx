"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useClientes } from "../../hooks/useClientes"
import { useVehiculos } from "../../hooks/useVehiculos"
import SearchBar from "../../components/Dashboard/SearchBar"
import SearchResults from "../../components/Dashboard/SearchResults"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Search } from "lucide-react"
import clientesService from "../../services/clientesService"
import vehiculosService from "../../services/vehiculosService"

const DashboardPage = () => {
  const { user } = useAuth()
  const [searchMode, setSearchMode] = useState("cliente") // 'cliente' o 'patente'
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  const { clientes, loadClientes, fetchClientes } = useClientes()
  const { vehiculos, loadVehiculos, fetchVehiculos } = useVehiculos()

  const handleSearch = async (term) => {
    if (!term.trim()) {
      setSearchResults([])
      setSearchTerm("")
      return
    }

    setLoading(true)
    setSearchTerm(term)

    try {
      let results = []

      if (searchMode === "cliente") {
        const clientesData = await clientesService.getClientes(1, 10, term)
        const clientesArray = clientesData?.data || clientesData || []
        results = clientesArray.map((cliente) => ({
          ...cliente,
        }))
      } else {
        const vehiculosData = await vehiculosService.getAll(1, 10, term, "")
        const vehiculosArray = vehiculosData?.data || vehiculosData || []
        console.log("[v0] Vehicle search results:", vehiculosArray)
        results = vehiculosArray
      }

      setSearchResults(results)
    } catch (error) {
      console.error("Error en búsqueda:", error)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleToggleMode = (mode) => {
    setSearchMode(mode)
    setSearchTerm("")
    setSearchResults([])
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8">
            <SearchBar onSearch={handleSearch} searchMode={searchMode} onToggleMode={handleToggleMode} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-8">
            <SearchResults results={searchResults} loading={loading} searchTerm={searchTerm} searchMode={searchMode} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
