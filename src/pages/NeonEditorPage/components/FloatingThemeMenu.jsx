import { useState, useRef, useEffect } from "react";
import { Palette, X, Check, LayoutList, Layers } from "lucide-react";

const THEMES = [
  { id: 'industrial', label: 'Industrial', color: '#ff6b00', gradient: 'linear-gradient(135deg, #ff6b00 0%, #ff8533 100%)' },
  { id: 'minimal', label: 'Minimal', color: '#333333', gradient: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)' },
  { id: 'cyberpunk', label: 'Cyber', color: '#00ff9f', gradient: 'linear-gradient(135deg, #00ffff 0%, #ff00ff 100%)' },
  { id: 'vaporwave', label: 'Retro', color: '#ff00ff', gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 100%)' },
  { id: 'brutalist', label: 'Brutal', color: '#ffffff', gradient: 'linear-gradient(135deg, #ff0000 0%, #000000 100%)' },
];

const MODOS = [
  { id: 'wizard', label: 'Por Pasos', icon: Layers, desc: 'Wizard paso a paso' },
  { id: 'completo', label: 'Todo Seguido', icon: LayoutList, desc: 'Formulario completo' },
];

export const FloatingThemeMenu = ({ 
  theme, 
  setTheme, 
  neonColor, 
  setNeonColor,
  modoVisualizacion,
  setModoVisualizacion
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentTheme = THEMES.find(t => t.id === theme) || THEMES[0];
  const currentModo = MODOS.find(m => m.id === modoVisualizacion) || MODOS[0];

  return (
    <div ref={menuRef} className="floating-theme-container">
      {/* Botón flotante */}
      <button
        className={`floating-theme-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: isOpen ? '#ff6b00' : currentTheme.gradient,
        }}
      >
        {isOpen ? <X size={24} /> : <Palette size={24} />}
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="floating-theme-menu">
          <div className="theme-menu-header">
            <Palette size={18} />
            <span>Tema del Editor</span>
          </div>

          <div className="theme-options-list">
            {THEMES.map((t) => (
              <button
                key={t.id}
                className={`theme-option-item ${theme === t.id ? 'active' : ''}`}
                onClick={() => {
                  setTheme(t.id);
                  setNeonColor(t.color);
                }}
              >
                <div 
                  className="theme-color-dot" 
                  style={{ background: t.gradient }}
                />
                <span className="theme-option-label">{t.label}</span>
                {theme === t.id && <Check size={16} className="theme-check" />}
              </button>
            ))}
          </div>

          <div className="theme-menu-divider" />

          {/* Selector de modo de visualización */}
          <div className="theme-menu-header">
            <currentModo.icon size={18} />
            <span>Modo de Vista</span>
          </div>

          <div className="theme-options-list">
            {MODOS.map((m) => (
              <button
                key={m.id}
                className={`theme-option-item ${modoVisualizacion === m.id ? 'active' : ''}`}
                onClick={() => setModoVisualizacion(m.id)}
              >
                <m.icon size={16} style={{ marginRight: 8, opacity: 0.7 }} />
                <span className="theme-option-label">{m.label}</span>
                {modoVisualizacion === m.id && <Check size={16} className="theme-check" />}
              </button>
            ))}
          </div>

          <div className="theme-menu-divider" />

          {/* Color picker personalizado */}
          <div className="theme-color-custom">
            <span>Color neón:</span>
            <div className="color-picker-wrapper">
              <input
                type="color"
                value={neonColor}
                onChange={(e) => setNeonColor(e.target.value)}
                className="theme-color-input"
              />
              <span className="color-hex">{neonColor}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
