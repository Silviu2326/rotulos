import React from 'react'

export default function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-gray-800">
      <div className="max-w-6xl mx-auto text-center text-gray-500">
        <p>
          Creado con{' '}
          <span className="text-blue-400">♥</span>
          {' '}usando React + Tailwind CSS
        </p>
        <p className="text-sm mt-2">
          © {new Date().getFullYear()} MiProyecto. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
