/**
 * ============================================================================
 * DICCIONARIO DE PROMPTS PARA IA - DISEÑADOR DE RÓTULOS
 * ============================================================================
 * 
 * Este archivo contiene todos los prompts y diccionarios necesarios para
 * la generación y mejora de descripciones de diseños mediante IA.
 */

// ============================================
// PROMPTS POR CATEGORÍA DE PRODUCTO
// ============================================

export const PROMPTS_CATEGORIA = {
  "rotulos": {
    contexto: "rótulo luminoso profesional para fachada comercial",
    elementos: ["estructura metálica", "iluminación LED integrada", "cajón luminoso", "lona tensionada"],
    estilos: {
      moderno: "líneas limpias, iluminación uniforme, acabados en aluminio cepillado",
      clasico: "marco decorativo, iluminación cálida, acabados tradicionales",
      elegante: "perfil slim, iluminación indirecta, acabados premium",
      minimalista: "formas geométricas puras, sin marco visible, luz difusa",
      llamativo: "colores contrastantes, iluminación RGB, efectos dinámicos",
      industrial: "estructura expuesta, acero corten, iluminación fría",
      vintage: "marco de latón, bombillas Edison estilo retro, óxido decorativo",
      neon: "tubos de neón flexibles, colores saturados, efecto glow intenso",
      luxury: "acabados dorados o plateados, iluminación indirecta, tipografía serif",
    },
    mejoras: [
      "incorporando iluminación LED de alta eficiencia con difusor uniforme",
      "con estructura de aluminio anodizado resistente a la intemperie",
      "diseño retroiluminado para máxima visibilidad nocturna",
      "con sistema de anclaje oculto y cables integrados",
      "acabado con pintura electrostática en polvo RAL personalizado",
    ],
  },
  
  "letras-neon": {
    contexto: "letras neón LED flexibles con efecto de tubo de vidrio brillante",
    elementos: ["tubo LED neon flex", "soporte transparente", "transformador", "cableado oculto"],
    estilos: {
      moderno: "trazos limpios, grosor uniforme 8mm, montaje sobre plexiglás",
      clasico: "tipografía script elegante, efecto de vidrio soplado tradicional",
      elegante: "líneas finas delicadas, montaje flotante, brillo suave",
      minimalista: "forma geométrica pura, solo contorno iluminado, sin relleno",
      llamativo: "colores neón saturados, parpadeo sutil, múltiples capas",
      industrial: "tubos gruesos 12mm, soportes metálicos visibles, look workshop",
      vintage: "tipografía retro 50s, efecto cristal ligeramente opaco, calor cálido",
      neon: "colores eléctricos puros, efecto plasma brillante, contorno doble",
      luxury: "dorado+blanco cálido, base de espejo, tipografía caligráfica",
    },
    mejoras: [
      "con tubos LED neon flex de última generación, bajo consumo y larga duración",
      "efecto de vidrio de neón real con difusión homogénea sin puntos LED visibles",
      "montaje sobre panel de metacrilato transparente de alta transparencia",
      "transformador electrónico silencioso con protección IP65 para exterior",
      "sistema de fijación con separadores de acero inoxidable para efecto flotante",
    ],
  },
  
  "rigidos-impresos": {
    contexto: "panel rígido de PVC o Dibond con impresión digital de alta resolución",
    elementos: ["placa PVC foam", "impresión UV directa", "cantos refinados", "sistema de fijación"],
    estilos: {
      moderno: "fotografía de alta definición, colores vivos, acabado mate",
      clasico: "ilustración detallada, paleta tradicional, acabado satinado",
      elegante: "imagen premium, colores sobrios, acabado brillo selectivo",
      minimalista: "icono simple, fondo liso, tipografía clara",
      llamativo: "colores fluorescentes, contraste extremo, imagen impactante",
      industrial: "texturas metálicas, código QR, información técnica",
      vintage: "efecto desgastado, tipografía antigua, sepia",
      neon: "colores eléctricos, glow digital, efectos de luz",
      luxury: "metales dorados/plateados, mármol, tipografía exclusiva",
    },
    mejoras: [
      "impresión UV de alta definición 1440dpi con tintas resistentes a la decoloración",
      "placa PVC foam de 5mm o 10mm con cantos perfectamente rectos y limpios",
      "acabado con laminado protector anti-rayas y anti-UV para exterior",
      "preparado con ojales metálicos en las esquinas para fácil instalación",
      "opción de doble cara con impresión perfecta alineada front-back",
    ],
  },
  
  "letras-corporeas": {
    contexto: "letras corpóreas 3D con volumen real en materiales premium",
    elementos: ["frente de letra", "retorno lateral", "sistema de iluminación", "fijación trasera"],
    estilos: {
      moderno: "frente plana, cantos rectos, acabado lacado mate o brillo",
      clasico: "frente con bisel, retorno curvo, acabado metalizado tradicional",
      elegante: "espesor reducido 3-5cm, acabado cepillado, iluminación indirecta",
      minimalista: "sin iluminación, solo forma pura, contraste con fondo",
      llamativo: "frente iluminada, laterales retroiluminados, múltiples efectos",
      industrial: "acero corten sin tratar, espesor 10cm+, look robusto",
      vintage: "latón envejecido, patina natural, tipografía art nouveau",
      neon: "metacrilato transparente contorneado, halo de luz perimetral",
      luxury: "acero pulido espejo, espesor 8cm, halo LED dorado suave",
    },
    tipos_materiales: {
      "aluminio-sin-luz": "aluminio composite de 3mm con pintura automotriz, sin iluminación",
      "pvc": "PVC expandido de alta densidad fresado CNC, pintable en cualquier color",
      "aluminio-con-luz": "frente de aluminio perforado con LEDs traseros, iluminación frontal",
      "pvc-retroiluminadas": "PVC opaco con iluminación LED trasera, efecto halo suave",
      "metacrilato": "acrílico transparente o coloreado, cantos pulidos brillantes",
      "pvc-impreso-uv": "PVC con impresión UV directa en frente, ideal para degradados",
      "aluminio-retroiluminada": "aluminio con separadores, halo LED dorado o blanco",
      "dibond-sin-relieve": "composite aluminio-plástico plano recortado, sin volumen",
    },
    mejoras: [
      "con fresado CNC de precisión para bordes perfectos y curvas suaves",
      "sistema de iluminación LED con 5 años de garantía y transformador incluido",
      "templado para exteriores con protección IP65 contra agua y polvo",
      "fijación mediante tacos químicos y varillas roscadas ocultas",
      "acabado con pintura automotriz de dos componentes para máxima durabilidad",
    ],
  },
  
  "lonas-pancartas": {
    contexto: "lona publicitaria de gran formato para exteriores o eventos",
    elementos: ["lona PVC 510g/m²", "refuerzos perimetrales", "ojales metálicos", "costuras selladas"],
    estilos: {
      moderno: "fotografía de producto, espacio negativo, tipografía sans-serif",
      clasico: "marco decorativo, ilustración tradicional, serif elegante",
      elegante: "fondo degradado sutil, producto premium, tipografía fina",
      minimalista: "solo logo y claim, fondo blanco o negro puro, mucho aire",
      llamativo: "colores saturados, ofertas grandes, flechas y elementos gráficos",
      industrial: "texturas metal/concreto, tipografía stencil, colores grises",
      vintage: "efecto papel envejecido, tipografía retro, ilustración clásica",
      neon: "fondo oscuro, elementos brillantes, efecto fluorescente",
      luxury: "fondo negro mate, dorados, producto con luz de estudio",
    },
    tipos_negocio: {
      restaurante: "imagen de plato principal, ambiente cálido, información de contacto clara",
      cafeteria: "taza de café destacada, ambiente acogedor, horarios visibles",
      panaderia: "productos recién horneados, tonos cálidos, tipografía artesanal",
      peluqueria: "siluetas de cortes de pelo, espejos, ambiente moderno",
      gimnasio: "personas entrenando, equipamiento, energía y motivación",
      tienda_ropa: "modelos con ropa de temporada, fondo limpio, precios destacados",
      inmobiliaria: "fachada de edificio, logo grande, teléfono de contacto",
      construccion: "obra en progreso, maquinaria, equipo profesional",
      taller_mecanico: "vehículos, herramientas, confianza y experiencia",
      clinica_dental: "sonrisa brillante, ambiente sanitario, tecnología moderna",
      veterinaria: "mascotas felices, cuidado profesional, ambiente acogedor",
      floreria: "flores coloridas, arreglos elegantes, ambiente natural",
      fiesta: "globos, confeti, colores brillantes, celebración",
      deportes: "equipamiento deportivo, acción, dinamismo",
      tecnologia: "dispositivos modernos, pantallas, futurismo",
      general: "imagen representativa, logo claro, información esencial",
    },
    mejoras: [
      "impresión en lona PVC 510g/m² de alta resistencia para exterior",
      "ojales metálicos reforzados cada 50cm en perímetro completo",
      "costuras soldadas de alta frecuencia para máxima resistencia al viento",
      "tintas UV resistentes a la decoloración por sol y lluvia",
      "opción de doble cara con blockout para no translucir",
    ],
  },
  
  "vinilos": {
    contexto: "vinilo adhesivo para escaparates, cristales o superficies lisas",
    elementos: ["vinilo adhesivo", "lamiando opcional", "corte o impresión", "espátula de aplicación"],
    estilos: {
      moderno: "formas geométricas, colores planos, tipografía sans-serif",
      clasico: "ornamentos, serif tradicional, paleta conservadora",
      elegante: "líneas finas, dorados o plateados, tipografía delicada",
      minimalista: "solo contornos, sin relleno, máximo contraste",
      llamativo: "colores fluorescentes, formas grandes, impacto visual",
      industrial: "tipografía stencil, colores básicos, funcional",
      vintage: "efecto desgastado, tipografía antigua, sepia",
      neon: "vinilo fluorescente, brilla con luz UV, efecto noche",
      luxury: "vinilo espejo oro/plata, reflejo real, premium",
    },
    mejoras: [
      "vinilo de alta calidad 3M o Avery, adhesivo permanente o removible",
      "corte plotter de precisión para bordes perfectos sin fondo",
      "impresión 1440dpi con laminado protector opcional anti-UV",
      "microperforado disponible para visibilidad desde dentro",
      "incluye espátula y papel de transfer para fácil aplicación",
    ],
  },
};

