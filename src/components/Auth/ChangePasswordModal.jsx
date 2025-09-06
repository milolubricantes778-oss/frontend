"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
} from "@mui/material"
import { Visibility, VisibilityOff, Lock, CheckCircle, Close } from "@mui/icons-material"

const ChangePasswordModal = ({ open, onClose }) => {
  const { changePassword } = useAuth()
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (formData.newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres")
      return
    }

    try {
      setLoading(true)
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      }, 2000)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleClose = () => {
    onClose()
    setError("")
    setSuccess(false)
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #d84315 0%, #ff6f47 100%)",
          color: "white",
          p: 3,
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                background: "rgba(255, 255, 255, 0.2)",
                mr: 2,
                width: 48,
                height: 48,
              }}
            >
              <Lock sx={{ color: "white" }} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 0.5 }}>
                Cambiar Contraseña
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Actualiza tu contraseña de acceso
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        {success ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Avatar
              sx={{
                background: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)",
                width: 64,
                height: 64,
                mx: "auto",
                mb: 2,
              }}
            >
              <CheckCircle sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#4caf50" }}>
              ¡Contraseña cambiada exitosamente!
            </Typography>
            <Typography variant="body2" color="textSecondary">
              La ventana se cerrará automáticamente...
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" onClose={() => setError("")} sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Contraseña Actual"
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => togglePasswordVisibility("current")} edge="end">
                        {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#d84315",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#d84315",
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Nueva Contraseña"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                required
                helperText="Mínimo 6 caracteres"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => togglePasswordVisibility("new")} edge="end">
                        {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#d84315",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#d84315",
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Confirmar Nueva Contraseña"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => togglePasswordVisibility("confirm")} edge="end">
                        {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: "#d84315",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#d84315",
                  },
                }}
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={loading}
                sx={{
                  borderColor: "#171717",
                  color: "#171717",
                  "&:hover": {
                    borderColor: "#171717",
                    backgroundColor: "rgba(23, 23, 23, 0.04)",
                  },
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Lock />}
                sx={{
                  backgroundColor: "#d84315",
                  "&:hover": {
                    backgroundColor: "rgba(216, 67, 21, 0.9)",
                  },
                  borderRadius: 2,
                  minWidth: 160,
                }}
              >
                {loading ? "Cambiando..." : "Cambiar Contraseña"}
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ChangePasswordModal
