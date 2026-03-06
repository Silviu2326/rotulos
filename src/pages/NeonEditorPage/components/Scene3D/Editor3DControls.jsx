import { useState } from 'react';
import { 
  Box, 
  Move, 
  Rotate3D, 
  Maximize2, 
  Layers, 
  Sun, 
  Moon,
  RefreshCcw,
  Grid3X3,
  Sliders
} from 'lucide-react';

/**
 * ============================================================================
 * PANEL DE CONTROL DEL EDITOR 3D
 * Controles para relieve, posición, iluminación y materiales
 * ============================================================================
 */

export function Editor3DControls({ 
  config, 
  onChange,
  onReset 
}) {
  const [activeTab, setActiveTab] = useState('relieve');

  const tabs = [
    { id: 'relieve', icon: Layers, label: 'Relieve' },
    { id: 'posicion', icon: Move, label: 'Posición' },
    { id: 'material', icon: Box, label: 'Material' },
    { id: 'iluminacion', icon: Sun, label: 'Luz' },
  ];

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      width: '280px',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '16px',
      color: 'white',
      fontSize: '0.85rem',
      zIndex: 1000,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Box size={18} color="var(--color-neon, #ff6b00)" />
          <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>
            Editor 3D
          </span>
        </div>
        <button
          onClick={onReset}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#888',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Resetear valores"
        >
          <RefreshCcw size={14} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '16px',
        background: 'rgba(255,255,255,0.05)',
        padding: '4px',
        borderRadius: '8px'
      }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '8px 4px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === tab.id ? 'var(--color-neon, #ff6b00)' : 'transparent',
                color: activeTab === tab.id ? '#000' : '#888',
                cursor: 'pointer',
                fontSize: '0.7rem',
                fontWeight: activeTab === tab.id ? '600' : '400',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenido de cada tab */}
      <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
        {activeTab === 'relieve' && (
          <RelieveControls config={config} onChange={onChange} />
        )}
        {activeTab === 'posicion' && (
          <PosicionControls config={config} onChange={onChange} />
        )}
        {activeTab === 'material' && (
          <MaterialControls config={config} onChange={onChange} />
        )}
        {activeTab === 'iluminacion' && (
          <IluminacionControls config={config} onChange={onChange} />
        )}
      </div>

      {/* Instrucciones */}
      <div style={{
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        fontSize: '0.7rem',
        color: '#666',
        lineHeight: '1.5'
      }}>
        <strong>Controles:</strong><br/>
        🖱️ Arrastrar: Rotar cámara<br/>
        📜 Rueda: Zoom<br/>
        ⇧ Shift+Arrastrar: Pan
      </div>
    </div>
  );
}

/**
 * Controles de relieve
 */
function RelieveControls({ config, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ControlSlider
        label="Profundidad del relieve"
        value={config.reliefDepth}
        min={0}
        max={1}
        step={0.05}
        onChange={(v) => onChange({ ...config, reliefDepth: v })}
        unit="m"
      />
      
      <ControlSlider
        label="Suavizado"
        value={config.reliefSmoothness}
        min={0}
        max={1}
        step={0.1}
        onChange={(v) => onChange({ ...config, reliefSmoothness: v })}
      />
      
      <ControlSlider
        label="Bisel"
        value={config.bevelSize}
        min={0}
        max={0.1}
        step={0.01}
        onChange={(v) => onChange({ ...config, bevelSize: v })}
        unit="m"
      />

      <div style={{
        padding: '10px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        fontSize: '0.75rem',
        color: '#aaa'
      }}>
        <Sliders size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
        El relieve se genera automáticamente analizando los brillos de la imagen.
      </div>
    </div>
  );
}

/**
 * Controles de posición
 */
function PosicionControls({ config, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <ControlSlider
        label="Posición X"
        value={config.positionX}
        min={-5}
        max={5}
        step={0.1}
        onChange={(v) => onChange({ ...config, positionX: v })}
        unit="m"
      />
      
      <ControlSlider
        label="Posición Y"
        value={config.positionY}
        min={-3}
        max={3}
        step={0.1}
        onChange={(v) => onChange({ ...config, positionY: v })}
        unit="m"
      />
      
      <ControlSlider
        label="Posición Z (de la pared)"
        value={config.positionZ}
        min={0}
        max={2}
        step={0.05}
        onChange={(v) => onChange({ ...config, positionZ: v })}
        unit="m"
      />

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />

      <ControlSlider
        label="Rotación X"
        value={config.rotationX}
        min={-45}
        max={45}
        step={1}
        onChange={(v) => onChange({ ...config, rotationX: v })}
        unit="°"
      />
      
      <ControlSlider
        label="Rotación Y"
        value={config.rotationY}
        min={-45}
        max={45}
        step={1}
        onChange={(v) => onChange({ ...config, rotationY: v })}
        unit="°"
      />
      
      <ControlSlider
        label="Escala"
        value={config.scale}
        min={0.5}
        max={3}
        step={0.1}
        onChange={(v) => onChange({ ...config, scale: v })}
      />
    </div>
  );
}

