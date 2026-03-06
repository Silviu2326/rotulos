/**
 * IlustracionProducto - Componente que muestra imágenes ilustrativas de los productos
 * Usa las imágenes locales del proyecto React (copiadas desde PHP)
 */

import React from 'react';

// Mapeo de imágenes por categoría - Rutas locales
const IMAGENES_CATEGORIA = {
  'rotulos': {
    url: '/img/rotulemos-rotulo-luminoso.webp',
    alt: 'Rótulo luminoso comercial',
    descripcion: 'Rótulos luminosos con iluminación LED integrada'
  },
  'letras-neon': {
    url: '/img/rotulo-de-neon-.webp',
    alt: 'Letras neón LED',
    descripcion: 'Letras neón flexibles LED de alta luminosidad'
  },
  'letras-corporeas': {
    url: '/img/letras-retroiluminadas.webp',
    alt: 'Letras corpóreas 3D',
    descripcion: 'Letras corpóreas con volumen y relieve'
  },
  'lonas-pancartas': {
    url: '/img/lonas-y-pancartas-publicitarias-comprar.webp',
    alt: 'Lonas y pancartas',
    descripcion: 'Lonas publicitarias de gran formato'
  },
  'vinilos': {
    url: '/img/vinilo-miccroperforado.webp',
    alt: 'Vinilos adhesivos',
    descripcion: 'Vinilos de corte e impresión para escaparates'
  },
  'banderolas': {
    url: '/img/banderola-luminosa.webp',
    alt: 'Banderolas',
    descripcion: 'Banderolas comerciales luminosas'
  },
  'rigidos-impresos': {
    url: '/img/PVC-FOREX.webp',
    alt: 'Rígidos impresos',
    descripcion: 'Paneles rígidos PVC/Dibond impresos'
  },
  'rollup': {
    url: '/img/ROLL-UP-DISPLAY.webp',
    alt: 'Roll up display',
    descripcion: 'Displays portátiles enrollables'
  },
  'photocall': {
    url: '/img/photocall-pop-up.webp',
    alt: 'Photocall',
    descripcion: 'Photocalls para eventos y ferias'
  },
  'carteles-inmobiliarios': {
    url: '/img/carteles-inmobiliaria.webp',
    alt: 'Carteles inmobiliarios',
    descripcion: 'Carteles específicos para inmobiliarias'
  },
  'mupis': {
    url: '/img/mupi-publicitario.webp',
    alt: 'Mupis publicitarios',
    descripcion: 'Mupis urbanos de gran formato'
  },
  'flybanner': {
    url: '/img/fly-banneer.webp',
    alt: 'Fly banners',
    descripcion: 'Banderas publicitarias tipo vela'
  }
};

// Imágenes específicas por tipo de corpórea
const IMAGENES_CORPOREAS = {
  'aluminio-sin-luz': {
    url: '/img/letras-corporeas-de-aluminio.jpg',
    titulo: 'Aluminio sin luz',
    descripcion: 'Letras metálicas sin iluminación'
  },
  'pvc': {
    url: '/img/letras-corporeas-pvc-rotulemos.webp',
    titulo: 'PVC sin luz',
    descripcion: 'PVC espumado económico'
  },
  'aluminio-con-luz': {
    url: '/img/letras-corporeas-con-luz-led-.webp',
    titulo: 'Aluminio con luz',
    descripcion: 'Aluminio iluminado frontalmente'
  },
  'pvc-retroiluminadas': {
    url: '/img/letras-retroiluminadas.webp',
    titulo: 'PVC retroiluminado',
    descripcion: 'PVC con iluminación trasera'
  },
  'metacrilato': {
    url: '/img/letras-3d-en-metaccrilato.webp',
    titulo: 'Metacrilato',
    descripcion: 'Acabado brillante premium'
  },
  'pvc-impreso-uv': {
    url: '/img/letras-PVC-impresas.webp',
    titulo: 'PVC impreso UV',
    descripcion: 'Con impresión digital directa'
  },
  'aluminio-retroiluminada': {
    url: '/img/letras-retroiluminadas.webp',
    titulo: 'Aluminio retroiluminado',
    descripcion: 'Efecto halo de luz'
  },
  'dibond-sin-relieve': {
    url: '/img/letrras-corporeas-de-aluminio-dibond.webp',
    titulo: 'Dibond plano',
    descripcion: 'Composite plano sin volumen'
  }
};