// ============================================
// PROMPTS POR TIPO DE NEGOCIO (LONAS)
// ============================================

export const PROMPTS_NEGOCIO = {
  restaurante: {
    keywords: ["gastronomía", "sabor", "fresco", "cocina tradicional", "ambiente acogedor"],
    elementos: ["plato principal", "chef", "ingredientes frescos", "horarios"],
    colores: ["rojo", "naranja", "marrón", "crema"],
  },
  cafeteria: {
    keywords: ["café de especialidad", "aroma", "relax", "trabajo", "encuentro"],
    elementos: ["taza de café","granos", "espuma de leche", "wifi gratis"],
    colores: ["marrón", "crema", "beige", "verde suave"],
  },
  panaderia: {
    keywords: ["recién horneado", "artesanal", "tradicional", "desayuno", "calidad"],
    elementos: ["pan", "croissants", "pasteles", "horno de leña"],
    colores: ["naranja", "amarillo", "marrón", "dorado"],
  },
  peluqueria: {
    keywords: ["estilo", "corte", "color", "tendencia", "belleza"],
    elementos: ["tijeras", "secador", "peine", "reflejo espejo"],
    colores: ["negro", "blanco", "rosa", "plateado"],
  },
  gimnasio: {
    keywords: ["energía", "salud", "fuerza", "resultados", "motivación"],
    elementos: ["pesas", "máquinas", "entrenador", "sudor"],
    colores: ["negro", "gris", "rojo", "verde neón"],
  },
  tienda_ropa: {
    keywords: ["moda", "tendencia", "estilo", "temporada", "oferta"],
    elementos: ["modelos", "perchas", "espejo", "probador"],
    colores: ["rosa", "negro", "blanco", "dorado"],
  },
  inmobiliaria: {
    keywords: ["confianza", "hogar", "inversión", "calidad", "servicio"],
    elementos: ["fachada", "llaves", "familia", "firma"],
    colores: ["azul", "blanco", "gris", "dorado"],
  },
  construccion: {
    keywords: ["solidez", "experiencia", "obra", "calidad", "garantía"],
    elementos: ["casco", "grúa", "planos", "obra terminada"],
    colores: ["naranja", "amarillo", "negro", "gris"],
  },
  general: {
    keywords: ["calidad", "servicio", "profesional", "atención", "experiencia"],
    elementos: ["logo", "slogan", "contacto", "producto"],
    colores: ["azul", "gris", "negro", "blanco"],
  },
};