/**
 * Controles de material
 */
function MaterialControls({ config, onChange }) {
  const presets = [
    { name: 'Oro', color: '#FFD700', metalness: 1, roughness: 0.2 },
    { name: 'Plata', color: '#C0C0C0', metalness: 1, roughness: 0.2 },
    { name: 'Bronce', color: '#CD7F32', metalness: 0.8, roughness: 0.3 },
    { name: 'Negro Mate', color: '#1a1a1a', metalness: 0.1, roughness: 0.9 },
    { name: 'Cromo', color: '#ffffff', metalness: 1, roughness: 0 },
    { name: 'PVC Blanco', color: '#ffffff', metalness: 0, roughness: 0.5 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>
        Presets:
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        {presets.map(preset => (
          <button
            key={preset.name}
            onClick={() => onChange({
              ...config,
              materialColor: preset.color,
              metalness: preset.metalness,
              roughness: preset.roughness
            })}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: config.materialColor === preset.color ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.05)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.65rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: preset.color,
              border: '1px solid rgba(255,255,255,0.2)'
            }} />
            {preset.name}
          </button>
        ))}
      </div>

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />

      <ControlSlider
        label="Metalidad"
        value={config.metalness}
        min={0}
        max={1}
        step={0.1}
        onChange={(v) => onChange({ ...config, metalness: v })}
      />
      
      <ControlSlider
        label="Rugosidad"
        value={config.roughness}
        min={0}
        max={1}
        step={0.1}
        onChange={(v) => onChange({ ...config, roughness: v })}
      />

      <ControlSlider
        label="Brillo emisivo"
        value={config.emissiveIntensity}
        min={0}
        max={1}
        step={0.1}
        onChange={(v) => onChange({ ...config, emissiveIntensity: v })}
      />
    </div>
  );
}

/**
 * Controles de iluminación
 */
function IluminacionControls({ config, onChange }) {
  const modos = [
    { id: 'dia', label: 'Día', icon: Sun, color: '#87CEEB' },
    { id: 'tarde', label: 'Atardecer', icon: Sun, color: '#ff6b35' },
    { id: 'noche', label: 'Noche', icon: Moon, color: '#1a1a3e' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '4px' }}>
        Ambiente:
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        {modos.map(modo => {
          const Icon = modo.icon;
          return (
            <button
              key={modo.id}
              onClick={() => onChange({ ...config, lightingMode: modo.id })}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: config.lightingMode === modo.id ? modo.color : 'rgba(255,255,255,0.05)',
                color: config.lightingMode === modo.id ? '#000' : '#fff',
                cursor: 'pointer',
                fontSize: '0.7rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                fontWeight: config.lightingMode === modo.id ? '600' : '400'
              }}
            >
              <Icon size={18} />
              {modo.label}
            </button>
          );
        })}
      </div>

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />

      <ControlSlider
        label="Intensidad de luz"
        value={config.lightIntensity}
        min={0.1}
        max={2}
        step={0.1}
        onChange={(v) => onChange({ ...config, lightIntensity: v })}
      />

      <ControlSlider
        label="Ángulo de luz"
        value={config.lightAngle}
        min={0}
        max={360}
        step={15}
        onChange={(v) => onChange({ ...config, lightAngle: v })}
        unit="°"
      />

      <div style={{
        padding: '10px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        fontSize: '0.75rem',
        color: '#aaa'
      }}>
        <Grid3X3 size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
        La iluminación afecta cómo se ve el relieve y los materiales.
      </div>
    </div>
  );
}

/**
 * Componente slider reutilizable
 */
function ControlSlider({ label, value, min, max, step, onChange, unit = '' }) {
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '6px',
        fontSize: '0.75rem'
      }}>
        <span style={{ color: '#aaa' }}>{label}</span>
        <span style={{ color: 'white', fontWeight: '500' }}>
          {value.toFixed(step < 1 ? 2 : 0)}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          background: 'rgba(255,255,255,0.1)',
          outline: 'none',
          cursor: 'pointer',
          WebkitAppearance: 'none'
        }}
      />
    </div>
  );
}

export default Editor3DControls;