// Imágenes por material láser
const IMAGENES_LASER = {
  'transparente': '/img/METACRILATO-TRANSPARENTE.jpg',
  'opaco': '/img/METACRILATO-BLANCO-OPAL.jpg',
  'espejo-plata': '/img/PLATA-ESPEJO.webp',
  'espejo-oro': '/img/DIBOND-ORO-ESPEJO.webp',
  'madera': '/img/LETRAS-MADERA.webp',
  'mdf': '/img/MDF.png'
};

// Iconos/Imágenes de tipos de negocio para lonas
const IMAGENES_LONA_NEGOCIO = {
  'restaurante': '/img/restaurante.png',
  'bar': '/img/bar.png',
  'cafeteria': '/img/cafeteria.png',
  'tienda-ropa': '/img/tienda-ropa.png',
  'peluqueria': '/img/peluqueria.png',
  'gimnasio': '/img/gimnasio.png',
  'tienda-alimentacion': '/img/panaderia.png',
  'ferreteria': '/img/ferreteria.png',
  'tienda-mascotas': '/img/veterinaria.png',
  'clinica-dental': '/img/clinica-dental.png',
  'farmacia': '/img/farmacia.png',
  'tienda-moviles': '/img/comercio.png',
  'floristeria': '/img/floristeria.png',
  'taller-mecanico': '/img/taller-mecanico.png',
  'inmobiliaria': '/img/inmobiliaria.png',
  'general': '/img/comercio.png'
};

// Iconos emoji como fallback
const ICONOS_NEGOCIO = {
  'restaurante': '🍽️',
  'bar': '🍻',
  'cafeteria': '☕',
  'tienda-ropa': '👕',
  'peluqueria': '💇',
  'gimnasio': '💪',
  'tienda-alimentacion': '🥬',
  'ferreteria': '🔧',
  'tienda-mascotas': '🐾',
  'clinica-dental': '🦷',
  'farmacia': '💊',
  'tienda-moviles': '📱',
  'floristeria': '🌸',
  'taller-mecanico': '🔧',
  'inmobiliaria': '🏠',
  'general': '🏪'
};

const NOMBRES_NEGOCIO = {
  'restaurante': 'Restaurante',
  'bar': 'Bar',
  'cafeteria': 'Cafetería',
  'tienda-ropa': 'Tienda ropa',
  'peluqueria': 'Peluquería',
  'gimnasio': 'Gimnasio',
  'tienda-alimentacion': 'Alimentación',
  'ferreteria': 'Ferretería',
  'tienda-mascotas': 'Mascotas',
  'clinica-dental': 'Dental',
  'farmacia': 'Farmacia',
  'tienda-moviles': 'Móviles',
  'floristeria': 'Floristería',
  'taller-mecanico': 'Mecánico',
  'inmobiliaria': 'Inmobiliaria',
  'general': 'General'
};

/**
 * Componente de ilustración principal de categoría
 */
export function IlustracionCategoria({ categoria, className = '' }) {
  const imagen = IMAGENES_CATEGORIA[categoria];
  
  if (!imagen) return null;
  
  return (
    <div className={`ilustracion-categoria ${className}`}>
      <img 
        src={imagen.url} 
        alt={imagen.alt}
        className="w-full h-48 object-cover rounded-lg shadow-md"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
      <p className="text-sm text-gray-600 mt-2 text-center">{imagen.descripcion}</p>
    </div>
  );
}

/**
 * Galería de tipos de corpóreas
 */
