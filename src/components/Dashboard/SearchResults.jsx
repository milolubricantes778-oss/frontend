"use client"

import ClienteCard from "./ClienteCard"
import VehiculoCard from "./VehiculoCard"
import { Box, Typography, Card, CardContent, Skeleton, Stack } from "@mui/material"
import { Search } from "lucide-react"

const SearchResults = ({ results, loading, searchTerm, searchMode }) => {
  if (loading) {
    return (
      <Stack spacing={3}>
        {[...Array(3)].map((_, i) => (
          <Card key={i} elevation={1} sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Skeleton variant="text" width="25%" height={32} />
                <Skeleton variant="text" width="35%" height={24} />
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2, mt: 2 }}>
                  <Skeleton variant="rectangular" height={96} sx={{ borderRadius: 1 }} />
                  <Skeleton variant="rectangular" height={96} sx={{ borderRadius: 1 }} />
                  <Skeleton variant="rectangular" height={96} sx={{ borderRadius: 1 }} />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    )
  }

  if (!searchTerm) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Search style={{ fontSize: "3rem", color: "#ccc", marginBottom: "16px" }} />
        <Typography variant="h6" sx={{ color: "#171717", mb: 1, fontWeight: "medium" }}>
          Buscar clientes o vehículos
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          Utiliza el buscador para encontrar información de clientes y sus vehículos
        </Typography>
      </Box>
    )
  }

  if (results.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Search style={{ fontSize: "3rem", color: "#ccc", marginBottom: "16px" }} />
        <Typography variant="h6" sx={{ color: "#171717", mb: 1, fontWeight: "medium" }}>
          No se encontraron resultados
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          No hay resultados para "{searchTerm}" en {searchMode === "cliente" ? "clientes" : "patentes"}
        </Typography>
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" sx={{ color: "#171717", fontWeight: "medium" }}>
          Resultados de búsqueda
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      <Stack spacing={3}>
        {results.map((item) =>
          searchMode === "patente" ? (
            <VehiculoCard key={item.id} vehiculo={item} />
          ) : (
            <ClienteCard key={item.id} cliente={item} />
          ),
        )}
      </Stack>
    </Box>
  )
}

export default SearchResults
