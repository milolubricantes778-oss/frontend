import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"
import "dayjs/locale/es"

import App from "./App.jsx"
import { AuthProvider } from "./contexts/AuthContext.jsx"
import "./index.css"

// Configurar dayjs para español argentino
dayjs.locale("es")

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <AuthProvider>
            <App />
          </AuthProvider>
        </LocalizationProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
