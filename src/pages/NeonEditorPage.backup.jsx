import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ShoppingCart, Type, Palette, Sparkles, Zap, Download, RefreshCcw, Check,
  Box, Flag, Type as TypeIcon, Square, Scroll, Image, MapPin, Lightbulb,
  Building2, X, Upload, Wand2, ChevronDown, ChevronUp, Plus, Trash2, Star,
  Eye, Wrench, Paintbrush, Maximize2, Grid3X3, Sun, Moon, Gauge, Layers,
  Circle, Square as SquareIcon, Triangle, Smartphone, Ruler, XCircle, Glasses,
  Cuboid, Camera, ScanLine, Scan, Move3d, View, Aperture, FlipHorizontal,
  Split, Monitor, Store, ScanFace, Coffee, Utensils, Croissant, Scissors,
  Dumbbell, Shirt, Home, HardHat, Wrench as WrenchIcon, Stethoscope, PawPrint,
  Flower2, PartyPopper, Trophy, Laptop, Store as StoreIcon, Info, CheckCircle,
  ArrowRight, ArrowLeft, Sliders, Trash, Copy, Share2, Heart, ShoppingBag,
  FileText, MessageSquare, Phone, Mail, User, Shield, CreditCard, Truck,
  HelpCircle, ChevronRight, MoreHorizontal, ZoomIn, ZoomOut, RotateCcw,
  AlignCenter, AlignLeft, AlignRight, Bold, Italic, Underline, Link,
  Image as ImageIcon, Film, Music, Mic, Wifi, Bluetooth, Battery,
  Cast, Airplay, Monitor as MonitorIcon, Tablet, Watch, Headphones, Speaker,
  Radio, Tv, Video, Camera as CameraIcon, ImagePlus, FolderOpen, Save,
  Printer, Scissors as ScissorsIcon, Clipboard, ClipboardCopy, ClipboardList,
  ExternalLink, Link as LinkIcon, Unlink, Paperclip, Bookmark, Flag as FlagIcon,
  Pin, Lock, Unlock, Key, Shield as ShieldIcon, Eye as EyeIcon, EyeOff,
  Fingerprint, Scan as ScanIcon, ScanFace as ScanFaceIcon, ScanLine as ScanLineIcon,
  Settings, Cog, Sliders as SlidersIcon, Wand2 as Wand2Icon, Brush, Eraser,
  Pencil, PenTool as PenToolIcon, Type as TypeIcon2, AlignJustify,
  List, ListOrdered, ListChecks, Indent, Outdent, Quote, Code as CodeIcon,
  Github, Twitter, Facebook, Instagram, Linkedin, Youtube, Twitch, Dribbble,
  Figma, Slack, Trello, Chrome, Compass, Clock, Calendar, Timer, Hourglass,
  Watch as WatchIcon, History, RotateCcw as RotateCcwIcon, Undo, Redo,
  Save as SaveIcon, Trash as TrashIcon, Edit as EditIcon, PenTool as PenToolIcon2,
  Highlighter as HighlighterIcon, Palette as PaletteIcon, Sun as SunIcon,
  Moon as MoonIcon, Cloud, CloudRain, CloudSnow, Wind, Droplets, Thermometer,
  Flame, Snowflake, Zap as ZapIcon, Battery as BatteryIcon, Cloud as CloudIcon,
  Play, SkipBack, SkipForward, Rewind, FastForward, Repeat, Shuffle,
  ListMusic, ListVideo, GripVertical, GripHorizontal, Move as MoveIcon,
  Rotate3d, Scale, Expand, Shrink, Maximize as MaximizeIcon, Minimize as MinimizeIcon,
  Crop, Copy as CopyIcon, CopyCheck, Clipboard as ClipboardIcon,
  ClipboardCopy as ClipboardCopyIcon, ClipboardList as ClipboardListIcon,
  Edit2 as Edit2Icon, Edit3 as Edit3Icon, Pencil as PencilIcon,
  PaintBucket, SprayCan, Thermometer as ThermometerIcon,
  CloudRain as CloudRainIcon, CloudSnow as CloudSnowIcon, Wind as WindIcon,
  Droplets as DropletsIcon, Flame as FlameIcon, Snowflake as SnowflakeIcon,
  ZapOff, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning,
  Wifi as WifiIcon, WifiOff, Bluetooth as BluetoothIcon, BluetoothOff,
  Utensils as UtensilsIcon, Coffee as CoffeeIcon, Wine, Beer, GlassWater,
  Croissant as CroissantIcon, Circle as CircleIcon, CircleCheck, CircleX,
  CirclePlus, CircleMinus, CircleArrowUp, CircleArrowDown,
  Square as SquareIcon2, SquareCheck, SquareX, SquarePlus, SquareMinus,
  Triangle as TriangleIcon, Star as StarIcon, Heart as HeartIcon,
  Car, Truck as TruckIcon, Train, Bus, Plane, Bike, Anchor, Sailboat,
  Fuel, Gauge as GaugeIcon, Activity as ActivityIcon, Map as MapIcon,
  MapPin as MapPinIcon, Navigation, Globe, Globe as GlobeIcon,
  DollarSign, Percent, Euro, PoundSterling, JapaneseYen, Bitcoin,
  Wallet, Receipt, Banknote, Landmark, PiggyBank, TrendingUp, TrendingDown,
  BarChart, PieChart, Target, Crosshair, Focus, Aperture as ApertureIcon,
  CameraOff, Video as VideoIcon, Film as FilmIcon, Image as ImageIcon2,
  ImagePlus as ImagePlusIcon, Images, PictureInPicture, Cast as CastIcon,
  Airplay as AirplayIcon, Monitor as MonitorIcon2, Tv as TvIcon,
  Smartphone as SmartphoneIcon, Tablet as TabletIcon, Computer, Mouse,
  Keyboard, Headphones as HeadphonesIcon, Mic as MicIcon, MicOff,
  Volume, VolumeX, VolumeOff, Radio as RadioIcon, Music as MusicIcon,
  FileText as FileTextIcon, FileCode, FileJson, FileType, FileCheck,
  FileX as FileXIcon, FilePlus as FilePlusIcon, Folder as FolderIcon,
  FolderOpen as FolderOpenIcon, FolderPlus as FolderPlusIcon,
  Inbox as InboxIcon, Send as SendIcon, Mail as MailIcon,
  MessageCircle as MessageCircleIcon, Phone as PhoneIcon,
  PhoneCall as PhoneCallIcon, Video as VideoIcon2, Hash, AtSign,
  QrCode, Barcode
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "../styles/rotularte.css";
import "../styles/neoneditor.css";

// ==================== DATOS Y CONFIGURACIÓN ====================

