"use client"

import { useState } from "react"
import { Box, Typography, TextField, Button, ToggleButton, ToggleButtonGroup, InputAdornment, Grid } from "@mui/material"
import { Search, Car, User } from "lucide-react"

const SearchBar = ({ onSearch, searchMode, onToggleMode }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      onToggleMode(newMode)
    }
  }

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto" }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#171717",
          mb: 1,
          textAlign: "center"
        }}
      >
        Buscar por
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <ToggleButtonGroup
          value={searchMode}
          exclusive
          onChange={handleModeChange}
          sx={{
            "& .MuiToggleButton-root": {
              borderRadius: 2,
              px: 3,
              py: 1,
              border: "1px solid #e0e0e0",
              "&.Mui-selected": {
                backgroundColor: "#d84315",
                color: "white",
                "&:hover": {
                  backgroundColor: "#bf360c",
                },
              },
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            },
          }}
        >
          <ToggleButton value="patente">
            <Car style={{ marginRight: "8px", fontSize: "1rem" }} />
            Por Patente
          </ToggleButton>
          <ToggleButton value="cliente">
            <User style={{ marginRight: "8px", fontSize: "1rem" }} />
            Por Cliente
          </ToggleButton>

        </ToggleButtonGroup>
      </Box>

      <Box component="form" onSubmit={handleSearch}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={searchMode === "cliente" ? "Buscar por nombre..." : "Buscar por patente..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search style={{ color: "#666", fontSize: "1.2rem" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#d84315",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#d84315",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              startIcon={<Search />}
              sx={{
                backgroundColor: "#d84315",
                color: "white",
                py: 1.5,
                borderRadius: 2,
                fontWeight: "medium",
                "&:hover": {
                  backgroundColor: "#bf360c",
                },
              }}
            >
              Buscar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default SearchBar
