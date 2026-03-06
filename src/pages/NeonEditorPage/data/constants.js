/**
 * ============================================================================
 * CONSTANTES DEL DISEÑADOR NEON
 * ============================================================================
 */

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
} from "lucide-react";

// Categorías de producto
export const CATEGORIAS_PRODUCTO = [
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

export const CATS_WITH_ORIENTATION = ["lonas-pancartas", "vinilos", "banderolas", "rollup", "photocall", "mupis", "flybanner"];
export const CATS_WITH_CORPOREA_TYPE = ["letras-corporeas"];

export const TIPOS_LETRAS_CORPOREAS = [
  { id: "aluminio-sin-luz", nombre: "Aluminio sin luz", icono: "🔩", desc: "Letras de aluminio sin iluminación" },
  { id: "pvc", nombre: "PVC fresado", icono: "🎨", desc: "Letras de PVC fresado" },
  { id: "aluminio-con-luz", nombre: "Aluminio con luz", icono: "💡", desc: "Aluminio con iluminación frontal" },
  { id: "pvc-retroiluminadas", nombre: "PVC retroiluminado", icono: "✨", desc: "PVC con retroiluminación LED" },
  { id: "metacrilato", nombre: "Metacrilato acrílico", icono: "💎", desc: "Letras de metacrilato/acrílico" },
  { id: "pvc-impreso-uv", nombre: "PVC impreso UV", icono: "🖨️", desc: "PVC con impresión UV directa" },
  { id: "aluminio-retroiluminada", nombre: "Aluminio retroiluminado", icono: "🌟", desc: "Aluminio con halo LED trasero" },
  { id: "dibond-sin-relieve", nombre: "Dibond sin relieve", icono: "📐", desc: "Letras planas de Aluminio/Dibond recortadas" },
];

export const TIPOS_CON_LUZ = ["aluminio-con-luz", "pvc-retroiluminadas", "aluminio-retroiluminada"];

export const ESPESORES_POR_TIPO = {
  "aluminio-sin-luz": [{ valor: 5, label: "5 cm" }, { valor: 8, label: "8 cm (estándar)" }, { valor: 10, label: "10 cm" }, { valor: 13, label: "13 cm" }],
  pvc: [{ valor: 5, label: "5 cm" }, { valor: 8, label: "8 cm" }, { valor: 10, label: "10 cm (estándar)" }, { valor: 13, label: "13 cm" }, { valor: 16, label: "16 cm" }],
  "aluminio-con-luz": [{ valor: 5, label: "5 cm" }, { valor: 8, label: "8 cm (estándar)" }, { valor: 10, label: "10 cm" }, { valor: 13, label: "13 cm" }],
  "pvc-retroiluminadas": [{ valor: 5, label: "5 cm" }, { valor: 8, label: "8 cm (estándar)" }, { valor: 10, label: "10 cm" }, { valor: 13, label: "13 cm" }],
  metacrilato: [{ valor: 3, label: "3 cm (fino)" }, { valor: 5, label: "5 cm (estándar)" }, { valor: 8, label: "8 cm (grueso)" }],
  "pvc-impreso-uv": [{ valor: 5, label: "5 cm" }, { valor: 8, label: "8 cm (estándar)" }, { valor: 10, label: "10 cm" }, { valor: 13, label: "13 cm" }],
  "aluminio-retroiluminada": [{ valor: 5, label: "5 cm" }, { valor: 8, label: "8 cm (estándar)" }, { valor: 10, label: "10 cm" }, { valor: 13, label: "13 cm" }],
  "dibond-sin-relieve": [{ valor: 0.3, label: "0.3 cm (plano)" }],
};

export const COLORES_LUZ_LED = [
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

export const MATERIALES_LASER = [
  { id: "transparente", nombre: "Metacrilato Transparente", desc: "Crystal clear, alta claridad óptica" },
  { id: "blanco", nombre: "Metacrilato Blanco", desc: "Blanco sólido, acabado semi-brillo" },
  { id: "mdf", nombre: "MDF", desc: "Acabado mate, tabla de fibra de madera" },
  { id: "oro-espejo", nombre: "Metacrilato Oro Espejo", desc: "Oro espejo altamente reflectante" },
  { id: "plata-espejo", nombre: "Metacrilato Plata Espejo", desc: "Espejo plata high-gloss" },
  { id: "rosa-espejo", nombre: "Metacrilato Rosa Espejo", desc: "Espejo rosa metálico" },
];

export const TIPOS_NEGOCIO_LONAS = [
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

export const ESTILOS_LONA = [
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

export const ACABADOS_SUPERFICIALES = [
  { id: "lacado-brillo", nombre: "Lacado brillo", icono: "✨", desc: "Lacado con acabado brillante y reflectante" },
  { id: "lacado-mate", nombre: "Lacado mate", icono: "🎨", desc: "Lacado con acabado mate suave" },
  { id: "cepillado", nombre: "Cepillado", icono: "〰️", desc: "Acabado metálico cepillado con textura" },
  { id: "espejo", nombre: "Espejo", icono: "🪞", desc: "Acabado espejo pulido high-gloss" },
  { id: "anodizado", nombre: "Anodizado", icono: "🔷", desc: "Acabado anodizado profesional" },
  { id: "oxido", nombre: "Óxido", icono: "🟤", desc: "Efecto óxido industrial vintage" },
];

// Modos de iluminación HDRI
export const MODOS_ILUMINACION = [
  { id: "studio", nombre: "Studio", icono: "💡", desc: "Iluminación de estudio profesional" },
  { id: "dia", nombre: "Día", icono: "☀️", desc: "Luz natural diurna" },
  { id: "noche", nombre: "Noche", icono: "🌙", desc: "Ambiente nocturno con iluminación artificial" },
  { id: "atardecer", nombre: "Atardecer", icono: "🌅", desc: "Luz cálida de atardecer" },
  { id: "interior", nombre: "Interior", icono: "🏢", desc: "Iluminación de interior comercial" },
];

// Opciones de post-procesado
export const POST_PROCESSING_OPTIONS = [
  { id: "bloom", nombre: "Bloom", desc: "Efecto de brillo luminoso" },
  { id: "fxaa", nombre: "FXAA", desc: "Anti-aliasing para bordes suaves" },
  { id: "toneMapping", nombre: "Tone Mapping", desc: "Mapeo de tonos HDR" },
  { id: "contrast", nombre: "Alto Contraste", desc: "Aumenta el contraste global" },
  { id: "sharpness", nombre: "Nitidez", desc: "Realza los detalles" },
];

export const TIPOGRAFIAS = [
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

export const COLORES_PREDEFINIDOS = [
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

export const ESTILOS_VISUALES = [
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

export const FACHADAS = [
  { id: "madera", nombre: "Madera", icono: Grid3X3, desc: "Panel de madera natural" },
  { id: "blanca", nombre: "Blanca", icono: Square, desc: "Pared blanca lisa" },
  { id: "oscura", nombre: "Oscura", icono: Square, desc: "Pared oscura moderna" },
  { id: "ladrillo", nombre: "Ladrillo", icono: Grid3X3, desc: "Ladrillo visto clásico" },
  { id: "hormigon", nombre: "Hormigón", icono: Square, desc: "Hormigón industrial" },
  { id: "marmol", nombre: "Mármol", icono: Square, desc: "Mármol elegante" },
];

export const ORIENTACIONES = [
  { id: "horizontal", nombre: "Horizontal", icono: Smartphone },
  { id: "vertical", nombre: "Vertical", icono: Smartphone },
  { id: "cuadrado", nombre: "Cuadrado", icono: Square },
];

export const TABS_PREVIEW = [
  { id: "design", nombre: "Diseño", icono: Palette },
  { id: "mockup", nombre: "Mockup", icono: Store },
  { id: "ar", nombre: "AR", icono: Glasses, badge: "NUEVO" },
  { id: "readability", nombre: "Legibilidad", icono: Eye },
];