// Categorías de producto - Coinciden con disenador-ia.php
const CATEGORIAS_PRODUCTO = [
  { id: "rotulos", nombre: "Rótulos", icono: Box, desc: "Rótulos luminosos con estructura", precioBase: 89, unidad: "m²", tiempoEntrega: "5-7 días" },
  { id: "letras-neon", nombre: "Neón LED", icono: Lightbulb, desc: "Neones realistas con tubos de vidrio brillantes. El texto se genera en UNA SOLA LÍNEA horizontal.", precioBase: 45, unidad: "letra", tiempoEntrega: "7-10 días" },
  { id: "rigidos-impresos", nombre: "Rígidos PVC", icono: Square, desc: "Paneles rígidos de PVC para señalización", precioBase: 35, unidad: "m²", tiempoEntrega: "3-5 días" },
  { id: "letras-corporeas", nombre: "Corpóreas 3D", icono: TypeIcon, desc: "Letras con volumen real. Usa 'Quitar fondo' para mejor integración en fachadas.", precioBase: 25, unidad: "letra", tiempoEntrega: "7-10 días" },
  { id: "lonas-pancartas", nombre: "Lonas", icono: Scroll, desc: "Ideal para eventos y promociones. Incluye ojales y refuerzos.", precioBase: 12, unidad: "m²", tiempoEntrega: "2-3 días" },
  { id: "banderolas", nombre: "Banderolas", icono: Flag, desc: "Banderas publicitarias para farolas", precioBase: 29, unidad: "unidad", tiempoEntrega: "3-5 días" },
  { id: "vinilos", nombre: "Vinilos", icono: MapPin, desc: "Vinilos para escaparates y cristales", precioBase: 18, unidad: "m²", tiempoEntrega: "2-3 días" },
  { id: "rollup", nombre: "Roll Up", icono: Scroll, desc: "Display enrollable para eventos", precioBase: 49, unidad: "unidad", tiempoEntrega: "2-3 días" },
  { id: "photocall", nombre: "Photocall", icono: Camera, desc: "Paneles para fotos en eventos", precioBase: 89, unidad: "unidad", tiempoEntrega: "3-5 días" },
  { id: "carteles-inmobiliarios", nombre: "Inmobiliario", icono: Home, desc: "Carteles de SE VENDE / SE ALQUILA", precioBase: 15, unidad: "unidad", tiempoEntrega: "2-3 días" },
  { id: "mupis", nombre: "Mupis", icono: Monitor, desc: "Mobiliario urbano publicitario", precioBase: 35, unidad: "unidad", tiempoEntrega: "3-5 días" },
  { id: "flybanner", nombre: "Fly Banner", icono: Flag, desc: "Banderas publicitarias con forma de vela", precioBase: 79, unidad: "unidad", tiempoEntrega: "3-5 días" },
];

const CATS_WITH_ORIENTATION = ["lonas-pancartas", "vinilos", "banderolas", "rollup", "photocall", "mupis", "flybanner"];
const CATS_WITH_CORPOREA_TYPE = ["letras-corporeas"];

const TIPOS_LETRAS_CORPOREAS = [
  { id: "aluminio-sin-luz", nombre: "Aluminio sin luz", icono: "🔩", desc: "Letras de aluminio sin iluminación" },
  { id: "pvc", nombre: "PVC fresado", icono: "🎨", desc: "Letras de PVC fresado" },
  { id: "aluminio-con-luz", nombre: "Aluminio con luz", icono: "💡", desc: "Aluminio con iluminación frontal" },
  { id: "pvc-retroiluminadas", nombre: "PVC retroiluminado", icono: "✨", desc: "PVC con retroiluminación LED" },
  { id: "metacrilato", nombre: "Metacrilato acrílico", icono: "💎", desc: "Letras de metacrilato/acrílico" },
  { id: "pvc-impreso-uv", nombre: "PVC impreso UV", icono: "🖨️", desc: "PVC con impresión UV directa" },
  { id: "aluminio-retroiluminada", nombre: "Aluminio retroiluminado", icono: "🌟", desc: "Aluminio con halo LED trasero" },
  { id: "dibond-sin-relieve", nombre: "Dibond sin relieve", icono: "📐", desc: "Letras planas de Aluminio/Dibond recortadas" },
];

const TIPOS_CON_LUZ = ["aluminio-con-luz", "pvc-retroiluminadas", "aluminio-retroiluminada"];

const ESPESORES_POR_TIPO = {
  "aluminio-sin-luz": [{ valor: 5, label: "5 cm" }, { valor: 8, label: "8 cm (estándar)" }, { valor: 10, label: "10 cm" }, { valor: 13, label: "13 cm" }],
  pvc: [{ valor: 5, label: "5 cm" }, { valor: 8, label: "8 cm" }, { valor: 10, label: "10 cm (estándar)" }, { valor: 13, label: "13 cm" }, { valor: 16, label: "16 cm" }],
  "aluminio-con-luz": [{ valor: 5, label: "5 cm" }, { valor: 8, label: "8 cm (estándar)" }, { valor: 10, label: "10 cm" }, { valor: 13, label: "13 cm" }],
  "pvc-retroiluminadas": [{ valor: 5, label: "5 cm" }, { valor: 8, label: "8 cm (estándar)" }, { valor: 10, label: "10 cm" }, { valor: 13, label: "13 cm" }],
  metacrilato: [{ valor: 3, label: "3 cm (fino)" }, { valor: 5, label: "5 cm (estándar)" }, { valor: 8, label: "8 cm (grueso)" }],
  "pvc-impreso-uv": [{ valor: 5, label: "5 cm" }, { valor: 8, label: "8 cm (estándar)" }, { valor: 10, label: "10 cm" }, { valor: 13, label: "13 cm" }],
  "aluminio-retroiluminada": [{ valor: 5, label: "5 cm" }, { valor: 8, label: "8 cm (estándar)" }, { valor: 10, label: "10 cm" }, { valor: 13, label: "13 cm" }],
  "dibond-sin-relieve": [{ valor: 0.3, label: "0.3 cm (plano)" }],
};

const COLORES_LUZ_LED = [
  { id: "blanco-calido", nombre: "Blanco cálido", temp: "4000K", hex: "#FFF5E6" },
  { id: "blanco-frio", nombre: "Blanco frío", temp: "9000K", hex: "#E6F3FF" },
  { id: "rojo", nombre: "Rojo", hex: "#FF3333" },
  { id: "verde", nombre: "Verde", hex: "#33FF33" },
  { id: "azul-celeste", nombre: "Celeste", hex: "#33CCFF" },
  { id: "azul", nombre: "Azul", hex: "#3333FF" },
  { id: "naranja", nombre: "Naranja", hex: "#FF9933" },
  { id: "amarillo", nombre: "Amarillo", hex: "#FFFF33" },
  { id: "rosa", nombre: "Rosa", hex: "#FF33CC" },
  { id: "morado", nombre: "Morado", hex: "#9933FF" },
];

const MATERIALES_LASER = [
  { id: "transparente", nombre: "Metacrilato Transparente", desc: "Crystal clear, alta claridad óptica" },
  { id: "blanco", nombre: "Metacrilato Blanco", desc: "Blanco sólido, acabado semi-brillo" },
  { id: "mdf", nombre: "MDF", desc: "Acabado mate, tabla de fibra de madera" },
  { id: "oro-espejo", nombre: "Metacrilato Oro Espejo", desc: "Oro espejo altamente reflectante" },
  { id: "plata-espejo", nombre: "Metacrilato Plata Espejo", desc: "Espejo plata high-gloss" },
  { id: "rosa-espejo", nombre: "Metacrilato Rosa Espejo", desc: "Espejo rosa metálico" },
];

