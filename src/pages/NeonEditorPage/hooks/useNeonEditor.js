import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CATEGORIAS_PRODUCTO,
  TIPOGRAFIAS,
  CATS_WITH_ORIENTATION,
  CATS_WITH_CORPOREA_TYPE,
  TIPOS_CON_LUZ,
  ESPESORES_POR_TIPO,
} from "../data/constants";

export const useNeonEditor = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const canvasRef = useRef(null);

  // Estados de UI
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [tabActivo, setTabActivo] = useState("design");
  const [pasoActual, setPasoActual] = useState(1);
  const [modoDiaNoche, setModoDiaNoche] = useState("dia");
  const [rotacion3D, setRotacion3D] = useState(0);

  // Estados del formulario
  const [categoria, setCategoria] = useState(null);
  const [nombreNegocio, setNombreNegocio] = useState("");
  const [tipografia, setTipografia] = useState(TIPOGRAFIAS[0]);
  const [coloresDiseño, setColoresDiseño] = useState([]);
  const [colorActivo, setColorActivo] = useState(null);
  const [orientacion, setOrientacion] = useState("horizontal");
  const [textoAdicional, setTextoAdicional] = useState("");
  const [logo, setLogo] = useState(null);
  const [modoIntegracionLogo, setModoIntegracionLogo] = useState("exacto");
  const [fachada, setFachada] = useState("blanca");
  const [fachadaPersonalizada, setFachadaPersonalizada] = useState(null);
  const [estiloVisual, setEstiloVisual] = useState("moderno");

  // Estados específicos por tipo
  const [tipoLetraCorporea, setTipoLetraCorporea] = useState(null);
  const [espesor, setEspesor] = useState(8);
  const [colorLuzLed, setColorLuzLed] = useState("blanco-calido");
  const [materialLaser, setMaterialLaser] = useState("transparente");
  const [acabadoSuperficial, setAcabadoSuperficial] = useState("lacado-brillo");
  const [tipoNegocioLona, setTipoNegocioLona] = useState("general");
  const [estiloLona, setEstiloLona] = useState("moderno");

  // Estados de iluminación y post-procesado 3D
  const [iluminacionHDRI, setIluminacionHDRI] = useState("studio");
  const [postProcessing, setPostProcessing] = useState({
    bloom: true,
    fxaa: true,
    toneMapping: true,
    contrast: 1.0,
    brightness: 1.0
  });

  // Estados para variaciones y upscale
  const [variacionesColor, setVariacionesColor] = useState([]);
  const [isUpscaling, setIsUpscaling] = useState(false);

  // Color picker
  const [colorPickerTab, setColorPickerTab] = useState("visualizer");
  const [colorHSB, setColorHSB] = useState({ h: 0, s: 100, b: 100 });
  const [hexInput, setHexInput] = useState("#FF0000");

  // Modal Lead
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadData, setLeadData] = useState({ nombre: "", email: "", telefono: "", acepta: false });

  // Descripción y tamaño
  const [descripcionDiseño, setDescripcionDiseño] = useState("");
  const [descripcionMejorada, setDescripcionMejorada] = useState("");
  const [tamanoAncho, setTamanoAncho] = useState(100);
  const [tamanoAlto, setTamanoAlto] = useState(50);
  const [errores, setErrores] = useState({});

  // Estados para generación de imágenes
  const [rotuloAislado, setRotuloAislado] = useState(null);
  const [mockups, setMockups] = useState([]);
  const [imagenActiva, setImagenActiva] = useState('rotulo');
  const [errorGeneracion, setErrorGeneracion] = useState(null);
  const [progresoGeneracion, setProgresoGeneracion] = useState(0);
  const [setsGenerados, setSetsGenerados] = useState([]); // [ { rotulo, mockup }, { rotulo, mockup } ]
  const [setActivo, setSetActivo] = useState(0); // 0 o 1
  
  // Estados para sistema híbrido de lonas (Ideogram + Canvas)
  const [mostrarGeneradorLona, setMostrarGeneradorLona] = useState(false);
  const [fondosLonaGenerados, setFondosLonaGenerados] = useState([]);
  const [lonaHibridaResultado, setLonaHibridaResultado] = useState(null);
  const [usarSistemaHibridoLona, setUsarSistemaHibridoLona] = useState(true); // Default true para lonas

  // Tema y modo de visualización
  const [theme, setTheme] = useState(() => localStorage.getItem("rotularte-theme") || "industrial");
  const [neonColor, setNeonColor] = useState(() => localStorage.getItem("rotularte-color") || "#ff6b00");
  const [modoVisualizacion, setModoVisualizacion] = useState(() => localStorage.getItem("rotularte-modo") || "wizard"); // 'wizard' | 'completo'

  // Cargar parámetros URL
  useEffect(() => {
    const categoriaParam = searchParams.get("categoria");
    const nombreParam = searchParams.get("nombre");
    if (categoriaParam) {
      const categoriaValida = CATEGORIAS_PRODUCTO.find((cat) => cat.id === categoriaParam);
      if (categoriaValida) setCategoria(categoriaParam);
    }
    if (nombreParam) setNombreNegocio(decodeURIComponent(nombreParam));
  }, [searchParams]);

  // Aplicar tema
  useEffect(() => {
    const themeConfig = {
      industrial: { bg: "#0a0a0a", bgAlt: "#111111", accent: "#ffffff", text: "#e0e0e0", textMuted: "#666666", metal: "#2a2a2a" },
      minimal: { bg: "#fafafa", bgAlt: "#ffffff", accent: "#1a1a1a", text: "#333333", textMuted: "#888888", metal: "#e5e5e5" },
      brutalist: { bg: "#000000", bgAlt: "#000000", accent: "#ffffff", text: "#ffffff", textMuted: "#666666", metal: "#ffffff" },
      vaporwave: { bg: "#0c0518", bgAlt: "#120824", accent: "#ffffff", text: "#e0e0ff", textMuted: "#8a7a9e", metal: "#1a0f2e" },
      cyberpunk: { bg: "#050810", bgAlt: "#0a1020", accent: "#ffffff", text: "#a0ffe0", textMuted: "#507060", metal: "#102030" },
    };
    const config = themeConfig[theme] || themeConfig.industrial;
    document.body.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty("--color-neon", neonColor);
    document.documentElement.style.setProperty("--color-bg", config.bg);
    document.documentElement.style.setProperty("--color-bg-alt", config.bgAlt);
    document.documentElement.style.setProperty("--color-accent", config.accent);
    document.documentElement.style.setProperty("--color-text", config.text);
    document.documentElement.style.setProperty("--color-text-muted", config.textMuted);
    document.documentElement.style.setProperty("--color-metal", config.metal);
    localStorage.setItem("rotularte-theme", theme);
    localStorage.setItem("rotularte-color", neonColor);
    localStorage.setItem("rotularte-modo", modoVisualizacion);
  }, [theme, neonColor, modoVisualizacion]);

  // Handlers
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
      reader.onload = (e) => {
        setFachadaPersonalizada(e.target.result);
        setFachada('personalizada');
      };
      reader.readAsDataURL(file);
    }
  };

  const mejorarDescripcionConIA = async () => {
    if (!descripcionDiseño.trim()) return;
    const mejoras = [
      "Diseño elegante con tipografía moderna y colores vibrantes",
      "Estilo profesional con acabados premium y detalles sofisticados",
      "Diseño atractivo con elementos visuales llamativos",
      "Estilo minimalista con líneas limpias",
    ];
    const mejoraAleatoria = mejoras[Math.floor(Math.random() * mejoras.length)];
    setDescripcionMejorada(`${descripcionDiseño}. ${mejoraAleatoria}`);
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!categoria) nuevosErrores.categoria = "Selecciona una categoría";
    if (!nombreNegocio.trim()) nuevosErrores.nombreNegocio = "El nombre es obligatorio";
    if (coloresDiseño.length === 0) nuevosErrores.colores = "Selecciona al menos un color";
    if (categoria === "letras-corporeas" && !tipoLetraCorporea) {
      nuevosErrores.tipoLetraCorporea = "Selecciona un tipo";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const getCategoriaInfo = () => CATEGORIAS_PRODUCTO.find((cat) => cat.id === categoria);
  const mostrarSelectorOrientacion = () => CATS_WITH_ORIENTATION.includes(categoria);
  const mostrarSelectorCorporea = () => CATS_WITH_CORPOREA_TYPE.includes(categoria);
  const mostrarSelectorLuzLed = () => {
    if (categoria === "letras-neon") return true;
    if (categoria === "letras-corporeas" && tipoLetraCorporea) {
      return TIPOS_CON_LUZ.includes(tipoLetraCorporea);
    }
    return false;
  };
  const mostrarSelectorMaterialLaser = () => categoria === "letras-corporeas" && tipoLetraCorporea === "metacrilato";
  const mostrarConfiguracionLona = () => categoria === "lonas-pancartas";
  const getEspesoresDisponibles = () => {
    if (!tipoLetraCorporea) return [];
    return ESPESORES_POR_TIPO[tipoLetraCorporea] || [];
  };
  const mostrarSelectorAcabado = () => categoria === "letras-corporeas" && tipoLetraCorporea && !tipoLetraCorporea.includes("sin-luz");

  // Generar variaciones de color
  const generarVariacionesColor = () => {
    if (coloresDiseño.length === 0) return;
    const variaciones = [];
    for (let i = 0; i < 4; i++) {
      variaciones.push({
        id: i,
        colores: coloresDiseño.map(c => ({
          ...c,
          hex: ajustarMatiz(c.hex, i * 30)
        }))
      });
    }
    setVariacionesColor(variaciones);
  };

  // Ajustar matiz de un color (simulación)
  const ajustarMatiz = (hex, shift) => {
    // Simplificación: retornar colores predefinidos de variación
    const variaciones = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57", "#FF9FF3"];
    return variaciones[Math.floor(Math.random() * variaciones.length)];
  };

  // Upscale de imagen
  const mejorarResolucion = async (imagenUrl) => {
    setIsUpscaling(true);
    // Simulación de proceso de upscale
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsUpscaling(false);
    return imagenUrl; // En producción, aquí se llamaría a la API
  };

  // Toggle post-processing
  const togglePostProcessing = (key) => {
    setPostProcessing(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return {
    // Refs
    canvasRef,
    // Estados UI
    isGenerating, setIsGenerating,
    showPreview, setShowPreview,
    tabActivo, setTabActivo,
    pasoActual, setPasoActual,
    modoDiaNoche, setModoDiaNoche,
    rotacion3D, setRotacion3D,
    // Estados formulario
    categoria, setCategoria,
    nombreNegocio, setNombreNegocio,
    tipografia, setTipografia,
    coloresDiseño, setColoresDiseño,
    colorActivo, setColorActivo,
    orientacion, setOrientacion,
    textoAdicional, setTextoAdicional,
    logo, setLogo,
    modoIntegracionLogo, setModoIntegracionLogo,
    fachada, setFachada,
    fachadaPersonalizada, setFachadaPersonalizada,
    estiloVisual, setEstiloVisual,
    // Estados específicos
    tipoLetraCorporea, setTipoLetraCorporea,
    espesor, setEspesor,
    colorLuzLed, setColorLuzLed,
    materialLaser, setMaterialLaser,
    acabadoSuperficial, setAcabadoSuperficial,
    tipoNegocioLona, setTipoNegocioLona,
    estiloLona, setEstiloLona,
    // Iluminación y post-procesado
    iluminacionHDRI, setIluminacionHDRI,
    postProcessing, setPostProcessing,
    togglePostProcessing,
    // Variaciones y upscale
    variacionesColor, setVariacionesColor,
    isUpscaling, setIsUpscaling,
    generarVariacionesColor,
    mejorarResolucion,
    // Color picker
    colorPickerTab, setColorPickerTab,
    colorHSB, setColorHSB,
    hexInput, setHexInput,
    // Modal Lead
    showLeadModal, setShowLeadModal,
    leadData, setLeadData,
    // Descripción
    descripcionDiseño, setDescripcionDiseño,
    descripcionMejorada, setDescripcionMejorada,
    tamanoAncho, setTamanoAncho,
    tamanoAlto, setTamanoAlto,
    errores, setErrores,
    // Generación imágenes
    rotuloAislado, setRotuloAislado,
    mockups, setMockups,
    imagenActiva, setImagenActiva,
    errorGeneracion, setErrorGeneracion,
    progresoGeneracion, setProgresoGeneracion,
    setsGenerados, setSetsGenerados,
    setActivo, setSetActivo,
    // Sistema híbrido de lonas
    mostrarGeneradorLona, setMostrarGeneradorLona,
    fondosLonaGenerados, setFondosLonaGenerados,
    lonaHibridaResultado, setLonaHibridaResultado,
    usarSistemaHibridoLona, setUsarSistemaHibridoLona,
    // Tema y modo
    theme, setTheme,
    neonColor, setNeonColor,
    modoVisualizacion, setModoVisualizacion,
    // Handlers
    agregarColor,
    eliminarColor,
    handleSubirLogo,
    handleSubirFachada,
    mejorarDescripcionConIA,
    validarFormulario,
    // Helpers
    getCategoriaInfo,
    mostrarSelectorOrientacion,
    mostrarSelectorCorporea,
    mostrarSelectorLuzLed,
    mostrarSelectorMaterialLaser,
    mostrarSelectorAcabado,
    mostrarConfiguracionLona,
    getEspesoresDisponibles,
    navigate,
  };
};
