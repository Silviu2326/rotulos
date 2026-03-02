import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ShoppingCart,
  Type,
  Palette,
  Sparkles,
  Zap,
  Download,
  RefreshCcw,
  Check,
  Box,
  Flag,
  Type as TypeIcon,
  Square,
  Scroll,
  Image,
  MapPin,
  Lightbulb,
  Building2,
  X,
  Upload,
  Wand2,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Star,
  Eye,
  Wrench,
  Paintbrush,
  Maximize2,
  Grid3X3,
  Sun,
  Moon,
  Gauge,
  Layers,
  Circle,
  Square as SquareIcon,
  Triangle,
  Smartphone,
  Ruler,
  XCircle,
  Glasses,
  Cuboid,
  Camera,
  ScanLine,
  Scan,
  Move3d,
  View,
  Aperture,
  FlipHorizontal,
  Split,
  Monitor,
  Store,
  ScanFace,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "../styles/rotularte.css";
import "../styles/neoneditor.css";

// ==================== DATOS Y CONFIGURACIÓN ====================

// Categorías de producto
const CATEGORIAS_PRODUCTO = [
  {
    id: "caja-luz",
    nombre: "Cajas de luz",
    icono: Box,
    desc: "Rótulos luminosos con estructura",
  },
  {
    id: "banderolas",
    nombre: "Banderolas",
    icono: Flag,
    desc: "Banderas publicitarias para fachadas",
  },
  {
    id: "letras-neon",
    nombre: "Letras Neón",
    icono: TypeIcon,
    desc: "Neones LED realistas con tubos de vidrio brillantes",
  },
  {
    id: "letras-corporeas",
    nombre: "Letras Corpóreas",
    icono: TypeIcon,
    desc: "Letras 3D con volumen real",
  },
  {
    id: "placas",
    nombre: "Placas",
    icono: Square,
    desc: "Placas identificativas",
  },
  {
    id: "lonas",
    nombre: "Lonas y Pancartas",
    icono: Scroll,
    desc: "Ideal para eventos y promociones",
  },
  {
    id: "banderas",
    nombre: "Banderas",
    icono: Flag,
    desc: "Banderas personalizadas",
  },
  {
    id: "vinilos",
    nombre: "Vinilos escaparates",
    icono: MapPin,
    desc: "Decoración de cristales",
  },
  {
    id: "rotulos-luminosos",
    nombre: "Rótulos luminosos",
    icono: Lightbulb,
    desc: "Señalización iluminada",
  },
];

// Tipografías disponibles
const TIPOGRAFIAS = [
  {
    id: "archivo",
    nombre: "Archivo Black",
    familia: "'Archivo Black', sans-serif",
    sample: "ABC",
  },
  {
    id: "oswald",
    nombre: "Oswald",
    familia: "'Oswald', sans-serif",
    sample: "ABC",
  },
  {
    id: "bebas",
    nombre: "Bebas Neue",
    familia: "'Bebas Neue', sans-serif",
    sample: "ABC",
  },
  {
    id: "rajdhani",
    nombre: "Rajdhani",
    familia: "'Rajdhani', sans-serif",
    sample: "ABC",
  },
  {
    id: "montserrat",
    nombre: "Montserrat",
    familia: "'Montserrat', sans-serif",
    sample: "ABC",
  },
  {
    id: "playfair",
    nombre: "Playfair",
    familia: "'Playfair Display', serif",
    sample: "ABC",
  },
  {
    id: "roboto",
    nombre: "Roboto",
    familia: "'Roboto', sans-serif",
    sample: "ABC",
  },
  {
    id: "opensans",
    nombre: "Open Sans",
    familia: "'Open Sans', sans-serif",
    sample: "ABC",
  },
  {
    id: "lobster",
    nombre: "Lobster",
    familia: "'Lobster', cursive",
    sample: "ABC",
  },
  {
    id: "poppins",
    nombre: "Poppins",
    familia: "'Poppins', sans-serif",
    sample: "ABC",
  },
];

// Colores predefinidos Pantone
const COLORES_PREDEFINIDOS = [
  { nombre: "Rojo", hex: "#DA291C" },
  { nombre: "Rojo Intenso", hex: "#E4002B" },
  { nombre: "Rosa", hex: "#CE0058" },
  { nombre: "Naranja", hex: "#FF6900" },
  { nombre: "Amarillo", hex: "#FEDD00" },
  { nombre: "Dorado", hex: "#FFD100" },
  { nombre: "Verde", hex: "#00A651" },
  { nombre: "Verde Menta", hex: "#00B388" },
  { nombre: "Azul Claro", hex: "#00A3E0" },
  { nombre: "Azul", hex: "#0033A0" },
  { nombre: "Azul Oscuro", hex: "#002855" },
  { nombre: "Púrpura", hex: "#6D2077" },
  { nombre: "Blanco", hex: "#FFFFFF" },
  { nombre: "Gris Claro", hex: "#F5F5F5" },
  { nombre: "Gris", hex: "#888B8D" },
  { nombre: "Negro", hex: "#1D1D1D" },
  { nombre: "Dorado Metálico", hex: "#D4AF37" },
  { nombre: "Plateado", hex: "#C0C0C0" },
];

// Fachadas predefinidas
const FACHADAS = [
  {
    id: "madera",
    nombre: "Madera",
    icono: Grid3X3,
    desc: "Panel de madera natural",
  },
  { id: "blanca", nombre: "Blanca", icono: Square, desc: "Pared blanca lisa" },
  {
    id: "oscura",
    nombre: "Oscura",
    icono: Square,
    desc: "Pared oscura moderna",
  },
  {
    id: "ladrillo",
    nombre: "Ladrillo",
    icono: Grid3X3,
    desc: "Ladrillo visto clásico",
  },
  {
    id: "hormigon",
    nombre: "Hormigón",
    icono: Square,
    desc: "Hormigón industrial",
  },
  { id: "marmol", nombre: "Mármol", icono: Square, desc: "Mármol elegante" },
];

