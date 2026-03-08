/**
 * ============================================================================
 * LONA CANVAS EDITOR - Sistema Híbrido (Ideogram + Canvas)
 * ============================================================================
 * 
 * Componente para componer texto sobre fondos generados por Ideogram.
 * Garantiza texto perfectamente legible y posicionable.
 * 
 * Basado en el sistema PHP de Rotulemos:
 * - Fondo decorativo: Ideogram API
 * - Texto superpuesto: Canvas HTML5
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  Type, 
  Palette, 
  AlignCenter, 
  AlignLeft, 
  AlignRight,
  Download,
  RefreshCw,
  Image as ImageIcon,
  Move,
  Plus,
  Minus,
  RotateCcw
} from 'lucide-react';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export function LonaCanvasEditor({ 
  fondoUrl,           // URL del fondo generado por Ideogram
  configInicial,      // Configuración inicial del texto
  onGuardar,          // Callback al guardar
  onCancelar,         // Callback al cancelar
  orientacion = 'horizontal'
}) {
  const canvasRef = useRef(null);
  const [cargando, setCargando] = useState(true);
  const [fondoCargado, setFondoCargado] = useState(null);
  
  // Estado del texto editable
  const [textos, setTextos] = useState(() => ({
    principal: {
      contenido: configInicial?.nombreNegocio || 'TU NEGOCIO',
      x: 50, // Porcentaje
      y: orientacion === 'horizontal' ? 50 : 35,
      fontSize: orientacion === 'horizontal' ? 72 : 56,
      fontFamily: configInicial?.tipografia || 'Bebas Neue, Arial, sans-serif',
      color: configInicial?.colorTexto || '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 2,
      fontWeight: 'bold',
      textAlign: 'center',
      shadowBlur: 10,
      shadowColor: 'rgba(0,0,0,0.5)'
    },
    secundario: {
      contenido: configInicial?.textoAdicional || '',
      x: 50,
      y: orientacion === 'horizontal' ? 65 : 55,
      fontSize: orientacion === 'horizontal' ? 28 : 22,
      fontFamily: configInicial?.tipografia || 'Arial, sans-serif',
      color: configInicial?.colorTextoSecundario || '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 1,
      fontWeight: 'normal',
      textAlign: 'center',
      shadowBlur: 6,
      shadowColor: 'rgba(0,0,0,0.4)'
    },
    terciario: {
      contenido: configInicial?.textoSecundario || '',
      x: 50,
      y: orientacion === 'horizontal' ? 78 : 75,
      fontSize: orientacion === 'horizontal' ? 20 : 16,
      fontFamily: 'Arial, sans-serif',
      color: configInicial?.colorTextoSecundario || '#FFFFFF',
      strokeColor: '#000000',
      strokeWidth: 1,
      fontWeight: 'normal',
      textAlign: 'center',
      shadowBlur: 4,
      shadowColor: 'rgba(0,0,0,0.3)'
    }
  }));

  // Texto actualmente seleccionado para edición
  const [textoActivo, setTextoActivo] = useState('principal');
  
  // Dimensiones del canvas
  const [dimensiones, setDimensiones] = useState({
    width: orientacion === 'horizontal' ? 1200 : 600,
    height: orientacion === 'horizontal' ? 400 : 800
  });

  // ============================================================================
  // CARGAR IMAGEN DE FONDO
  // ============================================================================
  useEffect(() => {
    if (!fondoUrl) return;
    
    setCargando(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      setFondoCargado(img);
      // Ajustar dimensiones manteniendo aspect ratio
      const aspectRatio = img.width / img.height;
      let newWidth, newHeight;
      
      if (orientacion === 'horizontal') {
        newWidth = 1200;
        newHeight = Math.round(newWidth / aspectRatio);
      } else {
        newHeight = 800;
        newWidth = Math.round(newHeight * aspectRatio);
      }
      
      setDimensiones({ width: newWidth, height: newHeight });
      setCargando(false);
    };
    
    img.onerror = () => {
      console.error('Error cargando fondo');
      setCargando(false);
    };
    
    img.src = fondoUrl;
  }, [fondoUrl, orientacion]);

  // ============================================================================
  // DIBUJAR CANVAS
  // ============================================================================
  const dibujarCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fondoCargado) return;
    
    const ctx = canvas.getContext('2d');
    const { width, height } = dimensiones;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Dibujar fondo
    ctx.drawImage(fondoCargado, 0, 0, width, height);
    
    // Dibujar cada texto
    Object.entries(textos).forEach(([key, texto]) => {
      if (!texto.contenido) return;
      
      const x = (texto.x / 100) * width;
      const y = (texto.y / 100) * height;
      
      ctx.save();
      
      // Configurar fuente
      ctx.font = `${texto.fontWeight} ${texto.fontSize}px ${texto.fontFamily}`;
      ctx.textAlign = texto.textAlign;
      ctx.textBaseline = 'middle';
      
      // Sombra
      ctx.shadowColor = texto.shadowColor;
      ctx.shadowBlur = texto.shadowBlur;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;
      
      // Stroke (contorno)
      if (texto.strokeWidth > 0) {
        ctx.strokeStyle = texto.strokeColor;
        ctx.lineWidth = texto.strokeWidth;
        ctx.strokeText(texto.contenido, x, y);
      }
      
      // Relleno
      ctx.fillStyle = texto.color;
      ctx.fillText(texto.contenido, x, y);
      
      // Indicador de selección
      if (key === textoActivo) {
        const metrics = ctx.measureText(texto.contenido);
        const textHeight = texto.fontSize;
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(
          x - (texto.textAlign === 'center' ? metrics.width / 2 : 0) - 5,
          y - textHeight / 2 - 5,
          metrics.width + 10,
          textHeight + 10
        );
        ctx.setLineDash([]);
      }
      
      ctx.restore();
    });
  }, [fondoCargado, textos, dimensiones, textoActivo]);

  // Redibujar cuando cambie algo
  useEffect(() => {
    dibujarCanvas();
  }, [dibujarCanvas]);

  // ============================================================================
  // HANDLERS DE EDICIÓN
  // ============================================================================
  const actualizarTexto = (campo, valor) => {
    setTextos(prev => ({
      ...prev,
      [textoActivo]: {
        ...prev[textoActivo],
        [campo]: valor
      }
    }));
  };

  const moverTexto = (deltaX, deltaY) => {
    setTextos(prev => ({
      ...prev,
      [textoActivo]: {
        ...prev[textoActivo],
        x: Math.max(5, Math.min(95, prev[textoActivo].x + deltaX)),
        y: Math.max(5, Math.min(95, prev[textoActivo].y + deltaY))
      }
    }));
  };

  const cambiarTamaño = (delta) => {
    setTextos(prev => ({
      ...prev,
      [textoActivo]: {
        ...prev[textoActivo],
        fontSize: Math.max(12, prev[textoActivo].fontSize + delta)
      }
    }));
  };

  // ============================================================================
  // EXPORTAR IMAGEN
  // ============================================================================
  const exportarImagen = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png', 1.0);
    onGuardar?.({
      imagenBase64: dataUrl,
      config: textos,
      dimensiones
    });
  };

  const descargarImagen = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement('a');
    link.download = `lona-${textos.principal.contenido.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  const textoActual = textos[textoActivo];

  return (
    <div className="lona-canvas-editor">
      {/* Header */}
      <div className="lona-editor-header">
        <h3>
          <ImageIcon size={20} />
          Editor de Lona - Sistema Híbrido
        </h3>
        <div className="lona-editor-actions">
          <button onClick={descargarImagen} className="btn-download">
            <Download size={18} />
            Descargar
          </button>
          <button onClick={exportarImagen} className="btn-save">
            Guardar Diseño
          </button>
          <button onClick={onCancelar} className="btn-cancel">
            Cancelar
          </button>
        </div>
      </div>

      <div className="lona-editor-body">
        {/* Panel de edición */}
        <div className="lona-editor-panel">
          {/* Selector de texto */}
          <div className="editor-section">
            <label>Texto a editar</label>
            <div className="texto-selector">
              {[
                { key: 'principal', label: 'Principal', icon: 'T' },
                { key: 'secundario', label: 'Secundario', icon: 't' },
                { key: 'terciario', label: 'Terciario', icon: 't' }
              ].map(({ key, label, icon }) => (
                <button
                  key={key}
                  className={textoActivo === key ? 'active' : ''}
                  onClick={() => setTextoActivo(key)}
                >
                  <span className="icon">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Contenido del texto */}
          <div className="editor-section">
            <label>Contenido</label>
            <input
              type="text"
              value={textoActual.contenido}
              onChange={(e) => actualizarTexto('contenido', e.target.value)}
              placeholder="Texto..."
            />
          </div>

          {/* Color */}
          <div className="editor-section">
            <label><Palette size={14} /> Color</label>
            <div className="color-row">
              <input
                type="color"
                value={textoActual.color}
                onChange={(e) => actualizarTexto('color', e.target.value)}
              />
              <span>{textoActual.color}</span>
            </div>
          </div>

          {/* Tamaño de fuente */}
          <div className="editor-section">
            <label><Type size={14} /> Tamaño</label>
            <div className="size-control">
              <button onClick={() => cambiarTamaño(-4)}><Minus size={16} /></button>
              <span>{textoActual.fontSize}px</span>
              <button onClick={() => cambiarTamaño(4)}><Plus size={16} /></button>
            </div>
          </div>

          {/* Posición */}
          <div className="editor-section">
            <label><Move size={14} /> Posición</label>
            <div className="position-control">
              <button onClick={() => moverTexto(0, -2)}>↑</button>
              <div className="position-middle">
                <button onClick={() => moverTexto(-2, 0)}>←</button>
                <button onClick={() => setTextos(prev => ({
                  ...prev,
                  [textoActivo]: { ...prev[textoActivo], x: 50, y: textoActivo === 'principal' ? 50 : prev[textoActivo].y }
                }))}><RotateCcw size={14} /></button>
                <button onClick={() => moverTexto(2, 0)}>→</button>
              </div>
              <button onClick={() => moverTexto(0, 2)}>↓</button>
            </div>
          </div>

          {/* Alineación */}
          <div className="editor-section">
            <label>Alineación</label>
            <div className="align-control">
              <button 
                className={textoActual.textAlign === 'left' ? 'active' : ''}
                onClick={() => actualizarTexto('textAlign', 'left')}
              >
                <AlignLeft size={18} />
              </button>
              <button 
                className={textoActual.textAlign === 'center' ? 'active' : ''}
                onClick={() => actualizarTexto('textAlign', 'center')}
              >
                <AlignCenter size={18} />
              </button>
              <button 
                className={textoActual.textAlign === 'right' ? 'active' : ''}
                onClick={() => actualizarTexto('textAlign', 'right')}
              >
                <AlignRight size={18} />
              </button>
            </div>
          </div>

          {/* Contorno/Stroke */}
          <div className="editor-section">
            <label>Contorno</label>
            <div className="stroke-control">
              <input
                type="color"
                value={textoActual.strokeColor}
                onChange={(e) => actualizarTexto('strokeColor', e.target.value)}
              />
              <input
                type="range"
                min="0"
                max="10"
                value={textoActual.strokeWidth}
                onChange={(e) => actualizarTexto('strokeWidth', parseInt(e.target.value))}
              />
              <span>{textoActual.strokeWidth}px</span>
            </div>
          </div>

          {/* Sombra */}
          <div className="editor-section">
            <label>Sombra</label>
            <input
              type="range"
              min="0"
              max="30"
              value={textoActual.shadowBlur}
              onChange={(e) => actualizarTexto('shadowBlur', parseInt(e.target.value))}
            />
          </div>
        </div>

        {/* Canvas */}
        <div className="lona-canvas-container">
          {cargando && (
            <div className="canvas-loading">
              <RefreshCw className="spin" size={32} />
              <p>Cargando fondo...</p>
            </div>
          )}
          <canvas
            ref={canvasRef}
            width={dimensiones.width}
            height={dimensiones.height}
            style={{
              maxWidth: '100%',
              maxHeight: '70vh',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          />
          <div className="canvas-info">
            {dimensiones.width} × {dimensiones.height}px | 
            Proporción: {orientacion === 'horizontal' ? '3:1' : '1:3'}
          </div>
        </div>
      </div>

      <style>{`
        .lona-canvas-editor {
          background: #1a1a24;
          border-radius: 12px;
          overflow: hidden;
          color: #fff;
        }

        .lona-editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #252532;
          border-bottom: 1px solid #333;
        }

        .lona-editor-header h3 {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.1rem;
        }

        .lona-editor-actions {
          display: flex;
          gap: 10px;
        }

        .lona-editor-actions button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s;
        }

        .btn-download {
          background: #3a3a4a;
          color: #fff;
        }

        .btn-download:hover {
          background: #4a4a5a;
        }

        .btn-save {
          background: #667eea;
          color: #fff;
        }

        .btn-save:hover {
          background: #5a6fd6;
        }

        .btn-cancel {
          background: transparent;
          color: #999;
          border: 1px solid #444;
        }

        .btn-cancel:hover {
          color: #fff;
          border-color: #666;
        }

        .lona-editor-body {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 20px;
          padding: 20px;
          min-height: 500px;
        }

        .lona-editor-panel {
          background: #252532;
          border-radius: 8px;
          padding: 16px;
          overflow-y: auto;
          max-height: 70vh;
        }

        .editor-section {
          margin-bottom: 20px;
        }

        .editor-section label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          color: #999;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .texto-selector {
          display: flex;
          gap: 8px;
        }

        .texto-selector button {
          flex: 1;
          padding: 10px;
          background: #1a1a24;
          border: 1px solid #444;
          border-radius: 6px;
          color: #999;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: all 0.2s;
        }

        .texto-selector button .icon {
          font-size: 1.2rem;
          font-weight: bold;
        }

        .texto-selector button.active,
        .texto-selector button:hover {
          border-color: #667eea;
          color: #fff;
          background: rgba(102, 126, 234, 0.1);
        }

        .texto-selector button.active {
          box-shadow: 0 0 10px rgba(102, 126, 234, 0.3);
        }

        .editor-section input[type="text"] {
          width: 100%;
          padding: 10px 12px;
          background: #1a1a24;
          border: 1px solid #444;
          border-radius: 6px;
          color: #fff;
          font-size: 0.95rem;
        }

        .editor-section input[type="text"]:focus {
          outline: none;
          border-color: #667eea;
        }

        .color-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .color-row input[type="color"] {
          width: 50px;
          height: 36px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .size-control {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .size-control button {
          width: 32px;
          height: 32px;
          background: #1a1a24;
          border: 1px solid #444;
          border-radius: 6px;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .size-control button:hover {
          border-color: #667eea;
        }

        .position-control {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .position-control button {
          width: 36px;
          height: 36px;
          background: #1a1a24;
          border: 1px solid #444;
          border-radius: 6px;
          color: #fff;
          cursor: pointer;
          font-size: 1rem;
        }

        .position-control button:hover {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.1);
        }

        .position-middle {
          display: flex;
          gap: 4px;
        }

        .align-control {
          display: flex;
          gap: 8px;
        }

        .align-control button {
          flex: 1;
          height: 36px;
          background: #1a1a24;
          border: 1px solid #444;
          border-radius: 6px;
          color: #999;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .align-control button.active,
        .align-control button:hover {
          border-color: #667eea;
          color: #fff;
          background: rgba(102, 126, 234, 0.1);
        }

        .stroke-control {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stroke-control input[type="color"] {
          width: 40px;
          height: 32px;
          border: none;
          border-radius: 4px;
        }

        .stroke-control input[type="range"] {
          flex: 1;
        }

        .lona-canvas-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0f0f15;
          border-radius: 8px;
          padding: 20px;
          position: relative;
          min-height: 400px;
        }

        .canvas-loading {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #667eea;
          gap: 12px;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .canvas-info {
          margin-top: 12px;
          font-size: 0.8rem;
          color: #666;
        }

        input[type="range"] {
          width: 100%;
          height: 6px;
          background: #1a1a24;
          border-radius: 3px;
          outline: none;
          -webkit-appearance: none;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: #667eea;
          border-radius: 50%;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .lona-editor-body {
            grid-template-columns: 1fr;
          }
          
          .lona-editor-panel {
            max-height: none;
          }
        }
      `}</style>
    </div>
  );
}

export default LonaCanvasEditor;