// ============================================
// PLANTILLAS DE PROMPTS PARA IA
// ============================================

export const PLANTILLAS_PROMPT = {
  // Mejora de descripción simple
  mejoraSimple: (descripcionOriginal, categoria, estilo) => {
    const categoriaData = PROMPTS_CATEGORIA[categoria];
    const estiloDesc = categoriaData?.estilos?.[estilo] || "";
    
    return `Transforma la siguiente descripción de diseño en una descripción profesional y detallada para un ${categoriaData?.contexto || "rótulo publicitario"}:

Descripción original: "${descripcionOriginal}"

Contexto: ${categoriaData?.contexto}
Estilo solicitado: ${estilo} - ${estiloDesc}

Genera una descripción mejorada que incluya:
1. Elementos visuales específicos y detallados
2. Materiales y acabados sugeridos
3. Efectos de iluminación o textura
4. Impacto visual esperado

Descripción mejorada:`;
  },

  // Mejora con variaciones
  mejoraConVariaciones: (descripcion, categoria, variacionIndex = 0) => {
    const mejoras = PROMPTS_CATEGORIA[categoria]?.mejoras || [];
    const mejora = mejoras[variacionIndex % mejoras.length];
    
    return `${descripcion}. ${mejora}`;
  },
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Obtiene una mejora aleatoria para una categoría
 */
export function getMejoraAleatoria(categoria) {
  const mejoras = PROMPTS_CATEGORIA[categoria]?.mejoras || PROMPTS_CATEGORIA["rotulos"].mejoras;
  return mejoras[Math.floor(Math.random() * mejoras.length)];
}

/**
 * Obtiene el contexto de una categoría
 */
export function getContextoCategoria(categoria) {
  return PROMPTS_CATEGORIA[categoria]?.contexto || "rótulo publicitario";
}

/**
 * Obtiene la descripción de un estilo para una categoría
 */
export function getDescripcionEstilo(categoria, estilo) {
  return PROMPTS_CATEGORIA[categoria]?.estilos?.[estilo] || "";
}

/**
 * Genera una descripción mejorada usando el diccionario
 */
export function generarDescripcionMejorada(descripcionOriginal, categoria, estilo, tipoNegocio = null) {
  const catData = PROMPTS_CATEGORIA[categoria];
  const negData = tipoNegocio ? PROMPTS_NEGOCIO[tipoNegocio] : null;
  
  if (!catData) return descripcionOriginal;
  
  const mejoras = catData.mejoras;
  const mejoraAleatoria = mejoras[Math.floor(Math.random() * mejoras.length)];
  
  let descripcionMejorada = `${descripcionOriginal}. ${mejoraAleatoria}`;
  
  // Añadir elementos de negocio si existe
  if (negData) {
    const elemento = negData.elementos[Math.floor(Math.random() * negData.elementos.length)];
    descripcionMejorada += `, destacando ${elemento}`;
  }
  
  // Añadir descripción del estilo
  if (catData.estilos[estilo]) {
    descripcionMejorada += `. Estilo ${estilo}: ${catData.estilos[estilo]}`;
  }
  
  return descripcionMejorada;
}

export default {
  PROMPTS_CATEGORIA,
  PROMPTS_NEGOCIO,
  PLANTILLAS_PROMPT,
  getMejoraAleatoria,
  getContextoCategoria,
  getDescripcionEstilo,
  generarDescripcionMejorada,
};
