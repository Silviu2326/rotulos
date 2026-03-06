import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Palette,
  Ruler,
  Type,
  Paintbrush,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Square,
  Circle,
  Triangle,
  Save,
  RotateCcw,
  Eye,
  Layout,
  Monitor,
  Smartphone,
  Upload,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  X,
  Droplet,
  Layers,
  Sun,
  Sparkles,
  Scissors,
  Image as ImageIcon,
} from "lucide-react";
import { useEditorConfig } from "../hooks/useEditorConfig";
import {
  PROMPTS_CATEGORIA,
  PROMPTS_NEGOCIO,
  getMejoraAleatoria,
  generarDescripcionMejorada,
} from "../data/prompts";
import {
  IlustracionCategoria,
  GaleriaCorporeas,
  MuestrasColorLED,
  MuestrasMaterialLaser,
  IconosNegocioLona,
  BannerEjemplo,
} from "../components/IlustracionProducto";
import "../styles/rotularte.css";

// ============================================
// COMPONENTE: COLOR PICKER HSB PROFESIONAL
// ============================================
const ColorPickerHSB = ({ selectedColors, onAddColor, onRemoveColor }) => {
  const [activeTab, setActiveTab] = useState("visualizer");
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [hexValue, setHexValue] = useState("#FF0000");
  const gradientRef = useRef(null);
  const hueRef = useRef(null);

  const hsbToHex = (h, s, b) => {
    const sNorm = s / 100;
    const bNorm = b / 100;
    const k = (n) => (n + h / 60) % 6;
    const f = (n) => bNorm * (1 - sNorm * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    const r = Math.round(f(5) * 255);
    const g = Math.round(f(3) * 255);
    const bVal = Math.round(f(1) * 255);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bVal.toString(16).padStart(2, "0")}`.toUpperCase();
  };

  const hexToHsb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const bVal = max;
    const s = max === 0 ? 0 : (max - min) / max;
    let h = 0;
    if (max !== min) {
      if (max === r) h = (g - b) / (max - min) + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / (max - min) + 2;
      else h = (r - g) / (max - min) + 4;
      h *= 60;
    }
    return { h, s: s * 100, b: bVal * 100 };
  };

  useEffect(() => {
    setHexValue(hsbToHex(hue, saturation, brightness));
  }, [hue, saturation, brightness]);

  const handleGradientClick = (e) => {
    if (!gradientRef.current) return;
    const rect = gradientRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setSaturation(x * 100);
    setBrightness((1 - y) * 100);
  };

  const handleHueClick = (e) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    setHue(x * 360);
  };

  const pantoneColors = [
    { hex: "#DA291C", name: "Rojo intenso" },
    { hex: "#E4002B", name: "Rojo brillante" },
    { hex: "#CE0058", name: "Magenta" },
    { hex: "#FF6900", name: "Naranja" },
    { hex: "#FEDD00", name: "Amarillo" },
    { hex: "#FFD100", name: "Dorado" },
    { hex: "#00A651", name: "Verde" },
    { hex: "#00B388", name: "Verde menta" },
    { hex: "#00A3E0", name: "Azul cielo" },
    { hex: "#0033A0", name: "Azul royal" },
    { hex: "#002855", name: "Azul marino" },
    { hex: "#6D2077", name: "Púrpura" },
    { hex: "#FFFFFF", name: "Blanco" },
    { hex: "#F5F5F5", name: "Gris claro" },
    { hex: "#888B8D", name: "Gris" },
    { hex: "#1D1D1D", name: "Negro" },
    { hex: "#D4AF37", name: "Dorado metalizado", gradient: "linear-gradient(135deg, #D4AF37, #FFD700, #B8860B)" },
    { hex: "#C0C0C0", name: "Plateado metalizado", gradient: "linear-gradient(135deg, #C0C0C0, #FFFFFF, #A8A8A8)" },
  ];

  return (
    <div className="color-picker-hsb">
      <div className="color-picker-tabs">
        <button
          className={`color-picker-tab ${activeTab === "visualizer" ? "active" : ""}`}
          onClick={() => setActiveTab("visualizer")}
        >
          🎨 Visualizador
        </button>
        <button
          className={`color-picker-tab ${activeTab === "palettes" ? "active" : ""}`}
          onClick={() => setActiveTab("palettes")}
        >
          📋 Paletas
        </button>
      </div>

      {activeTab === "visualizer" ? (
        <div className="color-tab-content">
          <div
            ref={gradientRef}
            className="color-gradient-box"
            style={{ background: `hsl(${hue}, 100%, 50%)` }}
            onClick={handleGradientClick}
          >
            <div
              className="color-gradient-overlay"
              style={{
                background: `linear-gradient(to right, white, transparent)`,
              }}
            />
            <div
              className="color-gradient-overlay"
              style={{
                background: `linear-gradient(to top, black, transparent)`,
              }}
            />
            <div
              className="color-picker-cursor"
              style={{
                left: `${saturation}%`,
                top: `${100 - brightness}%`,
                background: hexValue,
              }}
            />
          </div>
          <div
            ref={hueRef}
            className="color-hue-slider"
            onClick={handleHueClick}
          >
            <div
              className="hue-slider-thumb"
              style={{ left: `${(hue / 360) * 100}%` }}
            />
          </div>
          <div className="color-preview-row">
            <div
              className="color-preview-swatch"
              style={{ background: hexValue }}
            />
            <input
              type="text"
              className="color-hex-input"
              value={hexValue}
              onChange={(e) => {
                const val = e.target.value;
                setHexValue(val);
                if (/^#[0-9A-F]{6}$/i.test(val)) {
                  const hsb = hexToHsb(val);
                  setHue(hsb.h);
                  setSaturation(hsb.s);
                  setBrightness(hsb.b);
                }
              }}
              maxLength={7}
            />
            <button
              className="btn-add-color"
              onClick={() => onAddColor(hexValue)}
            >
              + Añadir
            </button>
          </div>
        </div>
      ) : (
        <div className="color-tab-content">
          <div className="pantone-palette">
            <div className="pantone-row">
              {pantoneColors.slice(0, 6).map((c) => (
                <button
                  key={c.hex}
                  className="color-swatch"
                  style={{
                    background: c.gradient || c.hex,
                    border: c.hex === "#FFFFFF" ? "1px solid #333" : undefined,
                  }}
                  title={c.name}
                  onClick={() => onAddColor(c.hex)}
                />
              ))}
            </div>
            <div className="pantone-row">
              {pantoneColors.slice(6, 12).map((c) => (
                <button
                  key={c.hex}
                  className="color-swatch"
                  style={{
                    background: c.gradient || c.hex,
                    border: c.hex === "#FFFFFF" ? "1px solid #333" : undefined,
                  }}
                  title={c.name}
                  onClick={() => onAddColor(c.hex)}
                />
              ))}
            </div>
            <div className="pantone-row">
              {pantoneColors.slice(12).map((c) => (
                <button
                  key={c.hex}
                  className="color-swatch"
                  style={{
                    background: c.gradient || c.hex,
                    border: c.hex === "#FFFFFF" ? "1px solid #333" : undefined,
                  }}
                  title={c.name}
                  onClick={() => onAddColor(c.hex)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Colores seleccionados */}
      {selectedColors.length > 0 && (
        <div className="selected-colors">
          {selectedColors.map((color, idx) => (
            <div key={idx} className="selected-color-chip">
              <div
                className="color-dot"
                style={{ background: color }}
              />
              <span>{color}</span>
              <button
                className="remove-color"
                onClick={() => onRemoveColor(idx)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// COMPONENTE: SELECTOR DE TIPO CORPÓREA
// ============================================
const CORPOTYPES = [
  { id: "aluminio-sin-luz", name: "Aluminio\nsin luz", icon: "🔩" },
  { id: "pvc", name: "PVC\nfresado", icon: "🎨" },
  { id: "aluminio-con-luz", name: "Aluminio\ncon luz", icon: "💡" },
  { id: "pvc-retroiluminadas", name: "PVC\nretroiluminado", icon: "✨" },
  { id: "metacrilato", name: "Metacrilato\nacrílico", icon: "💎" },
  { id: "pvc-impreso-uv", name: "PVC impreso\nUV", icon: "🖨️" },
  { id: "aluminio-retroiluminada", name: "Aluminio\nretroiluminado", icon: "🌟" },
  { id: "dibond-sin-relieve", name: "Dibond\nsin relieve", icon: "📐" },
];

const RELIEF_OPTIONS = {
  "aluminio-sin-luz": ["3cm", "5cm", "8cm", "10cm"],
  "pvc": ["2cm", "3cm", "5cm", "8cm", "10cm", "15cm", "20cm"],
  "aluminio-con-luz": ["5cm", "8cm", "10cm"],
  "pvc-retroiluminadas": ["5cm", "8cm", "10cm", "15cm"],
  "metacrilato": ["2cm", "3cm", "5cm", "8cm", "10cm", "15cm", "20cm"],
  "pvc-impreso-uv": ["Sin relieve", "2cm", "3cm", "5cm"],
  "aluminio-retroiluminada": ["5cm", "8cm", "10cm"],
  "dibond-sin-relieve": ["Sin relieve"],
};

// ============================================
// COMPONENTE: COLOR DE LUZ LED
// ============================================
const LED_COLORS = [
  { id: "blanco-calido", name: "Blanco\ncálido", color: "#FFF5E6" },
  { id: "blanco-frio", name: "Blanco\nfrío", color: "#E6F3FF" },
  { id: "rojo", name: "Rojo", color: "#FF3333" },
  { id: "verde", name: "Verde", color: "#33FF33" },
  { id: "azul-celeste", name: "Celeste", color: "#33CCFF" },
  { id: "azul", name: "Azul", color: "#3333FF" },
  { id: "naranja", name: "Naranja", color: "#FF9933" },
  { id: "amarillo", name: "Amarillo", color: "#FFFF33" },
  { id: "rosa", name: "Rosa", color: "#FF33CC" },
  { id: "morado", name: "Morado", color: "#9933FF" },
];

// ============================================
// COMPONENTE: MATERIAL CORTE LÁSER
// ============================================
const LASER_MATERIALS = [
  { id: "transparente", name: "METACRILATO\nTRANSPARENTE", style: { background: "linear-gradient(135deg, #e0f7fa, #fff)", border: "2px solid #b2ebf2" } },
  { id: "blanco", name: "METACRILATO\nBLANCO", style: { background: "#fafafa", border: "2px solid #e0e0e0" } },
  { id: "mdf", name: "MDF", style: { background: "#a1887f", border: "2px solid #8d6e63" } },
  { id: "oro-espejo", name: "METACRILATO\nORO ESPEJO", style: { background: "linear-gradient(135deg, #d4af37, #ffd700, #b8860b)", border: "2px solid #c9a227" } },
  { id: "plata-espejo", name: "METACRILATO\nPLATA ESPEJO", style: { background: "linear-gradient(135deg, #c0c0c0, #ffffff, #a8a8a8)", border: "2px solid #9e9e9e" } },
  { id: "rosa-espejo", name: "METACRILATO\nROSA ESPEJO", style: { background: "linear-gradient(135deg, #f8bbd9, #fce4ec, #f48fb1)", border: "2px solid #f06292" } },
];

// ============================================
// COMPONENTE: CONFIGURACIÓN LONAS
// ============================================
const LONA_BUSINESS_TYPES = [
  { id: "bar", name: "Bar", icon: "🍺" },
  { id: "restaurante", name: "Restaurante", icon: "🍽️" },
  { id: "tienda", name: "Tienda", icon: "🛍️" },
  { id: "peluqueria", name: "Peluquería", icon: "💈" },
  { id: "gimnasio", name: "Gimnasio", icon: "💪" },
  { id: "oficina", name: "Oficina", icon: "💼" },
  { id: "taller", name: "Taller", icon: "🔧" },
  { id: "clinica", name: "Clínica", icon: "🏥" },
  { id: "cafeteria", name: "Cafetería", icon: "☕" },
  { id: "panaderia", name: "Panadería", icon: "🥖" },
  { id: "floristeria", name: "Floristería", icon: "🌸" },
  { id: "tienda-mascotas", name: "Mascotas", icon: "🐾" },
  { id: "tienda-ropa", name: "Ropa", icon: "👕" },
  { id: "ferreteria", name: "Ferretería", icon: "🔨" },
  { id: "optica", name: "Óptica", icon: "👓" },
  { id: "farmacia", name: "Farmacia", icon: "💊" },
];

const LONA_STYLES = [
  { id: "festivo", name: "Festivo", preview: "linear-gradient(135deg, #ff6b6b, #feca57)" },
  { id: "elegante", name: "Elegante", preview: "linear-gradient(135deg, #2c3e50, #bdc3c7)" },
  { id: "retro", name: "Retro", preview: "linear-gradient(135deg, #f39c12, #e74c3c)" },
  { id: "moderno", name: "Moderno", preview: "linear-gradient(135deg, #3498db, #2ecc71)" },
  { id: "natural", name: "Natural", preview: "linear-gradient(135deg, #27ae60, #16a085)" },
  { id: "urbano", name: "Urbano", preview: "linear-gradient(135deg, #34495e, #95a5a6)" },
  { id: "playa", name: "Playa", preview: "linear-gradient(135deg, #00d2ff, #3a7bd5)" },
  { id: "minimalista", name: "Minimal", preview: "linear-gradient(135deg, #ecf0f1, #bdc3c7)" },
  { id: "industrial", name: "Industrial", preview: "linear-gradient(135deg, #7f8c8d, #2c3e50)" },
  { id: "vintage", name: "Vintage", preview: "linear-gradient(135deg, #d35400, #c0392b)" },
];

// Componente para el ColorPicker/ThemeSelector
const ColorPicker = ({ currentTheme, setTheme, currentColor, setColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  const colors = [
    { color: "#ff6b00", name: "Naranja Neón" },
    { color: "#00ff88", name: "Verde Neón" },
    { color: "#00d4ff", name: "Cian Neón" },
    { color: "#ff006e", name: "Rosa Neón" },
    { color: "#fb5607", name: "Coral" },
    { color: "#8338ec", name: "Púrpura" },
    { color: "#ffbe0b", name: "Amarillo" },
    { color: "#3a86ff", name: "Azul" },
  ];

  const themes = [
    {
      id: "industrial",
      name: "Industrial",
      desc: "⚡ Grid técnico visible / Monospace / Workshop oscuro",
      bg: "#0a0a0a",
      accent: "#ff6b00",
    },
    {
      id: "minimal",
      name: "Minimal",
      desc: "✨ Ultra aireado / Playfair Display / Sombras etéreas",
      bg: "#fafafa",
      accent: "#2d2d2d",
    },
    {
      id: "brutalist",
      name: "Brutalista",
      desc: "⚫ Negro absoluto / Bordes 3px / Sin redondeos",
      bg: "#000000",
      accent: "#ffffff",
    },
    {
      id: "vaporwave",
      name: "Vaporwave",
      desc: "🌆 Chrome & Gradientes / 3D Perspective / Glassmorphism",
      bg: "#0c0518",
      accent: "#ff71ce",
    },
    {
      id: "cyberpunk",
      name: "Cyberpunk",
      desc: "⚡ Futurista / Glitch effects / Neon glow",
      bg: "#050810",
      accent: "#00ff9f",
    },
  ];

  return (
    <>
      <button
        className="color-picker-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Cambiar colores"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
      </button>

      <div className={`color-picker-panel ${isOpen ? "active" : ""}`}>
        <div className="color-picker-header">
          <span>Personalizar</span>
          <button
            className="color-picker-close"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="color-presets">
          {colors.map((c) => (
            <button
              key={c.color}
              className={`color-preset ${currentColor === c.color ? "active" : ""}`}
              style={{ background: c.color }}
              onClick={() => setColor(c.color)}
              title={c.name}
            />
          ))}
        </div>

        <div className="custom-color-section">
          <label className="custom-color-label">Color Personalizado</label>
          <div className="color-input-wrapper">
            <input
              type="color"
              className="color-input"
              value={currentColor}
              onChange={(e) => setColor(e.target.value)}
            />
            <input
              type="text"
              className="color-hex-input"
              value={currentColor.toUpperCase()}
              onChange={(e) => setColor(e.target.value)}
              maxLength={7}
            />
          </div>
        </div>

        <div className="theme-section">
          <label className="theme-label">Estilo Visual</label>
          <div className="theme-options">
            {themes.map((t) => (
              <button
                key={t.id}
                className={`theme-btn ${currentTheme === t.id ? "active" : ""}`}
                onClick={() => setTheme(t.id)}
              >
                <div
                  className="theme-preview"
                  style={{
                    background: t.bg,
                    border: `2px solid ${t.id === "minimal" ? "#e5e5e5" : "#333"}`,
                    borderRadius:
                      t.id === "vaporwave" || t.id === "minimal" ? "8px" : "0",
                  }}
                >
                  <span
                    className="t-bg"
                    style={{
                      color: t.id === "minimal" ? "#999" : "#666",
                      fontSize: "0.5rem",
                    }}
                  >
                    BG
                  </span>
                  <span
                    className="t-accent"
                    style={{
                      color: t.accent,
                      fontSize: "0.6rem",
                      textShadow:
                        t.id === "vaporwave" ? "2px 2px #01cdfe" : "none",
                    }}
                  >
                    A
                  </span>
                </div>
                <div className="theme-info">
                  <span className="theme-name">{t.name}</span>
                  <span className="theme-desc">{t.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// Definición completa de todos los pasos posibles
const ALL_STEPS = {
  type: {
    id: "type",
    title: "Tipo",
    icon: Palette,
    description: "Selecciona el tipo de rótulo",
  },
  dimensions: {
    id: "dimensions",
    title: "Dimensiones",
    icon: Ruler,
    description: "Define tamaño y materiales",
  },
  design: {
    id: "design",
    title: "Diseño",
    icon: Type,
    description: "Añade texto y elementos",
  },
  colors: {
    id: "colors",
    title: "Estilo",
    icon: Paintbrush,
    description: "Personaliza colores y acabados",
  },
  extras: {
    id: "extras",
    title: "Extras",
    icon: CheckCircle,
    description: "Opciones adicionales",
  },
};

const ROTULO_TYPES = [
  {
    id: "luminoso",
    name: "Rótulo Luminoso",
    icon: Lightbulb,
    description: "Ideal para negocios que operan de noche",
    price: "Desde €450",
    popular: true,
  },
  {
    id: "vinilo",
    name: "Vinilo Escaparate",
    icon: Square,
    description: "Perfecto para escaparates y cristales",
    price: "Desde €120",
    popular: false,
  },
  {
    id: "corporeas",
    name: "Letras Corpóreas",
    icon: Type,
    description: "Letras en 3D con gran impacto visual",
    price: "Desde €890",
    popular: true,
  },
  {
    id: "panel",
    name: "Panel Publicitario",
    icon: Square,
    description: "Gran formato para exteriores",
    price: "Desde €320",
    popular: false,
  },
  {
    id: "metalico",
    name: "Rótulo Metálico",
    icon: Circle,
    description: "Elegante y duradero en metal",
    price: "Desde €280",
    popular: false,
  },
  {
    id: "bandera",
    name: "Banderola",
    icon: Triangle,
    description: "Visible desde ambos lados",
    price: "Desde €180",
    popular: false,
  },
  {
    id: "lonas",
    name: "Lonas y Pancartas",
    icon: Layout,
    description: "Ideal para eventos y promociones",
    price: "Desde €89",
    popular: false,
  },
  {
    id: "neon",
    name: "Neón LED",
    icon: Sparkles,
    description: "Neones realistas con tubos de vidrio brillantes",
    price: "Desde €350",
    popular: true,
  },
];

const MATERIALS = [
  {
    id: "pvc",
    name: "PVC Espumado",
    price: "Económico",
    features: ["Ligero", "Fácil instalación", "Interior/Exterior"],
  },
  {
    id: "aluminio",
    name: "Aluminio Composite",
    price: "Premium",
    features: ["Muy duradero", "Resistente", "Alta calidad"],
  },
  {
    id: "metacrilato",
    name: "Metacrilato",
    price: "Premium",
    features: ["Efecto cristal", "Luminoso", "Elegante"],
  },
  {
    id: "acero",
    name: "Acero Inoxidable",
    price: "Luxury",
    features: ["Máxima durabilidad", "Acabado profesional", "Intemporal"],
  },
];

const COLORS = [
  { id: "white", name: "Blanco", hex: "#FFFFFF" },
  { id: "black", name: "Negro", hex: "#111827" },
  { id: "red", name: "Rojo", hex: "#DC2626" },
  { id: "blue", name: "Azul", hex: "#2563EB" },
  { id: "green", name: "Verde", hex: "#16A34A" },
  { id: "yellow", name: "Amarillo", hex: "#FACC15" },
  { id: "purple", name: "Morado", hex: "#7C3AED" },
  { id: "orange", name: "Naranja", hex: "#F97316" },
];

const FONTS = [
  { id: "modern", name: "Moderna", sample: "Moderno" },
  { id: "classic", name: "Clásica", sample: "Clásico" },
  { id: "bold", name: "Bold", sample: "BOLD" },
  { id: "elegant", name: "Elegante", sample: "Elegante" },
  { id: "retro", name: "Retro", sample: "Retro" },
  { id: "minimal", name: "Minimalista", sample: "Clean" },
];

const ESTILOS = [
  { id: "moderno", name: "Moderno" },
  { id: "clasico", name: "Clásico" },
  { id: "elegante", name: "Elegante" },
  { id: "minimalista", name: "Minimalista" },
  { id: "llamativo", name: "Llamativo" },
  { id: "industrial", name: "Industrial" },
  { id: "vintage", name: "Vintage" },
  { id: "neon", name: "Neón" },
  { id: "luxury", name: "Luxury" },
];

export default function EditorPage({ standalone = false }) {
  const { config, getActiveSteps, isStepEnabled, getCustomFields } =
    useEditorConfig();
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState("type");
  const [showPreview, setShowPreview] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("rotularte-theme") || "industrial",
  );
  const [neonColor, setNeonColor] = useState(
    () => localStorage.getItem("rotularte-color") || "#ff6b00",
  );

  // ============================================
  // ESTADO: FormData con todos los campos nuevos
  // ============================================
  const [formData, setFormData] = useState({
    // Campos originales
    tipo: "",
    material: "",
    ancho: 100,
    alto: 50,
    texto: "",
    fuente: "modern",
    colorFondo: "white",
    colorTexto: "black",
    iluminacion: false,
    instalacion: false,
    
    // Campos nuevos del PHP
    textoAdicional: "",
    logo: null,
    estilo: "moderno",
    orientacion: "horizontal",
    
    // Corpóreas
    corporeaTipo: "aluminio-sin-luz",
    corporeaRelieve: "5cm",
    
    // Iluminación LED
    ledColor: "blanco-calido",
    
    // Material corte láser
    laserMaterial: "transparente",
    
    // Lonas
    lonaBusinessType: "",
    lonaStyle: "moderno",
    
    // Colores HSB
    coloresSeleccionados: [],
    
    // Descripción para IA
    descripcion: "",
    
    // Campos personalizados
    customFields: {},
  });

  // Inicializar campos personalizados
  useEffect(() => {
    const customFields = getCustomFields();
    if (customFields.length > 0) {
      setFormData((prev) => {
        const newCustomFields = { ...prev.customFields };
        customFields.forEach((field) => {
          if (!(field.name in newCustomFields)) {
            newCustomFields[field.name] =
              field.type === "checkbox" ? false : "";
          }
        });
        return { ...prev, customFields: newCustomFields };
      });
    }
  }, [config.customFields]);

  // Aplicar tema y color
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty("--color-neon", neonColor);
    document.documentElement.style.setProperty("--color-neon-glow", neonColor);

    const themeConfig = {
      industrial: {
        bg: "#0a0a0a",
        bgAlt: "#111111",
        accent: "#ffffff",
        text: "#e0e0e0",
        textMuted: "#666666",
        metal: "#2a2a2a",
      },
      minimal: {
        bg: "#fafafa",
        bgAlt: "#ffffff",
        accent: "#1a1a1a",
        text: "#333333",
        textMuted: "#888888",
        metal: "#e5e5e5",
      },
      brutalist: {
        bg: "#000000",
        bgAlt: "#000000",
        accent: "#ffffff",
        text: "#ffffff",
        textMuted: "#666666",
        metal: "#ffffff",
      },
      vaporwave: {
        bg: "#0c0518",
        bgAlt: "#120824",
        accent: "#ffffff",
        text: "#e0e0ff",
        textMuted: "#8a7a9e",
        metal: "#1a0f2e",
      },
      cyberpunk: {
        bg: "#050810",
        bgAlt: "#0a1020",
        accent: "#ffffff",
        text: "#a0ffe0",
        textMuted: "#507060",
        metal: "#102030",
      },
    };

    const t = themeConfig[theme] || themeConfig.industrial;
    document.documentElement.style.setProperty("--color-bg", t.bg);
    document.documentElement.style.setProperty("--color-bg-alt", t.bgAlt);
    document.documentElement.style.setProperty("--color-accent", t.accent);
    document.documentElement.style.setProperty("--color-text", t.text);
    document.documentElement.style.setProperty("--color-text-muted", t.textMuted);
    document.documentElement.style.setProperty("--color-metal", t.metal);

    localStorage.setItem("rotularte-theme", theme);
    localStorage.setItem("rotularte-color", neonColor);
  }, [theme, neonColor]);

  const activeSteps = useMemo(() => getActiveSteps(), [getActiveSteps]);
  const customFields = useMemo(() => getCustomFields(), [getCustomFields]);

  const STEPS = useMemo(() => {
    return activeSteps.map((step, index) => ({
      id: index + 1,
      key: step.key,
      title: ALL_STEPS[step.key]?.title || step.key,
      icon: ALL_STEPS[step.key]?.icon || Square,
      description: ALL_STEPS[step.key]?.description || "",
    }));
  }, [activeSteps]);

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const calculatePrice = () => {
    let base = 0;
    switch (formData.tipo) {
      case "luminoso":
        base = 450;
        break;
      case "vinilo":
        base = 120;
        break;
      case "corporeas":
        base = 890;
        break;
      case "panel":
        base = 320;
        break;
      case "metalico":
        base = 280;
        break;
      case "bandera":
        base = 180;
        break;
      case "lonas":
        base = 89;
        break;
      case "neon":
        base = 350;
        break;
      default:
        base = 0;
    }

    const area = (formData.ancho * formData.alto) / 10000;
    let materialMultiplier = 1;
    switch (formData.material) {
      case "aluminio":
        materialMultiplier = 1.5;
        break;
      case "metacrilato":
        materialMultiplier = 2;
        break;
      case "acero":
        materialMultiplier = 3;
        break;
      default:
        materialMultiplier = 1;
    }

    let extras = 0;
    if (formData.iluminacion) extras += 150;
    if (formData.instalacion) extras += 80;

    return Math.round(base + area * 50 * materialMultiplier + extras);
  };

  const updateCustomField = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [fieldName]: value,
      },
    }));
  };

  const handleAddColor = (color) => {
    if (!formData.coloresSeleccionados.includes(color)) {
      setFormData((prev) => ({
        ...prev,
        coloresSeleccionados: [...prev.coloresSeleccionados, color],
      }));
    }
  };

  const handleRemoveColor = (index) => {
    setFormData((prev) => ({
      ...prev,
      coloresSeleccionados: prev.coloresSeleccionados.filter((_, i) => i !== index),
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateFormData("logo", event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Renderizar campo personalizado
  const renderCustomField = (field) => {
    const value = formData.customFields[field.name] ?? "";

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "url":
        return (
          <div className="single-sidebar-field" key={field.id}>
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type={field.type}
              value={value}
              onChange={(e) => updateCustomField(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
            {field.helpText && <small>{field.helpText}</small>}
          </div>
        );

      case "textarea":
        return (
          <div className="single-sidebar-field" key={field.id}>
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => updateCustomField(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              rows={3}
            />
            {field.helpText && <small>{field.helpText}</small>}
          </div>
        );

      case "number":
        return (
          <div className="single-sidebar-field" key={field.id}>
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => updateCustomField(field.name, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
            {field.helpText && <small>{field.helpText}</small>}
          </div>
        );

      case "select":
        return (
          <div className="single-sidebar-field" key={field.id}>
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => updateCustomField(field.name, e.target.value)}
              required={field.required}
            >
              <option value="">{field.placeholder || "Seleccionar..."}</option>
              {field.options?.map((option, idx) => (
                <option key={idx} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {field.helpText && <small>{field.helpText}</small>}
          </div>
        );

      case "checkbox":
        return (
          <label className="single-sidebar-checkbox" key={field.id}>
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => updateCustomField(field.name, e.target.checked)}
            />
            <span>{field.label}</span>
          </label>
        );

      case "radio":
        return (
          <div className="single-sidebar-field" key={field.id}>
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <div className="single-sidebar-radio-group">
              {field.options?.map((option, idx) => (
                <label key={idx} className="radio-option">
                  <input
                    type="radio"
                    name={field.name}
                    value={option}
                    checked={value === option}
                    onChange={(e) =>
                      updateCustomField(field.name, e.target.value)
                    }
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
            {field.helpText && <small>{field.helpText}</small>}
          </div>
        );

      case "date":
        return (
          <div className="single-sidebar-field" key={field.id}>
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <input
              type="date"
              value={value}
              onChange={(e) => updateCustomField(field.name, e.target.value)}
              required={field.required}
            />
            {field.helpText && <small>{field.helpText}</small>}
          </div>
        );

      case "color":
        return (
          <div className="single-sidebar-field" key={field.id}>
            <label>
              {field.label}
              {field.required && <span className="required">*</span>}
            </label>
            <div className="color-field-input">
              <input
                type="color"
                value={value || "#000000"}
                onChange={(e) => updateCustomField(field.name, e.target.value)}
              />
              <input
                type="text"
                value={value}
                onChange={(e) => updateCustomField(field.name, e.target.value)}
                placeholder="#000000"
              />
            </div>
            {field.helpText && <small>{field.helpText}</small>}
          </div>
        );

      default:
        return null;
    }
  };

  // ==================== RENDERIZADO DE SECCIONES ====================

  // Mapeo de imágenes para el paso 1
  const TYPE_IMAGES = {
    'rotulos': '/img/rotulemos-rotulo-luminoso.webp',
    'letras-neon': '/img/rotulo-de-neon-.webp',
    'letras-corporeas': '/img/letras-retroiluminadas.webp',
    'lonas-pancartas': '/img/lonas-y-pancartas-publicitarias-comprar.webp',
    'vinilos': '/img/vinilo-miccroperforado.webp',
    'banderolas': '/img/banderola-luminosa.webp',
    'rigidos-impresos': '/img/PVC-FOREX.webp',
    'rollup': '/img/ROLL-UP-DISPLAY.jpg',
    'photocall': '/img/photocall-pop-up.jpg',
    'carteles-inmobiliarios': '/img/carteles-inmobiliaria.webp',
    'mupis': '/img/mupi-publicitario.webp',
    'flybanner': '/img/fly-banneer.webp'
  };

  const renderTypeSection = () => (
    <div className="wizard-content">
      <h3 className="wizard-title">Selecciona el tipo de rótulo</h3>
      <p className="wizard-subtitle">
        Elige el tipo que mejor se adapte a tu negocio
      </p>

      <div className="wizard-grid">
        {ROTULO_TYPES.map((tipo) => {
          const TypeIcon = tipo.icon;
          const isSelected = formData.tipo === tipo.id;
          const imageUrl = TYPE_IMAGES[tipo.id];

          return (
            <button
              key={tipo.id}
              className={`wizard-card ${isSelected ? "wizard-card-selected" : ""}`}
              onClick={() => updateFormData("tipo", tipo.id)}
            >
              {tipo.popular && (
                <span className="wizard-card-badge">Popular</span>
              )}
              {/* Imagen del producto */}
              <div className="wizard-card-image">
                <img 
                  src={imageUrl} 
                  alt={tipo.name}
                  onError={(e) => {
                    // Si falla la imagen, mostrar el icono
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="wizard-card-icon fallback-icon" style={{ display: 'none' }}>
                  <TypeIcon size={32} />
                </div>
              </div>
              <h4 className="wizard-card-title">{tipo.name}</h4>
              <p className="wizard-card-description">{tipo.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderDimensionsSection = () => (
    <div className="wizard-content">
      <h3 className="wizard-title">Dimensiones y materiales</h3>
      <p className="wizard-subtitle">Define el tamaño y elige el material</p>

      <div className="wizard-section">
        <h4 className="wizard-section-title">Dimensiones (cm)</h4>
        <div className="wizard-dimensions">
          <div className="wizard-dimension-input">
            <label>Ancho</label>
            <input
              type="number"
              value={formData.ancho}
              onChange={(e) =>
                updateFormData("ancho", parseInt(e.target.value) || 0)
              }
              min="10"
              max="500"
            />
            <span>cm</span>
          </div>

          <div className="wizard-dimension-x">×</div>

          <div className="wizard-dimension-input">
            <label>Alto</label>
            <input
              type="number"
              value={formData.alto}
              onChange={(e) =>
                updateFormData("alto", parseInt(e.target.value) || 0)
              }
              min="10"
              max="500"
            />
            <span>cm</span>
          </div>
        </div>
        
        {/* Selector de orientación */}
        <div style={{ marginTop: "1rem" }}>
          <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem", display: "block" }}>
            📐 Orientación del diseño:
          </label>
          <div className="style-pills">
            {[
              { id: "horizontal", name: "↔️ Horizontal" },
              { id: "vertical", name: "↕️ Vertical" },
              { id: "cuadrado", name: "⬜ Cuadrado" },
            ].map((o) => (
              <button
                key={o.id}
                className={`style-pill ${formData.orientacion === o.id ? "active" : ""}`}
                onClick={() => updateFormData("orientacion", o.id)}
              >
                {o.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="wizard-dimension-preview">
          <div
            className="wizard-preview-box"
            style={{
              width: `${Math.min(formData.ancho, 300)}px`,
              height: `${Math.min(formData.alto, 150)}px`,
            }}
          >
            <span>
              {formData.ancho} × {formData.alto} cm
            </span>
          </div>
        </div>
      </div>

      <div className="wizard-section">
        <h4 className="wizard-section-title">Material</h4>
        <div className="wizard-materials">
          {MATERIALS.map((material) => {
            const isSelected = formData.material === material.id;
            return (
              <button
                key={material.id}
                className={`wizard-material ${isSelected ? "wizard-material-selected" : ""}`}
                onClick={() => updateFormData("material", material.id)}
              >
                <div className="wizard-material-header">
                  <h5>{material.name}</h5>
                  <span className="wizard-material-price">
                    {material.price}
                  </span>
                </div>
                <ul className="wizard-material-features">
                  {material.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderDesignSection = () => (
    <div className="wizard-content">
      <h3 className="wizard-title">Diseño y texto</h3>
      <p className="wizard-subtitle">Añade el texto y elige la tipografía</p>

      <div className="wizard-section">
        <label className="wizard-label">Texto del rótulo</label>
        <input
          type="text"
          className="wizard-text-input"
          placeholder="Escribe el texto de tu rótulo..."
          value={formData.texto}
          onChange={(e) => updateFormData("texto", e.target.value)}
          maxLength={50}
        />
        <span className="wizard-char-count">
          {formData.texto.length}/50 caracteres
        </span>
      </div>

      {/* Texto adicional */}
      <div className="wizard-section">
        <label className="wizard-label">
          Texto adicional <small>(teléfono, eslogan...)</small>
        </label>
        <input
          type="text"
          className="wizard-text-input"
          placeholder="Ej: Tel: 666 777 888, Desde 1990..."
          value={formData.textoAdicional}
          onChange={(e) => updateFormData("textoAdicional", e.target.value)}
          maxLength={100}
        />
      </div>

      {/* Upload de logo */}
      <div className="wizard-section">
        <h4 className="wizard-section-title">Logo existente <small>(opcional)</small></h4>
        <div className="image-upload-large">
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            style={{ display: "none" }}
            id="logo-upload"
          />
          <label htmlFor="logo-upload" style={{ cursor: "pointer", width: "100%" }}>
            {formData.logo ? (
              <div className="upload-preview" style={{ display: "inline-block", position: "relative" }}>
                <img src={formData.logo} alt="Logo" style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: "8px" }} />
                <button
                  className="upload-remove"
                  onClick={(e) => {
                    e.preventDefault();
                    updateFormData("logo", null);
                  }}
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <ImageIcon size={32} />
                <span>Subir mi logo</span>
                <small>PNG o JPG - Se integrará en el diseño</small>
              </div>
            )}
          </label>
        </div>
      </div>

      {config.enableImageUpload && (
        <div className="wizard-section">
          <h4 className="wizard-section-title">Subir diseño propio</h4>
          <div className="image-upload-large">
            <div className="upload-placeholder">
              <Upload size={32} />
              <span>Arrastra tu diseño aquí o haz clic para subir</span>
              <small>
                Formatos: {config.allowedFormats.join(", ")}. Máx:{" "}
                {config.maxUploadSize}MB
              </small>
            </div>
            <input
              type="file"
              accept={config.allowedFormats.map((f) => `.${f}`).join(",")}
            />
          </div>
        </div>
      )}

      <div className="wizard-section">
        <h4 className="wizard-section-title">Tipografía</h4>
        <div className="wizard-fonts">
          {FONTS.map((font) => {
            const isSelected = formData.fuente === font.id;
            return (
              <button
                key={font.id}
                className={`wizard-font ${isSelected ? "wizard-font-selected" : ""}`}
                onClick={() => updateFormData("fuente", font.id)}
                style={{ fontFamily: font.id }}
              >
                <span className="wizard-font-sample">{font.sample}</span>
                <span className="wizard-font-name">{font.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Descripción para IA */}
      <div className="wizard-section">
        <h4 className="wizard-section-title">Describe tu diseño</h4>
        <div className="textarea-wrap">
          <textarea
            className="wizard-textarea"
            placeholder="Ej: Logo de tijeras elegante, letras cursivas brillantes..."
            value={formData.descripcion}
            onChange={(e) => updateFormData("descripcion", e.target.value)}
            rows={4}
          />
          <button
            type="button"
            className="btn-improve"
            onClick={() => {
              if (!formData.descripcion.trim()) {
                alert("Por favor, escribe una descripción primero");
                return;
              }
              const mejorada = generarDescripcionMejorada(
                formData.descripcion,
                formData.tipo,
                formData.estilo,
                formData.lonaBusinessType
              );
              updateFormData("descripcion", mejorada);
            }}
            disabled={!formData.descripcion.trim()}
          >
            <Sparkles size={16} />
            Mejorar con IA
          </button>
        </div>
        
        {/* Información de prompts disponibles */}
        {formData.tipo && (
          <div className="prompt-info" style={{ 
            marginTop: "0.75rem", 
            padding: "0.75rem", 
            background: "var(--color-bg)", 
            border: "1px solid var(--color-metal)",
            fontSize: "0.8rem",
            color: "var(--color-text-muted)"
          }}>
            <strong style={{ color: "var(--color-neon)" }}>
              {PROMPTS_CATEGORIA[formData.tipo]?.contexto || "Rótulo personalizado"}
            </strong>
            <p style={{ margin: "0.25rem 0 0" }}>
              Estilo {formData.estilo}: {getDescripcionEstilo(formData.tipo, formData.estilo)}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderColorsSection = () => (
    <div className="wizard-content">
      <h3 className="wizard-title">Colores, estilo y acabados</h3>
      <p className="wizard-subtitle">Personaliza los colores y añade extras</p>

      {/* Color Picker HSB Profesional */}
      <div className="wizard-section">
        <h4 className="wizard-section-title">🎨 Colores del diseño</h4>
        <ColorPickerHSB
          selectedColors={formData.coloresSeleccionados}
          onAddColor={handleAddColor}
          onRemoveColor={handleRemoveColor}
        />
      </div>

      {/* Estilos */}
      <div className="wizard-section">
        <h4 className="wizard-section-title">Estilo visual</h4>
        <div className="style-pills">
          {ESTILOS.map((estilo) => (
            <button
              key={estilo.id}
              className={`style-pill ${formData.estilo === estilo.id ? "active" : ""}`}
              onClick={() => updateFormData("estilo", estilo.id)}
            >
              {estilo.name}
            </button>
          ))}
        </div>
      </div>

      {/* Colores básicos (originales) */}
      <div className="wizard-section">
        <h4 className="wizard-section-title">Color de fondo</h4>
        <div className="wizard-colors">
          {COLORS.map((color) => (
            <button
              key={color.id}
              className={`wizard-color ${formData.colorFondo === color.id ? "wizard-color-selected" : ""}`}
              onClick={() => updateFormData("colorFondo", color.id)}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {formData.colorFondo === color.id && (
                <CheckCircle
                  size={20}
                  color={color.id === "white" ? "#000" : "#fff"}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="wizard-section">
        <h4 className="wizard-section-title">Color del texto</h4>
        <div className="wizard-colors">
          {COLORS.map((color) => (
            <button
              key={color.id}
              className={`wizard-color ${formData.colorTexto === color.id ? "wizard-color-selected" : ""}`}
              onClick={() => updateFormData("colorTexto", color.id)}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {formData.colorTexto === color.id && (
                <CheckCircle
                  size={20}
                  color={color.id === "white" ? "#000" : "#fff"}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de tipos corpóreas (solo visible si tipo es corpóreas) */}
      {formData.tipo === "corporeas" && (
        <>
          <div className="wizard-section">
            <h4 className="wizard-section-title">🔤 Tipo de letra corpórea</h4>
            <div className="corporea-types-grid">
              {CORPOTYPES.map((tipo) => (
                <button
                  key={tipo.id}
                  className={`corporea-type-btn ${formData.corporeaTipo === tipo.id ? "active" : ""}`}
                  onClick={() => {
                    updateFormData("corporeaTipo", tipo.id);
                    // Set default relief for this type
                    const defaultRelief = RELIEF_OPTIONS[tipo.id]?.[0] || "5cm";
                    updateFormData("corporeaRelieve", defaultRelief);
                  }}
                >
                  <div className="type-icon">{tipo.icon}</div>
                  <div className="type-name">{tipo.name}</div>
                </button>
              ))}
            </div>
            
            {/* Galería visual de ejemplos */}
            <GaleriaCorporeas 
              tipoSeleccionado={formData.corporeaTipo}
              onSelect={(tipo) => {
                updateFormData("corporeaTipo", tipo);
                const defaultRelief = RELIEF_OPTIONS[tipo]?.[0] || "5cm";
                updateFormData("corporeaRelieve", defaultRelief);
              }}
            />
          </div>

          {/* Selector de relieve/espesor */}
          <div className="wizard-section">
            <h4 className="wizard-section-title">📏 Espesor de las letras</h4>
            <div className="relief-options">
              {RELIEF_OPTIONS[formData.corporeaTipo]?.map((relieve) => (
                <button
                  key={relieve}
                  className={`relief-option ${formData.corporeaRelieve === relieve ? "active" : ""}`}
                  onClick={() => updateFormData("corporeaRelieve", relieve)}
                >
                  <div className="relief-value">{relieve}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Color de luz LED (para tipos iluminados) */}
          {(formData.corporeaTipo?.includes("luz") || formData.corporeaTipo?.includes("retro")) && (
            <div className="wizard-section">
              <h4 className="wizard-section-title">💡 Color de luz LED</h4>
              <p className="text-sm text-gray-500 mb-2">Selecciona el color de iluminación</p>
              <MuestrasColorLED 
                colorSeleccionado={formData.ledColor}
                onSelect={(color) => updateFormData("ledColor", color)}
              />
            </div>
          )}

          {/* Material corte láser (solo para metacrilato) */}
          {formData.corporeaTipo === "metacrilato" && (
            <div className="wizard-section">
              <h4 className="wizard-section-title">✂️ Material corte láser</h4>
              <p className="text-sm text-gray-500 mb-2">Selecciona el material para el corte láser</p>
              <MuestrasMaterialLaser 
                materialSeleccionado={formData.laserMaterial}
                onSelect={(material) => updateFormData("laserMaterial", material)}
              />
            </div>
          )}
        </>
      )}

      {/* Configuración especial para lonas */}
      {formData.tipo === "lonas" && (
        <div className="wizard-section lona-section">
          <h4 className="wizard-section-title">🏪 Configuración de lona</h4>
          
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem", display: "block" }}>
              Tipo de negocio (para fondo temático):
            </label>
            <IconosNegocioLona 
              tipoSeleccionado={formData.lonaBusinessType}
              onSelect={(tipo) => updateFormData("lonaBusinessType", tipo)}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem", display: "block" }}>
              Estilo del fondo:
            </label>
            <div className="lona-style-grid">
              {LONA_STYLES.map((s) => (
                <button
                  key={s.id}
                  className={`lona-style-btn ${formData.lonaStyle === s.id ? "active" : ""}`}
                  onClick={() => updateFormData("lonaStyle", s.id)}
                >
                  <div className="lona-style-preview" style={{ background: s.preview }} />
                  <div className="lona-style-name">{s.name}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="lona-info-box" style={{ marginTop: "1rem" }}>
            💡 <strong>Sistema Híbrido:</strong> La IA genera un fondo decorativo temático 
            (sin texto), y superponemos tu texto y logo con perfección garantizada.
          </div>
        </div>
      )}

      <div className="wizard-section">
        <h4 className="wizard-section-title">Extras</h4>
        <div className="wizard-extras">
          <label className="wizard-checkbox">
            <input
              type="checkbox"
              checked={formData.iluminacion}
              onChange={(e) => updateFormData("iluminacion", e.target.checked)}
            />
            <span className="wizard-checkbox-label">
              <strong>Iluminación LED</strong>
              {config.showPricePreview && <span>+€150</span>}
            </span>
          </label>

          <label className="wizard-checkbox">
            <input
              type="checkbox"
              checked={formData.instalacion}
              onChange={(e) => updateFormData("instalacion", e.target.checked)}
            />
            <span className="wizard-checkbox-label">
              <strong>Instalación profesional</strong>
              {config.showPricePreview && <span>+€80</span>}
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderExtrasSection = () => (
    <div className="wizard-content">
      <h3 className="wizard-title">Opciones adicionales</h3>
      <p className="wizard-subtitle">Añade extras a tu pedido</p>

      {config.showStockWarnings && (
        <div className="wizard-alert wizard-alert-info">
          <AlertCircle size={20} />
          <span>Todos los materiales están disponibles en stock</span>
        </div>
      )}

      <div className="wizard-section">
        <h4 className="wizard-section-title">Servicios adicionales</h4>
        <div className="wizard-extras">
          <label className="wizard-checkbox">
            <input
              type="checkbox"
              checked={formData.iluminacion}
              onChange={(e) => updateFormData("iluminacion", e.target.checked)}
            />
            <span className="wizard-checkbox-label">
              <strong>Iluminación LED integrada</strong>
              {config.showPricePreview && <span>+€150</span>}
            </span>
          </label>

          <label className="wizard-checkbox">
            <input
              type="checkbox"
              checked={formData.instalacion}
              onChange={(e) => updateFormData("instalacion", e.target.checked)}
            />
            <span className="wizard-checkbox-label">
              <strong>Instalación profesional incluida</strong>
              {config.showPricePreview && <span>+€80</span>}
            </span>
          </label>

          <label className="wizard-checkbox">
            <input type="checkbox" />
            <span className="wizard-checkbox-label">
              <strong>Garantía extendida (5 años)</strong>
              {config.showPricePreview && <span>+€50</span>}
            </span>
          </label>

          <label className="wizard-checkbox">
            <input type="checkbox" />
            <span className="wizard-checkbox-label">
              <strong>Mantenimiento anual</strong>
              {config.showPricePreview && <span>+€30/año</span>}
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSummarySection = () => (
    <div className="wizard-content">
      <h3 className="wizard-title">Resumen de tu pedido</h3>
      <p className="wizard-subtitle">
        Revisa todos los detalles antes de confirmar
      </p>

      <div className="wizard-summary">
        {isStepEnabled("type") && (
          <div className="wizard-summary-item">
            <span className="wizard-summary-label">Tipo</span>
            <span className="wizard-summary-value">
              {ROTULO_TYPES.find((t) => t.id === formData.tipo)?.name ||
                "No seleccionado"}
            </span>
          </div>
        )}

        {isStepEnabled("dimensions") && (
          <>
            <div className="wizard-summary-item">
              <span className="wizard-summary-label">Dimensiones</span>
              <span className="wizard-summary-value">
                {formData.ancho} × {formData.alto} cm
              </span>
            </div>
            <div className="wizard-summary-item">
              <span className="wizard-summary-label">Orientación</span>
              <span className="wizard-summary-value">{formData.orientacion}</span>
            </div>
            <div className="wizard-summary-item">
              <span className="wizard-summary-label">Material</span>
              <span className="wizard-summary-value">
                {MATERIALS.find((m) => m.id === formData.material)?.name ||
                  "No seleccionado"}
              </span>
            </div>
          </>
        )}

        {isStepEnabled("design") && (
          <>
            <div className="wizard-summary-item">
              <span className="wizard-summary-label">Texto</span>
              <span className="wizard-summary-value">
                {formData.texto || "Sin texto"}
              </span>
            </div>
            {formData.textoAdicional && (
              <div className="wizard-summary-item">
                <span className="wizard-summary-label">Texto adicional</span>
                <span className="wizard-summary-value">{formData.textoAdicional}</span>
              </div>
            )}
            <div className="wizard-summary-item">
              <span className="wizard-summary-label">Fuente</span>
              <span className="wizard-summary-value">
                {FONTS.find((f) => f.id === formData.fuente)?.name}
              </span>
            </div>
          </>
        )}

        {isStepEnabled("colors") && (
          <>
            <div className="wizard-summary-item">
              <span className="wizard-summary-label">Estilo</span>
              <span className="wizard-summary-value">
                {ESTILOS.find((e) => e.id === formData.estilo)?.name}
              </span>
            </div>
            <div className="wizard-summary-item">
              <span className="wizard-summary-label">Colores</span>
              <span className="wizard-summary-value">
                Fondo: {COLORS.find((c) => c.id === formData.colorFondo)?.name} /
                Texto: {COLORS.find((c) => c.id === formData.colorTexto)?.name}
              </span>
            </div>
            {formData.coloresSeleccionados.length > 0 && (
              <div className="wizard-summary-item">
                <span className="wizard-summary-label">Colores seleccionados</span>
                <span className="wizard-summary-value">
                  {formData.coloresSeleccionados.length} colores
                </span>
              </div>
            )}
            {formData.tipo === "corporeas" && (
              <>
                <div className="wizard-summary-item">
                  <span className="wizard-summary-label">Tipo corpórea</span>
                  <span className="wizard-summary-value">
                    {CORPOTYPES.find((c) => c.id === formData.corporeaTipo)?.name.replace("\n", " ")}
                  </span>
                </div>
                <div className="wizard-summary-item">
                  <span className="wizard-summary-label">Espesor</span>
                  <span className="wizard-summary-value">{formData.corporeaRelieve}</span>
                </div>
              </>
            )}
          </>
        )}

        {formData.iluminacion && (
          <div className="wizard-summary-item">
            <span className="wizard-summary-label">Extras</span>
            <span className="wizard-summary-value">
              Iluminación LED (+€150)
            </span>
          </div>
        )}

        {formData.instalacion && (
          <div className="wizard-summary-item">
            <span className="wizard-summary-label"></span>
            <span className="wizard-summary-value">Instalación (+€80)</span>
          </div>
        )}

        {config.showPricePreview && (
          <div className="wizard-summary-total">
            <span>Total estimado</span>
            <span className="wizard-summary-price">€{calculatePrice()}</span>
          </div>
        )}
      </div>

      <div className="wizard-preview-section">
        <button
          className="btn btn-secondary"
          onClick={() => setShowPreview(!showPreview)}
        >
          <Eye size={20} />
          {showPreview ? "Ocultar" : "Ver"} vista previa
        </button>

        {showPreview && (
          <div
            className="wizard-preview"
            style={{
              backgroundColor: COLORS.find((c) => c.id === formData.colorFondo)
                ?.hex,
              width: `${Math.min(formData.ancho * 2, 400)}px`,
              height: `${Math.min(formData.alto * 2, 200)}px`,
            }}
          >
            <span
              style={{
                color: COLORS.find((c) => c.id === formData.colorTexto)?.hex,
                fontFamily: formData.fuente,
                fontSize: "2rem",
                fontWeight: "bold",
              }}
            >
              {formData.texto || "Vista previa"}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // Renderizar paso según su key
  const renderStepContent = (stepKey) => {
    switch (stepKey) {
      case "type":
        return renderTypeSection();
      case "dimensions":
        return renderDimensionsSection();
      case "design":
        return renderDesignSection();
      case "colors":
        return renderColorsSection();
      case "extras":
        return renderExtrasSection();
      default:
        return null;
    }
  };

  // ==================== MODOS DE EDITOR ====================

  // MODO WIZARD: Paso a paso con indicador
  const renderWizardMode = () => (
    <>
      {/* Step Indicator */}
      <div className="wizard-steps">
        {STEPS.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <div
              key={step.id}
              className={`wizard-step ${isActive ? "wizard-step-active" : ""} ${isCompleted ? "wizard-step-completed" : ""}`}
            >
              <div className="wizard-step-indicator">
                <div
                  className={`wizard-step-number ${isActive ? "wizard-step-number-active" : ""} ${isCompleted ? "wizard-step-number-completed" : ""}`}
                >
                  {isCompleted ? (
                    <CheckCircle size={20} />
                  ) : (
                    <StepIcon size={20} />
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`wizard-step-line ${isCompleted ? "wizard-step-line-completed" : ""}`}
                  />
                )}
              </div>
              <div className="wizard-step-content">
                <span className="wizard-step-title">{step.title}</span>
                <span className="wizard-step-description">
                  {step.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Body */}
      <div className="wizard-body">
        {STEPS[currentStep] && renderStepContent(STEPS[currentStep].key)}
      </div>

      {/* Footer */}
      <div className="wizard-footer">
        <button className="btn" onClick={prevStep} disabled={currentStep === 0}>
          <ChevronLeft size={20} />
          Anterior
        </button>

        <div className="wizard-progress">
          Paso {currentStep + 1} de {STEPS.length}
        </div>

        {currentStep === STEPS.length - 1 ? (
          <button className="btn btn-primary">
            <Save size={20} />
            Guardar Pedido
          </button>
        ) : (
          <button className="btn btn-primary" onClick={nextStep}>
            Siguiente
            <ChevronRight size={20} />
          </button>
        )}

        {config.enableSaveDraft && (
          <button className="btn btn-secondary" style={{ marginLeft: "8px" }}>
            <RotateCcw size={18} />
            Guardar borrador
          </button>
        )}
      </div>
    </>
  );

  // MODO SINGLE: Sidebar izquierda + Preview derecha
  const renderSingleMode = () => (
    <div className="single-editor">
      <div className="single-layout">
        {/* Sidebar izquierda con configuración */}
        <div className="single-sidebar">
          <div className="single-sidebar-header">
            <h3>Configuración</h3>
          </div>

          <div className="single-sidebar-content">
            {/* Sección Tipo */}
            {isStepEnabled("type") && (
              <div className="single-sidebar-section">
                <h4>Tipo de Rótulo</h4>
                <div className="single-sidebar-options">
                  {ROTULO_TYPES.map((tipo) => {
                    const TypeIcon = tipo.icon;
                    const isSelected = formData.tipo === tipo.id;
                    return (
                      <button
                        key={tipo.id}
                        className={`single-sidebar-option ${isSelected ? "selected" : ""}`}
                        onClick={() => updateFormData("tipo", tipo.id)}
                      >
                        <TypeIcon size={20} />
                        <span>{tipo.name}</span>
                        {config.showPricePreview && <small>{tipo.price}</small>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sección Dimensiones y Material */}
            {isStepEnabled("dimensions") && (
              <div className="single-sidebar-section">
                <h4>Dimensiones (cm)</h4>
                <div className="single-sidebar-dimensions">
                  <div className="dimension-field">
                    <label>Ancho</label>
                    <input
                      type="number"
                      value={formData.ancho}
                      onChange={(e) =>
                        updateFormData("ancho", parseInt(e.target.value) || 0)
                      }
                      min="10"
                      max="500"
                    />
                  </div>
                  <span className="dimension-x">×</span>
                  <div className="dimension-field">
                    <label>Alto</label>
                    <input
                      type="number"
                      value={formData.alto}
                      onChange={(e) =>
                        updateFormData("alto", parseInt(e.target.value) || 0)
                      }
                      min="10"
                      max="500"
                    />
                  </div>
                </div>

                {/* Orientación */}
                <div style={{ marginTop: "1rem" }}>
                  <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "0.5rem", display: "block" }}>
                    Orientación:
                  </label>
                  <div className="style-pills">
                    {[
                      { id: "horizontal", name: "↔️ Horizontal" },
                      { id: "vertical", name: "↕️ Vertical" },
                      { id: "cuadrado", name: "⬜ Cuadrado" },
                    ].map((o) => (
                      <button
                        key={o.id}
                        className={`style-pill ${formData.orientacion === o.id ? "active" : ""}`}
                        onClick={() => updateFormData("orientacion", o.id)}
                      >
                        {o.name}
                      </button>
                    ))}
                  </div>
                </div>

                <h4 style={{ marginTop: "1rem" }}>Material</h4>
                <select
                  className="single-sidebar-select"
                  value={formData.material}
                  onChange={(e) => updateFormData("material", e.target.value)}
                >
                  <option value="">Seleccionar material...</option>
                  {MATERIALS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} - {m.price}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sección Diseño */}
            {isStepEnabled("design") && (
              <div className="single-sidebar-section">
                <h4>Texto</h4>
                <input
                  type="text"
                  className="single-sidebar-input"
                  placeholder="Escribe el texto del rótulo..."
                  value={formData.texto}
                  onChange={(e) => updateFormData("texto", e.target.value)}
                  maxLength={50}
                />
                <small className="char-count">{formData.texto.length}/50</small>

                {/* Texto adicional */}
                <h4 style={{ marginTop: "1rem" }}>Texto adicional</h4>
                <input
                  type="text"
                  className="single-sidebar-input"
                  placeholder="Teléfono, eslogan..."
                  value={formData.textoAdicional}
                  onChange={(e) => updateFormData("textoAdicional", e.target.value)}
                  maxLength={100}
                />

                {/* Logo upload */}
                <h4 style={{ marginTop: "1rem" }}>Logo</h4>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  style={{ display: "none" }}
                  id="logo-upload-single"
                />
                <label htmlFor="logo-upload-single" className="upload-area" style={{ display: "block", marginTop: "0.5rem" }}>
                  {formData.logo ? (
                    <div className="upload-preview">
                      <img src={formData.logo} alt="Logo" style={{ maxWidth: "70px", borderRadius: "8px" }} />
                    </div>
                  ) : (
                    <>
                      <div className="upload-icon">📤</div>
                      <div className="upload-text">Subir mi logo</div>
                    </>
                  )}
                </label>

                <h4 style={{ marginTop: "1rem" }}>Tipografía</h4>
                <div className="single-sidebar-fonts">
                  {FONTS.map((font) => {
                    const isSelected = formData.fuente === font.id;
                    return (
                      <button
                        key={font.id}
                        className={`single-sidebar-font ${isSelected ? "selected" : ""}`}
                        onClick={() => updateFormData("fuente", font.id)}
                        style={{ fontFamily: font.id }}
                      >
                        {font.sample}
                      </button>
                    );
                  })}
                </div>

                {/* Descripción para IA */}
                <h4 style={{ marginTop: "1rem" }}>Describe tu diseño</h4>
                <div className="textarea-wrap" style={{ position: "relative" }}>
                  <textarea
                    className="single-sidebar-input"
                    style={{ paddingBottom: "40px", minHeight: "80px", resize: "vertical" }}
                    placeholder="Ej: Logo de tijeras elegante, letras cursivas brillantes..."
                    value={formData.descripcion}
                    onChange={(e) => updateFormData("descripcion", e.target.value)}
                    rows={3}
                  />
                  <button
                    type="button"
                    className="btn-improve"
                    style={{
                      position: "absolute",
                      right: "8px",
                      bottom: "8px",
                      background: "var(--color-neon)",
                      border: "none",
                      padding: "6px 12px",
                      fontSize: "0.75rem",
                      color: "var(--color-bg)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      opacity: formData.descripcion.trim() ? 1 : 0.5,
                    }}
                    onClick={() => {
                      if (!formData.descripcion.trim()) {
                        alert("Por favor, escribe una descripción primero");
                        return;
                      }
                      const mejorada = generarDescripcionMejorada(
                        formData.descripcion,
                        formData.tipo,
                        formData.estilo,
                        formData.lonaBusinessType
                      );
                      updateFormData("descripcion", mejorada);
                    }}
                    disabled={!formData.descripcion.trim()}
                  >
                    <Sparkles size={14} />
                    Mejorar con IA
                  </button>
                </div>
                
                {/* Info de contexto del prompt */}
                {formData.tipo && (
                  <div style={{ 
                    marginTop: "0.5rem", 
                    fontSize: "0.75rem", 
                    color: "var(--color-text-muted)",
                    fontStyle: "italic"
                  }}>
                    Contexto: {PROMPTS_CATEGORIA[formData.tipo]?.contexto}
                  </div>
                )}
              </div>
            )}

            {/* Sección Colores y Estilo */}
            {isStepEnabled("colors") && (
              <div className="single-sidebar-section">
                {/* Color Picker HSB */}
                <h4>🎨 Colores del diseño</h4>
                <ColorPickerHSB
                  selectedColors={formData.coloresSeleccionados}
                  onAddColor={handleAddColor}
                  onRemoveColor={handleRemoveColor}
                />

                {/* Estilo */}
                <h4 style={{ marginTop: "1rem" }}>Estilo visual</h4>
                <div className="style-pills">
                  {ESTILOS.map((estilo) => (
                    <button
                      key={estilo.id}
                      className={`style-pill ${formData.estilo === estilo.id ? "active" : ""}`}
                      onClick={() => updateFormData("estilo", estilo.id)}
                    >
                      {estilo.name}
                    </button>
                  ))}
                </div>

                <h4 style={{ marginTop: "1rem" }}>Color de Fondo</h4>
                <div className="single-sidebar-colors">
                  {COLORS.map((color) => (
                    <button
                      key={color.id}
                      className={`single-sidebar-color ${formData.colorFondo === color.id ? "selected" : ""}`}
                      onClick={() => updateFormData("colorFondo", color.id)}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {formData.colorFondo === color.id && (
                        <CheckCircle
                          size={16}
                          color={color.id === "white" ? "#000" : "#fff"}
                        />
                      )}
                    </button>
                  ))}
                </div>

                <h4 style={{ marginTop: "1rem" }}>Color del Texto</h4>
                <div className="single-sidebar-colors">
                  {COLORS.map((color) => (
                    <button
                      key={color.id}
                      className={`single-sidebar-color ${formData.colorTexto === color.id ? "selected" : ""}`}
                      onClick={() => updateFormData("colorTexto", color.id)}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {formData.colorTexto === color.id && (
                        <CheckCircle
                          size={16}
                          color={color.id === "white" ? "#000" : "#fff"}
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Corpóreas específico */}
                {formData.tipo === "corporeas" && (
                  <>
                    <h4 style={{ marginTop: "1rem" }}>Tipo corpórea</h4>
                    <div className="corporea-types-grid">
                      {CORPOTYPES.map((tipo) => (
                        <button
                          key={tipo.id}
                          className={`corporea-type-btn ${formData.corporeaTipo === tipo.id ? "active" : ""}`}
                          onClick={() => {
                            updateFormData("corporeaTipo", tipo.id);
                            const defaultRelief = RELIEF_OPTIONS[tipo.id]?.[0] || "5cm";
                            updateFormData("corporeaRelieve", defaultRelief);
                          }}
                        >
                          <div className="type-icon">{tipo.icon}</div>
                          <div className="type-name">{tipo.name}</div>
                        </button>
                      ))}
                    </div>

                    <h4 style={{ marginTop: "1rem" }}>Espesor</h4>
                    <div className="relief-options">
                      {RELIEF_OPTIONS[formData.corporeaTipo]?.map((relieve) => (
                        <button
                          key={relieve}
                          className={`relief-option ${formData.corporeaRelieve === relieve ? "active" : ""}`}
                          onClick={() => updateFormData("corporeaRelieve", relieve)}
                        >
                          <div className="relief-value">{relieve}</div>
                        </button>
                      ))}
                    </div>

                    {/* LED Color para iluminados */}
                    {(formData.corporeaTipo.includes("luz") || formData.corporeaTipo.includes("retro")) && (
                      <>
                        <h4 style={{ marginTop: "1rem" }}>Color LED</h4>
                        <div className="luz-colors-grid">
                          {LED_COLORS.map((c) => (
                            <button
                              key={c.id}
                              className={`luz-color-btn ${formData.ledColor === c.id ? "active" : ""}`}
                              onClick={() => updateFormData("ledColor", c.id)}
                            >
                              <div className="luz-preview" style={{ background: c.color, boxShadow: `0 0 10px ${c.color}` }} />
                              <div className="luz-name">{c.name}</div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Material láser para metacrilato */}
                    {formData.corporeaTipo === "metacrilato" && (
                      <>
                        <h4 style={{ marginTop: "1rem" }}>Material láser</h4>
                        <div className="material-laser-grid">
                          {LASER_MATERIALS.map((m) => (
                            <button
                              key={m.id}
                              className={`material-laser-btn ${formData.laserMaterial === m.id ? "active" : ""}`}
                              onClick={() => updateFormData("laserMaterial", m.id)}
                            >
                              <div className="material-preview" style={m.style} />
                              <div className="material-name">{m.name}</div>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Lonas específico */}
                {formData.tipo === "lonas" && (
                  <>
                    <h4 style={{ marginTop: "1rem" }}>Tipo de negocio</h4>
                    <div className="lona-business-grid">
                      {LONA_BUSINESS_TYPES.slice(0, 8).map((b) => (
                        <button
                          key={b.id}
                          className={`lona-business-btn ${formData.lonaBusinessType === b.id ? "active" : ""}`}
                          onClick={() => updateFormData("lonaBusinessType", b.id)}
                        >
                          <div className="lona-business-icon">{b.icon}</div>
                          <div className="lona-business-name">{b.name}</div>
                        </button>
                      ))}
                    </div>

                    <h4 style={{ marginTop: "1rem" }}>Estilo del fondo</h4>
                    <div className="lona-style-grid">
                      {LONA_STYLES.slice(0, 6).map((s) => (
                        <button
                          key={s.id}
                          className={`lona-style-btn ${formData.lonaStyle === s.id ? "active" : ""}`}
                          onClick={() => updateFormData("lonaStyle", s.id)}
                        >
                          <div className="lona-style-preview" style={{ background: s.preview }} />
                          <div className="lona-style-name">{s.name}</div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Sección Extras */}
            {isStepEnabled("extras") && (
              <div className="single-sidebar-section">
                <h4>Extras</h4>
                <label className="single-sidebar-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.iluminacion}
                    onChange={(e) =>
                      updateFormData("iluminacion", e.target.checked)
                    }
                  />
                  <span>
                    Iluminación LED {config.showPricePreview && "(+€150)"}
                  </span>
                </label>
                <label className="single-sidebar-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.instalacion}
                    onChange={(e) =>
                      updateFormData("instalacion", e.target.checked)
                    }
                  />
                  <span>Instalación {config.showPricePreview && "(+€80)"}</span>
                </label>
              </div>
            )}

            {/* Campos Personalizados */}
            {customFields.length > 0 && (
              <div className="single-sidebar-section custom-fields-section">
                <h4>Información Adicional</h4>
                {customFields.map((field) => renderCustomField(field))}
              </div>
            )}
          </div>

          {/* Footer del sidebar */}
          <div className="single-sidebar-footer">
            {config.showPricePreview && (
              <div className="single-sidebar-total">
                <span>Total estimado:</span>
                <span className="price">€{calculatePrice()}</span>
              </div>
            )}
            <div className="single-sidebar-actions">
              {config.enableSaveDraft && (
                <button className="btn btn-secondary btn-small">
                  <RotateCcw size={16} />
                  Borrador
                </button>
              )}
              <button className="btn btn-primary btn-small">
                <Save size={16} />
                Guardar
              </button>
            </div>
          </div>
        </div>

        {/* Preview derecha */}
        <div className="single-preview-area">
          <div className="single-preview-header">
            <h3>Vista Previa</h3>
            <span className="preview-dimensions">
              {formData.ancho} × {formData.alto} cm
            </span>
          </div>

          <div className="single-preview-container">
            <div
              className="single-preview-sign"
              style={{
                backgroundColor: COLORS.find(
                  (c) => c.id === formData.colorFondo,
                )?.hex,
                width: `${Math.min(formData.ancho * 3, 500)}px`,
                height: `${Math.min(formData.alto * 3, 300)}px`,
                boxShadow: formData.iluminacion
                  ? `0 0 60px ${COLORS.find((c) => c.id === formData.colorFondo)?.hex}40, 0 20px 40px rgba(0,0,0,0.3)`
                  : "0 20px 40px rgba(0,0,0,0.2)",
              }}
            >
              <span
                style={{
                  color: COLORS.find((c) => c.id === formData.colorTexto)?.hex,
                  fontFamily: formData.fuente,
                  fontSize: `${Math.min(formData.alto * 0.5, 48)}px`,
                  fontWeight: "bold",
                  textShadow: formData.iluminacion
                    ? "0 0 20px currentColor"
                    : "none",
                }}
              >
                {formData.texto || "Tu texto aquí"}
              </span>
              {formData.textoAdicional && (
                <span
                  style={{
                    color: COLORS.find((c) => c.id === formData.colorTexto)?.hex,
                    fontFamily: formData.fuente,
                    fontSize: `${Math.min(formData.alto * 0.2, 16)}px`,
                    marginTop: "8px",
                    opacity: 0.8,
                  }}
                >
                  {formData.textoAdicional}
                </span>
              )}
            </div>
          </div>

          {/* Info del rótulo */}
          <div className="single-preview-info">
            <div className="preview-info-item">
              <span className="label">Tipo:</span>
              <span className="value">
                {ROTULO_TYPES.find((t) => t.id === formData.tipo)?.name ||
                  "No seleccionado"}
              </span>
            </div>
            <div className="preview-info-item">
              <span className="label">Material:</span>
              <span className="value">
                {MATERIALS.find((m) => m.id === formData.material)?.name ||
                  "No seleccionado"}
              </span>
            </div>
            <div className="preview-info-item">
              <span className="label">Estilo:</span>
              <span className="value">
                {ESTILOS.find((e) => e.id === formData.estilo)?.name || "Moderno"}
              </span>
            </div>
            <div className="preview-info-item">
              <span className="label">Orientación:</span>
              <span className="value">{formData.orientacion}</span>
            </div>
            <div className="preview-info-item">
              <span className="label">Extras:</span>
              <span className="value">
                {[
                  formData.iluminacion && "Iluminación LED",
                  formData.instalacion && "Instalación",
                ]
                  .filter(Boolean)
                  .join(", ") || "Ninguno"}
              </span>
            </div>
            {/* Campos personalizados en preview */}
            {customFields
              .filter(
                (field) =>
                  field.showInPreview && formData.customFields[field.name],
              )
              .map((field) => (
                <div className="preview-info-item" key={field.id}>
                  <span className="label">{field.label}:</span>
                  <span className="value">
                    {field.type === "checkbox"
                      ? formData.customFields[field.name]
                        ? "Sí"
                        : "No"
                      : formData.customFields[field.name]}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  // MODO SIMPLIFIED: Solo campos esenciales
  const renderSimplifiedMode = () => (
    <div className="simplified-editor">
      <div className="simplified-header">
        <h2>Crear Rótulo Rápido</h2>
        <p>Solo los campos esenciales para pedir tu rótulo</p>
      </div>

      <div className="simplified-form">
        {/* Tipo simplificado - solo los populares */}
        <div className="simplified-section">
          <label>Tipo de rótulo</label>
          <div className="simplified-options">
            {ROTULO_TYPES.filter((t) => t.popular).map((tipo) => {
              const TypeIcon = tipo.icon;
              return (
                <button
                  key={tipo.id}
                  className={`simplified-option ${formData.tipo === tipo.id ? "simplified-option-selected" : ""}`}
                  onClick={() => updateFormData("tipo", tipo.id)}
                >
                  <TypeIcon size={24} />
                  <span>{tipo.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dimensiones simplificadas */}
        <div className="simplified-section">
          <label>Dimensiones (cm)</label>
          <div className="simplified-dimensions">
            <input
              type="number"
              placeholder="Ancho"
              value={formData.ancho}
              onChange={(e) =>
                updateFormData("ancho", parseInt(e.target.value) || 0)
              }
            />
            <span>×</span>
            <input
              type="number"
              placeholder="Alto"
              value={formData.alto}
              onChange={(e) =>
                updateFormData("alto", parseInt(e.target.value) || 0)
              }
            />
          </div>
          
          {/* Orientación */}
          <div className="style-pills" style={{ marginTop: "0.5rem" }}>
            {[
              { id: "horizontal", name: "↔️" },
              { id: "vertical", name: "↕️" },
              { id: "cuadrado", name: "⬜" },
            ].map((o) => (
              <button
                key={o.id}
                className={`style-pill ${formData.orientacion === o.id ? "active" : ""}`}
                onClick={() => updateFormData("orientacion", o.id)}
              >
                {o.name}
              </button>
            ))}
          </div>
        </div>

        {/* Texto */}
        <div className="simplified-section">
          <label>Texto del rótulo</label>
          <input
            type="text"
            placeholder="Escribe el texto..."
            value={formData.texto}
            onChange={(e) => updateFormData("texto", e.target.value)}
          />
        </div>

        {/* Texto adicional */}
        <div className="simplified-section">
          <label>Texto adicional <small>(opcional)</small></label>
          <input
            type="text"
            placeholder="Teléfono, eslogan..."
            value={formData.textoAdicional}
            onChange={(e) => updateFormData("textoAdicional", e.target.value)}
          />
        </div>

        {/* Material simplificado */}
        <div className="simplified-section">
          <label>Material</label>
          <select
            value={formData.material}
            onChange={(e) => updateFormData("material", e.target.value)}
          >
            <option value="">Seleccionar...</option>
            {MATERIALS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        {/* Estilo */}
        <div className="simplified-section">
          <label>Estilo</label>
          <select
            value={formData.estilo}
            onChange={(e) => updateFormData("estilo", e.target.value)}
          >
            {ESTILOS.map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>

        {/* Extras */}
        <div className="simplified-section">
          <label className="simplified-checkbox">
            <input
              type="checkbox"
              checked={formData.iluminacion}
              onChange={(e) => updateFormData("iluminacion", e.target.checked)}
            />
            <span>Iluminación LED {config.showPricePreview && "(+€150)"}</span>
          </label>
          <label className="simplified-checkbox">
            <input
              type="checkbox"
              checked={formData.instalacion}
              onChange={(e) => updateFormData("instalacion", e.target.checked)}
            />
            <span>Instalación {config.showPricePreview && "(+€80)"}</span>
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="simplified-footer">
        {config.showPricePreview && (
          <div className="simplified-total">
            <span>Total:</span>
            <span>€{calculatePrice()}</span>
          </div>
        )}
        <button className="btn btn-primary btn-large">
          <Save size={20} />
          Crear Pedido
        </button>
      </div>
    </div>
  );

  // ==================== RENDER PRINCIPAL ====================

  const renderEditorMode = () => {
    switch (config.mode) {
      case "single":
        return renderSingleMode();
      case "simplified":
        return renderSimplifiedMode();
      case "wizard":
      default:
        return renderWizardMode();
    }
  };

  const handleOpenNewTab = () => {
    window.open(
      `${window.location.origin}${window.location.pathname}?standalone=true`,
      "_blank",
    );
  };

  const handleCloseStandalone = () => {
    window.close();
  };

  return (
    <div className="editor-page">
      {/* Header para modo standalone */}
      {standalone && (
        <div className="standalone-header">
          <div className="standalone-header-content">
            <button
              className="standalone-close-btn"
              onClick={handleCloseStandalone}
              title="Cerrar"
            >
              <X size={20} />
            </button>
            <h1 className="standalone-title">Editor de Rótulos</h1>
            <span className="standalone-badge">Modo Pantalla Completa</span>
          </div>
        </div>
      )}

      {/* Botón para abrir en nueva pestaña (solo en modo normal) */}
      {!standalone && (
        <div className="editor-new-tab-btn-container">
          <button
            className="btn btn-secondary btn-new-tab"
            onClick={handleOpenNewTab}
            title="Abrir editor en nueva pestaña"
          >
            <ExternalLink size={18} />
            <span>Abrir en nueva pestaña</span>
          </button>
        </div>
      )}

      <div
        className={`editor-container editor-mode-${config.mode} ${standalone ? "standalone" : ""}`}
      >
        {renderEditorMode()}
      </div>

      {/* Color Picker */}
      <ColorPicker
        currentTheme={theme}
        setTheme={setTheme}
        currentColor={neonColor}
        setColor={setNeonColor}
      />
    </div>
  );
}
