/**
 * ============================================================================
 * GENERADOR LONA HÍBRIDA - Flujo completo Ideogram + Canvas
 * ============================================================================
 * 
 * Componente que gestiona todo el flujo:
 * 1. Selección de tipo de negocio y estilo
 * 2. Generación de fondos con Ideogram
 * 3. Selección de fondo preferido
 * 4. Edición de texto con Canvas
 * 5. Exportación final
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Palette, 
  Store,
  ArrowRight,
  ArrowLeft,
  Check,
  RefreshCw,
  Type,
  Layout,
  Download
} from 'lucide-react';
import { generarFondosLona, generarLonaCompleta } from '../../../services/lonaService';
import LonaCanvasEditor from './LonaCanvasEditor';

// ============================================================================
// DICCIONARIOS (sincronizados con backend)
// ============================================================================
const TIPOS_NEGOCIO = [
  { id: 'restaurante', nombre: 'Restaurante', icono: '🍽️' },
  { id: 'bar', nombre: 'Bar', icono: '🍻' },
  { id: 'cafeteria', nombre: 'Cafetería', icono: '☕' },
  { id: 'panaderia', nombre: 'Panadería', icono: '🥐' },
  { id: 'peluqueria', nombre: 'Peluquería', icono: '💇' },
  { id: 'gimnasio', nombre: 'Gimnasio', icono: '💪' },
  { id: 'tienda_ropa', nombre: 'Tienda de Ropa', icono: '👕' },
  { id: 'inmobiliaria', nombre: 'Inmobiliaria', icono: '🏠' },
  { id: 'construccion', nombre: 'Construcción', icono: '🏗️' },
  { id: 'taller_mecanico', nombre: 'Taller Mecánico', icono: '🔧' },
  { id: 'clinica_dental', nombre: 'Clínica Dental', icono: '🦷' },
  { id: 'veterinaria', nombre: 'Veterinaria', icono: '🐾' },
  { id: 'floreria', nombre: 'Florería', icono: '🌸' },
  { id: 'tecnologia', nombre: 'Tecnología', icono: '💻' },
  { id: 'educacion', nombre: 'Educación', icono: '📚' },
  { id: 'fiesta', nombre: 'Fiesta/Eventos', icono: '🎉' },
  { id: 'musica', nombre: 'Música', icono: '🎵' },
  { id: 'deportes', nombre: 'Deportes', icono: '⚽' },
  { id: 'viajes', nombre: 'Viajes', icono: '✈️' },
  { id: 'general', nombre: 'General', icono: '🏪' },
];

const ESTILOS_VISUALES = [
  { id: 'moderno', nombre: 'Moderno', desc: 'Líneas limpias, minimalista' },
  { id: 'festivo', nombre: 'Festivo', desc: 'Colores brillantes, celebración' },
  { id: 'elegante', nombre: 'Elegante', desc: 'Premium, sofisticado' },
  { id: 'dinamico', nombre: 'Dinámico', desc: 'Energía, movimiento' },
  { id: 'natural', nombre: 'Natural', desc: 'Orgánico, eco-friendly' },
  { id: 'retro', nombre: 'Retro', desc: 'Vintage, nostálgico' },
  { id: 'minimalista', nombre: 'Minimalista', desc: 'Esencial, simple' },
  { id: 'corporativo', nombre: 'Corporativo', desc: 'Profesional, business' },
  { id: 'infantil', nombre: 'Infantil', desc: 'Diverido, colorido' },
  { id: 'tech', nombre: 'Tech', desc: 'Futurista, digital' },
];

const PALETAS_PRESET = [
  { nombre: 'Púrpura/Dorado', colores: ['#9333ea', '#fbbf24'] },
  { nombre: 'Azul/Naranja', colores: ['#3b82f6', '#f97316'] },
  { nombre: 'Rojo/Blanco', colores: ['#dc2626', '#ffffff'] },
  { nombre: 'Verde/Negro', colores: ['#22c55e', '#000000'] },
  { nombre: 'Rosa/Cian', colores: ['#ec4899', '#06b6d4'] },
  { nombre: 'Negro/Dorado', colores: ['#000000', '#ffd700'] },
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export function GeneradorLonaHibrida({ 
  datosIniciales = {},
  onCompletar,
  onCancelar 
}) {
  // Estados del flujo
  const [paso, setPaso] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  
  // Configuración
  const [config, setConfig] = useState({
    tipoNegocio: datosIniciales.tipoNegocio || 'general',
    estilo: datosIniciales.estilo || 'moderno',
    colores: datosIniciales.colores?.map(c => c.hex) || ['#9333ea', '#fbbf24'],
    orientacion: datosIniciales.orientacion || 'horizontal',
    nombreNegocio: datosIniciales.nombreNegocio || '',
    textoAdicional: datosIniciales.textoAdicional || '',
    tipografia: datosIniciales.tipografia?.familia || 'Bebas Neue, Arial, sans-serif',
  });
  
  // Resultados
  const [fondosGenerados, setFondosGenerados] = useState([]);
  const [fondoSeleccionado, setFondoSeleccionado] = useState(null);
  const [resultadoFinal, setResultadoFinal] = useState(null);

  // ============================================================================
  // PASO 1: Generar fondos con Ideogram
  // ============================================================================
  const generarFondos = async () => {
    setCargando(true);
    setError(null);
    
    try {
      const resultado = await generarFondosLona({
        tipoNegocio: config.tipoNegocio,
        estilo: config.estilo,
        colores: config.colores,
        orientacion: config.orientacion,
        cantidad: 4
      });
      
      setFondosGenerados(resultado.imagenes);
      setPaso(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  // ============================================================================
  // PASO 3: Abrir editor Canvas
  // ============================================================================
  const seleccionarFondo = (fondo) => {
    setFondoSeleccionado(fondo);
    setPaso(3);
  };

  // ============================================================================
  // PASO 4: Guardar resultado del Canvas
  // ============================================================================
  const guardarResultado = (resultado) => {
    setResultadoFinal(resultado);
    onCompletar?.(resultado);
  };

  // ============================================================================
  // RENDER: Paso 1 - Configuración
  // ============================================================================
  const renderPaso1 = () => (
    <div className="lona-config-step">
      <h3>
        <Sparkles size={24} />
        Configurar Lona Publicitaria
      </h3>
      <p className="lona-desc">
        Sistema Híbrido: IA genera el fondo decorativo + Canvas para el texto perfecto
      </p>

      {/* Orientación */}
      <div className="config-section">
        <label>Orientación</label>
        <div className="orientacion-selector">
          <button
            className={config.orientacion === 'horizontal' ? 'active' : ''}
            onClick={() => setConfig(p => ({ ...p, orientacion: 'horizontal' }))}
          >
            <Layout size={20} />
            <span>Horizontal</span>
            <small>3:1 - Para fachadas</small>
          </button>
          <button
            className={config.orientacion === 'vertical' ? 'active' : ''}
            onClick={() => setConfig(p => ({ ...p, orientacion: 'vertical' }))}
          >
            <Layout size={20} style={{ transform: 'rotate(90deg)' }} />
            <span>Vertical</span>
            <small>1:3 - Para columnas</small>
          </button>
        </div>
      </div>

      {/* Tipo de negocio */}
      <div className="config-section">
        <label><Store size={16} /> Tipo de Negocio</label>
        <div className="grid-selector">
          {TIPOS_NEGOCIO.map(tipo => (
            <button
              key={tipo.id}
              className={config.tipoNegocio === tipo.id ? 'active' : ''}
              onClick={() => setConfig(p => ({ ...p, tipoNegocio: tipo.id }))}
            >
              <span className="icon">{tipo.icono}</span>
              <span className="name">{tipo.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Estilo visual */}
      <div className="config-section">
        <label><Palette size={16} /> Estilo Visual</label>
        <div className="estilos-selector">
          {ESTILOS_VISUALES.map(estilo => (
            <button
              key={estilo.id}
              className={config.estilo === estilo.id ? 'active' : ''}
              onClick={() => setConfig(p => ({ ...p, estilo: estilo.id }))}
            >
              <span className="name">{estilo.nombre}</span>
              <small>{estilo.desc}</small>
            </button>
          ))}
        </div>
      </div>

      {/* Colores */}
      <div className="config-section">
        <label><Palette size={16} /> Paleta de Colores</label>
        <div className="paletas-selector">
          {PALETAS_PRESET.map(paleta => (
            <button
              key={paleta.nombre}
              className={config.colores.join(',') === paleta.colores.join(',') ? 'active' : ''}
              onClick={() => setConfig(p => ({ ...p, colores: paleta.colores }))}
            >
              <div className="color-preview">
                {paleta.colores.map(c => (
                  <span key={c} style={{ background: c }} />
                ))}
              </div>
              <span className="name">{paleta.nombre}</span>
            </button>
          ))}
        </div>
        <div className="custom-colors">
          <label>Personalizar:</label>
          <div className="color-inputs">
            {config.colores.map((color, idx) => (
              <input
                key={idx}
                type="color"
                value={color}
                onChange={(e) => {
                  const nuevos = [...config.colores];
                  nuevos[idx] = e.target.value;
                  setConfig(p => ({ ...p, colores: nuevos }));
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {/* Botones */}
      <div className="step-actions">
        <button onClick={onCancelar} className="btn-secondary">
          Cancelar
        </button>
        <button 
          onClick={generarFondos} 
          className="btn-primary"
          disabled={cargando}
        >
          {cargando ? (
            <><RefreshCw className="spin" size={18} /> Generando...</>
          ) : (
            <><Sparkles size={18} /> Generar Fondos con IA</>
          )}
        </button>
      </div>
    </div>
  );

  // ============================================================================
  // RENDER: Paso 2 - Selección de fondo
  // ============================================================================
  const renderPaso2 = () => (
    <div className="lona-fondos-step">
      <h3>
        <ImageIcon size={24} />
        Selecciona un Fondo
      </h3>
      <p className="lona-desc">
        Elige el fondo que más te guste. Después podrás añadir el texto perfecto.
      </p>

      <div className="fondos-grid">
        {fondosGenerados.map((fondo, idx) => (
          <div 
            key={idx} 
            className="fondo-item"
            onClick={() => seleccionarFondo(fondo)}
          >
            <img src={fondo.url} alt={`Fondo ${idx + 1}`} />
            <div className="fondo-overlay">
              <span>Seleccionar</span>
              <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </div>

      <div className="step-actions">
        <button onClick={() => setPaso(1)} className="btn-secondary">
          <ArrowLeft size={16} /> Volver
        </button>
        <button onClick={generarFondos} className="btn-refresh">
          <RefreshCw size={16} /> Generar más
        </button>
      </div>
    </div>
  );

  // ============================================================================
  // RENDER: Paso 3 - Editor Canvas
  // ============================================================================
  const renderPaso3 = () => (
    <LonaCanvasEditor
      fondoUrl={fondoSeleccionado?.url}
      configInicial={{
        nombreNegocio: config.nombreNegocio,
        textoAdicional: config.textoAdicional,
        tipografia: config.tipografia,
        colorTexto: '#FFFFFF',
        colorTextoSecundario: '#FFFFFF'
      }}
      orientacion={config.orientacion}
      onGuardar={guardarResultado}
      onCancelar={() => setPaso(2)}
    />
  );

  // ============================================================================
  // RENDER PRINCIPAL
  // ============================================================================
  return (
    <div className="generador-lona-hibrida">
      {/* Progress */}
      <div className="lona-progress">
        <div className={`step ${paso >= 1 ? 'active' : ''}`}>
          <span className="number">1</span>
          <span className="label">Configurar</span>
        </div>
        <div className="line" />
        <div className={`step ${paso >= 2 ? 'active' : ''}`}>
          <span className="number">2</span>
          <span className="label">Elegir Fondo</span>
        </div>
        <div className="line" />
        <div className={`step ${paso >= 3 ? 'active' : ''}`}>
          <span className="number">3</span>
          <span className="label">Añadir Texto</span>
        </div>
      </div>

      {/* Contenido */}
      <div className="lona-content">
        {paso === 1 && renderPaso1()}
        {paso === 2 && renderPaso2()}
        {paso === 3 && renderPaso3()}
      </div>

      <style>{`
        .generador-lona-hibrida {
          background: #1a1a24;
          border-radius: 16px;
          overflow: hidden;
          color: #fff;
          max-width: 1000px;
          margin: 0 auto;
        }

        .lona-progress {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #252532;
          gap: 8px;
        }

        .lona-progress .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          opacity: 0.5;
        }

        .lona-progress .step.active {
          opacity: 1;
        }

        .lona-progress .number {
          width: 32px;
          height: 32px;
          background: #444;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .lona-progress .step.active .number {
          background: #667eea;
        }

        .lona-progress .label {
          font-size: 0.75rem;
          color: #999;
        }

        .lona-progress .line {
          width: 60px;
          height: 2px;
          background: #444;
        }

        .lona-content {
          padding: 24px;
        }

        /* Paso 1: Configuración */
        .lona-config-step h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 8px 0;
          font-size: 1.3rem;
        }

        .lona-desc {
          color: #999;
          margin-bottom: 24px;
          font-size: 0.95rem;
        }

        .config-section {
          margin-bottom: 24px;
        }

        .config-section > label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 12px;
          color: #fff;
        }

        .orientacion-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .orientacion-selector button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px;
          background: #252532;
          border: 2px solid transparent;
          border-radius: 12px;
          color: #999;
          cursor: pointer;
          transition: all 0.2s;
        }

        .orientacion-selector button.active {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.1);
          color: #fff;
        }

        .orientacion-selector button span {
          font-weight: 600;
        }

        .orientacion-selector button small {
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .grid-selector {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
        }

        @media (max-width: 768px) {
          .grid-selector {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .grid-selector button {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px 8px;
          background: #252532;
          border: 1px solid #444;
          border-radius: 8px;
          color: #999;
          cursor: pointer;
          transition: all 0.2s;
        }

        .grid-selector button:hover {
          border-color: #667eea;
          color: #fff;
        }

        .grid-selector button.active {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.2);
          color: #fff;
        }

        .grid-selector button .icon {
          font-size: 1.5rem;
        }

        .grid-selector button .name {
          font-size: 0.75rem;
          text-align: center;
        }

        .estilos-selector {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .estilos-selector button {
          display: flex;
          flex-direction: column;
          padding: 12px;
          background: #252532;
          border: 1px solid #444;
          border-radius: 8px;
          color: #999;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }

        .estilos-selector button:hover {
          border-color: #667eea;
        }

        .estilos-selector button.active {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.1);
          color: #fff;
        }

        .estilos-selector button .name {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .estilos-selector button small {
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .paletas-selector {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 16px;
        }

        .paletas-selector button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: #252532;
          border: 1px solid #444;
          border-radius: 8px;
          color: #999;
          cursor: pointer;
          transition: all 0.2s;
        }

        .paletas-selector button.active {
          border-color: #667eea;
          color: #fff;
        }

        .color-preview {
          display: flex;
          gap: 2px;
        }

        .color-preview span {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }

        .paletas-selector button .name {
          font-size: 0.8rem;
        }

        .custom-colors {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .custom-colors label {
          font-size: 0.85rem;
          color: #999;
        }

        .color-inputs {
          display: flex;
          gap: 8px;
        }

        .color-inputs input[type="color"] {
          width: 40px;
          height: 36px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid #ef4444;
          color: #ef4444;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .step-actions {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #333;
        }

        .step-actions button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.2s;
        }

        .btn-secondary {
          background: #3a3a4a;
          color: #fff;
        }

        .btn-secondary:hover {
          background: #4a4a5a;
        }

        .btn-primary {
          background: #667eea;
          color: #fff;
          margin-left: auto;
        }

        .btn-primary:hover:not(:disabled) {
          background: #5a6fd6;
          transform: translateY(-1px);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-refresh {
          background: transparent;
          color: #667eea;
          border: 1px solid #667eea;
        }

        .btn-refresh:hover {
          background: rgba(102, 126, 234, 0.1);
        }

        /* Paso 2: Fondos */
        .lona-fondos-step h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 8px 0;
        }

        .fondos-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin: 20px 0;
        }

        .fondo-item {
          position: relative;
          aspect-ratio: 3/1;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s;
        }

        @media (max-width: 600px) {
          .fondos-grid {
            grid-template-columns: 1fr;
          }
          
          .fondo-item {
            aspect-ratio: 3/1;
          }
        }

        .fondo-item:hover {
          border-color: #667eea;
          transform: scale(1.02);
        }

        .fondo-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fondo-overlay {
          position: absolute;
          inset: 0;
          background: rgba(102, 126, 234, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.2s;
          font-weight: 600;
        }

        .fondo-item:hover .fondo-overlay {
          opacity: 1;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default GeneradorLonaHibrida;