// Estilos visuales
const ESTILOS_VISUALES = [
  { id: "moderno", nombre: "Moderno", desc: "Diseño contemporáneo y actual" },
  { id: "clasico", nombre: "Clásico", desc: "Estilo tradicional y atemporal" },
  { id: "elegante", nombre: "Elegante", desc: "Acabados sofisticados" },
  { id: "minimalista", nombre: "Minimalista", desc: "Diseño limpio y simple" },
  { id: "llamativo", nombre: "Llamativo", desc: "Colores vivos y contrastes" },
  { id: "industrial", nombre: "Industrial", desc: "Estilo urbano y robusto" },
  { id: "vintage", nombre: "Vintage", desc: "Aire retro y nostálgico" },
  { id: "neon", nombre: "Neón", desc: "Estilo luminoso y nocturno" },
  { id: "luxury", nombre: "Luxury", desc: "Alta gama y exclusividad" },
];

// Tipos de letras corpóreas
const TIPOS_LETRAS_CORPOREAS = [
  {
    id: "aluminio-sin-luz",
    nombre: "Aluminio sin luz",
    icono: TypeIcon,
    desc: "Letras de aluminio sin iluminación",
  },
  {
    id: "pvc-fresado",
    nombre: "PVC fresado",
    icono: TypeIcon,
    desc: "Letras de PVC fresado",
  },
  {
    id: "aluminio-con-luz",
    nombre: "Aluminio con luz",
    icono: Lightbulb,
    desc: "Aluminio con iluminación frontal",
  },
  {
    id: "pvc-retroiluminado",
    nombre: "PVC retroiluminado",
    icono: Sparkles,
    desc: "PVC con retroiluminación LED",
  },
  {
    id: "metacrilato",
    nombre: "Metacrilato acrílico",
    icono: Circle,
    desc: "Letras de metacrilato/acrílico",
  },
  {
    id: "pvc-uv",
    nombre: "PVC impreso UV",
    icono: Paintbrush,
    desc: "PVC con impresión UV directa",
  },
  {
    id: "aluminio-retroiluminado",
    nombre: "Aluminio retroiluminado",
    icono: Sparkles,
    desc: "Aluminio con halo LED trasero",
  },
  {
    id: "dibond",
    nombre: "Dibond sin relieve",
    icono: SquareIcon,
    desc: "Letras planas de Aluminio/Dibond recortadas",
  },
];

// Colores de luz LED
const COLORES_LUZ_LED = [
  {
    id: "blanco-calido",
    nombre: "Blanco cálido",
    temp: "4000K",
    hex: "#FFE5CC",
  },
  { id: "blanco-frio", nombre: "Blanco frío", temp: "9000K", hex: "#E6F2FF" },
  { id: "rojo", nombre: "Rojo", hex: "#FF3333" },
  { id: "verde", nombre: "Verde", hex: "#33FF33" },
  { id: "celeste", nombre: "Celeste", hex: "#33CCFF" },
  { id: "azul", nombre: "Azul", hex: "#3333FF" },
  { id: "naranja", nombre: "Naranja", hex: "#FF9933" },
  { id: "amarillo", nombre: "Amarillo", hex: "#FFFF33" },
  { id: "rosa", nombre: "Rosa", hex: "#FF33CC" },
  { id: "morado", nombre: "Morado", hex: "#9933FF" },
];

// Materiales de corte láser
const MATERIALES_LASER = [
  {
    id: "metacrilato-transparente",
    nombre: "Metacrilato Transparente",
    desc: "Crystal clear, alta claridad óptica",
  },
  {
    id: "metacrilato-blanco",
    nombre: "Metacrilato Blanco",
    desc: "Blanco sólido, acabado semi-brillo",
  },
  { id: "mdf", nombre: "MDF", desc: "Acabado mate, tabla de fibra de madera" },
  {
    id: "metacrilato-oro",
    nombre: "Metacrilato Oro Espejo",
    desc: "Oro espejo altamente reflectante",
  },
  {
    id: "metacrilato-plata",
    nombre: "Metacrilato Plata Espejo",
    desc: "Espejo plata high-gloss",
  },
  {
    id: "metacrilato-rosa",
    nombre: "Metacrilato Rosa Espejo",
    desc: "Espejo rosa metálico",
  },
];

// Tipos de negocio para lonas (sistema híbrido)
const TIPOS_NEGOCIO_LONAS = [
  { id: "tienda", nombre: "Tienda general", icono: Building2 },
  { id: "peluqueria", nombre: "Peluquería", icono: Wrench },
  { id: "cafe", nombre: "Café/Bar", icono: Circle },
  { id: "restaurante", nombre: "Restaurante", icono: Circle },
  { id: "oficina", nombre: "Oficina", icono: Building2 },
  { id: "gimnasio", nombre: "Gimnasio", icono: Circle },
  { id: "supermercado", nombre: "Supermercado", icono: Building2 },
  { id: "taller", nombre: "Taller", icono: Wrench },
];

// Orientaciones
const ORIENTACIONES = [
  { id: "horizontal", nombre: "Horizontal", icono: Smartphone },
  { id: "vertical", nombre: "Vertical", icono: Smartphone },
  { id: "cuadrado", nombre: "Cuadrado", icono: Square },
];

// ==================== COMPONENTE COLOR PICKER ====================

