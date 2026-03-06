import { useState, useRef, useEffect } from "react";
import { Upload, Trash2, X, Plus } from "lucide-react";
import { TIPOGRAFIAS, COLORES_PREDEFINIDOS, ORIENTACIONES } from "../data/constants";

// Color picker custom siempre visible
const ColorPickerCustom = ({ onColorSelect, colorActual }) => {
  const canvasRef = useRef(null);
  const [hue, setHue] = useState(24); // HUE inicial (naranja)
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);

  // Dibujar el gradiente de color
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Limpiar
    ctx.clearRect(0, 0, width, height);

    // Gradient horizontal: blanco -> color puro
    const gradH = ctx.createLinearGradient(0, 0, width, 0);
    gradH.addColorStop(0, '#ffffff');
    gradH.addColorStop(1, `hsl(${hue}, 100%, 50%)`);
    ctx.fillStyle = gradH;
    ctx.fillRect(0, 0, width, height);

    // Gradient vertical: transparente -> negro
    const gradV = ctx.createLinearGradient(0, 0, 0, height);
    gradV.addColorStop(0, 'rgba(0,0,0,0)');
    gradV.addColorStop(1, '#000000');
    ctx.fillStyle = gradV;
    ctx.fillRect(0, 0, width, height);
  }, [hue]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Calcular saturación y lightness basado en la posición
    const s = Math.round((x / width) * 100);
    const l = Math.round(100 - (y / height) * 100);
    
    setSaturation(Math.max(0, Math.min(100, s)));
    setLightness(Math.max(0, Math.min(100, l)));
    
    const hex = hslToHex(hue, Math.max(0, Math.min(100, s)), Math.max(0, Math.min(100, l)));
    onColorSelect(hex);
  };

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const handleHueChange = (e) => {
    const newHue = parseInt(e.target.value);
    setHue(newHue);
    const hex = hslToHex(newHue, saturation, lightness);
    onColorSelect(hex);
  };

  return (
    <div style={{ 
      background: 'rgba(0,0,0,0.3)', 
      borderRadius: 12, 
      padding: 12,
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      {/* Canvas de selección */}
      <canvas
        ref={canvasRef}
        width={200}
        height={120}
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          height: 120,
          borderRadius: 8,
          cursor: 'crosshair',
          display: 'block',
          marginBottom: 12
        }}
      />
      
      {/* Slider de HUE */}
      <div style={{ marginBottom: 12 }}>
        <input
          type="range"
          min="0"
          max="360"
          value={hue}
          onChange={handleHueChange}
          style={{
            width: '100%',
            height: 12,
            borderRadius: 6,
            appearance: 'none',
            background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
            cursor: 'pointer',
            outline: 'none'
          }}
        />
      </div>

      {/* Color seleccionado */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12,
        padding: 8,
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 8
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: colorActual || hslToHex(hue, saturation, lightness),
          border: '2px solid rgba(255,255,255,0.2)'
        }} />
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>Color seleccionado</p>
          <p style={{ margin: '2px 0 0 0', fontSize: '0.9rem', fontFamily: 'monospace', color: '#fff' }}>
            {(colorActual || hslToHex(hue, saturation, lightness)).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

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
  const [colorPickerValue, setColorPickerValue] = useState('#ff6b00');

  const handleSubirLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleColorPickerSelect = (hex) => {
    setColorPickerValue(hex);
  };

  const handleAgregarColorPicker = () => {
    const exists = coloresDiseño.find((c) => c.hex.toLowerCase() === colorPickerValue.toLowerCase());
    if (!exists) {
      agregarColor({
        hex: colorPickerValue,
        nombre: colorPickerValue.toUpperCase()
      });
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
          {/* Color Picker - Siempre visible */}
          <div style={{ marginBottom: 16 }}>
            <ColorPickerCustom 
              onColorSelect={handleColorPickerSelect}
              colorActual={colorPickerValue}
            />
            
            <button
              onClick={handleAgregarColorPicker}
              disabled={coloresDiseño.find((c) => c.hex.toLowerCase() === colorPickerValue.toLowerCase())}
              style={{
                width: '100%',
                marginTop: 12,
                padding: '10px',
                background: coloresDiseño.find((c) => c.hex.toLowerCase() === colorPickerValue.toLowerCase()) 
                  ? 'rgba(255,255,255,0.05)' 
                  : 'var(--color-neon)',
                color: coloresDiseño.find((c) => c.hex.toLowerCase() === colorPickerValue.toLowerCase()) 
                  ? '#666' 
                  : '#000',
                border: 'none',
                borderRadius: 8,
                cursor: coloresDiseño.find((c) => c.hex.toLowerCase() === colorPickerValue.toLowerCase()) 
                  ? 'not-allowed' 
                  : 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <Plus size={18} />
              {coloresDiseño.find((c) => c.hex.toLowerCase() === colorPickerValue.toLowerCase()) 
                ? 'Color ya agregado' 
                : 'Agregar este color'}
            </button>
          </div>

          {/* Colores predefinidos */}
          <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: 8 }}>Colores sugeridos:</p>
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
            <div style={{ marginTop: 16 }}>
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
          <div style={{ marginTop: 12, padding: 12, background: 'rgba(255,107,0,0.1)', borderRadius: 8, border: '1px solid rgba(255,107,0,0.2)' }}>
            <p style={{ fontSize: '0.8rem', color: '#ff6b00', margin: 0 }}>
              ✓ Logo cargado. Se integrará exactamente como se muestra en el diseño.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
