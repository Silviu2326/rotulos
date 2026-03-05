import { Upload, Trash2, X, Wand2, Maximize2 } from "lucide-react";
import { TIPOGRAFIAS, COLORES_PREDEFINIDOS, ORIENTACIONES } from "../data/constants";

export const Paso2Negocio = ({
  nombreNegocio,
  setNombreNegocio,
  tipografia,
  setTipografia,
  coloresDiseño,
  agregarColor,
  eliminarColor,
  orientacion,
  setOrientacion,
  textoAdicional,
  setTextoAdicional,
  logo,
  setLogo,
  modoIntegracionLogo,
  setModoIntegracionLogo,
  errores,
  mostrarSelectorOrientacion,
}) => {
  const handleSubirLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="paso-contenido">
      <h2 className="paso-titulo">Paso 2: Tu Negocio</h2>
      <p className="paso-descripcion">Personaliza los detalles de tu rótulo</p>

      {/* Nombre del negocio */}
      <div className="form-group">
        <label className="form-label">
          Nombre del Negocio *
        </label>
        <input
          type="text"
          className="form-input"
          value={nombreNegocio}
          onChange={(e) => setNombreNegocio(e.target.value)}
          placeholder="Ej: Café Roma, Bar Moderno..."
        />
        {errores.nombreNegocio && <span className="error-mensaje">{errores.nombreNegocio}</span>}
      </div>

      {/* Tipografía */}
      <div className="form-group">
        <label className="form-label">Tipografía</label>
        <div className="selector-tipografia">
          {TIPOGRAFIAS.map((font) => (
            <div
              key={font.id}
              className={`tipo-option ${tipografia?.id === font.id ? "selected" : ""}`}
              onClick={() => setTipografia(font)}
            >
              <div className="tipo-preview" style={{ fontFamily: font.familia }}>
                {font.sample}
              </div>
              <div className="tipo-nombre">{font.nombre}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Colores */}
      <div className="form-group">
        <label className="form-label">Colores del Diseño *</label>
        
        <div className="color-section">
          <div className="color-list">
            {COLORES_PREDEFINIDOS.map((color) => (
              <button
                key={color.hex}
                className={`color-dot ${coloresDiseño.find((c) => c.hex === color.hex) ? "active" : ""}`}
                style={{ backgroundColor: color.hex }}
                onClick={() => {
                  const exists = coloresDiseño.find((c) => c.hex === color.hex);
                  if (exists) {
                    eliminarColor(color.hex);
                  } else {
                    agregarColor(color);
                  }
                }}
                title={color.nombre}
              />
            ))}
          </div>

          {coloresDiseño.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: 8 }}>Seleccionados:</p>
              <div className="color-list">
                {coloresDiseño.map((color) => (
                  <div key={color.hex} className="color-chip">
                    <div className="color-dot" style={{ backgroundColor: color.hex }} />
                    <span className="color-name">{color.nombre}</span>
                    <button className="color-remove" onClick={() => eliminarColor(color.hex)}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {errores.colores && <span className="error-mensaje">{errores.colores}</span>}
      </div>

      {/* Orientación */}
      {mostrarSelectorOrientacion() && (
        <div className="form-group">
          <label className="form-label">Orientación</label>
          <div className="estilo-grid">
            {ORIENTACIONES.map((ori) => {
              const Icono = ori.icono;
              return (
                <div
                  key={ori.id}
                  className={`estilo-card ${orientacion === ori.id ? "selected" : ""}`}
                  onClick={() => setOrientacion(ori.id)}
                >
                  <div className="estilo-icon"><Icono size={24} /></div>
                  <div className="estilo-nombre">{ori.nombre}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Texto adicional */}
      <div className="form-group">
        <label className="form-label">Texto adicional (opcional)</label>
        <input
          type="text"
          className="form-input"
          value={textoAdicional}
          onChange={(e) => setTextoAdicional(e.target.value)}
          placeholder="Ej: Tel: 666 777 888, Desde 1990..."
        />
      </div>

      {/* Logo */}
      <div className="form-group">
        <label className="form-label">Logo existente (opcional)</label>
        <div className="color-section">
          {logo ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src={logo} alt="Logo" style={{ maxHeight: 80, borderRadius: 8 }} />
              <button 
                className="color-remove" 
                style={{ position: 'absolute', top: -8, right: -8 }}
                onClick={() => setLogo(null)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ) : (
            <label style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              padding: 24,
              border: '2px dashed rgba(255,255,255,0.1)',
              borderRadius: 12,
              cursor: 'pointer'
            }}>
              <Upload size={32} style={{ color: '#ff6b00', marginBottom: 8 }} />
              <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Arrastra tu logo o haz clic</span>
              <span style={{ color: '#666', fontSize: '0.75rem' }}>PNG o JPG</span>
              <input type="file" accept="image/*" onChange={handleSubirLogo} hidden />
            </label>
          )}
        </div>

        {logo && (
          <div style={{ marginTop: 12 }}>
            <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: 8 }}>Modo de integración:</p>
            <div className="estilo-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <button 
                className={`estilo-card ${modoIntegracionLogo === "ia" ? "selected" : ""}`}
                onClick={() => setModoIntegracionLogo("ia")}
              >
                <Wand2 size={16} style={{ marginBottom: 4 }} />
                <span style={{ fontSize: '0.75rem' }}>IA (Natural)</span>
              </button>
              <button 
                className={`estilo-card ${modoIntegracionLogo === "exacto" ? "selected" : ""}`}
                onClick={() => setModoIntegracionLogo("exacto")}
              >
                <Maximize2 size={16} style={{ marginBottom: 4 }} />
                <span style={{ fontSize: '0.75rem' }}>Exacto</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
