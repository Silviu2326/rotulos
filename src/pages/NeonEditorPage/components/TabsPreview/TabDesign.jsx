import { RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export const TabDesign = ({
  showPreview,
  isGenerating,
  progresoGeneracion,
  errorGeneracion,
  setErrorGeneracion,
  rotuloAislado,
  mockups,
  imagenActiva,
  setImagenActiva,
  nombreNegocio,
  canvasRef,
  hook,
  setsGenerados,
  setSetActivo
}) => {
  const [variacionActiva, setVariacionActiva] = useState(0);

  // Determinar qué mostrar según si hay sets generados o no
  const tieneSets = setsGenerados && setsGenerados.length > 0;
  const rotuloActual = tieneSets ? setsGenerados[variacionActiva]?.rotulo : rotuloAislado;
  const mockupsActuales = tieneSets ? [
    { tipo: 'exterior', imagen: setsGenerados[variacionActiva]?.mockup }
  ] : mockups;

  const cambiarVariacion = (direccion) => {
    const nuevaVariacion = direccion === 'next' 
      ? (variacionActiva + 1) % setsGenerados.length
      : (variacionActiva - 1 + setsGenerados.length) % setsGenerados.length;
    setVariacionActiva(nuevaVariacion);
    if (setSetActivo) setSetActivo(nuevaVariacion);
  };

  if (!showPreview) {
    return (
      <div className="empty" id="empty">
        <div className="empty-visual"></div>
        <h3 className="empty-title">Tu diseño aparecerá aquí</h3>
        <p className="empty-text">Selecciona el producto y genera tu rótulo</p>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="loading" id="loading">
        <div className="loading-spinner"></div>
        <h3 className="loading-title">Generando...</h3>
        <p className="loading-text">
          {progresoGeneracion < 30 ? 'Paso 1/4: Rótulo 1...' :
           progresoGeneracion < 50 ? 'Paso 2/4: Mockup 1...' :
           progresoGeneracion < 75 ? 'Paso 3/4: Rótulo 2...' :
           'Paso 4/4: Mockup 2...'}
        </p>
        <div className="loading-progress">
          <div className="loading-progress-bar" style={{ width: `${progresoGeneracion}%` }}></div>
        </div>
      </div>
    );
  }

  if (errorGeneracion) {
    return (
      <div className="error-state" style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#ff6b6b' }}>❌ {errorGeneracion}</p>
        <button className="btn-secondary" onClick={() => setErrorGeneracion(null)}>
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="result" id="result">
      {/* Selector de variaciones (solo si hay sets) */}
      {tieneSets && (
        <div className="variacion-selector" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
          marginBottom: '12px', padding: '10px',
          background: 'var(--color-bg-alt)', borderRadius: '8px'
        }}>
          <button 
            onClick={() => cambiarVariacion('prev')}
            style={{
              padding: '6px 12px', border: 'none', borderRadius: '6px',
              background: 'var(--color-bg)', color: 'var(--color-text)',
              cursor: 'pointer', display: 'flex', alignItems: 'center'
            }}
          >
            <ChevronLeft size={18} />
          </button>
          <span style={{ fontWeight: 500, color: 'var(--color-text)' }}>
            Variación {variacionActiva + 1} de {setsGenerados.length}
          </span>
          <button 
            onClick={() => cambiarVariacion('next')}
            style={{
              padding: '6px 12px', border: 'none', borderRadius: '6px',
              background: 'var(--color-bg)', color: 'var(--color-text)',
              cursor: 'pointer', display: 'flex', alignItems: 'center'
            }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Selector de imágenes */}
      <div className="image-selector" style={{
        display: 'flex', gap: '8px', marginBottom: '16px', padding: '8px',
        background: 'var(--color-bg-alt)', borderRadius: '8px'
      }}>
        <button 
          className={`image-selector-btn ${imagenActiva === 'rotulo' ? 'active' : ''}`}
          onClick={() => setImagenActiva('rotulo')}
          style={{
            flex: 1, padding: '8px 12px', border: 'none', borderRadius: '6px',
            background: imagenActiva === 'rotulo' ? 'var(--color-neon)' : 'transparent',
            color: imagenActiva === 'rotulo' ? '#000' : 'var(--color-text)',
            cursor: 'pointer'
          }}
        >
          🎨 Rótulo
        </button>
        {mockupsActuales.find(m => m.tipo?.includes('exterior')) && (
          <button 
            className={`image-selector-btn ${imagenActiva === 'exterior' ? 'active' : ''}`}
            onClick={() => setImagenActiva('exterior')}
            style={{
              flex: 1, padding: '8px 12px', border: 'none', borderRadius: '6px',
              background: imagenActiva === 'exterior' ? 'var(--color-neon)' : 'transparent',
              color: imagenActiva === 'exterior' ? '#000' : 'var(--color-text)',
              cursor: 'pointer'
            }}
          >
            🏪 Exterior
          </button>
        )}
      </div>

      {/* Imagen principal */}
      <div className="result-main" id="result-container" style={{ 
        minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: imagenActiva === 'rotulo' ? '#1a1a1a' : 'var(--color-bg-alt)',
        borderRadius: '8px'
      }}>
        {imagenActiva === 'rotulo' && rotuloActual ? (
          <img 
            src={rotuloActual} 
            alt={`Rótulo ${nombreNegocio}`} 
            className="canvas-preview"
            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
          />
        ) : imagenActiva === 'exterior' && mockupsActuales.find(m => m.tipo?.includes('exterior')) ? (
          <img 
            src={mockupsActuales.find(m => m.tipo?.includes('exterior')).imagen} 
            alt={`${nombreNegocio} exterior`} 
            className="canvas-preview"
            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
          />
        ) : (
          <canvas ref={canvasRef} className="canvas-preview" />
        )}
        <div className="quality-badge" id="quality-badge">
          {imagenActiva === 'rotulo' ? `Rótulo Aislado ${tieneSets ? variacionActiva + 1 : ''}` : 
           imagenActiva === 'exterior' ? `Fachada Exterior ${tieneSets ? variacionActiva + 1 : ''}` : 'Interior'}
        </div>
      </div>
      
      <div className="result-warning">
        <span>⚠️</span>
        Diseño REFERENCIAL
      </div>
      
      <div className="result-actions">
        <button className="btn-action btn-download" onClick={() => {}}>
          <span className="icon">📥</span> Descargar
        </button>
        <button className="btn-action" onClick={() => {}}>
          <span className="icon">🪄</span> Quitar fondo
        </button>
      </div>
    </div>
  );
};
