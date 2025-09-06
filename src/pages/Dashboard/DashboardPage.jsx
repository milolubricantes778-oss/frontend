"use client"

import { useState } from "react"
import SearchBar from "../../components/Dashboard/SearchBar"
import SearchResults from "../../components/Dashboard/SearchResults"
import { Box, Card, CardContent } from "@mui/material"
import clientesService from "../../services/clientesService"
import vehiculosService from "../../services/vehiculosService"

const DashboardPage = () => {
  const [searchMode, setSearchMode] = useState("patente") // 'cliente' o 'patente'
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

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
    <Box sx={{ p: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
      

        <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <SearchBar onSearch={handleSearch} searchMode={searchMode} onToggleMode={handleToggleMode} />
          </CardContent>
        </Card>

        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <SearchResults results={searchResults} loading={loading} searchTerm={searchTerm} searchMode={searchMode} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default DashboardPage
