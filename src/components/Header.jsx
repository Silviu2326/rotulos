import React from 'react'

export default function Header() {
  return (
    <header className="w-full py-4 px-6 bg-gray-800/50 backdrop-blur-md border-b border-gray-700">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-lg">
            R
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            MiProyecto
          </span>
        </div>
        <nav className="hidden md:flex gap-6">
          <a href="#" className="text-gray-300 hover:text-white transition-colors">Inicio</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">Características</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors">Acerca de</a>
        </nav>
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors font-medium">
          Empezar
        </button>
      </div>
    </header>
  )
}