const ColorPicker = ({ currentTheme, setTheme, currentColor, setColor }) => {
  const [isOpen, setIsOpen] = useState(false);

  const themeColors = [
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
          <span>Personalizar Estética</span>
          <button
            className="color-picker-close"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="color-presets">
          {themeColors.map((c) => (
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

// ==================== COMPONENTE PRINCIPAL ====================

const NeonEditorPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [modoVista, setModoVista] = useState(null); // '3d', 'ar', 'mockup', 'comparador'
  const [rotacion3D, setRotacion3D] = useState(0);
  const [modoDiaNoche, setModoDiaNoche] = useState("dia");

  // Estados del formulario
  const [pasoActual, setPasoActual] = useState(1);
  const [categoria, setCategoria] = useState(null);
  const [nombreNegocio, setNombreNegocio] = useState("");
  const [tipografia, setTipografia] = useState(TIPOGRAFIAS[0]);
  const [coloresDiseño, setColoresDiseño] = useState([]);
  const [colorActivo, setColorActivo] = useState(null);
  const [orientacion, setOrientacion] = useState("horizontal");
  const [textoAdicional, setTextoAdicional] = useState("");
  const [logo, setLogo] = useState(null);
  const [modoIntegracionLogo, setModoIntegracionLogo] = useState("ia"); // 'ia' o 'exacto'
  const [fachada, setFachada] = useState("blanca");
  const [fachadaPersonalizada, setFachadaPersonalizada] = useState(null);
  const [estiloVisual, setEstiloVisual] = useState("moderno");
  const [tipoLetraCorporea, setTipoLetraCorporea] = useState(null);
  const [espesor, setEspesor] = useState("10");
  const [colorLuzLed, setColorLuzLed] = useState("blanco-calido");
  const [materialLaser, setMaterialLaser] = useState(
    "metacrilato-transparente",
  );
  const [tipoNegocioLona, setTipoNegocioLona] = useState(null);
  const [estiloFondoLona, setEstiloFondoLona] = useState("patron-1");
  const [descripcionDiseño, setDescripcionDiseño] = useState("");
  const [descripcionMejorada, setDescripcionMejorada] = useState("");
  const [tamanoAncho, setTamanoAncho] = useState(100);
  const [tamanoAlto, setTamanoAlto] = useState(50);
  const [errores, setErrores] = useState({});

  // Estados para tema y color
  const [theme, setTheme] = useState(
    () => localStorage.getItem("rotularte-theme") || "industrial",
  );
  const [neonColor, setNeonColor] = useState(
    () => localStorage.getItem("rotularte-color") || "#ff6b00",
  );

  // ==================== EFECTOS ====================

  // Leer parámetros de URL y configurar categoría automáticamente
  useEffect(() => {
    const categoriaParam = searchParams.get("categoria");
    const productoParam = searchParams.get("producto");
    const nombreParam = searchParams.get("nombre");

    if (categoriaParam) {
      // Verificar si la categoría existe en CATEGORIAS_PRODUCTO
      const categoriaValida = CATEGORIAS_PRODUCTO.find(
        (cat) => cat.id === categoriaParam,
      );
      if (categoriaValida) {
        setCategoria(categoriaParam);
      }
    }

    if (nombreParam) {
      setNombreNegocio(decodeURIComponent(nombreParam));
    }
  }, [searchParams]);

  // Aplicar tema
  useEffect(() => {
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

    const config = themeConfig[theme] || themeConfig.industrial;

    document.body.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty("--color-neon", neonColor);
    document.documentElement.style.setProperty(
      "----color-neon-glow",
      neonColor,
    );
    document.documentElement.style.setProperty("--color-bg", config.bg);
    document.documentElement.style.setProperty("--color-bg-alt", config.bgAlt);
    document.documentElement.style.setProperty("--color-accent", config.accent);
    document.documentElement.style.setProperty("--color-text", config.text);
    document.documentElement.style.setProperty(
      "--color-text-muted",
      config.textMuted,
    );
    document.documentElement.style.setProperty("--color-metal", config.metal);

    localStorage.setItem("rotularte-theme", theme);
    localStorage.setItem("rotularte-color", neonColor);
  }, [theme, neonColor]);

  // ==================== HANDLERS ====================

  const handleSubirLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogo(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubirFachada = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setFachadaPersonalizada(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const agregarColor = (color) => {
    if (!coloresDiseño.find((c) => c.hex === color.hex)) {
      setColoresDiseño([...coloresDiseño, color]);
    }
    setColorActivo(color);
  };

  const eliminarColor = (hex) => {
    setColoresDiseño(coloresDiseño.filter((c) => c.hex !== hex));
    if (colorActivo?.hex === hex) {
      setColorActivo(coloresDiseño.length > 1 ? coloresDiseño[0] : null);
    }
  };

  const seleccionarColorPersonalizado = (e) => {
    const color = { nombre: "Personalizado", hex: e.target.value };
    agregarColor(color);
  };

  const mejorarDescripcionConIA = async () => {
    if (!descripcionDiseño.trim()) return;

    try {
      // Aquí iría la integración con Gemini
      // Por ahora simulamos la mejora
      const mejoras = [
        "Diseño elegante con tipografía moderna y colores vibrantes",
        "Estilo profesional con acabados premium y detalles sofisticados",
        "Diseño atractivo con elementos visuales llamativos y colores contrastantes",
        "Estilo minimalista con líneas limpias y paleta de colores neutra",
      ];
      const mejoraAleatoria =
        mejoras[Math.floor(Math.random() * mejoras.length)];
      setDescripcionMejorada(`${descripcionDiseño}. ${mejoraAleatoria}`);
    } catch (error) {
      console.error("Error mejorando descripción:", error);
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!categoria) nuevosErrores.categoria = "Selecciona una categoría";
    if (!nombreNegocio.trim())
      nuevosErrores.nombreNegocio = "El nombre del negocio es obligatorio";
    if (coloresDiseño.length === 0)
      nuevosErrores.colores = "Selecciona al menos un color";
    if (categoria === "letras-corporeas" && !tipoLetraCorporea) {
      nuevosErrores.tipoLetraCorporea = "Selecciona un tipo de letra";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const generarDiseno = async () => {
    if (!validarFormulario()) return;

    setIsGenerating(true);

    try {
      // Simulación de generación (aquí iría la integración con IA)
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setShowPreview(true);
    } catch (error) {
      console.error("Error generando diseño:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const descargarDiseno = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = `diseno-${nombreNegocio || "rotulo"}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  // ==================== FUNCIONES DE VISUALIZACIÓN AVANZADA ====================

  const iniciarAR = async () => {
    if (!navigator.xr) {
      alert(
        "WebXR no está soportado en tu navegador. Intenta usar Chrome en Android o Safari en iOS.",
      );
      return;
    }

    try {
      // Verificar si el dispositivo soporta AR
      const isSupported = await navigator.xr.isSessionSupported("immersive-ar");
      if (isSupported) {
        setModoVista("ar");
        // Aquí iría la lógica real de AR con WebXR
        alert(
          "Iniciando experiencia AR... Coloca tu rótulo en el espacio real.",
        );
      } else {
        // Fallback: usar cámara con overlay
        setModoVista("ar-fallback");
        alert("Modo AR simulado: Usa la cámara para ver tu diseño superpuesto");
      }
    } catch (error) {
      console.error("Error iniciando AR:", error);
      setModoVista("ar-fallback");
    }
  };

  const rotar3D = (direccion) => {
    setRotacion3D((prev) => {
      const nuevaRotacion = prev + (direccion === "derecha" ? 45 : -45);
      return nuevaRotacion % 360;
    });
  };

  const cambiarModoDiaNoche = () => {
    setModoDiaNoche((prev) => (prev === "dia" ? "noche" : "dia"));
  };

  const verEnFachada = (tipoFachada) => {
    setFachada(tipoFachada);
    setModoVista("mockup");
  };

  const cerrarVistaAvanzada = () => {
    setModoVista(null);
    setRotacion3D(0);
    setModoDiaNoche("dia");
  };

  const compartirDiseno = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Diseño de rótulo - ${nombreNegocio || "Mi Negocio"}`,
          text: `Mira este diseño de rótulo que he creado para ${nombreNegocio || "mi negocio"}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error compartiendo:", error);
      }
    } else {
      // Copiar al portapapeles
      navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado al portapapeles");
    }
  };

  const resetearFormulario = () => {
    setCategoria(null);
    setNombreNegocio("");
    setTipografia(TIPOGRAFIAS[0]);
    setColoresDiseño([]);
    setColorActivo(null);
    setOrientacion("horizontal");
    setTextoAdicional("");
    setLogo(null);
    setModoIntegracionLogo("ia");
    setFachada("blanca");
    setFachadaPersonalizada(null);
    setEstiloVisual("moderno");
    setTipoLetraCorporea(null);
    setEspesor("10");
    setColorLuzLed("blanco-calido");
    setMaterialLaser("metacrilato-transparente");
    setTipoNegocioLona(null);
    setEstiloFondoLona("patron-1");
    setDescripcionDiseño("");
    setDescripcionMejorada("");
    setTamanoAncho(100);
    setTamanoAlto(50);
    setErrores({});
    setPasoActual(1);
    setShowPreview(false);
  };

  // ==================== RENDERIZADO DE PASOS ====================

  const renderPaso1 = () => (
    <div className="paso-contenido">
      <h2 className="paso-titulo">Paso 1: Selecciona el Tipo de Producto</h2>
      <p className="paso-descripcion">
        Elige la categoría de rótulo que mejor se adapte a tu negocio
      </p>

      <div className="grid-categorias">
        {CATEGORIAS_PRODUCTO.map((cat) => {
          const Icono = cat.icono;
          return (
            <button
              key={cat.id}
              className={`categoria-card ${categoria === cat.id ? "activa" : ""}`}
              onClick={() => setCategoria(cat.id)}
            >
              <Icono size={32} className="categoria-icono" />
              <h3 className="categoria-nombre">{cat.nombre}</h3>
              <p className="categoria-desc">{cat.desc}</p>
            </button>
          );
        })}
      </div>

      {errores.categoria && (
        <span className="error-mensaje">{errores.categoria}</span>
      )}

      {categoria === "letras-neon" && (
        <div className="pista-contextual">
          <Lightbulb size={20} />
          <p>
            El texto se genera en UNA SOLA LÍNEA horizontal. Permite seleccionar
            el color de luz LED.
          </p>
        </div>
      )}
    </div>
  );

  const renderPaso2 = () => (
    <div className="paso-contenido">
      <h2 className="paso-titulo">Paso 2: Datos de tu Negocio</h2>

      {/* Nombre del Negocio */}
      <div className="campo-grupo">
        <label className="campo-label">
          Nombre del Negocio <span className="obligatorio">*</span>
        </label>
        <input
          type="text"
          className="campo-input"
          value={nombreNegocio}
          onChange={(e) => setNombreNegocio(e.target.value)}
          placeholder="Ej: Peluquería Tribilin, Café Roma..."
        />
        {errores.nombreNegocio && (
          <span className="error-mensaje">{errores.nombreNegocio}</span>
        )}
      </div>

      {/* Tipografía */}
      <div className="campo-grupo">
        <label className="campo-label">Tipografía</label>
        <div className="selector-tipografia">
          {TIPOGRAFIAS.slice(0, 6).map((font) => (
            <button
              key={font.id}
              className={`tipografia-opcion ${tipografia.id === font.id ? "activa" : ""}`}
              onClick={() => setTipografia(font)}
              style={{ fontFamily: font.familia }}
            >
              <span className="tipografia-muestra">{font.sample}</span>
              <span className="tipografia-nombre">{font.nombre}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Colores del Diseño */}
      <div className="campo-grupo">
        <label className="campo-label">
          Colores del Diseño <span className="obligatorio">*</span>
        </label>
        <div className="paleta-colores">
          {COLORES_PREDEFINIDOS.map((color) => (
            <button
              key={color.hex}
              className={`color-boton ${coloresDiseño.find((c) => c.hex === color.hex) ? "seleccionado" : ""}`}
              style={{ backgroundColor: color.hex }}
              onClick={() => agregarColor(color)}
              title={color.nombre}
            />
          ))}
          <div className="color-personalizado">
            <input
              type="color"
              onChange={seleccionarColorPersonalizado}
              title="Color personalizado"
            />
            <Plus size={16} />
          </div>
        </div>

        {coloresDiseño.length > 0 && (
          <div className="colores-seleccionados">
            <p className="colores-titulo">Colores seleccionados:</p>
            <div className="colores-lista">
              {coloresDiseño.map((color) => (
                <div key={color.hex} className="color-tag">
                  <div
                    className="color-muestra"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.nombre}</span>
                  <button onClick={() => eliminarColor(color.hex)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        {errores.colores && (
          <span className="error-mensaje">{errores.colores}</span>
        )}
      </div>

      {/* Orientación (condicional) */}
      {categoria === "lonas" && (
        <div className="campo-grupo">
          <label className="campo-label">Orientación</label>
          <div className="selector-orientacion">
            {ORIENTACIONES.map((ori) => {
              const Icono = ori.icono;
              return (
                <button
                  key={ori.id}
                  className={`orientacion-opcion ${orientacion === ori.id ? "activa" : ""}`}
                  onClick={() => setOrientacion(ori.id)}
                >
                  <Icono size={24} />
                  <span>{ori.nombre}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Texto Adicional */}
      <div className="campo-grupo">
        <label className="campo-label">
          Texto adicional (teléfono, eslogan...)
        </label>
        <input
          type="text"
          className="campo-input"
          value={textoAdicional}
          onChange={(e) => setTextoAdicional(e.target.value)}
          placeholder="Ej: Tel: 666 777 888, Desde 1990..."
        />
      </div>

      {/* Logo */}
      <div className="campo-grupo">
        <label className="campo-label">Logo existente (opcional)</label>
        <div className="logo-upload">
          {logo ? (
            <div className="logo-preview">
              <img src={logo} alt="Logo" />
              <button className="logo-eliminar" onClick={() => setLogo(null)}>
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <label className="logo-dropzone">
              <Upload size={32} />
              <span>Arrastra tu logo o haz clic para subir</span>
              <small>Formatos: PNG o JPG</small>
              <input
                type="file"
                accept="image/*"
                onChange={handleSubirLogo}
                hidden
              />
            </label>
          )}
        </div>

        {logo && (
          <div className="modo-integracion">
            <p>Modo de integración:</p>
            <div className="modo-opciones">
              <button
                className={modoIntegracionLogo === "ia" ? "activo" : ""}
                onClick={() => setModoIntegracionLogo("ia")}
              >
                <Wand2 size={16} />
                <span>IA (Integración natural)</span>
              </button>
              <button
                className={modoIntegracionLogo === "exacto" ? "activo" : ""}
                onClick={() => setModoIntegracionLogo("exacto")}
              >
                <Maximize2 size={16} />
                <span>Exacto (Superposición)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fachada */}
      <div className="campo-grupo">
        <label className="campo-label">Fachada para visualización</label>
        <div className="selector-fachada">
          {FACHADAS.map((fach) => {
            const Icono = fach.icono;
            return (
              <button
                key={fach.id}
                className={`fachada-opcion ${fachada === fach.id ? "activa" : ""}`}
                onClick={() => setFachada(fach.id)}
              >
                <Icono size={24} />
                <span>{fach.nombre}</span>
              </button>
            );
          })}
          <label
            className={`fachada-opcion subir ${fachada === "personalizada" ? "activa" : ""}`}
          >
            <Upload size={24} />
            <span>Subir mi fachada</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleSubirFachada}
              hidden
            />
          </label>
        </div>
        {fachadaPersonalizada && (
          <div className="fachada-preview">
            <img src={fachadaPersonalizada} alt="Fachada personalizada" />
          </div>
        )}
      </div>
    </div>
  );

  const renderPaso3 = () => (
    <div className="paso-contenido">
      <h2 className="paso-titulo">Paso 3: Estilo y Acabado</h2>

      {/* Estilos Visuales */}
      <div className="campo-grupo">
        <label className="campo-label">Estilo Visual</label>
        <div className="selector-estilos">
          {ESTILOS_VISUALES.map((estilo) => (
            <button
              key={estilo.id}
              className={`estilo-chip ${estiloVisual === estilo.id ? "activo" : ""}`}
              onClick={() => setEstiloVisual(estilo.id)}
            >
              {estilo.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Tipos de Letras Corpóreas (condicional) */}
      {categoria === "letras-corporeas" && (
        <div className="campo-grupo">
          <label className="campo-label">
            Tipo de Letra Corpórea <span className="obligatorio">*</span>
          </label>
          <div className="grid-tipos-letras">
            {TIPOS_LETRAS_CORPOREAS.map((tipo) => {
              const Icono = tipo.icono;
              return (
                <button
                  key={tipo.id}
                  className={`tipo-letra-card ${tipoLetraCorporea === tipo.id ? "activo" : ""}`}
                  onClick={() => setTipoLetraCorporea(tipo.id)}
                >
                  <Icono size={28} />
                  <h4>{tipo.nombre}</h4>
                  <p>{tipo.desc}</p>
                </button>
              );
            })}
          </div>
          {errores.tipoLetraCorporea && (
            <span className="error-mensaje">{errores.tipoLetraCorporea}</span>
          )}
        </div>
      )}

      {/* Selector de Espesor (condicional) */}
      {categoria === "letras-corporeas" && tipoLetraCorporea && (
        <div className="campo-grupo">
          <label className="campo-label">Espesor (relieve)</label>
          <div className="selector-espesor">
            {["3", "5", "10", "19"].map((esp) => (
              <button
                key={esp}
                className={`espesor-opcion ${espesor === esp ? "activo" : ""}`}
                onClick={() => setEspesor(esp)}
              >
                {esp}mm
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color de Luz LED (condicional) */}
      {categoria === "letras-corporeas" &&
        tipoLetraCorporea?.includes("luz") && (
          <div className="campo-grupo">
            <label className="campo-label">Color de Luz LED</label>
            <div className="selector-luz-led">
              {COLORES_LUZ_LED.map((color) => (
                <button
                  key={color.id}
                  className={`luz-led-opcion ${colorLuzLed === color.id ? "activo" : ""}`}
                  onClick={() => setColorLuzLed(color.id)}
                  style={{
                    backgroundColor: color.hex,
                    boxShadow:
                      colorLuzLed === color.id
                        ? `0 0 20px ${color.hex}`
                        : "none",
                  }}
                  title={color.nombre}
                >
                  <span
                    style={{
                      color:
                        color.id === "blanco-frio" ||
                        color.id === "blanco-calido"
                          ? "#000"
                          : "#fff",
                    }}
                  >
                    {color.nombre}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

      {/* Material Corte Láser (condicional) */}
      {categoria === "letras-corporeas" &&
        tipoLetraCorporea?.includes("metacrilato") && (
          <div className="campo-grupo">
            <label className="campo-label">Material Corte Láser</label>
            <div className="selector-material">
              {MATERIALES_LASER.map((material) => (
                <button
                  key={material.id}
                  className={`material-opcion ${materialLaser === material.id ? "activo" : ""}`}
                  onClick={() => setMaterialLaser(material.id)}
                >
                  <Layers size={20} />
                  <div>
                    <h4>{material.nombre}</h4>
                    <p>{material.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      {/* Configuración Especial para Lonas (sistema híbrido) */}
      {categoria === "lonas" && (
        <div className="campo-grupo">
          <label className="campo-label">
            Tipo de Negocio (Fondo temático)
          </label>
          <div className="grid-tipos-negocio">
            {TIPOS_NEGOCIO_LONAS.map((tipo) => {
              const Icono = tipo.icono;
              return (
                <button
                  key={tipo.id}
                  className={`tipo-negocio-card ${tipoNegocioLona === tipo.id ? "activo" : ""}`}
                  onClick={() => setTipoNegocioLona(tipo.id)}
                >
                  <Icono size={24} />
                  <span>{tipo.nombre}</span>
                </button>
              );
            })}
          </div>

          <div className="info-sistema-hibrido">
            <Sparkles size={20} />
            <p>
              El sistema híbrido genera un fondo decorativo temático con IA (sin
              texto), y superpone el texto y logo del usuario con precisión.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderPaso4 = () => (
    <div className="paso-contenido">
      <h2 className="paso-titulo">Paso 4: Describe tu Diseño</h2>

      <div className="campo-grupo">
        <label className="campo-label">Descripción del diseño deseado</label>
        <textarea
          className="campo-textarea"
          value={descripcionDiseño}
          onChange={(e) => setDescripcionDiseño(e.target.value)}
          placeholder="Ej: Logo de tijeras elegante, letras cursivas brillantes..."
          rows={4}
        />

        <button
          className="btn-mejorar-ia"
          onClick={mejorarDescripcionConIA}
          disabled={!descripcionDiseño.trim()}
        >
          <Wand2 size={18} />
          Mejorar con IA
        </button>

        {descripcionMejorada && (
          <div className="descripcion-mejorada">
            <p>
              <strong>Descripción mejorada:</strong>
            </p>
            <p>{descripcionMejorada}</p>
          </div>
        )}
      </div>

      <div className="campo-grupo">
        <label className="campo-label">Tamaño Aproximado</label>
        <div className="selector-dimensiones">
          <div className="dimension-input">
            <label>Ancho</label>
            <div className="input-con-unidad">
              <input
                type="number"
                value={tamanoAncho}
                onChange={(e) => setTamanoAncho(parseInt(e.target.value) || 0)}
                min="10"
                max="500"
              />
              <span>cm</span>
            </div>
          </div>
          <div className="dimension-x">×</div>
          <div className="dimension-input">
            <label>Alto</label>
            <div className="input-con-unidad">
              <input
                type="number"
                value={tamanoAlto}
                onChange={(e) => setTamanoAlto(parseInt(e.target.value) || 0)}
                min="10"
                max="500"
              />
              <span>cm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ==================== RENDER PRINCIPAL ====================

  return (
    <div className="neon-editor-page disenador-ia">
      {/* Navegación */}
      <nav className="nav-editor">
        <a
          href="#"
          className="logo-rotularte"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
        >
          ROTULARTE
        </a>
        <ul className="nav-links-rotularte">
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              Inicio
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/tienda");
              }}
            >
              Tienda
            </a>
          </li>
          <li>
            <a href="#" className="active">
              Diseñador IA
            </a>
          </li>
          <li>
            <div className="cart-icon" onClick={() => navigate("/tienda")}>
              <ShoppingCart size={24} />
              <span className="cart-count">0</span>
            </div>
          </li>
        </ul>
      </nav>

      {/* Contenido Principal */}
      <div className="disenador-contenido">
        {/* Sidebar */}
        <aside className="disenador-sidebar">
          <div className="sidebar-header">
            <h1>Diseñador IA</h1>
            <p>Crea tu rótulo profesional</p>
          </div>

          <div className="pasos-indicador">
            {[1, 2, 3, 4].map((paso) => (
              <button
                key={paso}
                className={`paso-indicador ${pasoActual === paso ? "activo" : ""} ${paso < pasoActual ? "completado" : ""}`}
                onClick={() => setPasoActual(paso)}
              >
                <span className="paso-numero">{paso}</span>
                <span className="paso-nombre">
                  {paso === 1 && "Producto"}
                  {paso === 2 && "Negocio"}
                  {paso === 3 && "Estilo"}
                  {paso === 4 && "Descripción"}
                </span>
              </button>
            ))}
          </div>

          <div className="sidebar-contenido">
            {pasoActual === 1 && renderPaso1()}
            {pasoActual === 2 && renderPaso2()}
            {pasoActual === 3 && renderPaso3()}
            {pasoActual === 4 && renderPaso4()}
          </div>

          <div className="sidebar-footer">
            <div className="navegacion-pasos">
              {pasoActual > 1 && (
                <button
                  className="btn-nav btn-anterior"
                  onClick={() => setPasoActual(pasoActual - 1)}
                >
                  <ChevronUp size={20} />
                  Anterior
                </button>
              )}
              {pasoActual < 4 && (
                <button
                  className="btn-nav btn-siguiente"
                  onClick={() => setPasoActual(pasoActual + 1)}
                >
                  Siguiente
                  <ChevronDown size={20} />
                </button>
              )}
            </div>

            <button
              className="btn-generar"
              onClick={generarDiseno}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="spinner" />
                  Generando...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generar Diseño con IA
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Área de Preview */}
        <main className="disenador-preview">
          {showPreview ? (
            <div className="preview-generado">
              <div className="preview-header">
                <h2>Vista previa de tu diseño</h2>
                <div className="preview-acciones">
                  <button className="btn-preview" onClick={descargarDiseno}>
                    <Download size={18} />
                    Descargar
                  </button>
                  <button className="btn-preview" onClick={resetearFormulario}>
                    <RefreshCcw size={18} />
                    Nuevo diseño
                  </button>
                </div>
              </div>
              <canvas ref={canvasRef} className="canvas-preview" />
            </div>
          ) : modoVista ? (
            /* VISTAS AVANZADAS: 3D / AR / MOCKUP / COMPARADOR */
            <div className="vista-avanzada-container">
              {/* Header de vista avanzada */}
              <div className="vista-avanzada-header">
                <h2>
                  {modoVista === "3d" && (
                    <>
                      <Cuboid size={24} /> Vista 3D
                    </>
                  )}
                  {modoVista === "ar" && (
                    <>
                      <Glasses size={24} /> Realidad Aumentada
                    </>
                  )}
                  {modoVista === "mockup" && (
                    <>
                      <Store size={24} /> Mockup en Fachada
                    </>
                  )}
                  {modoVista === "comparador" && (
                    <>
                      <Split size={24} /> Comparador Día/Noche
                    </>
                  )}
                </h2>
                <button
                  className="btn-cerrar-vista"
                  onClick={cerrarVistaAvanzada}
                >
                  <X size={20} />
                  Cerrar vista
                </button>
              </div>

              {/* Contenido según el modo */}
              <div className="vista-avanzada-contenido">
                {modoVista === "3d" && (
                  <div className="vista-3d">
                    <div
                      className="modelo-3d"
                      style={{ transform: `rotateY(${rotacion3D}deg)` }}
                    >
                      <div
                        className="rotulo-3d"
                        style={{
                          fontFamily: tipografia?.familia,
                          color: colorActivo?.hex || "#ff6b00",
                        }}
                      >
                        {nombreNegocio || "TU RÓTULO"}
                      </div>
                    </div>

                    <div className="controles-3d">
                      <button onClick={() => rotar3D("izquierda")}>
                        <ChevronUp
                          size={20}
                          style={{ transform: "rotate(-90deg)" }}
                        />
                        Rotar izquierda
                      </button>
                      <span className="angulo-3d">{rotacion3D}°</span>
                      <button onClick={() => rotar3D("derecha")}>
                        Rotar derecha
                        <ChevronUp
                          size={20}
                          style={{ transform: "rotate(90deg)" }}
                        />
                      </button>
                    </div>

                    <div className="info-3d">
                      <p>Usa los botones para rotar el modelo 360°</p>
                    </div>
                  </div>
                )}

                {modoVista === "ar" && (
                  <div className="vista-ar">
                    <div className="ar-camera-placeholder">
                      <Scan size={64} />
                      <p>Escanea el código QR con tu móvil</p>
                      <div className="qr-placeholder">
                        <Grid3X3 size={120} />
                        <span>Código QR para experiencia AR</span>
                      </div>
                    </div>

                    <div className="ar-instrucciones">
                      <h4>Para usar Realidad Aumentada:</h4>
                      <ol>
                        <li>Abre la cámara de tu móvil</li>
                        <li>Escanea el código QR</li>
                        <li>Apunta a la pared donde irá el rótulo</li>
                        <li>Ve cómo queda en tu local real</li>
                      </ol>
                    </div>

                    <div className="ar-compatibilidad-info">
                      <Smartphone size={20} />
                      <span>Compatible con iPhone 6s+ y Android 7.0+</span>
                    </div>
                  </div>
                )}

                {modoVista === "mockup" && (
                  <div className="vista-mockup">
                    <div
                      className="mockup-display"
                      style={{
                        background:
                          FACHADAS.find((f) => f.id === fachada)?.id ===
                          "madera"
                            ? "#8B4513"
                            : FACHADAS.find((f) => f.id === fachada)?.id ===
                                "ladrillo"
                              ? "#D2691E"
                              : FACHADAS.find((f) => f.id === fachada)?.id ===
                                  "oscura"
                                ? "#2c2c2c"
                                : FACHADAS.find((f) => f.id === fachada)?.id ===
                                    "hormigon"
                                  ? "#808080"
                                  : FACHADAS.find((f) => f.id === fachada)
                                        ?.id === "marmol"
                                    ? "#F5F5F5"
                                    : "#f5f5f5",
                      }}
                    >
                      <div
                        className="mockup-rotulo"
                        style={{
                          fontFamily: tipografia?.familia,
                          color: colorActivo?.hex || "#ff6b00",
                          textShadow: `0 0 20px ${colorActivo?.hex || "#ff6b00"}`,
                        }}
                      >
                        {nombreNegocio || "TU RÓTULO"}
                      </div>
                    </div>

                    <div className="mockup-fachadas-selector">
                      <span>Cambiar fachada:</span>
                      <div className="fachadas-mini-grid">
                        {FACHADAS.map((f) => (
                          <button
                            key={f.id}
                            className={`mini-fachada-btn ${fachada === f.id ? "activa" : ""}`}
                            onClick={() => verEnFachada(f.id)}
                            title={f.nombre}
                          >
                            <div
                              className="mini-fachada-color"
                              style={{
                                background:
                                  f.id === "madera"
                                    ? "#8B4513"
                                    : f.id === "ladrillo"
                                      ? "#D2691E"
                                      : f.id === "oscura"
                                        ? "#2c2c2c"
                                        : f.id === "hormigon"
                                          ? "#808080"
                                          : f.id === "marmol"
                                            ? "#F5F5F5"
                                            : "#f5f5f5",
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {modoVista === "comparador" && (
                  <div className="vista-comparador">
                    <div className="comparador-container">
                      <div
                        className={`comparador-modo ${modoDiaNoche === "dia" ? "activo" : ""}`}
                      >
                        <div className="modo-label">
                          <Sun size={20} />
                          Modo Día
                        </div>
                        <div
                          className="comparador-preview dia"
                          style={{
                            fontFamily: tipografia?.familia,
                            color: colorActivo?.hex || "#333",
                          }}
                        >
                          {nombreNegocio || "TU RÓTULO"}
                          <p className="modo-desc">Así se ve durante el día</p>
                        </div>
                      </div>

                      <div className="comparador-divider">
                        <button onClick={cambiarModoDiaNoche}>
                          <FlipHorizontal size={24} />
                          Cambiar
                        </button>
                      </div>

                      <div
                        className={`comparador-modo ${modoDiaNoche === "noche" ? "activo" : ""}`}
                      >
                        <div className="modo-label">
                          <Moon size={20} />
                          Modo Noche
                        </div>
                        <div
                          className="comparador-preview noche"
                          style={{
                            fontFamily: tipografia?.familia,
                            color: colorActivo?.hex || "#ff6b00",
                            textShadow: `0 0 30px ${colorActivo?.hex || "#ff6b00"}`,
                          }}
                        >
                          {nombreNegocio || "TU RÓTULO"}
                          <p className="modo-desc">
                            Así se ve iluminado de noche
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="preview-vacio">
              <div className="preview-header-section">
                <div className="preview-icono-principal">
                  <Palette size={48} />
                </div>
                <h2>Visualiza tu diseño</h2>
                <p>Elige cómo quieres ver tu rótulo antes de generarlo</p>
              </div>

              {/* Opciones de Visualización 3D/AR */}
              <div className="visualizacion-opciones">
                <div className="viz-card" onClick={() => setModoVista("3d")}>
                  <div className="viz-icono">
                    <Cuboid size={32} />
                    <div className="viz-badge">3D</div>
                  </div>
                  <h3>Vista 3D</h3>
                  <p>
                    Explora tu diseño desde todos los ángulos con rotación 360°
                  </p>
                  <div className="viz-preview-placeholder">
                    <div className="rotate-animation">
                      <Box size={40} />
                    </div>
                    <span className="viz-hint">Haz clic para rotar</span>
                  </div>
                </div>

                <div
                  className="viz-card ar-card"
                  onClick={() => setModoVista("ar")}
                >
                  <div className="viz-icono">
                    <Glasses size={32} />
                    <div className="viz-badge ar">AR</div>
                  </div>
                  <h3>Realidad Aumentada</h3>
                  <p>Visualiza el rótulo en tu local usando la cámara</p>
                  <div className="viz-preview-placeholder ar-placeholder">
                    <div className="scan-animation">
                      <ScanLine size={40} />
                    </div>
                    <span className="viz-hint">Usa tu cámara</span>
                  </div>
                  <div className="ar-compatibilidad">
                    <Smartphone size={14} />
                    <span>Compatible con iOS y Android</span>
                  </div>
                </div>

                <div
                  className="viz-card"
                  onClick={() => setModoVista("mockup")}
                >
                  <div className="viz-icono">
                    <Store size={32} />
                  </div>
                  <h3>Mockup en Fachada</h3>
                  <p>Ve cómo quedará en tu local con diferentes fondos</p>
                  <div className="viz-preview-placeholder">
                    <div className="fachada-preview-mini">
                      <div
                        className="mini-fachada"
                        style={{ background: "#f5f5f5" }}
                      ></div>
                      <div
                        className="mini-fachada"
                        style={{ background: "#8B4513" }}
                      ></div>
                      <div
                        className="mini-fachada"
                        style={{ background: "#333" }}
                      ></div>
                    </div>
                    <span className="viz-hint">
                      {FACHADAS.length} fachadas disponibles
                    </span>
                  </div>
                </div>

                <div
                  className="viz-card"
                  onClick={() => setModoVista("comparador")}
                >
                  <div className="viz-icono">
                    <Split size={32} />
                  </div>
                  <h3>Comparador</h3>
                  <p>Compara día vs noche, con luz vs sin luz</p>
                  <div className="viz-preview-placeholder">
                    <div className="comparador-mini">
                      <div className="comp-half dia">
                        <Sun size={16} />
                      </div>
                      <div className="comp-half noche">
                        <Moon size={16} />
                      </div>
                    </div>
                    <span className="viz-hint">Modo día / noche</span>
                  </div>
                </div>
              </div>

              {/* Separador */}
              <div className="preview-separator">
                <span>O completa la configuración</span>
              </div>

              {/* Consejos de configuración */}
              <div className="preview-consejos">
                <div className="consejo">
                  <div className="consejo-numero">1</div>
                  <div className="consejo-contenido">
                    <strong>Selecciona el tipo de producto</strong>
                    <span>Cajas de luz, letras neón, corpóreas...</span>
                  </div>
                </div>
                <div className="consejo">
                  <div className="consejo-numero">2</div>
                  <div className="consejo-contenido">
                    <strong>Ingresa el nombre de tu negocio</strong>
                    <span>El texto principal de tu rótulo</span>
                  </div>
                </div>
                <div className="consejo">
                  <div className="consejo-numero">3</div>
                  <div className="consejo-contenido">
                    <strong>Elige colores y estilo</strong>
                    <span>Personaliza la apariencia</span>
                  </div>
                </div>
                <div className="consejo">
                  <div className="consejo-numero">4</div>
                  <div className="consejo-contenido">
                    <strong>Genera tu diseño</strong>
                    <span>La IA creará opciones para ti</span>
                  </div>
                </div>
              </div>

              {/* Vista previa rápida del texto */}
              {nombreNegocio && (
                <div className="preview-texto-rapido">
                  <h4>Vista previa del texto</h4>
                  <div
                    className="texto-preview-neon"
                    style={{
                      fontFamily: tipografia?.familia || "inherit",
                      color: colorActivo?.hex || "#ff6b00",
                    }}
                  >
                    {nombreNegocio}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Color Picker - Cambiar Estética */}
      <ColorPicker
        currentTheme={theme}
        setTheme={setTheme}
        currentColor={neonColor}
        setColor={setNeonColor}
      />
    </div>
  );
};

export default NeonEditorPage;
