import { Sparkles, Ruler } from "lucide-react";
import { TIPOS_LETRAS_CORPOREAS, COLORES_LUZ_LED, CATEGORIAS_PRODUCTO } from "../data/constants";

export const Paso4Descripcion = ({
  categoria,
  tipoLetraCorporea,
  colorLuzLed,
  descripcionDiseño,
  setDescripcionDiseño,
  descripcionMejorada,
  setDescripcionMejorada,
  tamanoAncho,
  setTamanoAncho,
  tamanoAlto,
  setTamanoAlto,
}) => {
  const mejorarDescripcionConIA = () => {
    if (!descripcionDiseño.trim()) return;
    const mejoras = [
      "Diseño elegante con tipografía moderna y colores vibrantes",
      "Estilo profesional con acabados premium",
      "Diseño atractivo con elementos visuales llamativos",
      "Estilo minimalista con líneas limpias",
    ];
    const mejoraAleatoria = mejoras[Math.floor(Math.random() * mejoras.length)];
    setDescripcionMejorada(`${descripcionDiseño}. ${mejoraAleatoria}`);
  };

  const categoriaInfo = CATEGORIAS_PRODUCTO.find((cat) => cat.id === categoria);

  return (
    <div className="paso-contenido">
      <h2 className="paso-titulo">Paso 4: Describe tu Diseño</h2>
      <p className="paso-descripcion">Añade detalles y dimensiones</p>

      {/* Descripción */}
      <div className="form-group">
        <label className="form-label">Descripción del diseño deseado</label>
        <textarea
          className="form-textarea"
          value={descripcionDiseño}
          onChange={(e) => setDescripcionDiseño(e.target.value)}
          placeholder="Ej: Logo de tijeras elegante, letras cursivas brillantes..."
          rows={4}
        />
        <button
          className="nav-btn nav-btn-primary"
          style={{ marginTop: 10, width: '100%' }}
          onClick={mejorarDescripcionConIA}
          disabled={!descripcionDiseño.trim()}
        >
          <Sparkles size={18} />
          Mejorar con IA
        </button>
        
        {descripcionMejorada && (
          <div className="pista-contextual info" style={{ marginTop: 12 }}>
            <Sparkles size={18} />
            <div>
              <strong>Descripción mejorada:</strong>
              <p style={{ margin: '4px 0 0' }}>{descripcionMejorada}</p>
            </div>
          </div>
        )}
      </div>

      {/* Tamaño */}
      <div className="form-group">
        <label className="form-label">
          <Ruler size={16} style={{ display: 'inline', marginRight: 6 }} />
          Tamaño Aproximado
        </label>
        <div className="color-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: 4 }}>Ancho (cm)</label>
              <input
                type="number"
                className="form-input"
                value={tamanoAncho}
                onChange={(e) => setTamanoAncho(parseInt(e.target.value) || 0)}
                min="10"
                max="500"
              />
            </div>
            <span style={{ color: '#888', fontSize: '1.2rem', marginTop: 20 }}>×</span>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.75rem', color: '#888', display: 'block', marginBottom: 4 }}>Alto (cm)</label>
              <input
                type="number"
                className="form-input"
                value={tamanoAlto}
                onChange={(e) => setTamanoAlto(parseInt(e.target.value) || 0)}
                min="10"
                max="500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resumen */}
      {categoriaInfo && (
        <div className="color-section" style={{ background: 'rgba(255,107,0,0.05)', borderColor: 'rgba(255,107,0,0.2)' }}>
          <h4 style={{ margin: '0 0 12px', color: '#ff6b00', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Resumen de tu selección
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: '#888' }}>Producto:</span>
              <strong style={{ color: '#fff' }}>{categoriaInfo.nombre}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: '#888' }}>Precio base:</span>
              <strong style={{ color: '#22c55e' }}>{categoriaInfo.precioBase}€/{categoriaInfo.unidad}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: '#888' }}>Tiempo:</span>
              <strong style={{ color: '#fff' }}>{categoriaInfo.tiempoEntrega}</strong>
            </div>
            {categoria === "letras-corporeas" && tipoLetraCorporea && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#888' }}>Tipo:</span>
                <strong style={{ color: '#fff' }}>{TIPOS_LETRAS_CORPOREAS.find((t) => t.id === tipoLetraCorporea)?.nombre}</strong>
              </div>
            )}
            {(categoria === "letras-neon" || categoria === "letras-corporeas") && colorLuzLed && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#888' }}>Luz:</span>
                <strong style={{ color: '#fff' }}>{COLORES_LUZ_LED.find((c) => c.id === colorLuzLed)?.nombre}</strong>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