export function GaleriaCorporeas({ tipoSeleccionado, onSelect }) {
  return (
    <div className="galeria-corporeas grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      {Object.entries(IMAGENES_CORPOREAS).map(([key, data]) => (
        <div 
          key={key}
          className={`tipo-corporea cursor-pointer transition-all duration-200 rounded-lg overflow-hidden border-2 ${
            tipoSeleccionado === key 
              ? 'border-purple-600 ring-2 ring-purple-200' 
              : 'border-gray-200 hover:border-purple-300'
          }`}
          onClick={() => onSelect?.(key)}
        >
          <img 
            src={data.url} 
            alt={data.titulo}
            className="w-full h-32 object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="p-2 bg-white">
            <p className="text-xs font-semibold text-gray-800">{data.titulo}</p>
            <p className="text-[10px] text-gray-500">{data.descripcion}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Muestra muestras de colores LED
 */
export function MuestrasColorLED({ colorSeleccionado, onSelect }) {
  const colores = [
    { key: 'blanco-frio', nombre: 'Blanco frío', hex: '#F0F8FF' },
    { key: 'blanco-calido', nombre: 'Blanco cálido', hex: '#FFF8DC' },
    { key: 'blanco-neutro', nombre: 'Blanco neutro', hex: '#FFFAF0' },
    { key: 'rojo', nombre: 'Rojo', hex: '#FF0000' },
    { key: 'azul', nombre: 'Azul', hex: '#0000FF' },
    { key: 'verde', nombre: 'Verde', hex: '#00FF00' },
    { key: 'amarillo', nombre: 'Amarillo', hex: '#FFFF00' },
    { key: 'rosa', nombre: 'Rosa', hex: '#FF69B4' },
    { key: 'morado', nombre: 'Morado', hex: '#9400D3' },
    { key: 'rgb', nombre: 'RGB', hex: 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff)' }
  ];

  return (
    <div className="muestras-led grid grid-cols-5 md:grid-cols-10 gap-2 mt-3">
      {colores.map((color) => (
        <button
          key={color.key}
          className={`muestra-led w-full aspect-square rounded-full border-2 transition-all ${
            colorSeleccionado === color.key 
              ? 'border-purple-600 scale-110 ring-2 ring-purple-200' 
              : 'border-gray-300 hover:border-purple-400'
          }`}
          style={{ 
            background: color.hex,
            boxShadow: color.key !== 'rgb' ? `0 0 10px ${color.hex}40` : '0 0 10px rgba(255,0,0,0.3)'
          }}
          title={color.nombre}
          onClick={() => onSelect?.(color.key)}
        >
          <span className="sr-only">{color.nombre}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Muestra imágenes de materiales láser
 */
export function MuestrasMaterialLaser({ materialSeleccionado, onSelect }) {
  const materiales = [
    { key: 'transparente', nombre: 'Metacrilato transparente', url: IMAGENES_LASER['transparente'] },
    { key: 'opaco', nombre: 'Metacrilato opaco', url: IMAGENES_LASER['opaco'] },
    { key: 'espejo-plata', nombre: 'Espejo plata', url: IMAGENES_LASER['espejo-plata'] },
    { key: 'espejo-oro', nombre: 'Espejo oro', url: IMAGENES_LASER['espejo-oro'] },
    { key: 'madera', nombre: 'Madera', url: IMAGENES_LASER['madera'] },
    { key: 'mdf', nombre: 'MDF pintado', url: IMAGENES_LASER['mdf'] }
  ];

  return (
    <div className="muestras-laser grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
      {materiales.map((mat) => (
        <div
          key={mat.key}
          className={`material-laser cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
            materialSeleccionado === mat.key 
              ? 'border-purple-600 ring-2 ring-purple-200' 
              : 'border-gray-200 hover:border-purple-300'
          }`}
          onClick={() => onSelect?.(mat.key)}
        >
          <img 
            src={mat.url} 
            alt={mat.nombre}
            className="w-full h-24 object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden h-24 bg-gray-100 items-center justify-center text-gray-400 text-xs">
            {mat.nombre}
          </div>
          <div className="p-2 bg-white">
            <p className="text-xs font-medium text-gray-800">{mat.nombre}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Iconos de tipos de negocio para lonas
 */
export function IconosNegocioLona({ tipoSeleccionado, onSelect }) {
  const negocios = Object.keys(ICONOS_NEGOCIO);

  return (
    <div className="iconos-negocio grid grid-cols-4 md:grid-cols-8 gap-2 mt-3">
      {negocios.map((key) => (
        <button
          key={key}
          className={`negocio-btn flex flex-col items-center p-2 rounded-lg border-2 transition-all ${
            tipoSeleccionado === key 
              ? 'border-purple-600 bg-purple-50' 
              : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
          }`}
          onClick={() => onSelect?.(key)}
          title={NOMBRES_NEGOCIO[key]}
        >
          <span className="text-2xl mb-1">{ICONOS_NEGOCIO[key]}</span>
          <span className="text-[10px] text-gray-600 text-center leading-tight">{NOMBRES_NEGOCIO[key]}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * Banner informativo con imagen de ejemplo
 */
export function BannerEjemplo({ categoria, titulo, children }) {
  const imagen = IMAGENES_CATEGORIA[categoria];
  
  return (
    <div className="banner-ejemplo bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 md:p-6 mt-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {imagen && (
          <div className="w-full md:w-1/3">
            <img 
              src={imagen.url} 
              alt={imagen.alt}
              className="w-full h-40 object-cover rounded-lg shadow-md"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{titulo}</h3>
          <div className="text-sm text-gray-600">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default {
  IlustracionCategoria,
  GaleriaCorporeas,
  MuestrasColorLED,
  MuestrasMaterialLaser,
  IconosNegocioLona,
  BannerEjemplo,
  IMAGENES_CATEGORIA,
  IMAGENES_CORPOREAS,
  IMAGENES_LASER,
  IMAGENES_LONA_NEGOCIO
};
