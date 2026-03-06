import { Lightbulb, Type as TypeIcon, Scroll } from "lucide-react";
import { CATEGORIAS_PRODUCTO } from "../data/constants";

// Mapeo de imágenes para cada categoría
const TYPE_IMAGES = {
  'rotulos': '/img/rotulemos-rotulo-luminoso.webp',
  'letras-neon': '/img/rotulo-de-neon-.webp',
  'letras-corporeas': '/img/letras-retroiluminadas.webp',
  'lonas-pancartas': '/img/lonas-y-pancartas-publicitarias-comprar.webp',
  'vinilos': '/img/vinilo-miccroperforado.webp',
  'banderolas': '/img/banderola-luminosa.webp',
  'rigidos-impresos': '/img/PVC-FOREX.webp',
  'rollup': '/img/ROLL-UP-DISPLAY.jpg',
  'photocall': '/img/photocall-pop-up.jpg',
  'carteles-inmobiliarios': '/img/carteles-inmobiliaria.webp',
  'mupis': '/img/mupi-publicitario.webp',
  'flybanner': '/img/fly-banneer.webp'
};

export const Paso1Producto = ({ 
  categoria, 
  setCategoria, 
  errores 
}) => {
  return (
    <div className="paso-contenido">
      <h2 className="paso-titulo">Paso 1: Tipo de Producto</h2>
      <p className="paso-descripcion">Elige la categoría de rótulo que mejor se adapte a tu negocio</p>

      <div className="grid-categorias">
        {CATEGORIAS_PRODUCTO.map((cat) => {
          const Icono = cat.icono;
          const imageUrl = TYPE_IMAGES[cat.id];
          return (
            <button
              key={cat.id}
              className={`categoria-card ${categoria === cat.id ? "activa" : ""}`}
              onClick={() => setCategoria(cat.id)}
            >
              {/* Imagen del producto */}
              <div className="categoria-imagen">
                <img 
                  src={imageUrl} 
                  alt={cat.nombre}
                  onError={(e) => {
                    // Si falla la imagen, mostrar el icono
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="categoria-icono-fallback" style={{ display: 'none' }}>
                  <Icono size={32} />
                </div>
              </div>
              <h3 className="categoria-nombre">{cat.nombre}</h3>
              <p className="categoria-desc">{cat.desc}</p>
            </button>
          );
        })}
      </div>

      {errores.categoria && <span className="error-mensaje">{errores.categoria}</span>}

      {categoria === "letras-neon" && (
        <div className="pista-contextual info">
          <Lightbulb size={20} />
          <p><strong>Neón LED:</strong> Neones realistas con tubos de vidrio brillantes. El texto se genera en UNA SOLA LÍNEA horizontal.</p>
        </div>
      )}

      {categoria === "letras-corporeas" && (
        <div className="pista-contextual info">
          <TypeIcon size={20} />
          <p><strong>Letras Corpóreas 3D:</strong> Letras con volumen real. Usa "Quitar fondo" para mejor integración en fachadas.</p>
        </div>
      )}

      {categoria === "lonas-pancartas" && (
        <div className="pista-contextual info">
          <Scroll size={20} />
          <p><strong>Lonas y Pancartas:</strong> Ideal para eventos y promociones. Incluye ojales y refuerzos.</p>
        </div>
      )}
    </div>
  );
};