const TIPOS_NEGOCIO_LONAS = [
  { id: "restaurante", nombre: "Restaurante", icono: Utensils },
  { id: "cafeteria", nombre: "Cafetería", icono: Coffee },
  { id: "panaderia", nombre: "Panadería", icono: Croissant },
  { id: "peluqueria", nombre: "Peluquería", icono: Scissors },
  { id: "gimnasio", nombre: "Gimnasio", icono: Dumbbell },
  { id: "tienda_ropa", nombre: "Moda", icono: Shirt },
  { id: "inmobiliaria", nombre: "Inmobiliaria", icono: Home },
  { id: "construccion", nombre: "Construcción", icono: HardHat },
  { id: "taller_mecanico", nombre: "Taller", icono: WrenchIcon },
  { id: "clinica_dental", nombre: "Dentista", icono: Stethoscope },
  { id: "veterinaria", nombre: "Veterinaria", icono: PawPrint },
  { id: "floreria", nombre: "Floristería", icono: Flower2 },
  { id: "fiesta", nombre: "Eventos", icono: PartyPopper },
  { id: "deportes", nombre: "Deportes", icono: Trophy },
  { id: "tecnologia", nombre: "Tech", icono: Laptop },
  { id: "general", nombre: "General", icono: Star },
];

const ESTILOS_LONA = [
  { id: "moderno", nombre: "Moderno", colors: ["#3b82f6", "#06b6d4"] },
  { id: "festivo", nombre: "Festivo", colors: ["#f97316", "#eab308"] },
  { id: "elegante", nombre: "Elegante", colors: ["#1f2937", "#d4af37"] },
  { id: "dinamico", nombre: "Dinámico", colors: ["#dc2626", "#f97316"] },
  { id: "natural", nombre: "Natural", colors: ["#15803d", "#84cc16"] },
  { id: "retro", nombre: "Retro", colors: ["#c2410c", "#fbbf24"] },
  { id: "minimalista", nombre: "Minimal", colors: ["#f5f5f5", "#262626"] },
  { id: "corporativo", nombre: "Corp.", colors: ["#1e3a5f", "#60a5fa"] },
  { id: "infantil", nombre: "Infantil", colors: ["#ec4899", "#8b5cf6"] },
  { id: "tech", nombre: "Tech", colors: ["#0f172a", "#22d3ee"] },
];

const ACABADOS_SUPERFICIALES = [
  { id: "lacado-brillo", nombre: "Lacado brillo", icono: "✨", desc: "Lacado con acabado brillante" },
  { id: "lacado-mate", nombre: "Lacado mate", icono: "🎨", desc: "Lacado con acabado mate" },
  { id: "cepillado", nombre: "Cepillado", icono: "〰️", desc: "Acabado cepillado metálico" },
  { id: "espejo", nombre: "Espejo", icono: "🪞", desc: "Acabado espejo pulido" },
];

const TIPOGRAFIAS = [
  { id: "archivo", nombre: "Archivo Black", familia: "'Archivo Black', sans-serif", sample: "ABC" },
  { id: "oswald", nombre: "Oswald", familia: "'Oswald', sans-serif", sample: "ABC" },
  { id: "bebas", nombre: "Bebas Neue", familia: "'Bebas Neue', sans-serif", sample: "ABC" },
  { id: "rajdhani", nombre: "Rajdhani", familia: "'Rajdhani', sans-serif", sample: "ABC" },
  { id: "montserrat", nombre: "Montserrat", familia: "'Montserrat', sans-serif", sample: "ABC" },
  { id: "playfair", nombre: "Playfair", familia: "'Playfair Display', serif", sample: "ABC" },
  { id: "roboto", nombre: "Roboto", familia: "'Roboto', sans-serif", sample: "ABC" },
  { id: "opensans", nombre: "Open Sans", familia: "'Open Sans', sans-serif", sample: "ABC" },
  { id: "lobster", nombre: "Lobster", familia: "'Lobster', cursive", sample: "ABC" },
  { id: "poppins", nombre: "Poppins", familia: "'Poppins', sans-serif", sample: "ABC" },
];

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

const FACHADAS = [
  { id: "madera", nombre: "Madera", icono: Grid3X3, desc: "Panel de madera natural" },
  { id: "blanca", nombre: "Blanca", icono: Square, desc: "Pared blanca lisa" },
  { id: "oscura", nombre: "Oscura", icono: Square, desc: "Pared oscura moderna" },
  { id: "ladrillo", nombre: "Ladrillo", icono: Grid3X3, desc: "Ladrillo visto clásico" },
  { id: "hormigon", nombre: "Hormigón", icono: Square, desc: "Hormigón industrial" },
  { id: "marmol", nombre: "Mármol", icono: Square, desc: "Mármol elegante" },
];

const ORIENTACIONES = [
  { id: "horizontal", nombre: "Horizontal", icono: Smartphone },
  { id: "vertical", nombre: "Vertical", icono: Smartphone },
  { id: "cuadrado", nombre: "Cuadrado", icono: Square },
];

// Tabs del preview
const TABS_PREVIEW = [
  { id: "design", nombre: "Diseño", icono: Palette },
  { id: "mockup", nombre: "Mockup", icono: Store },
  { id: "ar", nombre: "AR", icono: Glasses, badge: "NUEVO" },
  { id: "readability", nombre: "Legibilidad", icono: Eye },
];

// ==================== COMPONENTE PRINCIPAL ====================

const NeonEditorPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [modoVista, setModoVista] = useState(null);
  const [rotacion3D, setRotacion3D] = useState(0);
  const [modoDiaNoche, setModoDiaNoche] = useState("dia");
  const [tabActivo, setTabActivo] = useState("design");

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
  const [modoIntegracionLogo, setModoIntegracionLogo] = useState("ia");
  const [fachada, setFachada] = useState("blanca");
  const [fachadaPersonalizada, setFachadaPersonalizada] = useState(null);
  const [estiloVisual, setEstiloVisual] = useState("moderno");
  
  // Estados específicos por tipo de producto
  const [tipoLetraCorporea, setTipoLetraCorporea] = useState(null);
  const [espesor, setEspesor] = useState(8);
  const [colorLuzLed, setColorLuzLed] = useState("blanco-calido");
  const [materialLaser, setMaterialLaser] = useState("transparente");
  const [acabadoSuperficial, setAcabadoSuperficial] = useState("lacado-brillo");
  const [tipoNegocioLona, setTipoNegocioLona] = useState("general");
  const [estiloLona, setEstiloLona] = useState("moderno");
  
  // Color picker HSB
  const [colorPickerTab, setColorPickerTab] = useState("visualizer");
  const [colorHSB, setColorHSB] = useState({ h: 0, s: 100, b: 100 });
  const [hexInput, setHexInput] = useState("#FF0000");
  
  // Modal Lead
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadData, setLeadData] = useState({ nombre: "", email: "", telefono: "", acepta: false });
  
  const [descripcionDiseño, setDescripcionDiseño] = useState("");
  const [descripcionMejorada, setDescripcionMejorada] = useState("");
  const [tamanoAncho, setTamanoAncho] = useState(100);
  const [tamanoAlto, setTamanoAlto] = useState(50);
  const [errores, setErrores] = useState({});

  // Estados para generación de imágenes (flujo 3 pasos)
  const [rotuloAislado, setRotuloAislado] = useState(null);
  const [mockups, setMockups] = useState([]);
  const [imagenActiva, setImagenActiva] = useState('rotulo');
  const [errorGeneracion, setErrorGeneracion] = useState(null);
  const [progresoGeneracion, setProgresoGeneracion] = useState(0);

  const [theme, setTheme] = useState(() => localStorage.getItem("rotularte-theme") || "industrial");
  const [neonColor, setNeonColor] = useState(() => localStorage.getItem("rotularte-color") || "#ff6b00");

  // ==================== EFECTOS ====================

  useEffect(() => {
    const categoriaParam = searchParams.get("categoria");
    const nombreParam = searchParams.get("nombre");
    if (categoriaParam) {
      const categoriaValida = CATEGORIAS_PRODUCTO.find((cat) => cat.id === categoriaParam);
      if (categoriaValida) setCategoria(categoriaParam);
    }
    if (nombreParam) setNombreNegocio(decodeURIComponent(nombreParam));
  }, [searchParams]);

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
    const mejoras = [
      "Diseño elegante con tipografía moderna y colores vibrantes",
      "Estilo profesional con acabados premium y detalles sofisticados",
      "Diseño atractivo con elementos visuales llamativos y colores contrastantes",
      "Estilo minimalista con líneas limpias y paleta de colores neutra",
    ];
    const mejoraAleatoria = mejoras[Math.floor(Math.random() * mejoras.length)];
    setDescripcionMejorada(`${descripcionDiseño}. ${mejoraAleatoria}`);
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!categoria) nuevosErrores.categoria = "Selecciona una categoría";
    if (!nombreNegocio.trim()) nuevosErrores.nombreNegocio = "El nombre del negocio es obligatorio";
    if (coloresDiseño.length === 0) nuevosErrores.colores = "Selecciona al menos un color";
    if (categoria === "letras-corporeas" && !tipoLetraCorporea) {
      nuevosErrores.tipoLetraCorporea = "Selecciona un tipo de letra";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const generarDiseno = async () => {
    if (!validarFormulario()) return;
    setShowLeadModal(true);
  };

  const submitLead = async () => {
    if (!leadData.nombre || !leadData.email || !leadData.acepta) return;
    setShowLeadModal(false);
    setIsGenerating(true);
    setErrorGeneracion(null);
    setProgresoGeneracion(0);
    
    try {
      let tipoNegocioDetectado = 'comercio';
      const nombreLower = nombreNegocio.toLowerCase();
      
      if (nombreLower.includes('bar') || nombreLower.includes('pub')) tipoNegocioDetectado = 'bar';
      else if (nombreLower.includes('cafe') || nombreLower.includes('coffee')) tipoNegocioDetectado = 'cafe';
      else if (nombreLower.includes('restaurant') || nombreLower.includes('bistro')) tipoNegocioDetectado = 'restaurante';
      else if (nombreLower.includes('spa') || nombreLower.includes('wellness')) tipoNegocioDetectado = 'spa';
      else if (nombreLower.includes('hotel')) tipoNegocioDetectado = 'hotel';
      else if (categoria === 'letras-neon') tipoNegocioDetectado = 'bar';
      else if (categoria === 'letras-corporeas') tipoNegocioDetectado = 'spa';
      
      let materialDetectado = null;
      let sistemaIluminacion = null;
      if (categoria === 'letras-corporeas' && tipoLetraCorporea) {
        const materialMap = {
          'aluminio-sin-luz': 'aluminio',
          'aluminio-con-luz': 'aluminio',
          'aluminio-retroiluminada': 'aluminio',
          'pvc': 'pvc',
          'pvc-retroiluminadas': 'pvc',
          'metacrilato': 'metacrilato',
        };
        materialDetectado = materialMap[tipoLetraCorporea];
        if (tipoLetraCorporea.includes('retroiluminada')) sistemaIluminacion = 'trasera';
        else if (tipoLetraCorporea.includes('con-luz')) sistemaIluminacion = 'frontal';
      }
      
      const datosGeneracion = {
        categoria,
        nombreNegocio,
        estiloVisual: estiloVisual || 'moderno',
        colores: coloresDiseño.map(c => ({ 
          id: c.nombre.toLowerCase().replace(/\s+/g, '-'), 
          nombre: c.nombre, 
          hex: c.hex 
        })),
        tipografia: tipografia?.id,
        fachada: fachada === 'personalizada' ? 'blanca' : fachada,
        tipoNegocio: tipoNegocioDetectado,
        ...(materialDetectado && { material: materialDetectado }),
        ...(sistemaIluminacion && { sistemaIluminacion }),
        ...(espesor && { espesor }),
        ...(categoria === 'letras-neon' && colorLuzLed && { colorLuzLed }),
      };
      
      console.log('🎨 Generación completa - Datos:', datosGeneracion);
      
      const response = await fetch('https://upgraded-funicular-production.up.railway.app/api/v1/mockups/generar-completo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosGeneracion),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.error || 'Error al generar');
      }
      
      const data = await response.json();
      
      if (data.success) {
        if (data.rotulo?.base64) {
          setRotuloAislado(`data:image/png;base64,${data.rotulo.base64}`);
          setProgresoGeneracion(33);
        }
        
        if (data.mockups?.length > 0) {
          const mockupsFormateados = data.mockups
            .filter(m => m.success)
            .map(m => ({
              tipo: m.tipo,
              imagen: `data:image/png;base64,${m.base64}`,
              tamanoKB: m.tamanoKB
            }));
          setMockups(mockupsFormateados);
          setProgresoGeneracion(100);
        }
        
        setShowPreview(true);
        setImagenActiva('rotulo');
        
        console.log('✅ Generación completa:', {
          rotulo: !!data.rotulo?.base64,
          mockups: data.mockups?.length || 0
        });
      } else {
        throw new Error('La respuesta no indica éxito');
      }
      
    } catch (error) {
      console.error('❌ Error generando diseño:', error);
      setErrorGeneracion(error.message || 'Error al generar el diseño');
    } finally {
      setIsGenerating(false);
    }
  };

  const descargarDiseno = () => {
    let imagenDescargar = null;
    let nombreArchivo = '';
    
    if (imagenActiva === 'rotulo' && rotuloAislado) {
      imagenDescargar = rotuloAislado;
      nombreArchivo = `rotulo-${nombreNegocio || "diseno"}.png`;
    } else if (imagenActiva === 'exterior') {
      const mockup = mockups.find(m => m.tipo === 'exterior');
      if (mockup) {
        imagenDescargar = mockup.imagen;
        nombreArchivo = `mockup-exterior-${nombreNegocio || "diseno"}.png`;
      }
    } else if (imagenActiva === 'interior') {
      const mockup = mockups.find(m => m.tipo === 'interior');
      if (mockup) {
        imagenDescargar = mockup.imagen;
        nombreArchivo = `mockup-interior-${nombreNegocio || "diseno"}.png`;
      }
    }
    
    if (imagenDescargar) {
      const link = document.createElement("a");
      link.download = nombreArchivo;
      link.href = imagenDescargar;
      link.click();
    } else {
      const canvas = canvasRef.current;
      if (canvas) {
        const link = document.createElement("a");
        link.download = `diseno-${nombreNegocio || "rotulo"}.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
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
    setTabActivo("mockup");
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
    setEspesor(8);
    setColorLuzLed("blanco-calido");
    setMaterialLaser("transparente");
    setAcabadoSuperficial("lacado-brillo");
    setTipoNegocioLona("general");
    setEstiloLona("moderno");
    setDescripcionDiseño("");
    setDescripcionMejorada("");
    setTamanoAncho(100);
    setTamanoAlto(50);
    setErrores({});
    setPasoActual(1);
    setShowPreview(false);
    setTabActivo("design");
    setRotuloAislado(null);
    setMockups([]);
    setImagenActiva('rotulo');
    setErrorGeneracion(null);
    setProgresoGeneracion(0);
  };

  // ==================== FUNCIONES AUXILIARES ====================

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
  const getCategoriaInfo = () => CATEGORIAS_PRODUCTO.find((cat) => cat.id === categoria);

  // ==================== RENDERIZADO ====================

  const renderPaso1 = () => (
    <div className="paso-contenido">
      <h2 className="paso-titulo">Paso 1: Tipo de Producto</h2>
      <p className="paso-descripcion">Elige la categoría de rótulo que mejor se adapte a tu negocio</p>

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
              <div className="categoria-precio">Desde {cat.precioBase}€/{cat.unidad}</div>
            </button>
          );
        })}
      </div>

      {errores.categoria && <span className="error-mensaje">{errores.categoria}</span>}

      {categoria === "letras-neon" && (
        <div className="pista-contextual info">
          <Lightbulb size={20} />
          <p><strong>Neón LED:</strong> Neones realistas con tubos de vidrio brillantes. El texto se genera en UNA SOLA LÍNEA horizontal. Selecciona el color de luz LED.</p>
        </div>
      )}

      {categoria === "letras-corporeas" && (
        <div className="pista-contextual info">
          <TypeIcon size={20} />
          <p><strong>Letras Corpóreas 3D:</strong> Letras con volumen real. Usa "Quitar fondo" para mejor integración en fachadas.</p>
        </div>
      )}

      {categoria === "lonas-pancartas" && (
        <div className="pista-contextual info">
          <Scroll size={20} />
          <p><strong>Lonas y Pancartas:</strong> Ideal para eventos y promociones. Incluye ojales y refuerzos.</p>
        </div>
      )}
    </div>
  );

  const renderPaso2 = () => (
    <div className="paso-contenido">
      <h2 className="paso-titulo">Paso 2: Tu Negocio</h2>

      <div className="campo-grupo">
        <label className="campo-label">Nombre del Negocio <span className="obligatorio">*</span></label>
        <input
          type="text"
          className="campo-input"
          value={nombreNegocio}
          onChange={(e) => setNombreNegocio(e.target.value)}
          placeholder="Ej: Peluquería Tribilin, Café Roma..."
        />
        {errores.nombreNegocio && <span className="error-mensaje">{errores.nombreNegocio}</span>}
      </div>

      <div className="campo-grupo">
        <label className="campo-label">Tipografía</label>
        <div className="selector-tipografia">
          {TIPOGRAFIAS.map((font) => (
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

      <div className="campo-grupo">
        <label className="campo-label">Colores del Diseño <span className="obligatorio">*</span></label>
        
        {/* Color Picker Tabs */}
        <div className="color-picker-tabs">
          <button 
            className={`color-picker-tab ${colorPickerTab === "visualizer" ? "active" : ""}`}
            onClick={() => setColorPickerTab("visualizer")}
          >
            🎨 Visualizador
          </button>
          <button 
            className={`color-picker-tab ${colorPickerTab === "palettes" ? "active" : ""}`}
            onClick={() => setColorPickerTab("palettes")}
          >
            📋 Paletas
          </button>
        </div>

        {/* Tab Visualizador */}
        {colorPickerTab === "visualizer" && (
          <div className="color-picker-hsb">
            <div className="color-gradient-box" style={{ background: `hsl(${colorHSB.h}, 100%, 50%)` }}>
              <div className="color-gradient-overlay saturation-gradient" />
              <div className="color-gradient-overlay brightness-gradient" />
              <div 
                className="color-picker-cursor" 
                style={{ left: `${colorHSB.s}%`, top: `${100 - colorHSB.b}%` }}
              />
            </div>
            <div className="color-hue-slider">
              <div className="hue-slider-thumb" style={{ left: `${(colorHSB.h / 360) * 100}%` }} />
            </div>
            <div className="color-preview-row">
              <div className="color-preview-swatch" style={{ background: hexInput }} />
              <input
                type="text"
                className="color-hex-input"
                value={hexInput}
                onChange={(e) => setHexInput(e.target.value)}
                maxLength={7}
              />
              <button className="btn-add-color" onClick={() => agregarColor({ nombre: "Personalizado", hex: hexInput })}>
                + Añadir
              </button>
            </div>
          </div>
        )}

        {/* Tab Paletas */}
        {colorPickerTab === "palettes" && (
          <div className="pantone-palette">
            <div className="pantone-row">
              {COLORES_PREDEFINIDOS.slice(0, 6).map((color) => (
                <button
                  key={color.hex}
                  className={`color-swatch ${coloresDiseño.find((c) => c.hex === color.hex) ? "active" : ""}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => agregarColor(color)}
                  title={color.nombre}
                />
              ))}
            </div>
            <div className="pantone-row">
              {COLORES_PREDEFINIDOS.slice(6, 12).map((color) => (
                <button
                  key={color.hex}
                  className={`color-swatch ${coloresDiseño.find((c) => c.hex === color.hex) ? "active" : ""}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => agregarColor(color)}
                  title={color.nombre}
                />
              ))}
            </div>
            <div className="pantone-row">
              {COLORES_PREDEFINIDOS.slice(12).map((color) => (
                <button
                  key={color.hex}
                  className={`color-swatch ${coloresDiseño.find((c) => c.hex === color.hex) ? "active" : ""}`}
                  style={{ backgroundColor: color.hex, border: color.hex === "#FFFFFF" ? "1px solid #333" : "none" }}
                  onClick={() => agregarColor(color)}
                  title={color.nombre}
                />
              ))}
            </div>
          </div>
        )}

        {coloresDiseño.length > 0 && (
          <div className="colores-seleccionados">
            <p className="colores-titulo">Colores seleccionados:</p>
            <div className="colores-lista">
              {coloresDiseño.map((color) => (
                <div key={color.hex} className="color-tag">
                  <div className="color-muestra" style={{ backgroundColor: color.hex }} />
                  <span>{color.nombre}</span>
                  <button onClick={() => eliminarColor(color.hex)}><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}
        {errores.colores && <span className="error-mensaje">{errores.colores}</span>}
      </div>

      {mostrarSelectorOrientacion() && (
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

      <div className="campo-grupo">
        <label className="campo-label">Texto adicional <span className="step-opt">(teléfono, eslogan...)</span></label>
        <input
          type="text"
          className="campo-input"
          value={textoAdicional}
          onChange={(e) => setTextoAdicional(e.target.value)}
          placeholder="Ej: Tel: 666 777 888, Desde 1990..."
        />
      </div>

      <div className="campo-grupo">
        <label className="campo-label">Logo existente <span className="step-opt">(opcional)</span></label>
        <div className="logo-upload">
          {logo ? (
            <div className="logo-preview">
              <img src={logo} alt="Logo" />
              <button className="logo-eliminar" onClick={() => setLogo(null)}><Trash2 size={16} /></button>
            </div>
          ) : (
            <label className="logo-dropzone">
              <Upload size={32} />
              <span>Arrastra tu logo o haz clic para subir</span>
              <small>Formatos: PNG o JPG</small>
              <input type="file" accept="image/*" onChange={handleSubirLogo} hidden />
            </label>
          )}
        </div>

        {logo && (
          <div className="modo-integracion">
            <p>Modo de integración:</p>
            <div className="modo-opciones">
              <button className={modoIntegracionLogo === "ia" ? "activo" : ""} onClick={() => setModoIntegracionLogo("ia")}>
                <Wand2 size={16} />
                <span>IA (Integración natural)</span>
              </button>
              <button className={modoIntegracionLogo === "exacto" ? "activo" : ""} onClick={() => setModoIntegracionLogo("exacto")}>
                <Maximize2 size={16} />
                <span>Exacto (Superposición)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPaso3 = () => (
    <div className="paso-contenido">
      <h2 className="paso-titulo">Paso 3: Estilo y Acabado</h2>

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

      {mostrarSelectorCorporea() && (
        <div className="campo-grupo">
          <label className="campo-label">Tipo de Letra Corpórea <span className="obligatorio">*</span></label>
          <div className="grid-tipos-letras">
            {TIPOS_LETRAS_CORPOREAS.map((tipo) => (
              <button
                key={tipo.id}
                className={`tipo-letra-card ${tipoLetraCorporea === tipo.id ? "activo" : ""}`}
                onClick={() => {
                  setTipoLetraCorporea(tipo.id);
                  const espesores = ESPESORES_POR_TIPO[tipo.id];
                  if (espesores && espesores.length > 0) setEspesor(espesores[0].valor);
                }}
              >
                <span className="tipo-icono">{tipo.icono}</span>
                <h4>{tipo.nombre}</h4>
                <p>{tipo.desc}</p>
              </button>
            ))}
          </div>
          {errores.tipoLetraCorporea && <span className="error-mensaje">{errores.tipoLetraCorporea}</span>}
        </div>
      )}

      {mostrarSelectorCorporea() && tipoLetraCorporea && (
        <div className="campo-grupo">
          <label className="campo-label">Espesor de las letras</label>
          <div className="selector-espesor">
            {getEspesoresDisponibles().map((esp) => (
              <button
                key={esp.valor}
                className={`espesor-opcion ${espesor === esp.valor ? "activo" : ""}`}
                onClick={() => setEspesor(esp.valor)}
              >
                {esp.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {mostrarSelectorLuzLed() && (
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
                  boxShadow: colorLuzLed === color.id ? `0 0 20px ${color.hex}` : "none",
                }}
                title={`${color.nombre} ${color.temp || ""}`}
              >
                <span style={{ color: ["blanco-frio", "blanco-calido", "amarillo"].includes(color.id) ? "#000" : "#fff" }}>
                  {color.nombre}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {mostrarSelectorMaterialLaser() && (
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

      {mostrarConfiguracionLona() && (
        <>
          <div className="campo-grupo">
            <label className="campo-label">Tipo de Negocio (para fondo temático)</label>
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
          </div>

          <div className="campo-grupo">
            <label className="campo-label">Estilo del Fondo</label>
            <div className="selector-estilos-lona">
              {ESTILOS_LONA.map((estilo) => (
                <button
                  key={estilo.id}
                  className={`estilo-lona-card ${estiloLona === estilo.id ? "activo" : ""}`}
                  onClick={() => setEstiloLona(estilo.id)}
                >
                  <div
                    className="estilo-lona-preview"
                    style={{ background: `linear-gradient(135deg, ${estilo.colors[0]}, ${estilo.colors[1]})` }}
                  />
                  <span>{estilo.nombre}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="info-sistema-hibrido">
            <Sparkles size={20} />
            <p>
              <strong>Sistema Híbrido:</strong> La IA genera un fondo decorativo temático 
              (sin texto), y superponemos tu texto y logo con perfección garantizada.
            </p>
          </div>
        </>
      )}

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
          <label className={`fachada-opcion subir ${fachada === "personalizada" ? "activa" : ""}`}>
            <Upload size={24} />
            <span>Subir mi fachada</span>
            <input type="file" accept="image/*" onChange={handleSubirFachada} hidden />
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

  const renderPaso4 = () => {
    const categoriaInfo = getCategoriaInfo();
    
    return (
      <div className="paso-contenido">
        <h2 className="paso-titulo">Paso 4: Describe tu Diseño</h2>

        <div className="campo-grupo">
          <label className="campo-label">Descripción del diseño deseado</label>
          <div className="textarea-wrap">
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
              <Sparkles size={18} />
              Mejorar con IA
            </button>
          </div>
          {descripcionMejorada && (
            <div className="descripcion-mejorada">
              <p><strong>Descripción mejorada:</strong></p>
              <p>{descripcionMejorada}</p>
            </div>
          )}
        </div>

        <div className="campo-grupo">
          <label className="campo-label">Tamaño Aproximado <span className="step-opt">(para presupuesto)</span></label>
          <div className="selector-dimensiones">
            <div className="dimension-input">
              <label>Ancho (cm)</label>
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
              <label>Alto (cm)</label>
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

        {categoriaInfo && (
          <div className="resumen-seleccion">
            <h4>Resumen de tu selección:</h4>
            <div className="resumen-item"><span>Producto:</span><strong>{categoriaInfo.nombre}</strong></div>
            <div className="resumen-item"><span>Precio base:</span><strong>{categoriaInfo.precioBase}€/{categoriaInfo.unidad}</strong></div>
            <div className="resumen-item"><span>Tiempo de entrega:</span><strong>{categoriaInfo.tiempoEntrega}</strong></div>
            {categoria === "letras-corporeas" && tipoLetraCorporea && (
              <div className="resumen-item">
                <span>Tipo:</span>
                <strong>{TIPOS_LETRAS_CORPOREAS.find(t => t.id === tipoLetraCorporea)?.nombre}</strong>
              </div>
            )}
            {(categoria === "letras-neon" || mostrarSelectorLuzLed()) && (
              <div className="resumen-item">
                <span>Color de luz:</span>
                <strong>{COLORES_LUZ_LED.find(c => c.id === colorLuzLed)?.nombre}</strong>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ==================== MODAL LEAD ====================

  const renderLeadModal = () => {
    if (!showLeadModal) return null;
    
    return (
      <div className="modal-overlay" onClick={() => setShowLeadModal(false)}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={() => setShowLeadModal(false)}>×</button>
          <div className="modal-icon">✨</div>
          <h2 className="modal-title">¡Casi listo!</h2>
          <p className="modal-subtitle">Déjanos tus datos para generar tu diseño gratuito</p>
          
          <div className="campo-grupo">
            <label>Nombre</label>
            <input
              type="text"
              className="campo-input"
              value={leadData.nombre}
              onChange={(e) => setLeadData({ ...leadData, nombre: e.target.value })}
              placeholder="Tu nombre"
            />
          </div>
          <div className="campo-grupo">
            <label>Email</label>
            <input
              type="email"
              className="campo-input"
              value={leadData.email}
              onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
              placeholder="tu@email.com"
            />
          </div>
          <div className="campo-grupo">
            <label>Teléfono</label>
            <input
              type="tel"
              className="campo-input"
              value={leadData.telefono}
              onChange={(e) => setLeadData({ ...leadData, telefono: e.target.value })}
              placeholder="666 777 888"
            />
          </div>
          
          <div className="checkbox-wrap">
            <input
              type="checkbox"
              id="lead-accept"
              checked={leadData.acepta}
              onChange={(e) => setLeadData({ ...leadData, acepta: e.target.checked })}
            />
            <label htmlFor="lead-accept">
              Acepto la <a href="/politica-privacidad" target="_blank">política de privacidad</a> y recibir comunicaciones comerciales
            </label>
          </div>
          
          <button
            type="button"
            className="btn-generar"
            onClick={submitLead}
            disabled={!leadData.nombre || !leadData.email || !leadData.acepta}
          >
            <Sparkles size={18} />
            Generar mi diseño gratis
          </button>
        </div>
      </div>
    );
  };

  // ==================== PANEL DE HERRAMIENTAS ====================

  const renderPanelHerramientas = () => (
    <aside className="panel-tools">
      <h3 className="tools-title"><span>🛠️</span> Herramientas IA</h3>
      
      <div className="tool-card">
        <div className="tool-header">
          <div className="tool-icon">🪄</div>
          <div className="tool-info">
            <div className="tool-name">Quitar Fondo</div>
            <div className="tool-desc">Remove.bg - Alta precisión</div>
          </div>
          <span className="tool-status ready">Listo</span>
        </div>
        <button className="tool-btn" disabled={!showPreview}>Aplicar</button>
      </div>
      
      <div className="tool-card">
        <div className="tool-header">
          <div className="tool-icon">🔍</div>
          <div className="tool-info">
            <div className="tool-name">Mejorar Calidad 4x</div>
            <div className="tool-desc">Real-ESRGAN - HD profesional</div>
          </div>
          <span className="tool-status ready">Listo</span>
        </div>
        <button className="tool-btn" disabled={!showPreview}>Aplicar</button>
      </div>
      
      <div className="tool-card">
        <div className="tool-header">
          <div className="tool-icon">🎨</div>
          <div className="tool-info">
            <div className="tool-name">Variaciones de Color</div>
            <div className="tool-desc">Ver en diferentes colores</div>
          </div>
          <span className="tool-status new">Nuevo</span>
        </div>
        <button className="tool-btn" disabled={!showPreview}>Generar</button>
      </div>
      
      <div className="tool-card">
        <div className="tool-header">
          <div className="tool-icon">👁️</div>
          <div className="tool-info">
            <div className="tool-name">Análisis Legibilidad</div>
            <div className="tool-desc">¿Se lee bien a distancia?</div>
          </div>
          <span className="tool-status ready">Listo</span>
        </div>
        <button className="tool-btn" disabled={!showPreview} onClick={() => setTabActivo("readability")}>Analizar</button>
      </div>
      
      <div className="tool-card">
        <div className="tool-header">
          <div className="tool-icon">📱</div>
          <div className="tool-info">
            <div className="tool-name">Realidad Aumentada</div>
            <div className="tool-desc">Ver en tu local real</div>
          </div>
          <span className="tool-status new">Nuevo</span>
        </div>
        <button className="tool-btn" disabled={!showPreview} onClick={() => setTabActivo("ar")}>Iniciar AR</button>
      </div>
    </aside>
  );

  // ==================== TABS DE PREVIEW ====================

  const renderTabDesign = () => (
    <div className="tab-content active" id="tab-design">
      {!showPreview ? (
        <div className="empty" id="empty">
          <div className="empty-visual"></div>
          <h3 className="empty-title">Tu diseño aparecerá aquí</h3>
          <p className="empty-text">Selecciona el producto, completa los datos y genera tu rótulo con IA</p>
        </div>
      ) : isGenerating ? (
        <div className="loading" id="loading">
          <div className="loading-spinner"></div>
          <h3 className="loading-title">Generando tu diseño...</h3>
          <p className="loading-text">
            {progresoGeneracion < 30 ? 'Paso 1/3: Creando rótulo aislado...' :
             progresoGeneracion < 70 ? 'Paso 2/3: Generando mockups...' :
             'Paso 3/3: Finalizando...'}
          </p>
          <div className="loading-progress">
            <div className="loading-progress-bar" style={{ width: `${progresoGeneracion}%` }}></div>
          </div>
        </div>
      ) : errorGeneracion ? (
        <div className="error-state" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#ff6b6b', marginBottom: '16px' }}>❌ {errorGeneracion}</p>
          <button className="btn-secondary" onClick={() => setErrorGeneracion(null)}>
            Intentar de nuevo
          </button>
        </div>
      ) : (
        <div className="result" id="result">
          {/* Selector de imágenes */}
          <div className="image-selector" style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
            padding: '8px',
            background: 'var(--color-bg-alt)',
            borderRadius: '8px'
          }}>
            <button 
              className={`image-selector-btn ${imagenActiva === 'rotulo' ? 'active' : ''}`}
              onClick={() => setImagenActiva('rotulo')}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: 'none',
                borderRadius: '6px',
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
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '6px',
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
                  flex: 1,
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '6px',
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
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
                alt={`${nombreNegocio} en fachada exterior`} 
                className="canvas-preview"
                style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
              />
            ) : imagenActiva === 'interior' && mockups.find(m => m.tipo === 'interior') ? (
              <img 
                src={mockups.find(m => m.tipo === 'interior').imagen} 
                alt={`${nombreNegocio} en interior`} 
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
            Diseño REFERENCIAL - Nuestros diseñadores crearán tu versión final profesional
          </div>
          
          <div className="result-actions">
            <button type="button" className="btn-action btn-download" onClick={descargarDiseno}>
              <span className="icon">📥</span>
              Descargar
            </button>
            <button type="button" className="btn-action btn-remove-bg">
              <span className="icon">🪄</span>
              Quitar fondo
            </button>
            <button type="button" className="btn-action btn-upscale">
              <span className="icon">🔍</span>
              Mejorar HD
            </button>
            <button type="button" className="btn-action btn-variations">
              <span className="icon">🎨</span>
              Variaciones
            </button>
          </div>
          
          <div className="result-actions">
            <button type="button" className="btn-action btn-mockup" onClick={() => setTabActivo("mockup")}>
              <span className="icon">🏢</span>
              Ver en fachada
            </button>
            <button type="button" className="btn-action btn-ar" onClick={() => setTabActivo("ar")}>
              <span className="icon">📱</span>
              Ver en AR
            </button>
          </div>
          
          <button type="button" className="btn-secondary" onClick={resetearFormulario}>
            <RefreshCcw size={16} />
            Generar otra variación
          </button>
        </div>
      )}
    </div>
  );

  const renderTabMockup = () => (
    <div className="tab-content" id="tab-mockup">
      <div className="mockup-controls-bar">
        <input type="file" id="inp-facade" accept="image/*" hidden />
        <button className="upload-facade-btn">
          <span>📸</span> Subir mi fachada
        </button>
        
        <div className="facade-filters">
          <button className="filter-btn active">Todos</button>
          <button className="filter-btn">Tiendas</button>
          <button className="filter-btn">Restaurantes</button>
          <button className="filter-btn">Oficinas</button>
          <button className="filter-btn">Industrial</button>
          <button className="filter-btn">Noche</button>
        </div>
      </div>
      
      <div className="mockup-preview" id="mockup-preview">
        <div className="mockup-canvas" id="mockup-canvas">
          <div className="mockup-empty">
            <p>📷</p>
            <p>Sube una fachada y genera un diseño</p>
          </div>
        </div>
      </div>
      
      <div className="mockup-controls" id="mockup-controls">
        <div className="control-item">
          <div className="control-label"><span>Tamaño</span><span>40%</span></div>
          <input type="range" className="control-slider" min="10" max="100" value="40" />
        </div>
        <div className="control-item">
          <div className="control-label"><span>Brillo diseño</span><span>100%</span></div>
          <input type="range" className="control-slider" min="50" max="200" value="100" />
        </div>
        <div className="control-item">
          <div className="control-label"><span>Oscurecer fachada</span><span>0%</span></div>
          <input type="range" className="control-slider" min="0" max="80" value="0" />
        </div>
        <div className="control-item">
          <div className="daynight-toggle">
            <button className={`daynight-btn ${modoDiaNoche === "dia" ? "active" : ""}`} onClick={() => setModoDiaNoche("dia")}>☀️ Día</button>
            <button className={`daynight-btn ${modoDiaNoche === "noche" ? "active" : ""}`} onClick={() => setModoDiaNoche("noche")}>🌙 Noche</button>
          </div>
        </div>
      </div>
      
      <div className="mockup-actions">
        <button type="button" className="btn-action btn-download">
          <span className="icon">📥</span>
          Descargar
        </button>
        <button type="button" className="btn-action btn-ar" onClick={() => setTabActivo("ar")}>
          <span className="icon">📱</span>
          Ver en AR
        </button>
        <button type="button" className="btn-action btn-mockup">
          <span className="icon">💬</span>
          Presupuesto
        </button>
      </div>
    </div>
  );

  const renderTabAR = () => (
    <div className="tab-content" id="tab-ar">
      <div className="ar-container">
        <div className="ar-preview" id="ar-preview">
          <div className="mockup-empty">
            <p style={{ fontSize: "3rem" }}>📱</p>
            <p>Cámara AR</p>
          </div>
        </div>
        
        <div className="ar-instructions">
          <h4>📱 Cómo usar la Realidad Aumentada</h4>
          <ol>
            <li>Genera un diseño primero</li>
            <li>Pulsa "Iniciar cámara AR"</li>
            <li>Apunta tu cámara hacia la fachada de tu local</li>
            <li>¡Verás tu rótulo superpuesto en tiempo real!</li>
          </ol>
        </div>
        
        <button className="btn-ar-start" disabled={!showPreview}>
          <span>📷</span>
          Iniciar cámara AR
        </button>
        
        <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "12px" }}>
          Funciona mejor en dispositivos móviles
        </p>
      </div>
    </div>
  );

  const renderTabReadability = () => (
    <div className="tab-content" id="tab-readability">
      <div className="readability-container">
        <div className="readability-preview">
          <div className="distance-card">
            <div className="distance-preview">
              <p style={{ color: "var(--color-text-muted)" }}>{showPreview ? "TU RÓTULO" : "Genera un diseño"}</p>
            </div>
            <div className="distance-info">
              <div className="distance-label">A 5 metros</div>
              <div className="distance-status">{showPreview ? "Excelente" : "-"}</div>
            </div>
          </div>
          <div className="distance-card">
            <div className="distance-preview">
              <p style={{ color: "var(--color-text-muted)" }}>{showPreview ? "TU RÓTULO" : "Genera un diseño"}</p>
            </div>
            <div className="distance-info">
              <div className="distance-label">A 10 metros</div>
              <div className="distance-status">{showPreview ? "Bueno" : "-"}</div>
            </div>
          </div>
          <div className="distance-card">
            <div className="distance-preview">
              <p style={{ color: "var(--color-text-muted)" }}>{showPreview ? "TU RÓTULO" : "Genera un diseño"}</p>
            </div>
            <div className="distance-info">
              <div className="distance-label">A 20 metros</div>
              <div className="distance-status">{showPreview ? "Regular" : "-"}</div>
            </div>
          </div>
        </div>
        
        {showPreview && (
          <>
            <div className="readability-score">
              <div className="score-title">Puntuación de legibilidad</div>
              <div className="score-value">85</div>
              <div className="score-label">Excelente</div>
            </div>
            
            <div className="readability-recommendations">
              <div className="recommendations-title">💡 Recomendaciones</div>
              <ul>
                <li>Aumentar el tamaño de la fuente para mejor visibilidad a distancia</li>
                <li>Usar mayor contraste entre el texto y el fondo</li>
                <li>Considerar iluminación adicional para visibilidad nocturna</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderPreviewContent = () => {
    switch (tabActivo) {
      case "design": return renderTabDesign();
      case "mockup": return renderTabMockup();
      case "ar": return renderTabAR();
      case "readability": return renderTabReadability();
      default: return renderTabDesign();
    }
  };

  // ==================== RENDER PRINCIPAL ====================

  return (
    <div className="neon-editor-page disenador-ia">
      <nav className="nav-editor">
        <a href="#" className="logo-rotularte" onClick={(e) => { e.preventDefault(); navigate("/"); }}>ROTULARTE</a>
        <ul className="nav-links-rotularte">
          <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }}>Inicio</a></li>
          <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/tienda"); }}>Tienda</a></li>
          <li><a href="#" className="active">Diseñador IA</a></li>
          <li>
            <div className="cart-icon" onClick={() => navigate("/tienda")}>
              <ShoppingCart size={24} />
              <span className="cart-count">0</span>
            </div>
          </li>
        </ul>
      </nav>

      <div className="disenador-contenido">
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
                <span className="paso-nombre">{paso === 1 ? "Producto" : paso === 2 ? "Negocio" : paso === 3 ? "Estilo" : "Descripción"}</span>
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
                <button className="btn-nav btn-anterior" onClick={() => setPasoActual(pasoActual - 1)}>
                  <ChevronUp size={20} /> Anterior
                </button>
              )}
              {pasoActual < 4 && (
                <button className="btn-nav btn-siguiente" onClick={() => setPasoActual(pasoActual + 1)}>
                  Siguiente <ChevronDown size={20} />
                </button>
              )}
            </div>

            <button className="btn-generar" onClick={generarDiseno} disabled={isGenerating}>
              {isGenerating ? (
                <><div className="spinner" /> Generando...</>
              ) : (
                <><Sparkles size={20} /> Generar Diseño con IA</>
              )}
            </button>
          </div>
        </aside>

        <section className="panel-preview">
          <div className="tabs">
            {TABS_PREVIEW.map((tab) => {
              const Icono = tab.icono;
              return (
                <button
                  key={tab.id}
                  className={`tab ${tabActivo === tab.id ? "active" : ""}`}
                  onClick={() => setTabActivo(tab.id)}
                >
                  <Icono size={18} />
                  {tab.nombre}
                  {tab.badge && <span className="badge">{tab.badge}</span>}
                </button>
              );
            })}
          </div>
          
          <div className="preview-content">
            {renderPreviewContent()}
          </div>
        </section>

        {renderPanelHerramientas()}
      </div>

      {renderLeadModal()}
    </div>
  );
};

export default NeonEditorPage;
