import { Lightbulb, Type as TypeIcon, Scroll } from "lucide-react";
import { CATEGORIAS_PRODUCTO } from "../data/constants";

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
          return (
            <button
              key={cat.id}
              className={`categoria-card ${categoria === cat.id ? "activa" : ""}`}
              onClick={() => setCategoria(cat.id)}
            >
              <Icono size={32} className="categoria-icono" />
              <h3 className="categoria-nombre">{cat.nombre}</h3>
              <p className="categoria-desc">{cat.desc}</p>
              <div className="categoria-precio">Desde {cat.precioBase}€/{cat.unidad}</div>
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
