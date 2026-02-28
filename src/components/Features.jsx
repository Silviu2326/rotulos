import React from 'react'

const features = [
  {
    icon: '⚡',
    title: 'Rápido',
    description: 'Desarrollo ultrarrápido con Hot Module Replacement (HMR) gracias a Vite.'
  },
  {
    icon: '🎨',
    title: 'Estilizado',
    description: 'Diseños hermosos y responsivos con utilidades de Tailwind CSS.'
  },
  {
    icon: '⚛️',
    title: 'Moderno',
    description: 'React 18 con las últimas características como Concurrent Features.'
  },
  {
    icon: '📦',
    title: 'Listo para producción',
    description: 'Build optimizado y configurado para desplegar en cualquier lugar.'
  }
]

export default function Features() {
  return (
    <section className="py-16 px-6 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Características</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 bg-gray-800 rounded-2xl hover:bg-gray-750 transition-colors border border-gray-700 hover:border-gray-600"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
