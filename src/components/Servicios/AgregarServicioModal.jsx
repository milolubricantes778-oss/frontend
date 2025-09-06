"use client"

import { useState, useEffect, useRef } from "react"
import {
  Dialog,
  DialogContent,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Paper,
  Portal,
} from "@mui/material"
import {
  Add as AddIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Inventory as InventoryIcon,
  Close as CloseIcon,
  Search as SearchIcon,
} from "@mui/icons-material"

const AgregarServicioModal = ({ isOpen, onClose, onAddItem, tiposServicios = [] }) => {
  const [currentItem, setCurrentItem] = useState({
    tipoServicioId: null,
    tipoServicioNombre: "",
    observaciones: "",
    notas: "",
    productos: [],
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [filteredTipos, setFilteredTipos] = useState([])
  const [showTiposList, setShowTiposList] = useState(false)
  const [newProducto, setNewProducto] = useState("")
  const [selectedTipoServicio, setSelectedTipoServicio] = useState(null)

  const searchFieldRef = useRef(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  useEffect(() => {
    if (searchTerm && !selectedTipoServicio) {
      const filtered = tiposServicios.filter((tipo) => tipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredTipos(filtered)
      setShowTiposList(true)

      if (searchFieldRef.current) {
        const rect = searchFieldRef.current.getBoundingClientRect()
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
        })
      }
    } else {
      setFilteredTipos([])
      setShowTiposList(false)
    }
  }, [searchTerm, tiposServicios, selectedTipoServicio])

  const handleSelectTipoServicio = (tipo) => {
    setSelectedTipoServicio(tipo)
    setCurrentItem((prev) => ({
      ...prev,
      tipoServicioId: tipo.id,
      tipoServicioNombre: tipo.nombre,
    }))
    setSearchTerm("")
    setFilteredTipos([])
    setShowTiposList(false)
  }

  const handleClearTipoServicio = () => {
    setSelectedTipoServicio(null)
    setCurrentItem((prev) => ({
      ...prev,
      tipoServicioId: null,
      tipoServicioNombre: "",
    }))
    setSearchTerm("")
  }

  const handleAddProducto = () => {
    if (newProducto.trim()) {
      setCurrentItem((prev) => ({
        ...prev,
        productos: [
          ...prev.productos,
          {
            id: Date.now(),
            nombre: newProducto.trim(),
            es_nuestro: true,
          },
        ],
      }))
      setNewProducto("")
    }
  }

  const handleRemoveProducto = (productoId) => {
    setCurrentItem((prev) => ({
      ...prev,
      productos: prev.productos.filter((p) => p.id !== productoId),
    }))
  }

  const handleToggleProductoOrigen = (productoId) => {
    setCurrentItem((prev) => ({
      ...prev,
      productos: prev.productos.map((p) => (p.id === productoId ? { ...p, es_nuestro: !p.es_nuestro } : p)),
    }))
  }

  const handleAddItem = () => {
    if (currentItem.tipoServicioId) {
      const newItem = {
        ...currentItem,
        id: Date.now(),
      }

      onAddItem(newItem)
      handleClose()
    }
  }

  const handleClose = () => {
    setCurrentItem({
      tipoServicioId: null,
      tipoServicioNombre: "",
      observaciones: "",
      notas: "",
      productos: [],
    })
    setSearchTerm("")
    setNewProducto("")
    setShowTiposList(false)
    setSelectedTipoServicio(null)
    onClose()
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && newProducto.trim()) {
      e.preventDefault()
      handleAddProducto()
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          bgcolor: "#d84315",
          color: "white",
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 40, height: 40 }}>
            <AddIcon sx={{ color: "white" }} />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Agregar Nuevo Servicio
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Completa la información del servicio que realizarás
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: "white", "&:hover": { bgcolor: "rgba(255,255,255,0.1)" } }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 3,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card sx={{ border: "1px solid #e0e0e0" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Avatar sx={{ bgcolor: "#d84315", width: 32, height: 32 }}>
                  <BuildIcon sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#171717" }}>
                  Tipo de Servicio *
                </Typography>
              </Box>

              {!selectedTipoServicio ? (
                <TextField
                  ref={searchFieldRef}
                  fullWidth
                  placeholder="Buscar tipo de servicio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: "#d84315" },
                      "&.Mui-focused fieldset": { borderColor: "#d84315" },
                    },
                  }}
                />
              ) : (
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "#f8f9fa",
                    border: "2px solid #d84315",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <BuildIcon sx={{ color: "#d84315", fontSize: 20 }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold", color: "#171717" }}>
                      {selectedTipoServicio.nombre}
                    </Typography>
                    {selectedTipoServicio.descripcion && (
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {selectedTipoServicio.descripcion}
                      </Typography>
                    )}
                  </Box>
                  <IconButton
                    onClick={handleClearTipoServicio}
                    size="small"
                    sx={{
                      color: "#d84315",
                      "&:hover": { bgcolor: "rgba(216, 67, 21, 0.1)" },
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Paper>
              )}
            </CardContent>
          </Card>

          {currentItem.tipoServicioId && (
            <Card sx={{ border: "1px solid #e0e0e0" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Avatar sx={{ bgcolor: "#d84315", width: 32, height: 32 }}>
                    <InventoryIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#171717" }}>
                    Productos Utilizados
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    placeholder="Ej: Aceite Motul 5W30, Filtro de aceite..."
                    value={newProducto}
                    onChange={(e) => setNewProducto(e.target.value)}
                    onKeyPress={handleKeyPress}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#d84315" },
                        "&.Mui-focused fieldset": { borderColor: "#d84315" },
                      },
                    }}
                  />
                  <Button
                    onClick={handleAddProducto}
                    disabled={!newProducto.trim()}
                    variant="contained"
                    sx={{
                      bgcolor: "#d84315",
                      "&:hover": { bgcolor: "#bf360c" },
                      minWidth: "auto",
                      px: 2,
                    }}
                  >
                    <AddIcon />
                  </Button>
                </Box>

                {currentItem.productos.length > 0 && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {currentItem.productos.map((producto) => (
                      <Paper
                        key={producto.id}
                        sx={{
                          p: 2,
                          bgcolor: "#f5f5f5",
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <InventoryIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                        <Typography variant="body2" sx={{ flex: 1, fontWeight: "medium" }}>
                          {producto.nombre}
                        </Typography>

                        <FormControlLabel
                          control={
                            <Switch
                              checked={producto.es_nuestro}
                              onChange={() => handleToggleProductoOrigen(producto.id)}
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": { color: "#d84315" },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#d84315" },
                              }}
                            />
                          }
                          label={
                            <Typography variant="caption">{producto.es_nuestro ? "Nuestro" : "Del cliente"}</Typography>
                          }
                          sx={{ mr: 1 }}
                        />

                        <IconButton
                          onClick={() => handleRemoveProducto(producto.id)}
                          size="small"
                          sx={{ color: "error.main", "&:hover": { bgcolor: "error.light", color: "white" } }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Paper>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ border: "1px solid #e0e0e0", height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#2196f3" }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#171717" }}>
                      Observaciones
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Observaciones específicas del cliente o del vehículo..."
                    value={currentItem.observaciones}
                    onChange={(e) => setCurrentItem((prev) => ({ ...prev, observaciones: e.target.value }))}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#d84315" },
                        "&.Mui-focused fieldset": { borderColor: "#d84315" },
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ border: "1px solid #e0e0e0", height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#4caf50" }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#171717" }}>
                      Notas Internas
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Notas para el equipo técnico, recordatorios..."
                    value={currentItem.notas}
                    onChange={(e) => setCurrentItem((prev) => ({ ...prev, notas: e.target.value }))}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: "#d84315" },
                        "&.Mui-focused fieldset": { borderColor: "#d84315" },
                      },
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {currentItem.tipoServicioId && (
            <Card
              sx={{
                background: "linear-gradient(135deg, rgba(216, 67, 21, 0.05) 0%, rgba(216, 67, 21, 0.1) 100%)",
                border: "1px solid rgba(216, 67, 21, 0.2)",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <CheckCircleIcon sx={{ color: "#d84315", fontSize: 18 }} />
                  <Typography variant="subtitle2" sx={{ color: "#d84315", fontWeight: "bold" }}>
                    Vista Previa del Servicio
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {currentItem.tipoServicioNombre && (
                    <Typography variant="body2">
                      <strong>Tipo:</strong> {currentItem.tipoServicioNombre}
                    </Typography>
                  )}
                  {currentItem.productos.length > 0 && (
                    <Typography variant="body2">
                      <strong>Productos:</strong> {currentItem.productos.length} item(s)
                    </Typography>
                  )}

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                    {currentItem.observaciones && (
                      <Chip
                        label={`Obs: ${currentItem.observaciones.substring(0, 30)}...`}
                        size="small"
                        sx={{ bgcolor: "#f5f5f5" }}
                      />
                    )}
                    {currentItem.notas && (
                      <Chip label={`Notas: ${currentItem.notas.substring(0, 30)}...`} size="small" variant="outlined" />
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </DialogContent>

      {showTiposList && filteredTipos.length > 0 && !selectedTipoServicio && (
        <Portal>
          <Paper
            sx={{
              position: "fixed",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 1500,
              maxHeight: 200,
              overflow: "auto",
              border: "1px solid #e0e0e0",
              boxShadow: "0 8px 16px -4px rgba(0, 0, 0, 0.2), 0 4px 8px -2px rgba(0, 0, 0, 0.1)",
            }}
          >
            <List disablePadding>
              {filteredTipos.map((tipo, index) => (
                <ListItem key={tipo.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleSelectTipoServicio(tipo)}
                    sx={{
                      borderBottom: index < filteredTipos.length - 1 ? "1px solid #f0f0f0" : "none",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: "#d84315",
                          flexShrink: 0,
                        }}
                      />
                      <ListItemText
                        primary={tipo.nombre}
                        secondary={tipo.descripcion}
                        primaryTypographyProps={{ fontWeight: "medium" }}
                      />
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Portal>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          p: 3,
          borderTop: "1px solid #e0e0e0",
          flexShrink: 0,
        }}
      >
        <Button onClick={handleClose} variant="outlined" sx={{ color: "#666", borderColor: "#ddd" }}>
          Cancelar
        </Button>
        <Button
          onClick={handleAddItem}
          disabled={!currentItem.tipoServicioId}
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: "#d84315",
            "&:hover": { bgcolor: "#bf360c" },
            "&:disabled": { bgcolor: "#ccc" },
          }}
        >
          Agregar Servicio
        </Button>
      </Box>
    </Dialog>
  )
}

export default AgregarServicioModal
