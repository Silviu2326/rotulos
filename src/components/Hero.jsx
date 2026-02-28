import React from 'react'

export default function Hero({ count, setCount }) {
  return (
    <section className="py-20 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          React + Tailwind
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Proyecto iniciado con Vite, React y Tailwind CSS. 
          Listo para desarrollar aplicaciones modernas y rápidas.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button 
            onClick={() => setCount(c => c + 1)}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-blue-500/25"
          >
            Contador: {count}
          </button>
          <button 
            onClick={() => setCount(0)}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all"
          >
            Reiniciar
          </button>
        </div>

        <div className="flex justify-center gap-4 text-sm text-gray-500">
          <span className="px-3 py-1 bg-gray-800 rounded-full">⚡ Vite</span>
          <span className="px-3 py-1 bg-gray-800 rounded-full">⚛️ React</span>
          <span className="px-3 py-1 bg-gray-800 rounded-full">🎨 Tailwind</span>
        </div>
      </div>
    </section>
  )
}
