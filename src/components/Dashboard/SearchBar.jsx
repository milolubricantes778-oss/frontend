"use client"

import { useState } from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Search, Car, User } from "lucide-react"

const SearchBar = ({ onSearch, searchMode, onToggleMode }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 px-4">
      {/* Toggle de modo de búsqueda */}
      <div className="flex items-center justify-center">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => onToggleMode("cliente")}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all ${
              searchMode === "cliente" ? "bg-white text-[#d84315] shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Por Cliente</span>
            <span className="sm:hidden">Cliente</span>
          </button>
          <button
            onClick={() => onToggleMode("patente")}
            className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all ${
              searchMode === "patente" ? "bg-white text-[#d84315] shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Car className="h-4 w-4" />
            <span className="hidden sm:inline">Por Patente</span>
            <span className="sm:hidden">Patente</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="w-full">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Input
              type="text"
              placeholder={searchMode === "cliente" ? "Buscar por nombre..." : "Buscar por patente..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base border-gray-200 focus:border-[#d84315] focus:ring-[#d84315] w-full min-w-0"
            />
          </div>
          <div className="flex-shrink-0">
            <Button
              type="submit"
              className="h-12 px-4 sm:px-6 bg-[#d84315] hover:bg-[#bf360c] text-white whitespace-nowrap w-full sm:w-auto"
            >
              <Search className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Buscar</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SearchBar
