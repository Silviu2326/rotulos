import { RefreshCcw } from "lucide-react";

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
  hook
}) => {
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
          {progresoGeneracion < 30 ? 'Paso 1/3: Rótulo aislado...' :
           progresoGeneracion < 70 ? 'Paso 2/3: Mockups...' :
           'Finalizando...'}
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
        {mockups.find(m => m.tipo === 'exterior') && (
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
        {mockups.find(m => m.tipo === 'interior') && (
          <button 
            className={`image-selector-btn ${imagenActiva === 'interior' ? 'active' : ''}`}
            onClick={() => setImagenActiva('interior')}
            style={{
              flex: 1, padding: '8px 12px', border: 'none', borderRadius: '6px',
              background: imagenActiva === 'interior' ? 'var(--color-neon)' : 'transparent',
              color: imagenActiva === 'interior' ? '#000' : 'var(--color-text)',
              cursor: 'pointer'
            }}
          >
            🏢 Interior
          </button>
        )}
      </div>

      {/* Imagen principal */}
      <div className="result-main" id="result-container" style={{ 
        minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: imagenActiva === 'rotulo' ? '#1a1a1a' : 'var(--color-bg-alt)',
        borderRadius: '8px'
      }}>
        {imagenActiva === 'rotulo' && rotuloAislado ? (
          <img 
            src={rotuloAislado} 
            alt={`Rótulo ${nombreNegocio}`} 
            className="canvas-preview"
            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
          />
        ) : imagenActiva === 'exterior' && mockups.find(m => m.tipo === 'exterior') ? (
          <img 
            src={mockups.find(m => m.tipo === 'exterior').imagen} 
            alt={`${nombreNegocio} exterior`} 
            className="canvas-preview"
            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
          />
        ) : imagenActiva === 'interior' && mockups.find(m => m.tipo === 'interior') ? (
          <img 
            src={mockups.find(m => m.tipo === 'interior').imagen} 
            alt={`${nombreNegocio} interior`} 
            className="canvas-preview"
            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
          />
        ) : (
          <canvas ref={canvasRef} className="canvas-preview" />
        )}
        <div className="quality-badge" id="quality-badge">
          {imagenActiva === 'rotulo' ? 'Rótulo Aislado' : 
           imagenActiva === 'exterior' ? 'Fachada Exterior' : 'Interior'}
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
